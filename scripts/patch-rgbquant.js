import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, '../node_modules/rgbquant/src/rgbquant.js')

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8')
  let changed = false

  // Fix: error diffusion clamping bias
  // RgbQuant writes accumulated error back into the pixel buffer (buf32) with clamping,
  // which silently discards overflow. Errors that push channels above 255 get lost,
  // causing a bias toward darker output on bright/white backgrounds.
  //
  // Fix: use separate Float64Array error buffers so overflow is preserved.
  // Read pixel + accumulated error (unclamped) before nearest-color lookup,
  // and compute quantization error from the unclamped adjusted value.

  if (!content.includes('errR = new Float64Array')) {
    const oldBufDecl = '\t\tvar dir = serpentine ? -1 : 1;'
    const newBufDecl = '\t\t// Float error accumulation buffers — avoids clamping bias from writing back to uint8 pixel buffer\n\t\tvar errR = new Float64Array(len),\n\t\t\terrG = new Float64Array(len),\n\t\t\terrB = new Float64Array(len);\n\n\t\tvar dir = serpentine ? -1 : 1;'

    const oldPixelRead = '\t\t\t\t// Image pixel\n\t\t\t\tvar idx = lni + x,\n\t\t\t\t\ti32 = buf32[idx],\n\t\t\t\t\tr1 = (i32 & 0xff),\n\t\t\t\t\tg1 = (i32 & 0xff00) >> 8,\n\t\t\t\t\tb1 = (i32 & 0xff0000) >> 16;\n\n\t\t\t\t// Reduced pixel\n\t\t\t\tvar i32x = this.nearestColor(i32),'
    const newPixelRead = '\t\t\t\t// Image pixel (add accumulated float error before clamping)\n\t\t\t\tvar idx = lni + x,\n\t\t\t\t\ti32 = buf32[idx],\n\t\t\t\t\tr1r = (i32 & 0xff) + errR[idx],\n\t\t\t\t\tg1r = ((i32 & 0xff00) >> 8) + errG[idx],\n\t\t\t\t\tb1r = ((i32 & 0xff0000) >> 16) + errB[idx],\n\t\t\t\t\tr1 = Math.max(0, Math.min(255, Math.round(r1r))),\n\t\t\t\t\tg1 = Math.max(0, Math.min(255, Math.round(g1r))),\n\t\t\t\t\tb1 = Math.max(0, Math.min(255, Math.round(b1r)));\n\n\t\t\t\t// Reduced pixel\n\t\t\t\tvar i32x = this.nearestColor((255 << 24) | (b1 << 16) | (g1 << 8) | r1),'

    const oldErrorCalc = '\t\t\t\t// Component distance\n\t\t\t\tvar er = r1 - r2,\n\t\t\t\t\teg = g1 - g2,\n\t\t\t\t\teb = b1 - b2;'
    const newErrorCalc = '\t\t\t\t// Component distance (use unclamped raw values to preserve overflow)\n\t\t\t\tvar er = r1r - r2,\n\t\t\t\t\teg = g1r - g2,\n\t\t\t\t\teb = b1r - b2;'

    const oldNeighborUpdate = '\t\t\t\t\t\tvar r3 = (buf32[idx2] & 0xff),\n\t\t\t\t\t\t\tg3 = (buf32[idx2] & 0xff00) >> 8,\n\t\t\t\t\t\t\tb3 = (buf32[idx2] & 0xff0000) >> 16;\n\n\t\t\t\t\t\tvar r4 = Math.max(0, Math.min(255, r3 + er * d)),\n\t\t\t\t\t\t\tg4 = Math.max(0, Math.min(255, g3 + eg * d)),\n\t\t\t\t\t\t\tb4 = Math.max(0, Math.min(255, b3 + eb * d));\n\n\t\t\t\t\t\tbuf32[idx2] =\n\t\t\t\t\t\t\t(255 << 24)\t|\t// alpha\n\t\t\t\t\t\t\t(b4  << 16)\t|\t// blue\n\t\t\t\t\t\t\t(g4  <<  8)\t|\t// green\n\t\t\t\t\t\t\t r4;\t\t\t// red'
    const newNeighborUpdate = '\t\t\t\t\t\t// Accumulate error into float buffers (no clamping — preserves overflow)\n\t\t\t\t\t\terrR[idx2] += er * d;\n\t\t\t\t\t\terrG[idx2] += eg * d;\n\t\t\t\t\t\terrB[idx2] += eb * d;'

    if (content.includes(oldBufDecl) && content.includes(oldPixelRead) &&
        content.includes(oldErrorCalc) && content.includes(oldNeighborUpdate)) {
      content = content
        .replace(oldBufDecl, newBufDecl)
        .replace(oldPixelRead, newPixelRead)
        .replace(oldErrorCalc, newErrorCalc)
        .replace(oldNeighborUpdate, newNeighborUpdate)
      changed = true
      console.log('Patched rgbquant.js: fixed error diffusion clamping bias')
    } else {
      console.warn('Warning: could not apply error diffusion patch — source did not match expected strings')
      // Debug which part failed
      if (!content.includes(oldBufDecl)) console.warn('  - oldBufDecl not found')
      if (!content.includes(oldPixelRead)) console.warn('  - oldPixelRead not found')
      if (!content.includes(oldErrorCalc)) console.warn('  - oldErrorCalc not found')
      if (!content.includes(oldNeighborUpdate)) console.warn('  - oldNeighborUpdate not found')
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content)
  }
}
