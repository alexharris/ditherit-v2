# Testing

## Running Tests

```bash
npm run test
```

This runs Jest with coverage output. Results print to the terminal with a coverage table at the end.

### Run a single test file

```bash
npx jest test/dithering.spec.js
```

### Run tests matching a pattern

```bash
npx jest --testPathPattern="ColorPicker"
```

### Watch mode (re-runs on file changes)

```bash
npx jest --watch
```

## Test Files

### `test/dithering.spec.js`

Unit tests for the pure dithering functions in `utils/dithering.js`.

- **`getClosestColor`** — finds the nearest palette color by Euclidean distance in RGB space. Tests cover exact matches, approximate matches, single-color palettes, and black/white extremes.
- **`bayerDither`** — applies ordered (Bayer matrix) dithering to image data. Tests verify that pixels are remapped to palette colors, `putImageData` is called, and pixelation is triggered only when `blockSize > 1`.
- **`addPixelation`** — downscales and upscales a canvas to create a blocky pixel effect. Tests verify the temp canvas dimensions and that image smoothing is disabled.

### `test/ColorPicker.spec.js`

Component tests for `components/ColorPicker.vue`.

- **`hexToRgb`** — converts hex color strings to `[r, g, b]` arrays. Tests cover standard 6-char hex, hex without `#`, short hex (returns null), and invalid input.
- **localStorage persistence** — verifies custom palettes load from and save to `localStorage`, and that corrupted JSON is handled without crashing.
- **Palette selection** — tests that choosing a preset palette or "original" correctly populates the palette array.
- **`updatePallete` event** — verifies the component emits `update-palette` with an array of RGB tuples.

### `test/ImageUpload.spec.js`

Component tests for `components/ImageUpload.vue`.

- **File validation** — drag-and-drop rejects non-image files (sets `notAnImage` flag) and accepts `image/jpeg` and `image/png`.
- **Event emission** — `reportNumberOfImages` emits the `number-images` event with the correct count.
- **Drag state** — the `dragging` flag toggles on `dragover` and `dragleave` events.
- **Loading state** — defaults to `false`.

### `test/FilesizeResults.spec.js`

Component tests for `components/FilesizeResults.vue`.

- **`originalFileSize`** — estimates the decoded file size from the base64 `src` string length.
- **`strokeDashArray`** — calculates the SVG donut chart segment as a percentage string like `"50 50"`.
- **Percentage display** — verifies the rendered template shows the correct ratio.

## Coverage

Coverage is collected automatically and printed after each run. It covers:

- `components/**/*.vue`
- `pages/**/*.vue`
- `utils/**/*.js`

Some pages (`index.vue`, `quant/index.vue`) and components (`ContactForm.vue`) show coverage collection warnings because their templates use syntax that `vue-jest` can't compile outside Nuxt. This doesn't affect test results — those files just won't appear in the coverage report.

## Adding New Tests

1. Create a file in `test/` with a `.spec.js` or `.test.js` extension.
2. Import what you need — `@/` and `~/` both resolve to the project root.
3. For Vue components, use `@vue/test-utils` `mount` or `shallowMount`. Stub child components that rely on third-party libraries (see the `sketch-picker` stub in `ColorPicker.spec.js` for an example).
4. Run `npm run test` to verify.
