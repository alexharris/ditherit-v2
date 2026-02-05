# Vue 2 to Vue 3 / Nuxt 2 to Nuxt 3 Migration

Migration completed successfully.

## Changes Made

### Configuration

- Created `nuxt.config.ts` with Nuxt 3 syntax (replacing `nuxt.config.js`)
- Updated `package.json` with Vue 3/Nuxt 3 dependencies
- Updated `jest.config.js` for Vue 3 test utils

### Components

- Replaced `.sync` modifier with `v-model:propName` in `pages/index.vue` (5 instances)
- Updated emit names to camelCase in `SidebarControls.vue` and `TopToolbar.vue`
- Replaced `vue-color` with `vue3-colorpicker` in `ColorPicker.vue`
- Updated `layouts/default.vue` (`<nuxt />` → `<slot />`)
- Removed Vue 2 config from `Examples.vue`
- Fixed `ContactForm.vue` embedded script tag issue
- Added `:key` attributes to all `v-for` loops

### Pages

- Updated `pages/resources/index.vue` to use `useHead()` composable
- Updated `pages/quant/index.vue` to use `useHead()` composable

### Tests

- Updated test files to use `props` instead of `propsData`
- Created mocks for `vue3-colorpicker` and CSS files in `test/__mocks__/`

## Verification

- Dev server starts without errors
- All 34 tests pass
- Static generation completes successfully to `/docs`

## Additional Fixes During Testing

- Replaced `require()` with ES module `import` in `ImageUpload.vue` (line 166)
- Added `scripts/patch-rgbquant.js` to fix undeclared `transparentPixels` variable in rgbquant fork
- Added postinstall script to auto-apply rgbquant patch
- Added Vite `optimizeDeps` config to force re-bundling of rgbquant

## File Change Summary

| File | Changes |
|------|---------|
| `nuxt.config.ts` | New file (replaced nuxt.config.js) |
| `package.json` | Updated all Vue/Nuxt dependencies |
| `pages/index.vue` | Replaced 5x `.sync` with `v-model:*` |
| `components/ColorPicker.vue` | Replaced vue-color with vue3-colorpicker |
| `components/SidebarControls.vue` | Updated emit names to camelCase, added v-for keys |
| `components/TopToolbar.vue` | Updated emit names to camelCase |
| `components/Examples.vue` | Removed vue config block, added v-for key |
| `components/ContactForm.vue` | Fixed embedded script tag for Vue 3 |
| `layouts/default.vue` | `<nuxt />` → `<slot />` |
| `pages/resources/index.vue` | Converted to script setup with useHead() |
| `pages/quant/index.vue` | Converted to script setup with useHead() |
| `jest.config.js` | Updated transform for Vue 3, added mocks |
| `test/*.spec.js` | `propsData` → `props` in mount calls |
| `test/__mocks__/` | New directory with vue3-colorpicker and style mocks |
