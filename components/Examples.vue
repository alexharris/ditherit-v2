/* eslint-disable no-console */
<template>
  <div
    class="mt-16 border-t border-b border-dashed border-red-500 md:items-start pt-8"
  >
    <h3 class="text-3xl w-full pb-12 font-serif text-center mx-0 px-0">Examples</h3>
    <div
      class="flex flex-col md:flex-row items-center gap-8 justify-center pb-8"
    >
      <span
        class="border-b border-red-700 text-red-700 cursor-pointer"
        :class="{ 'star': currentExample == example }"
        @click="currentExample = example"
        v-for="example in examples"
      >
        {{ example }}
      </span>
    </div>    
    <div
      class="flex flex-col md:flex-row items-start md:space-x-4 checkers shadow-inner p-8"
      v-if="example == 'color'"
    >
 
      <div
        class="w-full md:w-1/2 flex flex-col justify-end items-center gap-4 order-2 md:order-1"
      >
        <img
          src="~/assets/examples/earth.jpg"
          v-if="currentExample == 'Original'"
        />
        <img
          src="~/assets/examples/redmono_earth_bayer.png"
          v-if="currentExample == 'Red Mono'"
        />
        <img
          src="~/assets/examples/bw_earth_bayer.png"
          v-if="currentExample == 'Black & White'"
        />
        <img
          src="~/assets/examples/blueyellow_earth_bayer.png"
          v-if="currentExample == 'Blue & Yellow'"
        />
        <img
          src="~/assets/examples/gameboy_earth_bayer.png"
          v-if="currentExample == 'Gameboy'"
        />
        <img
          src="~/assets/examples/cmyk_earth_bayer.png"
          v-if="currentExample == 'CMYK'"
        />        
        Ordered (Bayer)
      </div>
      <div
        class="w-full md:w-1/2 flex flex-col items-center gap-4 order-1 md:order-2"
      >    
        <img
          src="~/assets/examples/redmono_earth.png"
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
        Error Diffusion
      </div>
    </div>
  
  </div>
</template>

<script>

export default {
  components: {
    
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