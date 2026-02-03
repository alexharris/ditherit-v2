<template>
  <div
    class="mt-16 w-full border-t border-b border-dashed border-red-500 md:items-start pt-8"
  >
    <h3 class="text-3xl w-full font-serif text-center mx-0 px-0">Examples</h3>
    <div class="flex flex-row gap-4 items-center justify-center p-8">
      <img class="w-24" src="~/assets/examples/frog_icon.png" alt="Frog example" @click="example = 'frog'" width="200" height="200" />
      <img class="w-24" src="~/assets/examples/earth_icon.png" alt="Earth example" @click="example = 'earth'" width="200" height="198"  />
    </div>
    <div class="flex flex-col checkers shadow-inner p-8">

      <!-- Frog Examples  -->
      <div
        class="flex flex-col md:flex-row gap-8"
        v-if="example == 'frog'"
      >
        <!-- Bayer Examples -->
        <div class="w-full flex flex-col items-center gap-4">
          Ordered (Bayer)
          <img-comparison-slider v-if="currentExample == 'Red Mono'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_bayer_redmono.png" alt="Frog with Bayer red mono dithering" width="512" height="512" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Black & White'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_bayer_bw.png" alt="Frog with Bayer black and white dithering" width="512" height="512" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Blue & Yellow'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_bayer_by.png" alt="Frog with Bayer blue and yellow dithering" width="512" height="512" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Gameboy'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_bayer_gameboy.png" alt="Frog with Bayer Game Boy dithering" width="512" height="512" />
          </img-comparison-slider>                                    
          <img-comparison-slider v-if="currentExample == 'CMYK'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_bayer_cmyk.png" alt="Frog with Bayer CMYK dithering" width="512" height="512" />
          </img-comparison-slider>          
        </div>
        <!-- Error Diffusion Exmaples -->
        <div class="w-full flex flex-col items-center gap-4">    
          Error Diffusion
          <img-comparison-slider v-if="currentExample == 'Red Mono'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_diffusion_redmono.png" alt="Frog with error diffusion red mono dithering" width="512" height="512" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Black & White'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_diffusion_bw.png" alt="Frog with error diffusion black and white dithering" width="512" height="512" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Blue & Yellow'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_diffusion_by.png" alt="Frog with error diffusion blue and yellow dithering" width="512" height="512" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Gameboy'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_diffusion_gameboy.png" alt="Frog with error diffusion Game Boy dithering" width="512" height="512" />
          </img-comparison-slider>                                    
          <img-comparison-slider v-if="currentExample == 'CMYK'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/quantfrog.png" alt="Original frog image" width="512" height="512" />
            <img slot="second" loading="lazy" src="~/assets/examples/frog_diffusion_cmyk.png" alt="Frog with error diffusion CMYK dithering" width="512" height="512" />
          </img-comparison-slider>          
          
        </div>
      </div>

      <!-- Earth Examples  -->
      <div
        class="flex flex-col md:flex-row"
        v-if="example == 'earth'"
      >
        <!-- Bayer Examples -->
        <div class="w-full flex flex-col itms-center gap-4">
          Ordered (Bayer)
          <img-comparison-slider v-if="currentExample == 'Red Mono'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/redmono_earth_bayer.png" alt="Earth with Bayer red mono dithering" width="640" height="480" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Black & White'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/bw_earth_bayer.png" alt="Earth with Bayer black and white dithering" width="640" height="480" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Blue & Yellow'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/blueyellow_earth_bayer.png" alt="Earth with Bayer blue and yellow dithering" width="640" height="480" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Gameboy'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/gameboy_earth_bayer.png" alt="Earth with Bayer Game Boy dithering" width="640" height="480" />
          </img-comparison-slider>                                    
          <img-comparison-slider v-if="currentExample == 'CMYK'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/cmyk_earth_bayer.png" alt="Earth with Bayer CMYK dithering" width="640" height="480" />
          </img-comparison-slider>          
        </div>
        <!-- Error Diffusion Exmaples -->
        <div class="w-full flex flex-col items-center gap-4">    
          Error Diffusion
          <img-comparison-slider v-if="currentExample == 'Red Mono'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/redmono_earth.jpg" alt="Earth with error diffusion red mono dithering" width="640" height="480" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Black & White'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/bw_earth.jpg" alt="Earth with error diffusion black and white dithering" width="640" height="480" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Blue & Yellow'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/blueyellow_earth.jpg" alt="Earth with error diffusion blue and yellow dithering" width="640" height="480" />
          </img-comparison-slider>    
          <img-comparison-slider v-if="currentExample == 'Gameboy'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/gameboy_earth.jpg" alt="Earth with error diffusion Game Boy dithering" width="640" height="480" />
          </img-comparison-slider>                                    
          <img-comparison-slider v-if="currentExample == 'CMYK'" class="img-slider">
            <img slot="first" loading="lazy" src="~/assets/examples/earth.jpg" alt="Original Earth image" width="640" height="480" />
            <img slot="second" loading="lazy" src="~/assets/examples/cmyk_earth.jpg" alt="Earth with error diffusion CMYK dithering" width="640" height="480" />
          </img-comparison-slider>                     
        </div>
      </div>      
      <!-- Example buttons -->
      <div class="flex flex-row flex-wrap items-start gap-8 p-8 justify-center w-full" >
        <div
          class="btn-red-outline"
          :class="{ 'star': currentExample == example }"
          @click="currentExample = example"
          v-for="example in examples"
        >
          {{ example }}
        </div>
      </div>       
    </div>
  </div>
</template>

<script>

import 'img-comparison-slider';

export default {
  vue: {
    config: {
      productionTip: false,
      ignoredElements: [/img-comparison-slider/]
    }
  },
  data() {
    return {
      example: 'frog',
      examples: [
        'Red Mono',
        'Black & White',
        'CMYK',
        'Blue & Yellow',
        'Gameboy'
      ],
      currentExample: 'Red Mono'
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
.img-slider {
  --divider-color: rgb(0, 0, 0);
  --default-handle-color: rgb(0, 0, 0);
  --default-handle-width: 100px;
  --divider-width: 4px;
  @apply rounded-lg
}
.img-slider:focus {
  outline: none;
}

</style>

