<template>
  <div>
    <BatchDither />
  </div>
</template>

<script>
import BatchDither from '~/components/BatchDither.vue'
export default {
  components: { BatchDither },
  head() {
    return {
      title: 'Batch Dither — Dither it!',
      meta: [{ hid: 'description', name: 'description', content: 'Dither multiple images at once with the same settings.' }]
    }
  }
}
</script>
