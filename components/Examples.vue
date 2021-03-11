/* eslint-disable no-console */
<template> 

<div class=" mt-16 px-4 border-t border-dashed border-red-500 md:items-start pt-8 mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:md-64">

  <h3 class="text-3xl w-full pb-12 text-center font-serif">Examples</h3>
    <div class="flex flex-col md:flex-row items-center ">
      
      <div class="w-full md:w-1/4 flex flex-row md:flex-col flex-wrap items-center pb-4">  
        <span class="border border-red-500 p-4 my-2 mr-2 rounded-full hover:bg-red-500 cursor-pointer shadow" :class="{ 'bg-red-500': currentExample == 'redmono'}" @click="currentExample = 'redmono'">Red Monochrome</span>
        <span class="border border-red-500 p-4 my-2 mr-2 rounded-full hover:bg-red-500 cursor-pointer shadow" :class="{ 'bg-red-500': currentExample == 'bw'}" @click="currentExample = 'bw'">Black & White</span>
        <span class="border border-red-500 p-4 my-2 mr-2 rounded-full hover:bg-red-500 cursor-pointer shadow" :class="{ 'bg-red-500': currentExample == 'blueyellow'}" @click="currentExample = 'blueyellow'">Blue & Yellow</span>
        <span class="border border-red-500 p-4 my-2 mr-2 rounded-full hover:bg-red-500 cursor-pointer shadow" :class="{ 'bg-red-500': currentExample == 'gameboy'}" @click="currentExample = 'gameboy'">Gameboy</span>
      </div>
      <div class="w-full md:w-3/4">
        <div class="">
          <TwentyTwenty
              v-if="currentExample == 'redmono'"   
                  
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
          />                
        </div>      
      </div>
                     
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
        currentExample: 'redmono'
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
