import JSZip from 'jszip'
import { nextTick } from 'vue'

export interface GalleryImage {
  id: string
  fileName: string
  originalSrc: string
  originalFileSize: number // in bytes
  originalMimeType: string // e.g. 'image/jpeg', 'image/png'
  ditheredDataUrl: string | null // blob URL for display
  ditheredBlob: Blob | null // raw PNG blob for download/zip
  ditheredFileSize: number | null // blob.size in bytes
  resizedOriginalSrc: string | null
  isProcessing: boolean
  isStale: boolean // dithered result is outdated and needs re-processing
}

// Module-level state — shared across all callers
const images = ref<GalleryImage[]>([])
const selectedId = ref<string | null>(null)
const isDownloadingAll = ref(false)

const selectedImage = computed(() =>
  images.value.find(img => img.id === selectedId.value) || null
)

const hasImages = computed(() => images.value.length > 0)

const processedCount = computed(() =>
  images.value.filter(img => img.ditheredDataUrl !== null).length
)

export function useImageGallery() {

  function generateId(): string {
    return `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }

  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB
  const MAX_DIMENSION = 10000

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = src
    })
  }

  const LARGE_FILE_THRESHOLD = 2 * 1024 * 1024 // 2 MB

  async function addImages(files: FileList | File[]): Promise<{ tooLarge: string[]; tooWide: string[]; largeFiles: string[]; added: number }> {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    const tooLarge: string[] = []
    const tooWide: string[] = []
    const largeFiles: string[] = []
    let added = 0

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        tooLarge.push(file.name)
        continue
      }

      const dataUrl = await readFileAsDataURL(file)
      const { width, height } = await getImageDimensions(dataUrl)

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        tooWide.push(file.name)
        continue
      }

      const newImage: GalleryImage = {
        id: generateId(),
        fileName: file.name,
        originalSrc: dataUrl,
        originalFileSize: file.size,
        originalMimeType: file.type || 'image/png',
        ditheredDataUrl: null,
        ditheredBlob: null,
        ditheredFileSize: null,
        resizedOriginalSrc: null,
        isProcessing: false,
        isStale: false
      }
      images.value.push(newImage)

      if (file.size > LARGE_FILE_THRESHOLD) {
        largeFiles.push(file.name)
      }

      added++

      // Auto-select if this is the first image
      if (images.value.length === 1) {
        selectedId.value = newImage.id
      }
    }

    return { tooLarge, tooWide, largeFiles, added }
  }

  async function addImageFromUrl(url: string, fileName: string) {
    const response = await fetch(url)
    const blob = await response.blob()
    const file = new File([blob], fileName, { type: blob.type })
    await addImages([file])
  }

  function selectImage(id: string) {
    selectedId.value = id
  }

  function removeImage(id: string) {
    const index = images.value.findIndex(img => img.id === id)
    if (index !== -1) {
      // Revoke blob URL before removing
      const img = images.value[index]
      if (img?.ditheredDataUrl) {
        URL.revokeObjectURL(img.ditheredDataUrl)
      }

      images.value.splice(index, 1)

      // Update selection if we removed the selected image
      if (selectedId.value === id) {
        if (images.value.length > 0) {
          // Select the previous image, or first if we removed the first
          const newIndex = Math.max(0, index - 1)
          selectedId.value = images.value[newIndex]?.id ?? null
        } else {
          selectedId.value = null
        }
      }
    }
  }

  function clearAll() {
    // Revoke all blob URLs
    images.value.forEach((img) => {
      if (img.ditheredDataUrl) {
        URL.revokeObjectURL(img.ditheredDataUrl)
      }
    })
    images.value = []
    selectedId.value = null
  }

  function setDitheredResult(id: string, url: string, blob: Blob) {
    const image = images.value.find(img => img.id === id)
    if (image) {
      const oldUrl = image.ditheredDataUrl
      // Set new values first so the <img> gets a valid src immediately
      image.ditheredDataUrl = url
      image.ditheredBlob = blob
      image.ditheredFileSize = blob.size
      image.isStale = false
      // Revoke old blob URL after Vue has flushed the DOM update
      if (oldUrl) {
        nextTick(() => URL.revokeObjectURL(oldUrl))
      }
    }
  }

  function setResizedOriginal(id: string, dataUrl: string | null) {
    const image = images.value.find(img => img.id === id)
    if (image) {
      image.resizedOriginalSrc = dataUrl
    }
  }

  function setProcessing(id: string, processing: boolean) {
    const image = images.value.find(img => img.id === id)
    if (image) {
      image.isProcessing = processing
    }
  }

  function clearDitheredResults() {
    images.value.forEach((img) => {
      if (img.ditheredDataUrl) {
        URL.revokeObjectURL(img.ditheredDataUrl)
      }
      img.ditheredDataUrl = null
      img.ditheredBlob = null
      img.ditheredFileSize = null
      img.resizedOriginalSrc = null
    })
  }

  async function downloadAll(
    processImage: (image: GalleryImage) => Promise<{ url: string; blob: Blob }>,
    format: string = 'png',
    convertBlob?: (blob: Blob) => Promise<Blob>
  ) {
    if (images.value.length === 0) return

    isDownloadingAll.value = true

    try {
      const zip = new JSZip()

      // Process any unprocessed images and add all to ZIP
      for (const image of images.value) {
        let blob = image.ditheredBlob

        // Process if not already processed
        if (!blob) {
          image.isProcessing = true
          try {
            const result = await processImage(image)
            // Revoke old URL if any
            if (image.ditheredDataUrl) {
              URL.revokeObjectURL(image.ditheredDataUrl)
            }
            image.ditheredDataUrl = result.url
            image.ditheredBlob = result.blob
            image.ditheredFileSize = result.blob.size
            blob = result.blob
          } finally {
            image.isProcessing = false
          }
        }

        if (blob) {
          if (convertBlob) {
            blob = await convertBlob(blob)
          }
          const baseName = image.fileName.replace(/\.[^.]+$/, '')
          zip.file(`${baseName}-dithered.${format}`, blob)
        }
      }

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'dithered-images.zip'
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      isDownloadingAll.value = false
    }
  }

  return {
    // State
    images,
    selectedId,
    selectedImage,
    hasImages,
    processedCount,
    isDownloadingAll,

    // Methods
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
  }
}
