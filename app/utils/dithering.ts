import { BLUE_NOISE_TEXTURE } from './blue-noise-texture'

export type BayerSize = 2 | 4 | 8 | 16

export const BAYER_SIZES = [
  { label: '2x2', value: 2 },
  { label: '4x4', value: 4 },
  { label: '8x8', value: 8 },
  { label: '16x16', value: 16 }
] as const

function generateBayerIndex(size: number): number[][] {
  if (size === 2) return [[0, 2], [3, 1]]
  const half = size / 2
  const sub = generateBayerIndex(half)
  const m: number[][] = Array.from({ length: size }, () => new Array(size))
  for (let si = 0; si < half; si++) {
    for (let sj = 0; sj < half; sj++) {
      const v = sub[si]![sj]! * 4
      m[si]![sj] = v
      m[si]![half + sj] = v + 2
      m[half + si]![sj] = v + 3
      m[half + si]![half + sj] = v + 1
    }
  }
  return m
}

function toBayerThresholds(m: number[][]): number[][] {
  const n = m.length * m.length
  return m.map(row => row.map(v => Math.floor((v + 0.5) / n * 256)))
}

export const BAYER_MATRICES: Record<BayerSize, number[][]> = {
  2: toBayerThresholds(generateBayerIndex(2)),
  4: toBayerThresholds(generateBayerIndex(4)),
  8: toBayerThresholds(generateBayerIndex(8)),
  16: toBayerThresholds(generateBayerIndex(16))
}

