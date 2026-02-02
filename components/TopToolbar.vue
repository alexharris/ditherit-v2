<template>
  <div
    v-if="showDitheredImage && !dithering"
    class="flex flex-row justify-between space-x-2 w-full items-center py-2 px-2 mb-4 shadow rounded bg-white"
  >
    <div class="flex-grow flex flex-col md:flex-row gap-4">
      <Toggler
        custom-event="view-original"
        @view-original="$emit('update:view-original', !viewOriginal)"
      >
        View Original
      </Toggler>
      <Toggler
        v-if="customWidth && viewOriginal"
        custom-event="view-full-width"
        @view-full-width="$emit('update:view-full-width', !viewFullWidth)"
      >
        Full Size
      </Toggler>
    </div>
    <ImageUpload
      text="✨ New"
      @number-images="$emit('number-images', $event)"
      @image-upload="$emit('image-upload', $event)"
    />
    <a
      class="btn-red-outline inline-block self-center"
      target="_blank"
      :href="downloadUrl"
      :download="'dither_it_' + selectedFile.name"
      @click="$emit('download')"
      >💾 Save</a
    >
  </div>
</template>

<script>
import Toggler from '~/components/Toggler.vue'
import ImageUpload from '~/components/ImageUpload.vue'

export default {
  components: {
    Toggler,
    ImageUpload
  },
  props: {
    showDitheredImage: {
      type: Boolean,
      default: false
    },
    dithering: {
      type: Boolean,
      default: false
    },
    viewOriginal: {
      type: Boolean,
      default: false
    },
    viewFullWidth: {
      type: Boolean,
      default: false
    },
    customWidth: {
      type: Boolean,
      default: false
    },
    downloadUrl: {
      type: String,
      default: ''
    },
    selectedFile: {
      default: null
    }
  }
}
</script>
