// Shared canvas-based dithering render function, extracted from
// DitherTournament.vue so the standalone AI Ranker page can produce
// pixel-identical output using the same RgbQuant/bayerDither pipeline,
// without needing a bracket UI or per-variant <canvas> refs in the DOM.

import RgbQuant from 'rgbquant'
import { bayerDither } from './dithering'

export function autoSamplePalette(img) {
  const canvas = document.createElement('canvas')
  canvas.width = 16
  canvas.height = 16
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, 16, 16)
  const data = ctx.getImageData(0, 0, 16, 16).data
  const colors = []
  for (let i = 0; i < data.length; i += 64) {
    colors.push([data[i], data[i + 1], data[i + 2]])
  }
  return colors.slice(0, 16)
}

// Renders a single variant config against the given loaded <img> element,
// using a throwaway canvas (not attached to the DOM). Returns a PNG data URL.
//
// variantConfig: { mode: 'Error Diffusion'|'Bayer (Ordered)', algorithm, serpentine }
// paletteRgb: array of [r,g,b] arrays, or null to auto-sample from the image
export function renderVariant(img, variantConfig, paletteRgb) {
  const w = img.naturalWidth
  const h = img.naturalHeight

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, w, h)

  try {
    if (variantConfig.mode === 'Bayer (Ordered)') {
      const imgData = ctx.getImageData(0, 0, w, h)
      const pal = paletteRgb || autoSamplePalette(img)
      bayerDither(ctx, imgData, pal, 1)
    } else {
      const qOpts = {
        colors: paletteRgb ? paletteRgb.length : 8,
        method: 2,
        boxSize: [8, 8],
        boxPxls: 2,
        initColors: 4096,
        minHueCols: 2000,
        dithKern: variantConfig.algorithm,
        dithDelta: 0,
        dithSerp: variantConfig.serpentine,
        reIndex: false,
        useCache: true,
        cacheFreq: 10,
        colorDist: 'euclidean',
        palette: paletteRgb || [],
      }
      const q = new RgbQuant(qOpts)
      q.sample(img)
      const result = q.reduce(canvas)
      const imgData = ctx.getImageData(0, 0, w, h)
      imgData.data.set(result)
      ctx.putImageData(imgData, 0, 0)
    }
  } catch (err) {
    // fall through — canvas keeps the plain drawImage copy if dithering failed
  }

  return canvas.toDataURL('image/png')
}

// Renders every variant in `variants` against `img`, yielding to the
// browser between each one (setTimeout 0) so a progress UI can update.
// onProgress(done, total) is called after each render.
// Returns an array of { ...variant, dataUrl, config: { ...variant.config, paletteColorCount } }
export async function renderAllVariants(img, variants, paletteRgb, onProgress) {
  const results = []
  const paletteColorCount = paletteRgb ? paletteRgb.length : 8

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i]
    await new Promise(resolve => setTimeout(resolve, 10))

    const dataUrl = renderVariant(img, v.config, paletteRgb)
    const configWithPaletteInfo = { ...v.config, paletteColorCount }
    results.push({ ...v, config: configWithPaletteInfo, dataUrl })

    if (onProgress) onProgress(i + 1, variants.length)
  }

  return results
}
