export function getClosestColor(colors, [r2, g2, b2]) {
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

export function addPixelation(ctx, sourceCanvas, width, height, blockSize) {
  // draw the original image at a fraction of the final size
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = width / blockSize
  tempCanvas.height = height / blockSize

  // Disable image smoothing on temp canvas to prevent color interpolation during downscaling
  tempCtx.msImageSmoothingEnabled = false
  tempCtx.mozImageSmoothingEnabled = false
  tempCtx.webkitImageSmoothingEnabled = false
  tempCtx.imageSmoothingEnabled = false

  tempCtx.drawImage(sourceCanvas, 0, 0, tempCanvas.width, tempCanvas.height)

  // turn off image aliasing on main canvas for upscaling
  ctx.msImageSmoothingEnabled = false
  ctx.mozImageSmoothingEnabled = false
  ctx.webkitImageSmoothingEnabled = false
  ctx.imageSmoothingEnabled = false

  // enlarge the minimized image to full size
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

export function bayerDither(ctx, imageData, palette, blockSize) {
  const bayerThresholdMap = [
    [15, 135, 45, 165],
    [195, 75, 225, 105],
    [60, 180, 30, 150],
    [240, 120, 210, 90]
  ]

  const imageDataLength = imageData.data.length

  const w = imageData.width

  const oldPalette = palette.slice()
  const newPalette = []

  oldPalette.forEach((color, id) => {
    const newColor = [id].concat(color)
    newPalette.push(newColor)
  })

  // Go through the RGBA data, at every 4th value, each of which corresponds to a pixel
  for (
    let currentPixel = 0;
    currentPixel <= imageDataLength - 4;
    currentPixel += 4
  ) {
    const x = (currentPixel / 4) % w
    const y = Math.floor(currentPixel / 4 / w)

    const map = Math.floor(
      (imageData.data[currentPixel] + bayerThresholdMap[x % 4][y % 4]) / 2
    )
    const map2 = Math.floor(
      (imageData.data[currentPixel + 1] + bayerThresholdMap[x % 4][y % 4]) / 2
    )
    const map3 = Math.floor(
      (imageData.data[currentPixel + 2] + bayerThresholdMap[x % 4][y % 4]) / 2
    )

    const closest_color = getClosestColor(newPalette, [map, map2, map3])

    imageData.data[currentPixel] = closest_color[1]
    imageData.data[currentPixel + 1] = closest_color[2]
    imageData.data[currentPixel + 2] = closest_color[3]
  }

  // Put the new image data on the canvas
  ctx.putImageData(imageData, 0, 0)

  if (blockSize > 1) {
    addPixelation(ctx, ctx.canvas, imageData.width, imageData.height, blockSize)
  }
}
