import { getClosestColor, bayerDither, addPixelation } from '@/utils/dithering'

// ── getClosestColor ──────────────────────────────────────────────────

describe('getClosestColor', () => {
  const palette = [
    [0, 255, 0, 0], // red
    [1, 0, 255, 0], // green
    [2, 0, 0, 255], // blue
    [3, 255, 255, 255], // white
    [4, 0, 0, 0] // black
  ]

  test('returns exact match when color is in palette', () => {
    const result = getClosestColor(palette, [255, 0, 0])
    expect(result).toEqual([0, 255, 0, 0])
  })

  test('returns closest color by Euclidean distance', () => {
    // (200, 10, 10) is closest to red (255, 0, 0)
    const result = getClosestColor(palette, [200, 10, 10])
    expect(result).toEqual([0, 255, 0, 0])
  })

  test('works with single-color palette', () => {
    const single = [[0, 128, 128, 128]]
    const result = getClosestColor(single, [0, 0, 0])
    expect(result).toEqual([0, 128, 128, 128])
  })

  test('returns black for (0,0,0)', () => {
    const result = getClosestColor(palette, [0, 0, 0])
    expect(result).toEqual([4, 0, 0, 0])
  })

  test('returns white for (255,255,255)', () => {
    const result = getClosestColor(palette, [255, 255, 255])
    expect(result).toEqual([3, 255, 255, 255])
  })
})

// ── bayerDither ──────────────────────────────────────────────────────

describe('bayerDither', () => {
  let ctx, imageData

  beforeEach(() => {
    // 2x2 image: 4 pixels, 16 bytes of RGBA data
    const data = new Uint8ClampedArray([
      100, 100, 100, 255, // pixel 0
      200, 200, 200, 255, // pixel 1
      50, 50, 50, 255, // pixel 2
      150, 150, 150, 255 // pixel 3
    ])

    imageData = { data, width: 2, height: 2 }

    ctx = {
      putImageData: jest.fn(),
      canvas: {}
    }
  })

  test('modifies imageData pixels to palette colors', () => {
    const palette = [
      [0, 0, 0],
      [255, 255, 255]
    ]

    bayerDither(ctx, imageData, palette, 1)

    // Every pixel should now be either black or white
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i]
      const g = imageData.data[i + 1]
      const b = imageData.data[i + 2]
      const isBlack = r === 0 && g === 0 && b === 0
      const isWhite = r === 255 && g === 255 && b === 255
      expect(isBlack || isWhite).toBe(true)
    }
  })

  test('calls putImageData on context', () => {
    const palette = [
      [0, 0, 0],
      [255, 255, 255]
    ]

    bayerDither(ctx, imageData, palette, 1)
    expect(ctx.putImageData).toHaveBeenCalledWith(imageData, 0, 0)
  })

  test('calls addPixelation when blockSize > 1', () => {
    // Mock document.createElement for addPixelation
    const tempCtx = {
      drawImage: jest.fn(),
      msImageSmoothingEnabled: true,
      mozImageSmoothingEnabled: true,
      webkitImageSmoothingEnabled: true,
      imageSmoothingEnabled: true
    }
    const tempCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => tempCtx)
    }
    document.createElement = jest.fn(() => tempCanvas)

    ctx.drawImage = jest.fn()
    ctx.msImageSmoothingEnabled = true
    ctx.mozImageSmoothingEnabled = true
    ctx.webkitImageSmoothingEnabled = true
    ctx.imageSmoothingEnabled = true

    const palette = [
      [0, 0, 0],
      [255, 255, 255]
    ]

    bayerDither(ctx, imageData, palette, 2)
    expect(document.createElement).toHaveBeenCalledWith('canvas')
  })

  test('skips pixelation when blockSize is 1', () => {
    document.createElement = jest.fn()

    const palette = [
      [0, 0, 0],
      [255, 255, 255]
    ]

    bayerDither(ctx, imageData, palette, 1)
    expect(document.createElement).not.toHaveBeenCalled()
  })
})

// ── addPixelation ────────────────────────────────────────────────────

describe('addPixelation', () => {
  test('creates temp canvas at reduced size and draws scaled image', () => {
    const tempCtx = {
      drawImage: jest.fn(),
      msImageSmoothingEnabled: true,
      mozImageSmoothingEnabled: true,
      webkitImageSmoothingEnabled: true,
      imageSmoothingEnabled: true
    }
    const tempCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => tempCtx)
    }
    document.createElement = jest.fn(() => tempCanvas)

    const sourceCanvas = { width: 100, height: 100 }
    const ctx = {
      drawImage: jest.fn(),
      msImageSmoothingEnabled: true,
      mozImageSmoothingEnabled: true,
      webkitImageSmoothingEnabled: true,
      imageSmoothingEnabled: true
    }

    addPixelation(ctx, sourceCanvas, 100, 100, 4)

    expect(document.createElement).toHaveBeenCalledWith('canvas')
    expect(tempCanvas.width).toBe(25)
    expect(tempCanvas.height).toBe(25)
    expect(tempCtx.imageSmoothingEnabled).toBe(false)
    expect(ctx.imageSmoothingEnabled).toBe(false)
    expect(tempCtx.drawImage).toHaveBeenCalledWith(sourceCanvas, 0, 0, 25, 25)
    expect(ctx.drawImage).toHaveBeenCalledWith(
      tempCanvas,
      0,
      0,
      25,
      25,
      0,
      0,
      100,
      100
    )
  })
})
