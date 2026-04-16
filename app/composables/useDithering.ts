import RgbQuant from 'rgbquant'
import type { BayerSize } from '~/utils/dithering'
import { addPixelation, bayerDither } from '~/utils/dithering'

export interface GifFrame {
  imageData: ImageData
  delay: number // milliseconds
}

// gif.js worker blob URL (created once, reused)
let gifWorkerUrl: string | null = null
async function getGifWorkerUrl(): Promise<string> {
  if (!gifWorkerUrl) {
    // Import worker source as a raw string via Vite, then create a Blob URL so gif.js can spawn it
    const workerSrc = await import('gif.js/dist/gif.worker.js?raw')
    const blob = new Blob([workerSrc.default], { type: 'application/javascript' })
    gifWorkerUrl = URL.createObjectURL(blob)
  }
  return gifWorkerUrl
}

export interface RgbQuantOptions {
  colors: number
  method: number
  boxSize: [number, number]
  boxPxls: number
  initColors: number
  minHueCols: number
  dithKern: string
  dithDelta: number
  dithSerp: boolean
  palette: number[][]
  reIndex: boolean
  useCache: boolean
  cacheFreq: number
  colorDist: string
}

export type DitherMode = 'diffusion' | 'bayer'

export const DIFFUSION_ALGORITHMS = [
  { label: 'Floyd-Steinberg', value: 'FloydSteinberg' },
  { label: 'Atkinson', value: 'Atkinson' },
  { label: 'Jarvis-Judice-Ninke', value: 'JarvisJudiceNinke' },
  { label: 'Stucki', value: 'Stucki' },
  { label: 'Burkes', value: 'Burkes' },
  { label: 'Sierra3', value: 'Sierra3' },
  { label: 'Sierra2', value: 'Sierra2' },
  { label: 'Sierra24A', value: 'Sierra24A' },
  { label: 'Fan', value: 'Fan' },
  { label: 'ShiauFan', value: 'ShiauFan' },
  { label: 'ShiauFan2', value: 'ShiauFan2' }
] as const

export interface DitherResult {
  width: number
  height: number
  blob: Blob
  url: string
}

// Image element cache — avoids re-decoding data URLs on every dither
const imageCache = new Map<string, HTMLImageElement>()

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached) return Promise.resolve(cached)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageCache.set(src, img)
      resolve(img)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}

export function evictImageCache(src: string) {
  imageCache.delete(src)
}

// Module-level state — shared across all callers
const isProcessing = ref(false)
const ditherMode = ref<DitherMode>('diffusion')
const algorithm = ref('FloydSteinberg')
const serpentine = ref(false)
const pixeliness = ref(1)
const pixelScale = ref(1)
const bayerSize = ref<BayerSize>(4)
const smoothPixels = ref(false)
const palette = ref<number[][]>([])
const originalWidth = ref(0)
const originalHeight = ref(0)
const sizeWidth = ref<number | undefined>(undefined)
const sizeValid = ref(true)

// RgbQuant instance cache — reused when only algorithm/serpentine changes
let cachedQuant: any = null
let cachedPaletteKey = ''

// Bayer Web Worker (lazily created)
let worker: Worker | null = null

