# Dither it! Improvement Plan

## 1. Code Architecture & Organization

### ~~1a. Break up `pages/index.vue` (~1000 lines)~~ ✅
~~The main page file handles everything: UI, dithering logic, Bayer algorithm, canvas manipulation, download, analytics, and state management.~~ Decomposed into:
- ~~**`utils/dithering.js`** — pure dithering functions (`getClosestColor`, `bayerDither`, `addPixelation`)~~
- ~~**`components/SidebarControls.vue`** — dither mode, image size, pixeliness, advanced options~~
- ~~**`components/TopToolbar.vue`** — view original toggle, new image button, save button~~
- ~~**`components/KofiButton.vue`** — Ko-fi SVG badge~~
- ~~`pages/index.vue` reduced from ~880 lines to ~470 lines~~

### 1b. Remove dead code
- ~~`baseColors` array in `data()` (line 552) — has a comment saying "this is from old bayer stuff and can prob be deleted"~~ ✅
- ~~`imageWidths` array (line 496) — the dropdown that used it is commented out~~ ✅
- ~~`hexToRgb` method in `index.vue` (line 989) — duplicate of the one in `ColorPicker.vue`, and it's not called anywhere in `index.vue`~~ ✅
- ~~`InputBlock.vue` — imported in `index.vue` but never used in the template~~ ✅
- ~~`Donate.vue` — imported in `index.vue` but only appears in commented-out template blocks~~ ✅
- Large blocks of commented-out HTML throughout `index.vue`, `BottomContent.vue`, and `FilesizeResults.vue`
- ~~`algoExamples` data in `Examples.vue` — declared but never used~~ ✅
- ~~`imgSrc` and `console` methods in `Examples.vue` — unused or debugging only~~ ✅
- Empty `data()`, `methods`, `components`, and `<style>` blocks in several components (`ContactForm`, `Donate`, etc.)

### ~~1c. Remove `console.log` statements~~ ✅
~~There are `console.log` calls scattered throughout the codebase for debugging — in `index.vue` (`computedHeight`, `getSelected`, `getNumberOfImages`, `downloadImage`, `onUpdatePalette`, `onImageUpload`, `ditherImage`, `analyzeImagePalette`), `Toggler.vue`, `ColorPicker.vue`, `Examples.vue`. These should all be removed.~~

### ~~1d. Stop using `this.$children` to access child component internals~~ ✅
~~In `index.vue` lines 714 and 965:~~
```js
this.$children[1]._data.presetPaletteSelection = 'original'
```
~~This directly mutates a child component's internal data by index, which is fragile (breaks if component order changes) and violates Vue's one-way data flow. Instead, either:~~
- ~~Pass `presetPaletteSelection` as a prop to `ColorPicker`~~
- ~~Use a ref (`this.$refs.colorPicker`) and expose a method like `resetPalette()`~~

### ~~1e. Replace `setTimeout` coordination with proper async patterns~~ ✅
~~Multiple places use `setTimeout` with arbitrary delays (50ms, 100ms) to wait for DOM updates or image loading:~~
- ~~`ImageUpload.vue`: 100ms delays for `createOriginalImage` and `$emit('image-upload')`~~
- ~~`index.vue`: 100ms delay in `onImageUpload` for `analyzeImagePalette`, 50ms in `analyzeImagePalette`, 100ms in `ditherImage`~~

~~Replaced with `async`/`await`, `this.$nextTick()`, `Promise` wrapping `FileReader.onload`/`image.onload`, and `requestAnimationFrame` for paint-dependent flows. Also fixed `loading = false` running before async work completed, and image width/height being read before the image loaded.~~

### ~~1f. Use proper data structures for `images` array~~ ✅
~~In `ImageUpload.vue`, images are stored as arrays with string keys:~~
```js
this.images[i] = []
this.images[i]['id'] = id
```
~~This treats arrays as objects. They should be plain objects: `this.images[i] = { id, type, name, size }`. The `handlePaste` method already does this correctly — the other methods should match.~~

