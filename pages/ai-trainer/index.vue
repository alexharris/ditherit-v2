<template>
  <div>
    <AiTrainer />
  </div>
</template>

<script>
import AiTrainer from '~/components/AiTrainer.vue'
export default {
  components: { AiTrainer },
  head() {
    return {
      title: 'AI Dither Trainer — Dither it!',
      meta: [{ hid: 'description', name: 'description', content: 'Train a personal AI model from your dither tournament picks, then let it rank dithering options for you.' }]
    }
  }
}
</script>
