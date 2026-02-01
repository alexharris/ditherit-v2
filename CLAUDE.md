# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dither it! is a client-side image dithering web app built with **Vue 2 / Nuxt 2** (SPA mode, `ssr: false`). It uses [RgbQuant.js](https://github.com/leeoniya/RgbQuant.js) (custom fork with transparency support) for color quantization and dithering, with Canvas API for image rendering.

## Commands

```bash
# Dev server (localhost:3000) — requires Node <17 or setting legacy OpenSSL first
export NODE_OPTIONS=--openssl-legacy-provider  # needed for Node.js v17+
npm run dev

# Build & start production server
npm run build && npm run start

# Generate static site to /docs (GitHub Pages)
npm run generate
npm run generate:gh-pages  # with DEPLOY_ENV=GH_PAGES

# Lint
npm run lint

# Test
npm run test
```

## Architecture

**SPA with file-based routing** — Nuxt 2 with SSR disabled. Static output goes to `/docs`.

### Core Processing Flow

1. `components/ImageUpload.vue` — handles file input, drag-drop, clipboard paste
2. `pages/index.vue` (~1000 lines) — **the main application logic**: dithering configuration, RgbQuant invocation, Canvas rendering, download. This is the heart of the app.
3. `components/ColorPicker.vue` — palette management: analyze original colors, custom palette editing, import/export JSON, save to localStorage
4. `components/FilesizeResults.vue` — displays before/after file size comparison with donut chart

### Dithering Modes

- **Error Diffusion** with selectable algorithms: FloydSteinberg, Atkinson, Sierra24A, Fan, ShiauFan, ShiauFan2, JarvisJudiceNinke, Stucki, Burkes, Sierra3, Sierra2
- **Bayer (Ordered)** dithering
- **Pixeliness** effect via canvas downscaling/upscaling

### Key Dependencies

- `rgbquant` — forked at `github:alexharris/RgbQuant.js#transparency` for transparency support
- `vue-color` — color picker UI
- `tailwindcss` v3 with `@tailwindcss/forms` plugin
- `@nuxtjs/pwa` — progressive web app support

### Other Pages

- `/quant/` — blog/quarterly reports ("Quant Error")
- `/resources/` — curated dithering resources and links

## Style

- Tailwind CSS utility classes for styling
- Prettier: no semicolons, single quotes, arrow parens
- ESLint extends `@nuxtjs` and `prettier` configs

## Commits

- Do not mention Claude, Anthropic, or any AI tooling in commit messages or Co-Authored-By lines.
