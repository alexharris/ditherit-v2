<template>
  <div>
    <DitherTournament />
  </div>
</template>

<script>
import DitherTournament from '~/components/DitherTournament.vue'

export default {
  components: { DitherTournament },
  head() {
    return {
      title: 'Dither Tournament — Dither it!',
      meta: [{ hid: 'description', name: 'description', content: 'Find your perfect dither algorithm by elimination bracket.' }]
    }
  }
}
</script>
