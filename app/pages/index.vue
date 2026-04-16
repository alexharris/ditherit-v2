<script setup lang="ts">
definePageMeta({ keepalive: true })

import { loadImage } from '~/composables/useDithering'
import type { GalleryImage } from '~/composables/useImageGallery'
import defaultImageUrl from '~/assets/examples/quantfrog.png'
import defaultImageUrl2 from '~/assets/examples/earth.jpg'
import defaultImageUrl3 from '~/assets/examples/coat.gif'

const {
  isProcessing,
  ditherMode,
  algorithm,
  serpentine,
  pixeliness,
  pixelScale,
  bayerSize,
  smoothPixels,
  palette,
  originalWidth,
  originalHeight,
  sizeWidth,
  sizeValid,
  analyzePalette,
  dither,
  ditherGif,
  invalidateQuantCache
} = useDithering()

const {
  images,
  selectedImage,
  hasImages,
  processedCount,
  isDownloadingAll,
  addImages,
  addImageFromUrl,
  selectImage,
  removeImage,
  clearAll,
  setDitheredResult,
  setResizedOriginal,
  setProcessing,
  clearDitheredResults,
  downloadAll
} = useImageGallery()

const {
  selectedPreset,
  paletteAsRgb,
  setPaletteFromRgb,
  updateOriginalPalette
} = usePalette()

const toast = useToast()
const colorMode = useColorMode()

const fileInputRef = ref<HTMLInputElement>()
const canvasRef = ref<HTMLCanvasElement>()

const isDefaultImage = computed(() => images.value.length <= 3 && images.value.every(img => img.fileName === 'quantfrog.png' || img.fileName === 'earth.jpg' || img.fileName === 'coat.gif'))

const isDragging = ref(false)
const isIntro = ref(true)
const showCompare = ref(true)
const drawerMode = ref(false)
const drawerPalette = ref(false)
const drawerScale = ref(false)


function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  const main = e.currentTarget as HTMLElement
  if (e.relatedTarget && main.contains(e.relatedTarget as Node)) return
  isDragging.value = false
}

function warnRejectedFiles(result: { tooLarge: string[]; tooWide: string[]; largeFiles: string[] }) {
  if (result.tooLarge.length > 0) {
    toast.add({
      title: 'File too large',
      description: `${result.tooLarge.join(', ')} exceeded the 2.5 MB limit and was not added.`,
      color: 'error'
    })
  }
  if (result.tooWide.length > 0) {
    toast.add({
      title: 'Image too large',
      description: `${result.tooWide.join(', ')} exceeds 4000px and was not added.`,
      color: 'error'
    })
  }
  if (result.largeFiles.length > 0) {
    toast.add({
      title: 'Large file warning',
      description: `${result.largeFiles.join(', ')} ${result.largeFiles.length === 1 ? 'is' : 'are'} over 2 MB. You may experience slow load times or degraded performance. Consider reducing image size first.`,
      color: 'warning'
    })
  }
}

async function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const wasIntro = isIntro.value
    const oldIds = wasIntro ? images.value.map(img => img.id) : []
    const result = await addImages(files)
    if (wasIntro && result.added > 0) {
      isIntro.value = false
      oldIds.forEach(id => removeImage(id))
    }
    warnRejectedFiles(result)
  }
}

async function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const wasIntro = isIntro.value
    const oldIds = wasIntro ? images.value.map(img => img.id) : []
    const result = await addImages(target.files)
    if (wasIntro && result.added > 0) {
      isIntro.value = false
      oldIds.forEach(id => removeImage(id))
    }
    warnRejectedFiles(result)
    // Reset input so same file can be selected again
    target.value = ''
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return
  const imageFiles: File[] = []
  for (const item of Array.from(items)) {
    if (item.kind === 'file' && item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) imageFiles.push(file)
    }
  }
  if (imageFiles.length === 0) return
  e.preventDefault()
  const wasIntro = isIntro.value
  const oldIds = wasIntro ? images.value.map(img => img.id) : []
  const result = await addImages(imageFiles)
  if (wasIntro && result.added > 0) {
    isIntro.value = false
    oldIds.forEach(id => removeImage(id))
  }
  warnRejectedFiles(result)
}

