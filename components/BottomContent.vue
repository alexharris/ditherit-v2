<template>

<div class="w-full border-t border-b border-dashed border-red-500 flex flex-col items-center py-16">
    <!-- <div class="md:w-2/3 lg:w-4/5 shadow-md p-8 rounded flex gap-8 flex-col sm:flex-row m-4">
      <a class="border-0 hover:border-0 w-[200px] shrink-0" href="https://ditherit.threadless.com/designs/dithered-earth/mens/t-shirt/regular"  @click="track()">
        <img src="~/assets/t-shirt.png" />   
      </a>
      <div class="flex-shrink"> 
        <h3 class="text-lg font-serif mt-0">Dither it! t-shirts</h3>
        <p>Idk maybe this is a bad idea but let's try it. Here are some Dither it! t-shirts. Confuse your friends, confuse your enemies. Interested but hate the design? Let me know, I have other ideas, too.</p>
        <p>5% of proceeds go to the National Audubon Society. </p>
        <a class="pt-4 border-b-1 border-red-700 hover:text-red-800 inline-block" href="https://ditherit.threadless.com/designs/dithered-earth/mens/t-shirt/regular" @click="track()">🌎 Check em out</a>
      </div>  
    </div>     -->
    <div class="w-full lg:w-11/12 flex flex-col md:flex-row items-stretch gap-4 p-4">
      <div class="w-full md:w-1/2 shadow-md p-4 rounded">
      
  
          <h3 class="text-lg font-serif mt-0">Dither it! for Figma v1.0.0</h3>
          <p> Finally, the plugin that literally no one has ever asked for...Dither It! for Figma is now available.</p>

          <p>Features include:</p>

          <ul class="list-disc pl-4">
            <li>Dithering images in Figma</li>
          </ul>
          <a class="pt-4 border-b-1 border-red-700 hover:text-red-800 inline-block" href="https://www.figma.com/community/plugin/1141558599392169513/Dither-it!">🌀 Take it for a spin</a>
      
      </div>
      <div class="w-full md:w-1/2 shadow-md p-4 flex flex-col items-start overflow-scroll h-64">
        <h3 class="text-lg font-serif mt-0 mb-2">Updates</h3>
        <div class="flex flex-row items-center gap-2 text-sm">
            <span class="text-gray-400">03-12-25</span><h4 class=" inline m-0 text-sm"> – New Feature</h4>
        </div>
        <div>
          <p class="mt-0">Trying something new, a little development log just to keep track of news and new features. And the first annoucement is..the development log itself 😵‍💫</p>          
        </div>

      </div>  
    </div> 
    <!-- begin three column -->
    <div
      class="flex flex-wrap space-y-2 md:space-y-0 flex-col md:flex-row pt-4 mt-8 px-4 mx-2 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 "
    >
      <div class="w-full md:w-1/2 p-4">
        <h3 class="text-lg font-serif">Source Code</h3>
        <p>The Dither it! <a href="https://github.com/alexharris/ditherit-v2">source code</a> is available for your browsing pleasure on github. Feel free to report an issue or submit a pull request.</p>    
      </div>
      <div class="w-full md:w-1/2 p-4">
        <h3 class="text-lg font-serif">Resources</h3>
        <p>A list of dithering <a href="/resources">resources</a> from around the web. Explainers, algorithms, examples, etc.</p>
      </div>      
      <div class="w-full md:w-1/2 p-4">
        <h3 class="text-lg font-serif">Privacy</h3>
        <p>Nothing is uploaded, your images never leave your browser. Some basic usage data is collected using a privacy-focused analytics tool.</p>    
      </div>      
      <div class="w-full md:w-1/2 p-4">
        <h3 class="text-lg font-serif">Support</h3>
        <p>Support the continued existence of Dither it! with a small donation. Much appreciated.</p>
        <p><a
            href="https://ko-fi.com/E1E7DZSYP"
            >
            ☕ Buy me a coffee
        </a>  
        </p>
      </div>  
    </div>
    <Examples />
    <ContactForm />
    <div class="flex flex-col items-center">
      <div class="my-24">
        <div class="md:flex-row  mx-4 md:mx-0 max-w-3xl ">
              <h3 class="text-3xl w-full pb-12 font-serif text-center mx-0 px-0">About Dither it!</h3>

          <h3 class="font-serif text-lg">What is Dithering?</h3>
          <p> Dithering is a method for trying to make an image look good while reducing the number of colors it uses, or as <a href="https://en.wikipedia.org/wiki/Dither">wikipedia puts it:</a></p>
          <blockquote class="bg-gray-50">Dithering is used in computer graphics to create the illusion of "color depth" in images with a limited color palette - a technique also known as color quantization. In a dithered image, colors that are not available in the palette are approximated by a diffusion of colored pixels from within the available palette. The human eye perceives the diffusion as a mixture of the colors within it (see color vision). Dithered images, particularly those with relatively few colors, can often be distinguished by a characteristic graininess or speckled appearance. </blockquote>
          <p>For more information, see this list of dithering <a href="/resources">resources</a> from around the web: explainers, algorithms, examples, etc.</p>
          <h3 class="font-serif text-lg pt-8">About this site</h3>
          <p>Dither it! is built by <a href="https://alexharris.online/">Alex Harris</a>.</p>

          <p>It was inspired by a <a href="https://solar.lowtechmagazine.com/2018/09/how-to-build-a-lowtech-website/">blog post from Low-tech Magazine</a> about how to reduce the energy usage associated with running websites. One method discussed was to reduce full color images to dithered images with very few colors and subsequently smaller file sizes. Ensuing discussion clarified that there are other, more modern ways to compress images (try <a href="https://squoosh.app/">Squoosh</a>) which achieve reduced file sizes while maintaining color. Nonetheless, dithering is a fun technique that looks cool and is interesting to learn about.</p>

          

          <p>The Dither it! source code is freely available on the <a href="https://github.com/alexharris/ditherit-v2">Dither it! Github page</a>. Please feel free to contribute, share or pilfer.</p>

          <p>Thanks to Leon Sorokin, for making <a href="https://github.com/leeoniya/RgbQuant.js">RgbQuant.js</a> and Don for making <a href="https://xiaokaike.github.io/vue-color/">vue-color</a>.</p>
          <p>Image slider for examples: <a href="https://img-comparison-slider.sneas.io/examples.html">Img Comparison Slider</a></p>
        </div>  
      </div>
    </div>


    
    <!-- <div class="mt-32 px-4 border-t border-dashed border-red-500 pt-16 flex mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64 flex-col md:flex-row">
      
      <div class="w-full md:w-1/2 p-4">
        <h4>About Dithering</h4>
        <p> Dithering is essentially a method for trying to make an image look good while reducing the number of colors it uses, or as <a href="https://en.wikipedia.org/wiki/Dither">wikipedia puts it:</a></p>
        <blockquote>Dithering is used in computer graphics to create the illusion of "color depth" in images with a limited color palette - a technique also known as color quantization. In a dithered image, colors that are not available in the palette are approximated by a diffusion of colored pixels from within the available palette. The human eye perceives the diffusion as a mixture of the colors within it (see color vision). Dithered images, particularly those with relatively few colors, can often be distinguished by a characteristic graininess or speckled appearance. </blockquote>
        <p>I'm no scientist, but I think basically what that means is: When reducing an image from many colors to fewer colors you can't get every pixel exactly right, but you can spread that error around to neighboring pixels which helps it look more like the original. The various wasy to spread that error around are the various dithering algorithms.</p>
        <p>Is this wrong? <a href="https://twitter.com/alexharris6">Tweet at me</a>.</p>

      </div>
      <div class="w-full md:w-1/2 p-4">
      
      <h4>About Dither it!</h4>
      <p class="text-xl">Built by <a href="https://alexharris.online/">Alex Harris</a>, on twitter <a href="https://twitter.com/alexharris6">@alexharris6</a>. Show me what you've dithered!</p>
      <p>Dither it! was inspired by a <a href="https://solar.lowtechmagazine.com/2018/09/how-to-build-a-lowtech-website/">blog post from a site called Low-tech Magazine</a> about how to reduce the energy usage associated with running websites. One method they discussed was to reduce full color images to dithered images with very few colors. Ensuing comments clarified that there are other, more modern ways to compress images which achieve small file sizes while maintaining color, but I still think it is a fun technique that looks cool and is interesting to learn about.</p>



      <h4>Source code</h4>
      <p>The Dither it! source code is available on the <a href="https://github.com/alexharris/ditherit-v2">Dither it! Github page</a>. Please feel free to contribute, share or pilfer.</p>

      <h4>Thanks</h4>

      <ul>
      <li>Leon Sorokin, for making <a href="https://github.com/leeoniya/RgbQuant.js">RgbQuant.js</a></li>
      <li>Don, for making <a href="https://xiaokaike.github.io/vue-color/">vue-color</a></li>
      <li><a href="https://lowtechmagazine.com">Low-tech Magazine</a></li>
      </ul>

    

  </div>
          
      </div> -->
</div>
</template>


<script>

import Examples from '~/components/Examples.vue'
import ContactForm from '~/components/ContactForm.vue'

export default {
  components: {
    Examples,
    ContactForm
  },     
  data() {
    return {
    }
  },
  
  methods: {
    track() {
      fathom('trackGoal', 'GAHXDKWX', 0)
    }
  
  }
}
</script>
