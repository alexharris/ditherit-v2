<script setup lang="ts">
// Import the web component
import 'img-comparison-slider'

defineProps<{
  originalSrc: string
  ditheredSrc: string
  alt?: string
  imageStyle?: Record<string, string>
}>()
</script>

<template>
  <div class="image-compare-wrapper">
    <img-comparison-slider class="image-compare-slider">
      <img
        slot="first"
        :src="originalSrc"
        :alt="alt ? `Original: ${alt}` : 'Original image'"
        class="compare-image"
        :style="imageStyle"
      />
      <img
        slot="second"
        :src="ditheredSrc"
        :alt="alt ? `Dithered: ${alt}` : 'Dithered image'"
        class="compare-image"
        :style="imageStyle"
      />
    </img-comparison-slider>
  </div>
</template>

<style scoped>
.image-compare-wrapper {
  position: relative;
  display: block;
  line-height: 0;
}

.image-compare-slider {
  --divider-color: rgb(239, 68, 68);
  --default-handle-color: rgb(239, 68, 68);
  --default-handle-width: 50px;
  --divider-width: 3px;
  overflow: hidden;
  max-width: 100%;
  touch-action: none;
}

.image-compare-slider:focus {
  outline: 3px solid #C53030;
  outline-offset: 2px;
}

.compare-image {
  display: block;
  width: 100%;
  height: auto;
  image-rendering: pixelated;
  object-fit: contain;
}

@media (min-width: 1024px) {
  .compare-image {
    max-height: 60vh;
  }
}
</style>
