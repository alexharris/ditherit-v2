/* eslint-disable no-console */
<template>
  <div
    class="mt-16 border-t border-dashed border-red-500 md:items-start pt-8 "
  >
    <h3 class="text-3xl w-full pb-12 font-serif text-center mx-0 px-0">Examples</h3>
    <div class="flex flex-row justify-center mb-12 space-x-4">
      <span
        class="border border-red-700 p-2 my-2 rounded-lg hover:bg-red-700 hover:text-white cursor-pointer"
        :class="{ 'bg-red-700 text-white': example == 'color' }"
        @click="
          example = 'color'
          currentExample = 'Original'
        "
        >🎨 Colors</span
      >       
      <span
        class="border border-red-700 p-2 my-2 rounded-lg hover:bg-red-700 hover:text-white cursor-pointer"
        :class="{ 'bg-red-700 text-white': example == 'algo' }"
        @click="
          example = 'algo'
          currentExample = 'Floyd Steinberg'
        "
        >🖥️ Algorithms</span
      >

    </div>
    <div
      class="flex flex-col md:flex-row items-start md:space-x-4 checkers shadow-inner p-8"
      v-if="example == 'color'"
    >
      <div
        class="w-full md:w-2/5 flex flex-col justify-end md:px-4 order-2 md:order-1"
      >
        
        <div
          class="border-b border-red-700 my-2 pb-1 text-red-700 cursor-pointer"
          :class="{ 'star': currentExample == example }"
          @click="currentExample = example"
          v-for="example in examples"
        >
          {{ example }}
        </div>
      </div>
      <div
        class="w-full md:w-3/5 flex flex-col items-center order-1 md:order-2"
      >
        <img
          src="~/assets/examples/redmono_earth.jpg"
          v-if="currentExample == 'Red Mono'"
        />
        <img
          src="~/assets/examples/bw_earth.jpg"
          v-if="currentExample == 'Black & White'"
        />
        <img
          src="~/assets/examples/blueyellow_earth.jpg"
          v-if="currentExample == 'Blue & Yellow'"
        />
        <img
          src="~/assets/examples/gameboy_earth.jpg"
          v-if="currentExample == 'Gameboy'"
        />
        <img
          src="~/assets/examples/cmyk_earth.jpg"
          v-if="currentExample == 'CMYK'"
        />        
        <img
          src="~/assets/examples/earth.jpg"
          v-if="currentExample == 'Original'"
        />
      </div>
    </div>
    <div
      class="flex flex-col md:flex-row items-start md:space-x-4 checkers shadow-inner p-8"
      v-if="example == 'algo'"
    >
      <div
        class="w-full md:w-2/5 flex flex-col justify-end md:px-4 order-2 md:order-1"
      >
        <span
          class="border-b border-red-700 my-2 pb-1 text-red-700 cursor-pointer"
          :class="{ 'star': currentExample == example }"
          @click="currentExample = example"
          v-for="example in algoExamples"
        >
          {{ example }}
        </span>
      </div>
      <div
        class="w-full md:w-3/5 flex flex-col items-center order-1 md:order-2"
      >
        <img
          src="~/assets/examples/frog_floydsteinberg.png"
          v-if="currentExample == 'Floyd Steinberg'"
        />
        <img
          src="~/assets/examples/frog_falsefloyd.png"
          v-if="currentExample == 'False Floyd Steinberg'"
        />
        <img
          src="~/assets/examples/frog_stucki.png"
          v-if="currentExample == 'Stucki'"
        />
        <img
          src="~/assets/examples/frog_atkinson.png"
          v-if="currentExample == 'Atkinson'"
        />
        <img
          src="~/assets/examples/frog_jarvis.png"
          v-if="currentExample == 'Jarvis'"
        />
        <img
          src="~/assets/examples/frog_burkes.png"
          v-if="currentExample == 'Burkes'"
        />
        <img
          src="~/assets/examples/frog_sierra.png"
          v-if="currentExample == 'Sierra'"
        />
        <img
          src="~/assets/examples/frog_twosierra.png"
          v-if="currentExample == 'TwoSierra'"
        />
        <img
          src="~/assets/examples/frog_sierralite.png"
          v-if="currentExample == 'SierraLite'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-twentytwenty/dist/vue-twentytwenty.css'
import TwentyTwenty from 'vue-twentytwenty'

export default {
  components: {
    TwentyTwenty
  },
  data() {
    return {
      example: 'color',
      examples: [
        'Original',
        'CMYK',        
        'Red Mono',
        'Black & White',
        'Blue & Yellow',
        'Gameboy',

      ],
      algoExamples: [
        'Floyd Steinberg',
        'False Floyd Steinberg',
        'Stucki',
        'Atkinson',
        'Jarvis',
        'Burkes',
        'Sierra',
        'TwoSierra',
        'SierraLite'
      ],
      currentExample: 'Original'
    }
  },
  methods: {
    imgSrc(filename) {
      var file = filename
      return require('@/assets/examples/' + file)
    }
  }
}
</script>

<style scoped>
.star {
  @apply text-black
}
.star::before {
  content: '✔️';
}
</style>