// Process a single image — uses cached image loading
async function processImageForDither(image: GalleryImage, width?: number): Promise<{ url: string; blob: Blob }> {
  if (image.isAnimatedGif && image.gifFrames?.length) {
    const result = await ditherGif(image.gifFrames, (progress) => {
      image.processingProgress = progress
    }, width)
    image.processingProgress = null
    return { url: result.url, blob: result.blob }
  }
  const img = await loadImage(image.originalSrc)
  const canvas = canvasRef.value
  if (!canvas) throw new Error('Canvas not available')
  const result = await dither(img, canvas, width)
  return { url: result.url, blob: result.blob }
}

function generateResizedOriginal(image: GalleryImage, width: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // Use cached image loading for resized original too
    loadImage(image.originalSrc).then((img) => {
      const canvas = document.createElement('canvas')
      const height = (img.naturalHeight / img.naturalWidth) * width
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/png'))
    }).catch(reject)
  })
}

async function handleDither() {
  if (!selectedImage.value || !canvasRef.value || !sizeValid.value) return

  setProcessing(selectedImage.value.id, true)
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  try {
    const width = sizeWidth.value
    const result = await processImageForDither(selectedImage.value, width)
    setDitheredResult(selectedImage.value.id, result.url, result.blob)

    if (width && !selectedImage.value.isAnimatedGif) {
      const resized = await generateResizedOriginal(selectedImage.value, width)
      setResizedOriginal(selectedImage.value.id, resized)
    } else {
      setResizedOriginal(selectedImage.value.id, null)
    }
  } finally {
    setProcessing(selectedImage.value.id, false)
  }
}

let ditherTimeout: ReturnType<typeof setTimeout> | null = null
let skipNextDither = false
function debouncedDither() {
  if (ditherTimeout) clearTimeout(ditherTimeout)
  ditherTimeout = setTimeout(() => handleDither(), 300)
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const jpgSizeMap = reactive(new Map<string, number>())
const jpgBlobTracker = new Map<string, Blob>()

watch(
  () => images.value.map(img => ({ id: img.id, blob: img.ditheredBlob, isAnimatedGif: img.isAnimatedGif })),
  async (entries) => {
    // Clean up removed/cleared entries
    for (const key of [...jpgSizeMap.keys()]) {
      if (!entries.some(e => e.id === key && e.blob)) {
        jpgSizeMap.delete(key)
        jpgBlobTracker.delete(key)
      }
    }
    // Compute JPG size for new/changed blobs (skip animated GIFs)
    for (const { id, blob, isAnimatedGif } of entries) {
      if (!blob || isAnimatedGif || jpgBlobTracker.get(id) === blob) continue
      jpgBlobTracker.set(id, blob)
      const jpgBlob = await convertBlobToJpeg(blob)
      if (jpgBlobTracker.get(id) === blob) {
        jpgSizeMap.set(id, jpgBlob.size)
      }
    }
  },
  { immediate: true }
)

// Track dithered size in the original file's format (for fair scorecard comparison)
const CANVAS_EXPORT_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])
const nativeFormatSizeMap = reactive(new Map<string, number>())
const nativeFormatBlobTracker = new Map<string, Blob>()

watch(
  () => images.value.map(img => ({ id: img.id, blob: img.ditheredBlob, mime: img.originalMimeType })),
  async (entries) => {
    for (const key of [...nativeFormatSizeMap.keys()]) {
      if (!entries.some(e => e.id === key && e.blob)) {
        nativeFormatSizeMap.delete(key)
        nativeFormatBlobTracker.delete(key)
      }
    }
    for (const { id, blob, mime } of entries) {
      if (!blob || nativeFormatBlobTracker.get(id) === blob) continue
      nativeFormatBlobTracker.set(id, blob)

      if (mime === 'image/png' || !CANVAS_EXPORT_TYPES.has(mime)) {
        // PNG or unsupported format — dithered blob is already PNG
        if (nativeFormatBlobTracker.get(id) === blob) {
          nativeFormatSizeMap.set(id, blob.size)
        }
      } else {
        // JPEG or WebP — convert to measure size
        const converted = await convertBlobToFormat(blob, mime)
        if (nativeFormatBlobTracker.get(id) === blob) {
          nativeFormatSizeMap.set(id, converted.size)
        }
      }
    }
  },
  { immediate: true }
)

