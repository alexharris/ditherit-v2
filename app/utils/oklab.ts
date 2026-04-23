// sRGB [0–255] ↔ OKLab (Björn Ottosson, 2020)
// https://bottosson.github.io/posts/oklab/

function srgbToLinear(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

export function rgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const rl = srgbToLinear(r)
  const gl = srgbToLinear(g)
  const bl = srgbToLinear(b)

  const l = Math.cbrt(0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl)
  const m = Math.cbrt(0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl)
  const s = Math.cbrt(0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl)

  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  ]
}

export function oklabToRgb(L: number, a: number, b: number): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3

  const rl = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const gl = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bll = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

  return [
    Math.round(Math.max(0, Math.min(255, linearToSrgb(rl) * 255))),
    Math.round(Math.max(0, Math.min(255, linearToSrgb(gl) * 255))),
    Math.round(Math.max(0, Math.min(255, linearToSrgb(bll) * 255)))
  ]
}