### ~~1g. Consistent use of `var` vs `let`/`const`~~ ✅
~~The code mixes `var`, `let`, and `const` inconsistently (e.g., `bayerDither` uses `var` throughout while newer code uses `const`/`let`). Standardize on `const`/`let`.~~ All `var` declarations in `ColorPicker.vue` replaced with `const`. `utils/dithering.js` (including `bayerDither`) was already converted in prior refactoring.

## 2. Front End / UI

### ~~2a. Inline SVG in template~~ ✅
~~The Ko-fi support badge in `index.vue` was a massive inline SVG path embedded directly in the template.~~ Extracted to `components/KofiButton.vue`.

### 2b. Duplicate `FilesizeResults` rendering
The `FilesizeResults` component is rendered twice in `index.vue` — once for mobile (line 299, `md:hidden`) and once for desktop (line 417, `hidden md:flex`). Instead, render it once and use CSS to reposition it at different breakpoints, or use a portal/teleport pattern.

### 2c. Help tooltip pattern is repeated 5 times
The "?" circle button that toggles an explanation modal is copy-pasted for: dither mode, image size, pixeliness, algorithm, serpentine, and palette import/export. Each one has its own boolean (`showDitherModeModal`, `showOptionsModalSize`, `showPixelinessModal`, `showOptionsModalAlgo`, `showOptionsModalSerp`, `showOptionsPaletteImportExport`). This should be a reusable `<HelpTooltip>` component.

### 2d. Button style classes are duplicated
`tailwind.css` defines `btn-red`, `btn-red-outline`, `btn-red-small-outline`, `btn-red-large`, `btn-red-large-outline`, `btn-blue`, `btn-green`, `btn-grey` — each with separate hover rules. A few of these (`btn-blue`, `btn-red-large`, `btn-red-large-outline`) don't appear to be used anywhere. The remaining ones could be simplified.

### 2e. Global element styles may cause unintended side effects
In `tailwind.css`, base styles are applied to bare HTML elements (`a`, `p`, `h3`, `h4`, `blockquote`, `ul`). For example, every `<a>` gets `text-red-700 border-b border-red-700` and every `<p>` gets `mt-4`. This makes it hard to use these elements without the opinionated styles and can cause surprises in new pages or components.

### 2f. Non-scoped component styles
`ColorPicker.vue` and `Toggler.vue` use non-scoped `<style>` blocks. The ColorPicker styles override `.vc-sketch` globally, which is fine for that specific library, but the toggle styles in `Toggler.vue` should be scoped.

## 3. Accessibility

### 3a. Missing `alt` attributes on images
- `index.vue` line 30: `<img src="~/assets/earth-dither.gif">` — no alt text
- `index.vue` line 378: original image display `<img :src="selectedImage.src">` — no alt
- `index.vue` line 383-388: thumbnail images — no alt
- `Examples.vue`: all example images lack meaningful alt text

### 3b. Non-semantic interactive elements
- Color swatches in `ColorPicker.vue` are `<div>` elements with `@click` handlers — should be `<button>` elements
- The "+" to add a new swatch is a `<div>` — should be a `<button>`
- "Save", "Export", "Import" tabs in `ColorPicker.vue` are `<span>` elements with `@click` — should be `<button>` elements
- Example palette buttons in `Examples.vue` are `<div>` elements — should be `<button>` elements
- The "Start with a frog" trigger is a `<span>` — should be `<button>`

### 3c. Ko-fi link has no accessible label
The Ko-fi badge link (line 4 of `index.vue`) contains only an SVG with no `aria-label`, `title`, or visible text. Screen readers would announce it as an empty link.

### 3d. Color contrast
The red (`#C53030`) on white may not meet WCAG AA contrast for smaller text sizes. The help tooltip circles (red background, white text) at `h-4 w-4` size are very small.

### 3e. No keyboard handling for custom interactive elements
The color swatches, example palette buttons, and various `<span>`/`<div>` click handlers don't have `tabindex`, `role`, or keyboard event listeners.