const isSelectedGif = computed(() => selectedImage.value?.isAnimatedGif ?? false)

const scorecardDitheredSize = computed(() => {
  const img = selectedImage.value
  if (!img?.ditheredFileSize) return null
  return nativeFormatSizeMap.get(img.id) ?? img.ditheredFileSize
})

const scorecardDitheredWidth = computed(() => {
  if (!originalWidth.value) return undefined
  return sizeWidth.value || originalWidth.value
})

const scorecardDitheredHeight = computed(() => {
  if (!originalWidth.value || !originalHeight.value || !scorecardDitheredWidth.value) return undefined
  return Math.round((originalHeight.value / originalWidth.value) * scorecardDitheredWidth.value)
})

const pngSizeLabel = computed(() => {
  const size = selectedImage.value?.ditheredBlob?.size
  return size ? `PNG (${formatBytes(size)})` : 'PNG'
})

const jpgSizeLabel = computed(() => {
  const id = selectedImage.value?.id
  const size = id ? jpgSizeMap.get(id) : undefined
  return size ? `JPG (${formatBytes(size)})` : 'JPG'
})

// ZIP overhead: local file header (30 + name) + central directory entry (46 + name) + end record (22)
function estimateZipSize(files: { name: string; size: number }[]): number {
  let total = 22
  for (const file of files) {
    total += file.size + 76 + (file.name.length * 2)
  }
  return total
}

const footerPngLabel = computed(() => {
  if (images.value.length <= 1) return pngSizeLabel.value
  const files = images.value
    .filter(img => img.ditheredBlob)
    .map(img => ({
      name: `${img.fileName.replace(/\.[^.]+$/, '')}-dithered.png`,
      size: img.ditheredBlob!.size
    }))
  return files.length > 0 ? `PNG ZIP (${formatBytes(estimateZipSize(files))})` : 'PNG'
})

const footerJpgLabel = computed(() => {
  if (images.value.length <= 1) return jpgSizeLabel.value
  const files = images.value
    .filter(img => jpgSizeMap.has(img.id))
    .map(img => ({
      name: `${img.fileName.replace(/\.[^.]+$/, '')}-dithered.jpg`,
      size: jpgSizeMap.get(img.id)!
    }))
  return files.length > 0 ? `JPG ZIP (${formatBytes(estimateZipSize(files))})` : 'JPG'
})

const footerSvgLabel = computed(() => {
  return images.value.length <= 1 ? 'SVG' : 'SVG ZIP'
})

async function convertBlobToFormat(pngBlob: Blob, mimeType: string, quality = 0.92): Promise<Blob> {
  const img = new Image()
  const url = URL.createObjectURL(pngBlob)
  await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url })
  URL.revokeObjectURL(url)
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0)
  return new Promise(resolve => canvas.toBlob(b => resolve(b!), mimeType, quality))
}

function convertBlobToJpeg(pngBlob: Blob, quality = 0.92): Promise<Blob> {
  return convertBlobToFormat(pngBlob, 'image/jpeg', quality)
}

