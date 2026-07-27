// Shared dithering variant/palette definitions, extracted so both the
// bracket tournament and the standalone AI Ranker page use identical
// candidate configs. Keeping this in one place means the AI model's
// training data (built from tournament picks) always matches the
// candidate set the AI Ranker page scores against.

export const ERROR_ALGORITHMS = [
  'FloydSteinberg', 'Atkinson', 'Sierra24A', 'Fan', 'ShiauFan',
  'ShiauFan2', 'JarvisJudiceNinke', 'Stucki', 'Burkes', 'Sierra3', 'Sierra2'
]

export const PRESET_PALETTES = [
  { name: 'Original (auto)', value: 'original', colors: ['#888', '#444', '#ccc', '#222', '#fff'] },
  { name: 'Black & White', value: 'blackwhite', colors: ['#ffffff', '#000000'] },
  { name: 'CMYK', value: 'cmyk', colors: ['#000000', '#ffff00', '#00FFFF', '#FF00FF', '#FFFFFF'] },
  { name: 'Game Boy', value: 'gameboy', colors: ['#CADC9F', '#0F380F', '#306230', '#8BAC0F', '#9BBC0F'] },
  { name: 'Red Monochrome', value: 'redmono', colors: ['#ffe3db', '#4f1403'] },
  { name: 'Blue & Yellow', value: 'blueyellow', colors: ['#134E87', '#FFF585'] },
  { name: 'Green Monochrome', value: 'greenmono', colors: ['#eeffdb', '#1d3801'] },
  { name: 'Red', value: 'red', colors: ['#ffffff', '#f46842', '#aa2f0d', '#000000'] },
  { name: 'Black White Red', value: 'bwr', colors: ['#FFFFFF', '#000000', '#FF0000'] },
  { name: 'Purple & Green', value: 'purplegreen', colors: ['#76C066', '#AD2BBB'] },
]

export const PALETTE_COLORS = {
  original: null,
  blackwhite: [['#ffffff'], ['#000000']],
  cmyk: [['#000000'], ['#ffff00'], ['#00FFFF'], ['#FF00FF'], ['#FFFFFF']],
  gameboy: [['#CADC9F'], ['#0F380F'], ['#306230'], ['#8BAC0F'], ['#9BBC0F']],
  redmono: [['#ffe3db'], ['#4f1403']],
  blueyellow: [['#134E87'], ['#FFF585']],
  greenmono: [['#eeffdb'], ['#1d3801']],
  red: [['#ffffff'], ['#f46842'], ['#aa2f0d'], ['#000000']],
  bwr: [['#FFFFFF'], ['#000000'], ['#FF0000']],
  purplegreen: [['#76C066'], ['#AD2BBB']],
}

export function hexToRgb(hex) {
  const result = new RegExp('^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$', 'i').exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

export function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Builds the full candidate list for a given mode/serpentine choice.
// mode: 'error' | 'bayer' | 'both'
// serpentineOpt: true | false | 'both' (only relevant for error diffusion)
export function buildVariants(mode, serpentineOpt) {
  const variants = []
  if (mode === 'error' || mode === 'both') {
    const serpOptions = serpentineOpt === 'both' ? [false, true] : [serpentineOpt]
    ERROR_ALGORITHMS.forEach(algo => {
      serpOptions.forEach(serp => {
        variants.push({
          id: 'err_' + algo + '_' + (serp ? 'serp' : 'noserp'),
          label: algo + (serp ? ' (serpentine)' : ''),
          config: { mode: 'Error Diffusion', algorithm: algo, serpentine: serp }
        })
      })
    })
  }
  if (mode === 'bayer' || mode === 'both') {
    variants.push({
      id: 'bayer',
      label: 'Bayer (Ordered)',
      config: { mode: 'Bayer (Ordered)' }
    })
  }
  return variants
}

// Resolves a palette selection (preset key, or 'custom-gpl' + a customGplPalette
// object) down to an RGB array ready for RgbQuant/bayerDither, or null for
// 'original' (auto-sample from the image).
export function resolvePaletteRgb(paletteKey, customGplPalette) {
  if (paletteKey === 'custom-gpl' && customGplPalette) {
    return customGplPalette.rgb
  }
  if (paletteKey === 'original' || !paletteKey) {
    return null
  }
  const hexColors = PALETTE_COLORS[paletteKey]
  if (!hexColors) return null
  return hexColors.map(c => hexToRgb(Array.isArray(c) ? c[0] : c)).filter(Boolean)
}

export function resolvePaletteName(paletteKey, customGplPalette) {
  if (paletteKey === 'custom-gpl' && customGplPalette) {
    return customGplPalette.name
  }
  return PRESET_PALETTES.find(p => p.value === paletteKey)?.name || 'Original'
}
