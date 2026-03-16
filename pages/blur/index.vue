<template>
  <div>
    <BlurStudio />
  </div>
</template>

<script>
import BlurStudio from '~/components/BlurStudio.vue'

export default {
  components: { BlurStudio },
  head() {
    return {
      title: 'Blur Studio — Dither it!',
      meta: [{ hid: 'description', name: 'description', content: 'Apply GIMP-style blur methods to your dithered images.' }]
    }
  }
}
</script>
