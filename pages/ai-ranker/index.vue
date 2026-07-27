<template>
  <div>
    <AiDitherRanker />
  </div>
</template>

<script>
import AiDitherRanker from '~/components/AiDitherRanker.vue'
export default {
  components: { AiDitherRanker },
  head() {
    return {
      title: 'AI Dither Ranker — Dither it!',
      meta: [{ hid: 'description', name: 'description', content: 'Upload an image and let your trained AI model rank every dithering option, best to worst.' }]
    }
  }
}
</script>
