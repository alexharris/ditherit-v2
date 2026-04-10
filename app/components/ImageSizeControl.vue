<script setup lang="ts">
const props = defineProps<{
  originalWidth: number
  originalHeight: number
  initialWidth?: number
}>()

const emit = defineEmits<{
  change: [payload: { width: number | undefined, valid: boolean }]
}>()

const MAX_WIDTH = 5000
const useCustomSize = ref(false)
const customWidth = ref(0)
const customWidthInput = ref(0)

const calculatedHeight = computed(() => {
  if (!props.originalWidth || !props.originalHeight) return 0
  const width = useCustomSize.value ? customWidth.value : props.originalWidth
  return Math.round((props.originalHeight / props.originalWidth) * width)
})

const isWidthValid = computed(() => {
  if (!useCustomSize.value) return true
  return customWidthInput.value > 0 && customWidthInput.value <= MAX_WIDTH
})

const isDirty = computed(() => useCustomSize.value && customWidthInput.value !== customWidth.value)

function enableCustomSize() {
  if (useCustomSize.value) return
  useCustomSize.value = true
  customWidth.value = props.originalWidth
  customWidthInput.value = props.originalWidth
}

function applySize() {
  if (!isWidthValid.value) return
  customWidth.value = customWidthInput.value
}

function resetToOriginalSize() {
  useCustomSize.value = false
  customWidth.value = props.originalWidth
  customWidthInput.value = props.originalWidth
}

// Reset when original dimensions change (new image selected)
watch(() => props.originalWidth, (newWidth) => {
  if (props.initialWidth && props.initialWidth !== newWidth) {
    useCustomSize.value = true
    customWidth.value = props.initialWidth
    customWidthInput.value = props.initialWidth
  } else {
    useCustomSize.value = false
    customWidth.value = newWidth
    customWidthInput.value = newWidth
  }
}, { immediate: true })

// Emit resolved state whenever it changes
watch([() => useCustomSize.value, customWidth, isWidthValid], () => {
  emit('change', {
    width: useCustomSize.value ? customWidth.value : undefined,
    valid: isWidthValid.value
  })
}, { immediate: true })
</script>

<template>
  <div class="flex items-center gap-1.5">
    <label class="text-xs text-gray-500 dark:text-gray-400">W</label>
    <UInput
      v-model="customWidthInput"
      type="number"
      :min="1"
      :max="MAX_WIDTH"
      size="xs"
      class="w-14"
      :color="useCustomSize && !isWidthValid ? 'error' : 'neutral'"
      @focus="enableCustomSize"
      @keydown.enter="applySize"
    />
    <span class="text-xs text-gray-400 dark:text-gray-500">&times;</span>
    <label class="text-xs text-gray-500 dark:text-gray-400">H</label>
    <UInput
      :model-value="calculatedHeight"
      type="number"
      size="xs"
      class="w-14 opacity-50"
      disabled
    />
    <UButton
      v-if="isDirty"
      icon="i-lucide-check"
      size="xs"
      color="primary"
      variant="solid"
      title="Apply size"
      :disabled="!isWidthValid"
      @click="applySize"
    />
    <UButton
      v-else-if="useCustomSize"
      icon="i-lucide-rotate-ccw"
      size="xs"
      color="neutral"
      variant="ghost"
      title="Reset to original size"
      @click="resetToOriginalSize"
    />
  </div>
</template>

<style scoped>
:deep(input[type="number"]) {
  -moz-appearance: textfield;
}

@media (max-width: 1023px) {
  :deep(input[type="number"]) {
    font-size: 16px;
  }
}

:deep(input[type="number"])::-webkit-outer-spin-button,
:deep(input[type="number"])::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