## 4. Bugs & Correctness

### ~~4a. Duplicate prop name in `FilesizeResults.vue`~~ ✅
~~Line 75: `downloadFileSize` appears twice in the props array:~~
```js
props: ['ratioGood', 'downloadFileSize', 'selectedImage', 'ditheredHeight', 'ditheredWidth', 'downloadFileSize', 'rgbquant']
```

### ~~4b. `downloadImage()` called at wrong time~~ ✅
~~In `ditherImage()`, `downloadImage()` is called three times:~~
1. ~~Inside the Bayer branch (line 782) — correct~~
2. ~~Inside the Error Diffusion branch (line 817) — correct~~
3. ~~After the `setTimeout` call (line 827) — this runs immediately, before the setTimeout callback finishes, so it runs against stale canvas data~~

### 4c. File size calculation uses base64 string length
The original file size is estimated from `selectedImage.src.length` (which is a base64 data URL). This is an approximation that includes the data URL prefix and doesn't account for base64 overhead correctly. The actual file size from the File object (`images[i].size`) is available but not used for comparison.

### 4d. `loading` flag set to `false` too early in `ImageUpload.vue`
In both `imageUploaded()` (line 129) and `startWithDuck()` (line 202), `this.loading = false` runs immediately after scheduling `setTimeout` callbacks, so the loading spinner disappears before the images are actually loaded.

### ~~4e. Missing error handling for palette import~~ ✅
~~`importPalette()` in `ColorPicker.vue` calls `JSON.parse(this.palette2Import)` without a try/catch. Invalid JSON will throw an unhandled error.~~

### 4f. `originalInitialPalette` comparison bug
In `rgbToHex()` (ColorPicker line 491):
```js
if (this.originalInitialPalette.length < i) {
```
This should be `<=` or should check against the current palette length, since it compares against the loop index `i` and will skip storing the first color.

## 5. Performance

### 5a. `getClosestColor` sorts the entire palette for every pixel
In the Bayer dither path, `getClosestColor` is called once per pixel. It maps and sorts the full palette array each time. For a 640x480 image that's 307,200 sort operations. A simple linear scan for the minimum distance would be faster, or precompute a color lookup table.

### 5b. Example images are all loaded regardless of which example is selected
`Examples.vue` uses `v-if` on the `img-comparison-slider` components, but the images inside are static `<img>` tags with `src` attributes — the browser may still download them. Lazy loading (`loading="lazy"`) would help.

### 5c. Analytics scripts loaded inline in template
The Fathom and Clicky analytics scripts are embedded directly in the `index.vue` template (lines 439-457). These should be in `nuxt.config.js` head scripts to be loaded properly and cached.

## 6. Miscellaneous

### 6a. Typo: `updatePallete` should be `updatePalette`
The method is misspelled throughout `ColorPicker.vue`. Not a functional issue but worth fixing for consistency.

### 6b. `fathom()` called as a global without safety check
Multiple components call `fathom('trackGoal', ...)` as a global function. If the Fathom script fails to load (ad blocker, network issue), these calls will throw `ReferenceError`. Should be wrapped in a check like `if (typeof fathom !== 'undefined')` or use optional chaining via a helper.

### 6c. No test coverage
`package.json` has Jest configured but there don't appear to be any test files. The dithering logic (especially `getClosestColor`, `bayerDither`, hex/RGB conversions) would benefit from unit tests since it's pure computation.

### ~~6d. `eslint-disable` comments~~ ✅
~~Several files start with `/* eslint-disable no-console */` as a blanket override. Once the console.log cleanup (1c) is done, these can be removed.~~

### 6e. Props should use object syntax with type validation
Both `ImageUpload` and `ColorPicker` use array-style props (`props: ['text', 'duck']`). Object syntax with types and defaults would catch misuse earlier:
```js
props: {
  text: { type: String, required: true },
  duck: { type: Boolean, default: false }
}
```
Note: `duck` is currently passed as a string `"true"` and compared with `== 'true'`, which would change to an actual boolean.