async function generateSvgBlob(pngBlob: Blob): Promise<Blob> {
  const img = new Image()
  const url = URL.createObjectURL(pngBlob)
  await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = url })
  URL.revokeObjectURL(url)

  const canvas = document.createElement('canvas')
  const w = img.width
  const h = img.height
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const { data } = ctx.getImageData(0, 0, w, h)

  const parts: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">`]

  for (let y = 0; y < h; y++) {
    let x = 0
    while (x < w) {
      const i = (y * w + x) * 4
      const a = data[i + 3]!
      if (a === 0) { x++; continue }
      const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!

      // Run-length encode: merge adjacent same-color pixels into wider rects
      let runLen = 1
      while (x + runLen < w) {
        const j = (y * w + x + runLen) * 4
        if (data[j] === r && data[j + 1] === g && data[j + 2] === b && data[j + 3] === a) {
          runLen++
        } else {
          break
        }
      }

      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      const opacity = a < 255 ? ` fill-opacity="${(a / 255).toFixed(2)}"` : ''
      parts.push(`<rect x="${x}" y="${y}" width="${runLen}" height="1" fill="${hex}"${opacity}/>`)
      x += runLen
    }
  }

  parts.push('</svg>')
  return new Blob([parts.join('')], { type: 'image/svg+xml' })
}

async function downloadSingleImage(format: 'png' | 'jpg' | 'svg' | 'gif') {
  if (!selectedImage.value?.ditheredBlob) return
  // Always use GIF for animated GIF images regardless of requested format
  if (selectedImage.value.isAnimatedGif) {
    format = 'gif'
  }
  let blob: Blob
  if (format === 'gif') {
    blob = selectedImage.value.ditheredBlob
  } else if (format === 'jpg') {
    blob = await convertBlobToJpeg(selectedImage.value.ditheredBlob)
  } else if (format === 'svg') {
    blob = await generateSvgBlob(selectedImage.value.ditheredBlob)
  } else {
    blob = selectedImage.value.ditheredBlob
  }
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const baseName = selectedImage.value.fileName.replace(/\.[^.]+$/, '')
  link.download = `${baseName}-dithered.${format}`
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

async function handleDownload(format: 'png' | 'jpg' | 'svg' | 'gif') {
  if (images.value.length > 1) {
    const converter = format === 'jpg' ? convertBlobToJpeg
      : format === 'svg' ? generateSvgBlob
        : undefined
    await downloadAll(processImageForDither, format, converter)
  } else {
    await downloadSingleImage(format)
  }
}

// Load default image on startup (auto-dither triggers via settings watcher)
onMounted(() => {
  if (!hasImages.value) {
    addImageFromUrl(defaultImageUrl, 'quantfrog.png')
    addImageFromUrl(defaultImageUrl2, 'earth.jpg')
    addImageFromUrl(defaultImageUrl3, 'coat.gif')
  }
  document.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste)
})

// Reload the frog when the last image is removed
watch(hasImages, (has) => {
  if (!has) {
    isIntro.value = true
    addImageFromUrl(defaultImageUrl, 'quantfrog.png')
    addImageFromUrl(defaultImageUrl2, 'earth.jpg')
    addImageFromUrl(defaultImageUrl3, 'coat.gif')
  }
})

// Turn off compare when user adds their own image
watch(isDefaultImage, (isDefault) => {
  if (!isDefault) showCompare.value = false
})

// Update palette and dimensions when selected image changes
watch(selectedImage, async (newImage) => {
  if (newImage) {
    // Set dimensions synchronously from stored values so the aspect-ratio
    // container is correct before any repaint (avoids distortion on image switch)
    originalWidth.value = newImage.naturalWidth
    originalHeight.value = newImage.naturalHeight

    const img = await loadImage(newImage.originalSrc)

    invalidateQuantCache()
    const colors = analyzePalette(img)

    // Always store the analyzed palette so "Original" reflects this image
    updateOriginalPalette(colors)

    if (selectedPreset.value === 'original') {
      // Use the image's own analyzed palette
      if (newImage.ditheredDataUrl && !newImage.isStale) skipNextDither = true
      palette.value = colors
      setPaletteFromRgb(colors)
      // Auto-dither triggers via paletteAsRgb watcher
    } else {
      // Keep current preset/custom palette, re-dither only if not already cached (or stale)
      if (!newImage.ditheredDataUrl || newImage.isStale) {
        debouncedDither()
      }
    }
  }
}, { immediate: true })

