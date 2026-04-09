<script setup lang="ts">
const {
  pixeliness,
  pixelScale,
  smoothPixels,
  originalWidth,
  originalHeight,
  sizeWidth,
  sizeValid
} = useDithering()

function handleSizeChange(payload: { width: number | undefined; valid: boolean }) {
  sizeWidth.value = payload.width
  sizeValid.value = payload.valid
}

const advancedOpen = ref(false)
</script>

<template>
  <div v-if="originalWidth > 0" class="px-4 py-4">
    <span class="text-sm font-medium text-highlighted">Size</span>
    <div class="mt-2">
      <ImageSizeControl
        :original-width="originalWidth"
        :original-height="originalHeight"
        @change="handleSizeChange"
      />
    </div>
  </div>

  <USeparator v-if="originalWidth > 0" />

  <div class="px-4 py-4">
    <HelpTooltip>
      <template #label>
        <span class="text-sm font-medium text-highlighted">Pixel Scale</span>
      </template>
      <template #help>
        Make the "pixels" bigger for a chunkier look
      </template>
      <div class="mt-2">
        <USlider v-model="pixelScale" :min="1" :max="25" :step="1" />
        <span class="text-xs text-gray-500">{{ pixelScale }}x</span>
      </div>
    </HelpTooltip>
  </div>

  <USeparator />
  <div class="px-4 pb-4 pt-4">
    <button class="flex cursor-pointer items-center gap-1" @click="advancedOpen = !advancedOpen">
      <UIcon
        name="i-lucide-chevron-right"
        class="size-4 transition-transform duration-200"
        :class="{ 'rotate-90': advancedOpen }"
      />
      <span class="text-sm font-medium text-highlighted">Advanced</span>
    </button>
  </div>

  <div v-if="advancedOpen" class="px-4 pb-4">
    <div class="rounded-lg bg-gray-50 p-3 space-y-4 dark:bg-gray-900">
      <HelpTooltip>
        <template #label>
          <span class="text-sm font-medium text-highlighted">Pixeliness</span>
        </template>
        <template #help>
          Like pixel scale but more chaotic.
        </template>
        <div class="mt-2">
          <USlider v-model="pixeliness" :min="1" :max="25" :step="1" />
          <span class="text-xs text-gray-500">{{ pixeliness }}x</span>
        </div>
      </HelpTooltip>
      <HelpTooltip>
        <template #label>
          <UCheckbox v-model="smoothPixels" label="Smooth pixels" />
        </template>
        <template #help>
          Blend colors when pixelating instead of using strict nearest-neighbor. Produces softer results but may introduce colors outside the palette.
        </template>
      </HelpTooltip>
    </div>
  </div>

  <USeparator />
</template>
