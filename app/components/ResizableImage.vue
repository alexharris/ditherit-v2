<script setup lang="ts">
const props = defineProps<{
  outputWidth: number
  originalWidth: number
  originalHeight: number
  disabled?: boolean
  maxWidth?: number
}>()

const emit = defineEmits<{
  resize: [payload: { width: number }]
}>()

const maxW = computed(() => props.maxWidth ?? 5000)

const containerRef = ref<HTMLElement>()
const isDragging = ref(false)
const isHovering = ref(false)
const liveWidth = ref(0)

// Which corner is being dragged
let activeCorner: string | null = null
// Snapshot values at drag start
let startPointerX = 0
let startPointerY = 0
let startOutputWidth = 0
let scaleFactor = 1 // outputPixels per screenPixel

const liveHeight = computed(() => {
  if (!props.originalWidth || !props.originalHeight || !liveWidth.value) return 0
  return Math.round((props.originalHeight / props.originalWidth) * liveWidth.value)
})


function onPointerDown(e: PointerEvent, corner: string) {
  if (props.disabled) return
  e.preventDefault()
  e.stopPropagation()

  activeCorner = corner
  isDragging.value = true
  startPointerX = e.clientX
  startPointerY = e.clientY
  startOutputWidth = props.outputWidth

  // Calculate scale factor: how many output pixels per screen pixel
  const el = containerRef.value
  if (el) {
    const displayedWidth = el.offsetWidth
    scaleFactor = displayedWidth > 0 ? startOutputWidth / displayedWidth : 1
  }

  liveWidth.value = startOutputWidth

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return

  const dx = e.clientX - startPointerX
  const dy = e.clientY - startPointerY

  // Use diagonal projection for aspect-ratio-preserving resize
  // Positive diagonal = larger, negative = smaller
  let screenDelta: number
  if (activeCorner === 'top-left') {
    screenDelta = (-dx + -dy) / Math.SQRT2
  } else if (activeCorner === 'top-right') {
    screenDelta = (dx + -dy) / Math.SQRT2
  } else if (activeCorner === 'bottom-left') {
    screenDelta = (-dx + dy) / Math.SQRT2
  } else {
    // bottom-right
    screenDelta = (dx + dy) / Math.SQRT2
  }

  const outputDelta = screenDelta * scaleFactor
  const newWidth = Math.round(Math.max(1, Math.min(maxW.value, startOutputWidth + outputDelta)))
  liveWidth.value = newWidth
}

function onPointerUp() {
  if (!isDragging.value) return
  isDragging.value = false

  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)

  if (liveWidth.value !== props.outputWidth) {
    emit('resize', { width: liveWidth.value })
  }
  activeCorner = null
}

const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const

function cornerClasses(corner: string) {
  const base = 'absolute size-4 z-10 touch-none'
  const pos: Record<string, string> = {
    'top-left': 'top-0 left-0 cursor-nwse-resize',
    'top-right': 'top-0 right-0 cursor-nesw-resize',
    'bottom-left': 'bottom-0 left-0 cursor-nesw-resize',
    'bottom-right': 'bottom-0 right-0 cursor-nwse-resize'
  }
  return `${base} ${pos[corner]}`
}

function cornerBorderClasses(corner: string) {
  const base = 'absolute border-ditherit'
  const style: Record<string, string> = {
    'top-left': `${base} top-0 left-0 w-3 h-3 border-t-2 border-l-2`,
    'top-right': `${base} top-0 right-0 w-3 h-3 border-t-2 border-r-2`,
    'bottom-left': `${base} bottom-0 left-0 w-3 h-3 border-b-2 border-l-2`,
    'bottom-right': `${base} bottom-0 right-0 w-3 h-3 border-b-2 border-r-2`
  }
  return style[corner]
}
</script>

<template>
  <div
    ref="containerRef"
    class="relative inline-block"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <slot />

    <!-- Corner handles -->
    <template v-if="!disabled">
      <div
        v-for="corner in corners"
        :key="corner"
        :class="cornerClasses(corner)"
        :style="{ opacity: isDragging || isHovering ? 1 : 0, transition: 'opacity 150ms' }"
        @pointerdown="onPointerDown($event, corner)"
      >
        <div :class="cornerBorderClasses(corner)" />
      </div>
    </template>

    <!-- Dimension badge -->
    <div
      v-if="isDragging"
      class="absolute top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-0.5 text-xs font-mono text-white shadow dark:bg-gray-100 dark:text-gray-800"
    >
      {{ liveWidth }} &times; {{ liveHeight }}
    </div>
  </div>
</template>
