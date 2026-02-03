<template>

<div class="w-full border-t border-b border-dashed border-red-500 flex flex-col items-center py-16">
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
        <div class="mb-4">
          <div class="flex flex-row items-center gap-2 text-sm">
              <span class="text-gray-400">02-01-25</span><h4 class=" inline m-0 text-sm"> – Cool Thing</h4>
          </div>
          <div>
            <p class="mt-0">
              Want to learn more about dithering? Check out this amazing animated tutorial thing: <a href="https://visualrambling.space/dithering-part-1/">Dithering Part 1: What is Dithering?</a> by Visual Rambling. It is the visual intro to dithering that I wish I would/could have made.
            </p>          
          </div>
        </div>         
        <div class="mb-4">
          <div class="flex flex-row items-center gap-2 text-sm">
              <span class="text-gray-400">12-14-25</span><h4 class=" inline m-0 text-sm"> – Feature Update</h4>
          </div>
          <div>
            <p class="mt-0">
              Wow, two days in a row, and this one is cool. You can now save a color palette to local storage in your browser, so you can make complex palettes and have access to them on future visits. But all will be lost if you clear your browsers local storage. Let me know if it is helpful, broken, can be improved, whatever. Let me know!
            </p>          
          </div>
        </div>                 
        <div class="mb-4">
          <div class="flex flex-row items-center gap-2 text-sm">
              <span class="text-gray-400">12-13-25</span><h4 class=" inline m-0 text-sm"> – New Feature</h4>
          </div>
          <div>
            <p class="mt-0">
              After a little feedback, I have updated the "pixeliness" feature to strictly stick to the defined palette (except in firefox??). If it looks horrible, try adding another color or two.
            </p>          
          </div>
        </div>        
        <div>
          <div class="flex flex-row items-center gap-2 text-sm">
              <span class="text-gray-400">03-12-25</span><h4 class=" inline m-0 text-sm"> – New Feature</h4>
          </div>
          <div>
            <p class="mt-0">Trying something new, a little development log just to keep track of news and new features. And the first annoucement is..the development log itself 😵‍💫</p>          
          </div>
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
  methods: {
    track() {
      typeof fathom !== 'undefined' && fathom('trackGoal', 'GAHXDKWX', 0)
    }
  
  }
}
</script>
