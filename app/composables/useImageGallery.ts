import JSZip from 'jszip'
import { nextTick } from 'vue'

export interface GifFrame {
  imageData: ImageData
  delay: number // milliseconds
}

export interface GalleryImage {
  id: string
  fileName: string
  originalSrc: string
  originalFileSize: number // in bytes
  originalMimeType: string // e.g. 'image/jpeg', 'image/png'
  naturalWidth: number
  naturalHeight: number
  ditheredDataUrl: string | null // blob URL for display
  ditheredBlob: Blob | null // raw PNG/GIF blob for download/zip
  ditheredFileSize: number | null // blob.size in bytes
  resizedOriginalSrc: string | null
  isProcessing: boolean
  isStale: boolean // dithered result is outdated and needs re-processing
  isAnimatedGif: boolean
  gifFrames: GifFrame[] | null
  gifFrameCount: number | null
  processingProgress: number | null // 0–1 while dithering GIF frames
}

// Module-level state — shared across all callers
const images = ref<GalleryImage[]>([])
const selectedId = ref<string | null>(null)
const isDownloadingAll = ref(false)

const selectedImage = computed(() =>
  images.value.find(img => img.id === selectedId.value) || null
)

const hasImages = computed(() => images.value.length > 0)

const processedCount = computed(() =>
  images.value.filter(img => img.ditheredDataUrl !== null).length
)