export function useDithering() {

  function getWorker(): Worker {
    if (!worker) {
      worker = new Worker(
        new URL('~/utils/dither-worker', import.meta.url),
        { type: 'module' }
      )
    }
    return worker
  }

  function getPaletteKey(pal: number[][]): string {
    return pal.map(c => c.join(',')).join('|')
  }

  const rgbQuantOptions = computed<RgbQuantOptions>(() => ({
    colors: palette.value.length || 8,
    method: 2,
    boxSize: [8, 8],
    boxPxls: 2,
    initColors: 4096,
    minHueCols: 2000,
    dithKern: algorithm.value,
    dithDelta: 0,
    dithSerp: serpentine.value,
    palette: palette.value,
    reIndex: false,
    useCache: true,
    cacheFreq: 10,
    colorDist: 'euclidean'
  }))

  function analyzePalette(image: HTMLImageElement): number[][] {
    const q = new RgbQuant({
      ...rgbQuantOptions.value,
      colors: 8,
      palette: []
    })
    q.sample(image)
    return q.palette(true)
  }

  function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob(blob => resolve(blob!), 'image/png')
    })
  }

  async function dither(
    sourceImage: HTMLImageElement,
    targetCanvas: HTMLCanvasElement,
    width?: number
  ): Promise<DitherResult> {
    isProcessing.value = true

    try {
      const ctx = targetCanvas.getContext('2d')!
      const finalWidth = width || sourceImage.naturalWidth
      const finalHeight = (sourceImage.naturalHeight / sourceImage.naturalWidth) * finalWidth

      // Pre-dither downscale for chunky pixel effect
      const scale = pixelScale.value
      const ditherWidth = scale > 1 ? Math.max(1, Math.round(finalWidth / scale)) : finalWidth
      const ditherHeight = scale > 1 ? Math.max(1, Math.round(finalHeight / scale)) : finalHeight

      targetCanvas.width = ditherWidth
      targetCanvas.height = ditherHeight
      ctx.drawImage(sourceImage, 0, 0, ditherWidth, ditherHeight)

      if (ditherMode.value === 'bayer') {
        // --- Bayer path: offload to Web Worker with main-thread fallback ---
        const paletteToUse = palette.value.length > 0 ? palette.value : analyzePalette(sourceImage)

        try {
          const imageData = ctx.getImageData(0, 0, ditherWidth, ditherHeight)
          const result = await new Promise<{ pixels: ArrayBuffer; width: number; height: number }>((resolve, reject) => {
            const w = getWorker()
            const timeoutId = setTimeout(() => reject(new Error('Bayer worker timeout')), 10_000)
            w.onmessage = (e) => {
              clearTimeout(timeoutId)
              resolve(e.data)
            }
            w.onerror = (e) => {
              clearTimeout(timeoutId)
              reject(e)
            }
            w.postMessage({
              pixels: imageData.data.buffer,
              width: ditherWidth,
              height: ditherHeight,
              palette: paletteToUse,
              blockSize: pixeliness.value,
              bayerSize: bayerSize.value
            }, [imageData.data.buffer])
          })

          const processedData = new ImageData(
            new Uint8ClampedArray(result.pixels),
            result.width,
            result.height
          )
          ctx.putImageData(processedData, 0, 0)
        } catch {
          // Worker failed — fall back to main-thread Bayer dithering
          ctx.drawImage(sourceImage, 0, 0, ditherWidth, ditherHeight)
          const freshImageData = ctx.getImageData(0, 0, ditherWidth, ditherHeight)
          bayerDither(ctx, freshImageData, paletteToUse, pixeliness.value, bayerSize.value, smoothPixels.value)
        }
      } else {
        // --- Error diffusion path: cache RgbQuant instance ---
        const palKey = getPaletteKey(palette.value)

        let q: any
        if (cachedQuant && cachedPaletteKey === palKey) {
          // Reuse cached instance — palette tables + color cache already built.
          // Only re-reduce with (potentially different) kernel/serpentine.
          q = cachedQuant
        } else {
          // Palette changed — need fresh instance
          q = new RgbQuant(rgbQuantOptions.value)
          q.sample(sourceImage)
          cachedQuant = q
          cachedPaletteKey = palKey
        }

        // Pass algorithm + serpentine explicitly so the cached instance
        // uses the current values even if they differ from construction
        const ditherResult = q.reduce(targetCanvas, 1, algorithm.value, serpentine.value)
        const imageData = ctx.getImageData(0, 0, ditherWidth, ditherHeight)
        imageData.data.set(ditherResult)
        ctx.putImageData(imageData, 0, 0)
      }

      // Upscale dithered result to full resolution with nearest-neighbor interpolation
      if (scale > 1) {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = ditherWidth
        tempCanvas.height = ditherHeight
        const tempCtx = tempCanvas.getContext('2d')!
        tempCtx.drawImage(targetCanvas, 0, 0)

        targetCanvas.width = finalWidth
        targetCanvas.height = finalHeight
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(tempCanvas, 0, 0, finalWidth, finalHeight)
      }

      // Post-process pixelation (operates on upscaled result)
      if (pixeliness.value > 1) {
        addPixelation(ctx, targetCanvas, finalWidth, finalHeight, pixeliness.value, smoothPixels.value)
      }

      // Async PNG encoding — doesn't block the main thread
      const blob = await canvasToBlob(targetCanvas)
      const url = URL.createObjectURL(blob)

      return {
        width: finalWidth,
        height: finalHeight,
        blob,
        url
      }
    } finally {
      isProcessing.value = false
    }
  }

  function invalidateQuantCache() {
    cachedQuant = null
    cachedPaletteKey = ''
  }

  async function ditherGif(
    frames: GifFrame[],
    onProgress?: (progress: number) => void
  ): Promise<DitherResult> {
    isProcessing.value = true
    try {
      const firstFrame = frames[0]!
      const { width, height } = firstFrame.imageData

      const scratchCanvas = document.createElement('canvas')
      scratchCanvas.width = width
      scratchCanvas.height = height
      const ctx = scratchCanvas.getContext('2d')!

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const GIF = ((await import('gif.js')) as any).default
      const workerScript = await getGifWorkerUrl()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gif = new GIF({ workers: 2, quality: 10, workerScript }) as any

      // Build palette from first frame for diffusion mode
      let q: any = null
      if (ditherMode.value === 'diffusion') {
        const palKey = getPaletteKey(palette.value)
        if (cachedQuant && cachedPaletteKey === palKey) {
          q = cachedQuant
        } else {
          q = new RgbQuant(rgbQuantOptions.value)
          ctx.putImageData(firstFrame.imageData, 0, 0)
          q.sample(scratchCanvas)
          cachedQuant = q
          cachedPaletteKey = palKey
        }
      }

      // For Bayer mode, use configured palette (or derive from first frame if empty)
      let paletteToUse = palette.value
      if (ditherMode.value === 'bayer' && paletteToUse.length === 0) {
        ctx.putImageData(firstFrame.imageData, 0, 0)
        const qTemp = new RgbQuant({ ...rgbQuantOptions.value, colors: 8, palette: [] })
        qTemp.sample(scratchCanvas)
        paletteToUse = qTemp.palette(true)
      }

      for (let i = 0; i < frames.length; i++) {
        const { imageData, delay } = frames[i]!
        ctx.putImageData(imageData, 0, 0)

        if (ditherMode.value === 'bayer') {
          const buf = imageData.data.buffer.slice(0) // copy — don't transfer the original
          const result = await new Promise<{ pixels: ArrayBuffer; width: number; height: number }>((resolve, reject) => {
            const w = getWorker()
            const timeoutId = setTimeout(() => reject(new Error('Bayer worker timeout')), 10_000)
            w.onmessage = (e: MessageEvent) => { clearTimeout(timeoutId); resolve(e.data) }
            w.onerror = (e: ErrorEvent) => { clearTimeout(timeoutId); reject(e) }
            w.postMessage({ pixels: buf, width, height, palette: paletteToUse, blockSize: pixeliness.value, bayerSize: bayerSize.value }, [buf])
          })
          ctx.putImageData(new ImageData(new Uint8ClampedArray(result.pixels), result.width, result.height), 0, 0)
        } else {
          const ditherResult = q.reduce(scratchCanvas, 1, algorithm.value, serpentine.value)
          const id = ctx.getImageData(0, 0, width, height)
          id.data.set(ditherResult)
          ctx.putImageData(id, 0, 0)
        }

        const ditheredData = ctx.getImageData(0, 0, width, height)
        gif.addFrame(ditheredData, { delay })

        onProgress?.((i + 1) / frames.length)

        // Yield to the browser every 5 frames to keep the UI responsive
        if (i % 5 === 4) {
          await new Promise(resolve => requestAnimationFrame(resolve))
        }
      }

      const blob = await new Promise<Blob>((resolve) => {
        gif.on('finished', resolve)
        gif.render()
      })
      const url = URL.createObjectURL(blob)
      return { width, height, blob, url }
    } finally {
      isProcessing.value = false
    }
  }

  return {
    // State
    isProcessing,
    ditherMode,
    algorithm,
    serpentine,
    pixeliness,
    pixelScale,
    bayerSize,
    smoothPixels,
    palette,
    originalWidth,
    originalHeight,
    sizeWidth,
    sizeValid,

    // Computed
    rgbQuantOptions,

    // Methods
    analyzePalette,
    dither,
    ditherGif,
    invalidateQuantCache
  }
}
