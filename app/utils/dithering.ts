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
