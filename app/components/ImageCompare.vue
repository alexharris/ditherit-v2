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
      <div slot="first" class="compare-slot">
        <img
          :src="originalSrc"
          :alt="alt ? `Original: ${alt}` : 'Original image'"
          class="compare-image"
          :style="imageStyle"
        />
      </div>
      <div slot="second" class="compare-slot">
        <img
          :src="ditheredSrc"
          :alt="alt ? `Dithered: ${alt}` : 'Dithered image'"
          class="compare-image"
          :style="imageStyle"
        />
      </div>
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

.compare-slot {
  background-color: #fff;
  background-image:
    linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
    linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
    linear-gradient(-45deg, transparent 75%, #e5e5e5 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
  line-height: 0;
}

.image-compare-slider:focus {
  outline: 3px solid #C53030;
  outline-offset: 2px;
}

.compare-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

@media (min-width: 1024px) {
  .compare-image {
    max-height: 60vh;
  }
}
</style>
