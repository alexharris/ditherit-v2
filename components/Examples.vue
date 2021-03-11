/* eslint-disable no-console */
<template> 

<div class=" mt-16 px-4 border-t border-dashed border-red-500 md:items-start pt-8 mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64">

  <h3 class="text-3xl w-full pb-12 font-serif md:text-center">Examples</h3>
    <div class="flex flex-col md:flex-row items-center">
      
      <div class="w-full md:w-1/4 flex flex-row md:flex-col flex-wrap items-end py-4 order-2 md:order-1">  
        <span 
          class="border border-red-500 p-4 my-2 mr-2 rounded-full hover:bg-red-500 cursor-pointer shadow" 
          :class="{ 'bg-red-500': currentExample == example}"  
          @click="currentExample = example"
          v-for="example in examples">
            {{example}}
        </span>
        <!-- <span class="border border-red-500 p-4 my-2 mr-2 rounded-full hover:bg-red-500 cursor-pointer shadow" :class="{ 'bg-red-500': currentExample == 'bw'}" @click="currentExample = 'bw'">Black & White</span>
        <span class="border border-red-500 p-4 my-2 mr-2 rounded-full hover:bg-red-500 cursor-pointer shadow" :class="{ 'bg-red-500': currentExample == 'blueyellow'}" @click="currentExample = 'blueyellow'">Blue & Yellow</span>
        <span class="border border-red-500 p-4 my-2 mr-2 rounded-full hover:bg-red-500 cursor-pointer shadow" :class="{ 'bg-red-500': currentExample == 'gameboy'}" @click="currentExample = 'gameboy'">Gameboy</span> -->
      </div>
      <div class="w-full md:w-3/4 flex flex-col items-center order-1 md:order-2">
        <img src="~/assets/examples/redmono_earth.jpg" v-if="currentExample == 'Red Mono'" />
        <img src="~/assets/examples/bw_earth.jpg" v-if="currentExample == 'Black & White'" />
        <img src="~/assets/examples/blueyellow_earth.jpg" v-if="currentExample == 'Blue & Yellow'" />
        <img src="~/assets/examples/gameboy_earth.jpg" v-if="currentExample == 'Gameboy'" />
        <img src="~/assets/examples/earth.jpg" v-if="currentExample == 'Original'" />
      </div>
          <!-- <TwentyTwenty
              v-if="currentExample == 'Red Monochrome'"   
                  
              :before="imgSrc('earth.jpg')"
              :after="imgSrc('redmono_earth.jpg')" 
          />  
          <TwentyTwenty
              v-if="currentExample == 'blueyellow'"   
              
              :before="imgSrc('earth.jpg')"
              :after="imgSrc('blueyellow_earth.jpg')" 
          /> 
          <TwentyTwenty
              v-if="currentExample == 'bw'"   
              
              :before="imgSrc('earth.jpg')"
              :after="imgSrc('bw_earth.jpg')" 
          /> 
          <TwentyTwenty
              v-if="currentExample == 'gameboy'"   
              
              :before="imgSrc('earth.jpg')"
              :after="imgSrc('gameboy_earth.jpg')" 
          />                 -->

                     
    </div>
  </div>
</template>

<script>

import 'vue-twentytwenty/dist/vue-twentytwenty.css';
import TwentyTwenty from 'vue-twentytwenty';

export default {
  components: {
    TwentyTwenty
  },      
  data() {
    return {
      examples: ['Original', 'Red Mono', 'Black & White', 'Blue & Yellow', 'Gameboy'],
      currentExample: 'Original'
    }
  },
  methods: {
    imgSrc(filename) {
      var file = filename;
      return require('@/assets/examples/' + file);
    }  



  }
}
</script>