// Sync palette editor changes to dithering palette
watch(paletteAsRgb, (newPalette) => {
  if (newPalette.length > 0) {
    palette.value = newPalette
  }
}, { deep: true, immediate: true })

// Auto-dither selected image when any setting changes
watch([ditherMode, algorithm, serpentine, pixeliness, pixelScale, bayerSize, smoothPixels, paletteAsRgb, sizeWidth], () => {
  if (selectedImage.value && sizeValid.value) {
    if (skipNextDither) { skipNextDither = false; return }
    debouncedDither()
  }
}, { deep: true })

// Mark non-selected images as stale when settings change so they re-dither on next select
// but keep their ditheredDataUrl so the old result stays visible during recalculation
watch([ditherMode, algorithm, serpentine, pixeliness, pixelScale, bayerSize, smoothPixels, paletteAsRgb], () => {
  // Note: width changes only affect the selected image, so we don't include it here
  images.value.forEach((img) => {
    if (img.id !== selectedImage.value?.id && img.ditheredDataUrl) {
      img.isStale = true
    }
  })
}, { deep: true })
</script>

<template>
  <div class="flex h-dvh flex-col bg-gray-100 dark:bg-gray-900 bg-grid pt-12 lg:pt-0">
    <!-- Hidden file input (multiple) -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Hidden canvas for dithering -->
    <canvas ref="canvasRef" class="hidden" />

    <!-- Top Bar -->
    <AppHeader />

    <!-- Mobile image selector + download bar (hidden during intro — upload button is in the top zone) -->
    <div
      v-if="!isDefaultImage"
      class="flex lg:hidden shrink-0 items-center justify-between border-b border-gray-200 px-3 py-4 dark:border-gray-800"
    >
      <!-- Upload/add button -->
      <button
        class="inline-flex items-center gap-1.5 rounded-md border border-ditherit bg-white px-3 py-1.5 text-sm font-medium text-ditherit shadow-sm transition-colors hover:bg-ditherit hover:text-white dark:bg-gray-950"
        @click="triggerFileInput"
      >
        {{ isDefaultImage ? '✨ Select image(s)' : '➕ Add' }}
      </button>
      <UPopover v-if="!isDefaultImage" class="shrink-0">
        <UButton
          label="💾 Download"
          color="neutral"
          variant="solid"
          size="sm"
          :loading="isDownloadingAll"
          :disabled="!selectedImage?.ditheredDataUrl"
        />
        <template #content="{ close }">
          <div class="flex flex-col gap-1 p-2">
            <UButton :label="footerPngLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('png'); close()" />
            <UButton :label="footerJpgLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('jpg'); close()" />
            <UButton :label="footerSvgLabel" icon="i-lucide-file-code" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('svg'); close()" />
          </div>
        </template>
      </UPopover>
    </div>

    <!-- Mobile Drawers -->
    <UDrawer v-model:open="drawerMode" :overlay="false">
      <template #body>
        <SidebarDitherMode />
      </template>
    </UDrawer>

    <UDrawer v-model:open="drawerPalette" :overlay="false">
      <template #body>
        <SidebarPalette />
      </template>
    </UDrawer>

    <UDrawer v-model:open="drawerScale" :overlay="false">
      <template #body>
        <SidebarPixelScale />
      </template>
    </UDrawer>

    <!-- Body below top bar -->
    <div class="flex flex-1 flex-col lg:flex-row overflow-hidden">

    <!-- Sidebar (desktop only) -->
    <aside
      class="hidden lg:flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
    >
      <SidebarContent />

      <!-- Sidebar Footer -->
      <div
        class="flex shrink-0 items-center justify-between border-t border-gray-200 p-4 dark:border-gray-800"
      >
        <span class="text-sm text-gray-500 dark:text-gray-400">v3</span>
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          size="sm"
          to="https://github.com/alexharris/ditherit-v3"
          target="_blank"
        />
        <UButton
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
        />
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Content area -->
      <div class="relative flex flex-1 overflow-hidden">
        <!-- Main Content Area (drag-and-drop zone) -->
        <main
          class="relative flex flex-1 flex-col overflow-hidden "
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          <!-- Mobile floating image toolbar pill (replaced by inline toolbar in flex-col flow) -->
          <div
            v-if="false"
            class="absolute bottom-3 left-1/2 z-10 flex lg:hidden -translate-x-1/2 items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <UButton
              icon="i-lucide-columns-2"
              :color="showCompare ? 'primary' : 'neutral'"
              :variant="showCompare ? 'soft' : 'ghost'"
              size="sm"
              :disabled="!selectedImage.ditheredDataUrl"
              @click="showCompare = !showCompare"
            />
            <UPopover>
              <UButton
                icon="i-lucide-download"
                color="neutral"
                variant="ghost"
                size="sm"
                :disabled="!selectedImage.ditheredDataUrl"
              />
              <template #content="{ close }">
                <div class="flex flex-col gap-1 p-2">
                  <template v-if="isSelectedGif">
                    <UButton label="GIF" icon="i-lucide-film" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="downloadSingleImage('gif'); close()" />
                  </template>
                  <template v-else>
                    <UButton :label="pngSizeLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="downloadSingleImage('png'); close()" />
                    <UButton :label="jpgSizeLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="downloadSingleImage('jpg'); close()" />
                    <UButton label="SVG" icon="i-lucide-file-code" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="downloadSingleImage('svg'); close()" />
                  </template>
                </div>
              </template>
            </UPopover>
            <UButton
              v-if="!isDefaultImage"
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              @click="removeImage(selectedImage.id)"
            />
          </div>

          <!-- Drag overlay -->
          <div
            v-if="isDragging"
            class="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-red-500/10 ring-4 ring-inset ring-red-500"
          >
            <div class="rounded-xl bg-white/90 px-8 py-6 text-center shadow-lg dark:bg-gray-900/90">
              <UIcon name="i-lucide-image-plus" class="mx-auto size-12 text-red-500" />
              <p class="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">
                Drop images to add
              </p>
            </div>
          </div>

          <!-- Preview Area -->
          <div
            class="flex flex-1 flex-col items-center overflow-hidden p-2 lg:p-8"
            :class="isIntro ? 'lg:border-2 lg:border-dashed lg:border-gray-300 lg:m-4 dark:lg:border-gray-600' : ''"
          >
            <div
              v-if="selectedImage"
              class="flex h-full w-full min-h-0 flex-col items-center"
            >
              <!-- Top zone (flex-1): centered between top bar and image -->
              <div class="flex flex-1 min-h-0 w-full items-center justify-center">
                <template v-if="isIntro">
                  <!-- Desktop: drop/paste hint -->
                  <div class="hidden lg:flex items-center gap-3 rounded-lg bg-white px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-200 dark:bg-gray-900 dark:text-red-300 dark:ring-red-800">
                    <span>✨ Drop or paste images here, or</span>
                    <UButton
                      icon="i-lucide-upload"
                      label="Select"
                      size="xs"
                      color="error"
                      variant="subtle"
                      @click="triggerFileInput"
                    />
                  </div>
                  <!-- Mobile: button centered between top bar and image -->
                  <button
                    class="lg:hidden inline-flex items-center gap-1.5 rounded-md border border-ditherit bg-white px-3 py-1.5 text-sm font-medium text-ditherit shadow-sm transition-colors hover:bg-ditherit hover:text-white dark:bg-gray-950"
                    @click="triggerFileInput"
                  >
                    ✨ Select image(s)
                  </button>
                </template>
              </div>

              <!-- Image + toolbar zone -->
              <div class="flex min-h-0 w-full flex-col items-center justify-center gap-2" style="flex: 0 0 70%">
              <!-- Image wrapper -->
              <div
                class="relative min-h-0 max-h-full max-w-full"
                :style="originalWidth && originalHeight ? { aspectRatio: `${originalWidth}/${originalHeight}` } : {}"
              >
                <template v-if="selectedImage.ditheredDataUrl">
                  <!-- Comparison slider -->
                  <ImageCompare
                    v-show="showCompare"
                    :original-src="selectedImage.resizedOriginalSrc || selectedImage.originalSrc"
                    :dithered-src="selectedImage.ditheredDataUrl"
                    :alt="selectedImage.fileName"
                    class="h-full w-full max-h-full max-w-full"
                  />

                  <!-- Dithered only -->
                  <img
                    v-show="!showCompare"
                    :src="selectedImage.ditheredDataUrl"
                    :alt="selectedImage.fileName"
                    class="h-full w-full max-h-full max-w-full no-touch-callout"
                  />
                </template>

                <!-- Original only (when not dithered) -->
                <img
                  v-else
                  :src="selectedImage.originalSrc"
                  :alt="selectedImage.fileName"
                  class="h-full w-full max-h-full max-w-full no-touch-callout"
                />

                <!-- Processing overlay covers exactly the image -->
                <div
                  v-if="selectedImage.isProcessing"
                  class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30"
                >
                  <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-red-500" />
                  <span
                    v-if="selectedImage.processingProgress !== null"
                    class="text-sm font-medium text-white"
                  >{{ Math.round(selectedImage.processingProgress * 100) }}%</span>
                </div>
              </div>

              <!-- Image toolbar — snug beneath the image -->
              <div
                class="shrink-0 flex flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div class="flex-1" />
                <UButton
                  icon="i-lucide-columns-2"
                  :color="showCompare ? 'primary' : 'neutral'"
                  :variant="showCompare ? 'soft' : 'ghost'"
                  size="xs"
                  :disabled="!selectedImage.ditheredDataUrl"
                  @click="showCompare = !showCompare"
                >
                  <span class="hidden lg:inline">Compare</span>
                </UButton>
                <UPopover>
                  <UButton
                    icon="i-lucide-download"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :disabled="!selectedImage.ditheredDataUrl"
                  >
                    <span class="hidden lg:inline">Download</span>
                  </UButton>
                  <template #content="{ close }">
                    <div class="flex flex-col gap-1 p-2">
                      <template v-if="isSelectedGif">
                        <UButton label="GIF" icon="i-lucide-film" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="downloadSingleImage('gif'); close()" />
                      </template>
                      <template v-else>
                        <UButton :label="pngSizeLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="downloadSingleImage('png'); close()" />
                        <UButton :label="jpgSizeLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="downloadSingleImage('jpg'); close()" />
                        <UButton label="SVG" icon="i-lucide-file-code" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="downloadSingleImage('svg'); close()" />
                      </template>
                    </div>
                  </template>
                </UPopover>
                <UButton
                  v-if="!isDefaultImage"
                  icon="i-lucide-trash-2"
                  color="error"
                  variant="ghost"
                  size="xs"
                  @click="removeImage(selectedImage.id)"
                >
                  <span class="hidden lg:inline">Remove</span>
                </UButton>
              </div>
              </div><!-- end image+toolbar zone -->

              <!-- Bottom spacer (flex-1) -->
              <div class="flex-1 min-h-0" />

            </div>
          </div>
        </main>

        <!-- Right Sidebar (desktop only) -->
        <aside class="hidden lg:block w-48 shrink-0 overflow-y-auto pl-0 pr-4 pt-4 pb-4">
          <div
            v-if="selectedImage"
            class="rounded-xl border border-gray-200 bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-950/90"
          >
            <FileSizeReport
              :original-size="selectedImage.originalFileSize"
              :dithered-file-size="scorecardDitheredSize"
              :file-name="selectedImage.fileName"
              :original-width="originalWidth || undefined"
              :original-height="originalHeight || undefined"
              :dithered-width="scorecardDitheredWidth"
              :dithered-height="scorecardDitheredHeight"
              class="w-full"
            />
          </div>
        </aside>
      </div>

      <!-- Bottom Bar (thumbnails + actions) -->
      <footer
        class="hidden lg:flex shrink-0 flex-col lg:flex-row items-stretch lg:items-center gap-2 border-t border-gray-200 bg-white px-3 py-3 lg:px-4 lg:py-4 dark:border-gray-800 dark:bg-gray-950"
      >
        <!-- Image Thumbnails + mobile download -->
        <div v-if="hasImages" class="flex min-w-0 items-center justify-between gap-2">
          <div
            class="flex min-w-0 items-center gap-2 rounded-lg bg-gray-100 px-2 py-2 ring-1 ring-gray-200 ring-inset dark:bg-gray-900 dark:ring-gray-800"
          >
            <ImageThumbnailStrip
              :images="images"
              :selected-id="selectedImage?.id"
              @select="selectImage"
              @remove="removeImage"
              @add="triggerFileInput"
            />
            <button
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-500 dark:border-gray-600 dark:hover:border-gray-500"
              @click="triggerFileInput"
            >
              <UIcon name="i-lucide-plus" class="size-5" />
            </button>
          </div>
          <UPopover class="lg:hidden shrink-0">
            <UButton
              icon="i-lucide-download"
              color="primary"
              variant="solid"
              size="md"
              :loading="isDownloadingAll"
              :disabled="!selectedImage?.ditheredDataUrl"
            />
            <template #content="{ close }">
              <div class="flex flex-col gap-1 p-2">
                <UButton :label="footerPngLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('png'); close()" />
                <UButton :label="footerJpgLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('jpg'); close()" />
                <UButton :label="footerSvgLabel" icon="i-lucide-file-code" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('svg'); close()" />
              </div>
            </template>
          </UPopover>
        </div>
        <div class="hidden lg:block flex-1" />

        <!-- Action buttons (desktop only) -->
        <div class="hidden lg:flex shrink-0 items-center justify-end gap-2">
          <UButton
            v-if="images.length > 0 && !isDefaultImage"
            icon="i-lucide-trash-2"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="clearAll"
          >
            <span>Clear All</span>
          </UButton>
          <UPopover>
            <UButton
              icon="i-lucide-download"
              color="primary"
              variant="solid"
              size="md"
              :loading="isDownloadingAll"
              :disabled="!selectedImage?.ditheredDataUrl"
            >
              <span>Download All</span>
            </UButton>
            <template #content="{ close }">
              <div class="flex flex-col gap-1 p-2">
                <UButton :label="footerPngLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('png'); close()" />
                <UButton :label="footerJpgLabel" icon="i-lucide-image" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('jpg'); close()" />
                <UButton :label="footerSvgLabel" icon="i-lucide-file-code" color="neutral" variant="ghost" size="sm" class="text-gray-900 dark:text-gray-100" @click="handleDownload('svg'); close()" />
              </div>
            </template>
          </UPopover>
        </div>
      </footer>

      <!-- Mobile Thumbnail Strip (multiple images) -->
      <div
        v-if="images.length > 1"
        class="flex lg:hidden shrink-0 items-center gap-2 border-t border-gray-200 bg-white px-2 py-2 dark:border-gray-800 dark:bg-gray-950"
      >
        <ImageThumbnailStrip
          :images="images"
          :selected-id="selectedImage?.id"
          class="flex-1 min-w-0"
          @select="selectImage"
          @remove="removeImage"
          @add="triggerFileInput"
        />
      </div>

      <!-- Mobile Bottom Toolbar -->
      <div class="flex lg:hidden shrink-0 items-center justify-around border-t border-gray-200 bg-white pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] dark:border-gray-800 dark:bg-gray-950">
        <button class="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400" @click="drawerMode = true">
          <span class="text-2xl leading-none">🏁</span>
          <span class="uppercase tracking-wide" style="font-size: 12px">Mode</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400" @click="drawerPalette = true">
          <span class="text-2xl leading-none">🎨</span>
          <span class="uppercase tracking-wide" style="font-size: 12px">Palette</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400" @click="drawerScale = true">
          <span class="text-2xl leading-none">🖼️</span>
          <span class="uppercase tracking-wide" style="font-size: 12px">Image</span>
        </button>
      </div>
    </div>

    </div>
  </div>
</template>