export function useImageGallery() {

  function generateId(): string {
    return `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }

  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
  const MAX_DIMENSION = 10000

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  async function decodeGifFrames(file: File): Promise<GifFrame[] | null> {
    try {
      const { parseGIF, decompressFrames } = await import('gifuct-js')
      const buffer = await readFileAsArrayBuffer(file)
      const gif = parseGIF(buffer)
      const frames = decompressFrames(gif, true)
      if (frames.length <= 1) return null

      const fullWidth = gif.lsd.width
      const fullHeight = gif.lsd.height

      // Resolve the GIF's background color for disposal-type-2 restoration.
      // GIFs use a color-index-based transparent color per frame; if the background
      // color index is NOT the transparent index for a given frame, it's a real color.
      const gct = (gif as any).gct as [number, number, number][] | undefined
      const bgColorIndex = (gif as any).lsd?.backgroundColorIndex as number | undefined

      // Compositing canvas — accumulates frames respecting disposal methods
      const canvas = document.createElement('canvas')
      canvas.width = fullWidth
      canvas.height = fullHeight
      const ctx = canvas.getContext('2d')!

      const result: GifFrame[] = []
      let previousSnapshot: ImageData | null = null

      for (const frame of frames) {
        // Save snapshot before drawing if we need to restore it next iteration
        if (frame.disposalType === 3) {
          previousSnapshot = ctx.getImageData(0, 0, fullWidth, fullHeight)
        }

        // Draw the patch at its position within the full canvas
        const patchCanvas = document.createElement('canvas')
        patchCanvas.width = frame.dims.width
        patchCanvas.height = frame.dims.height
        const patchCtx = patchCanvas.getContext('2d')!
        patchCtx.putImageData(new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height), 0, 0)
        ctx.drawImage(patchCanvas, frame.dims.left, frame.dims.top)

        // Capture the fully composited frame
        result.push({
          imageData: ctx.getImageData(0, 0, fullWidth, fullHeight),
          delay: frame.delay // gifuct-js already returns ms
        })

        // Apply disposal method for the next frame
        switch (frame.disposalType) {
          case 2: {
            // Restore to background: use the GIF's declared background color if it isn't
            // the transparent color index for this frame — otherwise clear to transparent.
            const frameTransIdx = (frame as any).transparentIndex as number | undefined
            const bgIsTransparent = frameTransIdx != null && frameTransIdx === bgColorIndex
            const bgRgb = (!bgIsTransparent && gct && bgColorIndex != null) ? gct[bgColorIndex] : null
            if (bgRgb) {
              ctx.fillStyle = `rgb(${bgRgb[0]},${bgRgb[1]},${bgRgb[2]})`
              ctx.fillRect(frame.dims.left, frame.dims.top, frame.dims.width, frame.dims.height)
            } else {
              ctx.clearRect(frame.dims.left, frame.dims.top, frame.dims.width, frame.dims.height)
            }
            break
          }
          case 3:
            if (previousSnapshot) ctx.putImageData(previousSnapshot, 0, 0)
            break
          // 0/1: leave canvas as-is
        }
      }

      return result
    } catch {
      return null
    }
  }

  function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = src
    })
  }

  async function addImages(files: FileList | File[]): Promise<{ tooLarge: string[]; tooWide: string[]; largeFiles: string[]; added: number }> {
    const isMobile = import.meta.client && window.innerWidth < 1024
    const LARGE_FILE_THRESHOLD = isMobile ? 1 * 1024 * 1024 : 2 * 1024 * 1024
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    const tooLarge: string[] = []
    const tooWide: string[] = []
    const largeFiles: string[] = []
    let added = 0

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        tooLarge.push(file.name)
        continue
      }

      const dataUrl = await readFileAsDataURL(file)
      const { width, height } = await getImageDimensions(dataUrl)

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        tooWide.push(file.name)
        continue
      }

      let isAnimatedGif = false
      let gifFrames: GifFrame[] | null = null
      let gifFrameCount: number | null = null

      if (file.type === 'image/gif') {
        const frames = await decodeGifFrames(file)
        if (frames) {
          isAnimatedGif = true
          gifFrames = frames
          gifFrameCount = frames.length
        }
      }

      const newImage: GalleryImage = {
        id: generateId(),
        fileName: file.name,
        originalSrc: dataUrl,
        originalFileSize: file.size,
        originalMimeType: file.type || 'image/png',
        naturalWidth: width,
        naturalHeight: height,
        ditheredDataUrl: null,
        ditheredBlob: null,
        ditheredFileSize: null,
        resizedOriginalSrc: null,
        isProcessing: false,
        isStale: false,
        isAnimatedGif,
        gifFrames,
        gifFrameCount,
        processingProgress: null
      }
      images.value.push(newImage)

      if (file.size > LARGE_FILE_THRESHOLD || width * height > 4_000_000) {
        largeFiles.push(file.name)
      }

      added++

      // Auto-select if this is the first image
      if (images.value.length === 1) {
        selectedId.value = newImage.id
      }
    }

    return { tooLarge, tooWide, largeFiles, added }
  }

  async function addImageFromUrl(url: string, fileName: string) {
    const response = await fetch(url)
    const blob = await response.blob()
    const file = new File([blob], fileName, { type: blob.type })
    await addImages([file])
  }

  function selectImage(id: string) {
    selectedId.value = id
  }

  function removeImage(id: string) {
    const index = images.value.findIndex(img => img.id === id)
    if (index !== -1) {
      // Revoke blob URL before removing
      const img = images.value[index]
      if (img?.ditheredDataUrl) {
        URL.revokeObjectURL(img.ditheredDataUrl)
      }

      images.value.splice(index, 1)

      // Update selection if we removed the selected image
      if (selectedId.value === id) {
        if (images.value.length > 0) {
          // Select the previous image, or first if we removed the first
          const newIndex = Math.max(0, index - 1)
          selectedId.value = images.value[newIndex]?.id ?? null
        } else {
          selectedId.value = null
        }
      }
    }
  }

  function clearAll() {
    // Revoke all blob URLs
    images.value.forEach((img) => {
      if (img.ditheredDataUrl) {
        URL.revokeObjectURL(img.ditheredDataUrl)
      }
    })
    images.value = []
    selectedId.value = null
  }

  function setDitheredResult(id: string, url: string, blob: Blob) {
    const image = images.value.find(img => img.id === id)
    if (image) {
      const oldUrl = image.ditheredDataUrl
      // Set new values first so the <img> gets a valid src immediately
      image.ditheredDataUrl = url
      image.ditheredBlob = blob
      image.ditheredFileSize = blob.size
      image.isStale = false
      // Revoke old blob URL after Vue has flushed the DOM update
      if (oldUrl) {
        nextTick(() => URL.revokeObjectURL(oldUrl))
      }
    }
  }

  function setResizedOriginal(id: string, dataUrl: string | null) {
    const image = images.value.find(img => img.id === id)
    if (image) {
      image.resizedOriginalSrc = dataUrl
    }
  }

  function setProcessing(id: string, processing: boolean) {
    const image = images.value.find(img => img.id === id)
    if (image) {
      image.isProcessing = processing
    }
  }

  function setProgress(id: string, value: number | null) {
    const image = images.value.find(img => img.id === id)
    if (image) {
      image.processingProgress = value
    }
  }

  function clearDitheredResults() {
    images.value.forEach((img) => {
      if (img.ditheredDataUrl) {
        URL.revokeObjectURL(img.ditheredDataUrl)
      }
      img.ditheredDataUrl = null
      img.ditheredBlob = null
      img.ditheredFileSize = null
      img.resizedOriginalSrc = null
      img.processingProgress = null
    })
  }

  async function downloadAll(
    processImage: (image: GalleryImage) => Promise<{ url: string; blob: Blob }>,
    format: string = 'png',
    convertBlob?: (blob: Blob) => Promise<Blob>
  ) {
    if (images.value.length === 0) return

    isDownloadingAll.value = true

    try {
      const zip = new JSZip()

      // Process any unprocessed images and add all to ZIP
      for (const image of images.value) {
        let blob = image.ditheredBlob

        // Process if not already processed
        if (!blob) {
          image.isProcessing = true
          try {
            const result = await processImage(image)
            // Revoke old URL if any
            if (image.ditheredDataUrl) {
              URL.revokeObjectURL(image.ditheredDataUrl)
            }
            image.ditheredDataUrl = result.url
            image.ditheredBlob = result.blob
            image.ditheredFileSize = result.blob.size
            blob = result.blob
          } finally {
            image.isProcessing = false
          }
        }

        if (blob) {
          const baseName = image.fileName.replace(/\.[^.]+$/, '')
          if (image.isAnimatedGif) {
            // Always use .gif extension and skip format conversion for animated GIFs
            zip.file(`${baseName}-dithered.gif`, blob)
          } else {
            if (convertBlob) {
              blob = await convertBlob(blob)
            }
            zip.file(`${baseName}-dithered.${format}`, blob)
          }
        }
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'dithered-images.zip'
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      isDownloadingAll.value = false
    }
  }

  return {
    // State
    images,
    selectedId,
    selectedImage,
    hasImages,
    processedCount,
    isDownloadingAll,

    // Methods
    addImages,
    addImageFromUrl,
    selectImage,
    removeImage,
    clearAll,
    setDitheredResult,
    setResizedOriginal,
    setProcessing,
    setProgress,
    clearDitheredResults,
    downloadAll
  }
}