export function getClosestColor(colors: number[][], [r2, g2, b2]: number[]): number[] {
  let minDist = Infinity
  let closest = colors[0]
  for (let i = 0; i < colors.length; i++) {
    const [, r1, g1, b1] = colors[i]
    const dist = (r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2
    if (dist < minDist) {
      minDist = dist
      closest = colors[i]
    }
  }
  return closest
}

export function addPixelation(
  ctx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  blockSize: number,
  smoothDownscale = false
) {
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')!
  tempCanvas.width = width / blockSize
  tempCanvas.height = height / blockSize

  tempCtx.imageSmoothingEnabled = smoothDownscale
  tempCtx.drawImage(sourceCanvas, 0, 0, tempCanvas.width, tempCanvas.height)

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(
    tempCanvas,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height,
    0,
    0,
    width,
    height
  )
}

export function bayerDither(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  palette: number[][],
  blockSize: number,
  bayerSize: BayerSize = 4,
  smoothDownscale = false
) {
  const matrix = BAYER_MATRICES[bayerSize]
  const size = bayerSize

  const imageDataLength = imageData.data.length
  const w = imageData.width

  const newPalette = palette.map((color, id) => [id, ...color])

  for (let currentPixel = 0; currentPixel <= imageDataLength - 4; currentPixel += 4) {
    const x = (currentPixel / 4) % w
    const y = Math.floor(currentPixel / 4 / w)

    const threshold = matrix[y % size]![x % size]!

    const map = Math.max(0, Math.min(255, imageData.data[currentPixel]! + 128 - threshold))
    const map2 = Math.max(0, Math.min(255, imageData.data[currentPixel + 1]! + 128 - threshold))
    const map3 = Math.max(0, Math.min(255, imageData.data[currentPixel + 2]! + 128 - threshold))

    const closestColor = getClosestColor(newPalette, [map, map2, map3])

    imageData.data[currentPixel] = closestColor[1]!
    imageData.data[currentPixel + 1] = closestColor[2]!
    imageData.data[currentPixel + 2] = closestColor[3]!
  }

  ctx.putImageData(imageData, 0, 0)

  if (blockSize > 1) {
    addPixelation(ctx, ctx.canvas, imageData.width, imageData.height, blockSize, smoothDownscale)
  }
}

export function simple2DDither(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  palette: number[][],
  blockSize: number,
  smoothDownscale = false
) {
  const { width, height } = imageData
  const data = imageData.data
  const newPalette = palette.map((color, id) => [id, ...color])

  // Floating-point error buffer: one [eR, eG, eB] per pixel
  const errR = new Float64Array(width * height)
  const errG = new Float64Array(width * height)
  const errB = new Float64Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const idx = y * width + x

      const adjR = Math.max(0, Math.min(255, data[i]! + errR[idx]!))
      const adjG = Math.max(0, Math.min(255, data[i + 1]! + errG[idx]!))
      const adjB = Math.max(0, Math.min(255, data[i + 2]! + errB[idx]!))

      const closest = getClosestColor(newPalette, [adjR, adjG, adjB])
      const chosenR = closest[1]!
      const chosenG = closest[2]!
      const chosenB = closest[3]!

      data[i] = chosenR
      data[i + 1] = chosenG
      data[i + 2] = chosenB

      const eR = adjR - chosenR
      const eG = adjG - chosenG
      const eB = adjB - chosenB

      // Spread error: 1/2 right, 1/2 below
      if (x + 1 < width) {
        errR[idx + 1]! += eR * 0.5
        errG[idx + 1]! += eG * 0.5
        errB[idx + 1]! += eB * 0.5
      }
      if (y + 1 < height) {
        errR[idx + width]! += eR * 0.5
        errG[idx + width]! += eG * 0.5
        errB[idx + width]! += eB * 0.5
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)

  if (blockSize > 1) {
    addPixelation(ctx, ctx.canvas, width, height, blockSize, smoothDownscale)
  }
}

function nextPowerOfTwo(n: number): number {
  let p = 1; while (p < n) p <<= 1; return p
}

export function hilbertD2XY(n: number, d: number): [number, number] {
  let rx: number, ry: number, t = d, x = 0, y = 0
  for (let s = 1; s < n; s *= 2) {
    rx = 1 & Math.floor(t / 2)
    ry = 1 & (t ^ rx)
    if (ry === 0) {
      if (rx === 1) { x = s - 1 - x; y = s - 1 - y }
      const tmp = x; x = y; y = tmp
    }
    x += s * rx; y += s * ry; t = Math.floor(t / 4)
  }
  return [x, y]
}

export function blueNoiseDither(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  palette: number[][],
  blockSize: number,
  smoothDownscale = false
) {
  const imageDataLength = imageData.data.length
  const w = imageData.width

  const newPalette = palette.map((color, id) => [id, ...color])
  const colorCache = new Map<number, number[]>()

  for (let currentPixel = 0; currentPixel <= imageDataLength - 4; currentPixel += 4) {
    const x = (currentPixel / 4) % w
    const y = Math.floor(currentPixel / 4 / w)

    const threshold = BLUE_NOISE_TEXTURE[(y % 64) * 64 + (x % 64)]!

    const r = Math.max(0, Math.min(255, imageData.data[currentPixel]! + 128 - threshold))
    const g = Math.max(0, Math.min(255, imageData.data[currentPixel + 1]! + 128 - threshold))
    const b = Math.max(0, Math.min(255, imageData.data[currentPixel + 2]! + 128 - threshold))

    const key = (r << 16) | (g << 8) | b
    let closest = colorCache.get(key)
    if (!closest) {
      closest = getClosestColor(newPalette, [r, g, b])
      colorCache.set(key, closest)
    }

    imageData.data[currentPixel] = closest[1]!
    imageData.data[currentPixel + 1] = closest[2]!
    imageData.data[currentPixel + 2] = closest[3]!
  }

  ctx.putImageData(imageData, 0, 0)

  if (blockSize > 1) {
    addPixelation(ctx, ctx.canvas, imageData.width, imageData.height, blockSize, smoothDownscale)
  }
}

export function riemersmaDither(
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  palette: number[][],
  blockSize: number,
  smoothDownscale = false
) {
  const { width, height } = imageData
  const data = imageData.data
  const newPalette = palette.map((color, id) => [id, ...color])

  const N = 32
  const r = 1 / 8
  // weights[0] = most recent (1.0), weights[N-1] = oldest (r^1 ≈ 0.125)
  const weights: number[] = []
  for (let i = 0; i < N; i++) {
    weights.push(Math.pow(r, i / (N - 1)))
  }

  // Circular error buffer: [eR, eG, eB] per slot
  const errorBuf: Float64Array = new Float64Array(N * 3)
  let bufHead = 0

  const side = nextPowerOfTwo(Math.max(width, height))

  for (let d = 0; d < side * side; d++) {
    const [x, y] = hilbertD2XY(side, d)
    if (x >= width || y >= height) continue

    const i = (y * width + x) * 4

    // Accumulate weighted errors from circular buffer
    let eR = 0, eG = 0, eB = 0
    for (let k = 0; k < N; k++) {
      const slot = ((bufHead - 1 - k) % N + N) % N
      eR += weights[k]! * errorBuf[slot * 3]!
      eG += weights[k]! * errorBuf[slot * 3 + 1]!
      eB += weights[k]! * errorBuf[slot * 3 + 2]!
    }

    const origR = data[i]!
    const origG = data[i + 1]!
    const origB = data[i + 2]!

    const adjR = Math.max(0, Math.min(255, origR + eR))
    const adjG = Math.max(0, Math.min(255, origG + eG))
    const adjB = Math.max(0, Math.min(255, origB + eB))

    const closest = getClosestColor(newPalette, [adjR, adjG, adjB])
    const chosenR = closest[1]!
    const chosenG = closest[2]!
    const chosenB = closest[3]!

    data[i] = chosenR
    data[i + 1] = chosenG
    data[i + 2] = chosenB

    // Store error in circular buffer
    errorBuf[bufHead * 3] = origR - chosenR
    errorBuf[bufHead * 3 + 1] = origG - chosenG
    errorBuf[bufHead * 3 + 2] = origB - chosenB
    bufHead = (bufHead + 1) % N
  }

  ctx.putImageData(imageData, 0, 0)

  if (blockSize > 1) {
    addPixelation(ctx, ctx.canvas, width, height, blockSize, smoothDownscale)
  }
}
