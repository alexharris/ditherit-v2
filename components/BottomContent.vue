<template>

<div class="w-full border-t border-b border-dashed border-red-500 flex flex-col items-center py-16">
    <div class="md:w-2/3 lg:w-4/5 shadow-md p-8 rounded flex gap-8 flex-col sm:flex-row m-4">
      <a class="border-0 hover:border-0 w-[200px] shrink-0" href="https://ditherit.threadless.com/designs/dithered-earth/mens/t-shirt/regular"  @click="fathom('trackGoal', 'GAHXDKWX', 0)">
        <img src="~/assets/t-shirt.png" />   
      </a>
      <div class="flex-shrink"> 
        <h3 class="text-lg font-serif mt-0">Dither it! t-shirts</h3>
        <p>Idk maybe this is a bad idea but let's try it. Here are some Dither it! t-shirts. Confuse your friends, confuse your enemies. Interested but hate the design? Let me know, I have other ideas, too.</p>
        <p>5% of proceeds goes to the National Audubon Society. </p>
        <span class="btn-red-outline text-center inline-block bg-white cursor-pointer mt-8" >
          <a class="border-0 hover:text-white" href="https://ditherit.threadless.com/designs/dithered-earth/mens/t-shirt/regular" @click="fathom('trackGoal', 'GAHXDKWX', 0)">🌎 Check em out</a>
        </span>                 
      </div>  
    </div>    
    <div class="md:w-2/3 lg:w-4/5 shadow-md p-8 rounded flex gap-8 flex-col sm:flex-row m-4">
      <a class="border-0 hover:border-0" href="https://www.figma.com/community/plugin/1141558599392169513/Dither-it!">
        <svg width="200" height="82" viewBox="0 0 200 82" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <path d="M27 41C27 33.5291 32.9826 27.4725 40.3626 27.4725C47.7424 27.4725 53.7251 33.5291 53.7251 41C53.7251 48.4711 47.7424 54.5275 40.3626 54.5275C32.9826 54.5275 27 48.4711 27 41Z" fill="#1ABCFE"/>
          <path d="M0.274872 68.0551C0.274872 60.5841 6.25749 54.5275 13.6374 54.5275H27V68.0551C27 75.5262 21.0174 81.5826 13.6374 81.5826C6.25749 81.5826 0.274872 75.5262 0.274872 68.0551Z" fill="#0ACF83"/>
          <path d="M27 0.417496V27.4725H40.3626C47.7426 27.4725 53.7251 21.4161 53.7251 13.945C53.7251 6.47398 47.7426 0.417496 40.3626 0.417496H27Z" fill="#FF7262"/>
          <path d="M0.274872 13.945C0.274872 21.416 6.25749 27.4725 13.6374 27.4725H27V0.41748H13.6374C6.25749 0.41748 0.274872 6.47396 0.274872 13.945Z" fill="#F24E1E"/>
          <path d="M0.274872 41C0.274872 48.4711 6.25749 54.5275 13.6374 54.5275H27V27.4725H13.6374C6.25749 27.4725 0.274872 33.5291 0.274872 41Z" fill="#A259FF"/>
          <rect x="118" width="82" height="82" fill="url(#pattern0)"/>
          <path d="M83.9091 53.6136V31.1136H87.7273V53.6136H83.9091ZM74.5682 44.2727V40.4545H97.0682V44.2727H74.5682Z" fill="#C53030"/>
          <defs>
          <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlink:href="#image0_12_67" transform="scale(0.0078125)"/>
          </pattern>
          <image id="image0_12_67" width="128" height="128" xlink:href="data:image/png;base64,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"/>
          </defs>
        </svg>    
      </a>
      <div> 
        <h3 class="text-lg font-serif mt-0">Dither it! for Figma v1.0.0</h3>
        <p> Finally, the plugin that literally no one has ever asked for...Dither It! for Figma is now available.</p>

        <p>Features include:</p>

        <ul class="list-disc pl-4">
          <li>Dithering images in Figma</li>
        </ul>
        <span class="btn-red-outline text-center inline-block bg-white cursor-pointer mt-8">
          <a class="border-0 hover:text-white" href="https://www.figma.com/community/plugin/1141558599392169513/Dither-it!">🌀 Take it for a spin</a>
        </span>                 
      </div>  
    </div>  
    <!-- begin three column -->
    <div
      class="flex space-y-8 md:space-y-0 md:space-x-16 flex-col md:flex-row  pt-4 mt-8 px-4 mx-2 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 "
    >
      <div class="w-full md:w-1/3">
        <h3 class="text-lg font-serif">Open Source</h3>
        <p>The Dither it! source code is available for your browsing pleasure on github.</p>
        <p><a href="https://github.com/alexharris/ditherit-v2">Read more</a></p>        
      </div>
      <div class="w-full md:w-1/3">
        <h3 class="text-lg font-serif">Resources</h3>
        <p>A list of dithering <a href="/resources">resources</a> from around the web. Explainers, algorithms, examples, etc.</p>
      </div>      
      <div class="w-full md:w-1/3">
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
    <div class="flex flex-col items-center">
      <div class="my-24">
        <div class="md:flex-row  mx-4 md:mx-0 max-w-3xl ">
              <h3 class="text-3xl w-full pb-12 font-serif text-center mx-0 px-0">About Dither it!</h3>

          <h3 class="font-serif text-lg">What is Dithering?</h3>
          <p> Dithering is a method for trying to make an image look good while reducing the number of colors it uses, or as <a href="https://en.wikipedia.org/wiki/Dither">wikipedia puts it:</a></p>
          <blockquote class="bg-gray-50">Dithering is used in computer graphics to create the illusion of "color depth" in images with a limited color palette - a technique also known as color quantization. In a dithered image, colors that are not available in the palette are approximated by a diffusion of colored pixels from within the available palette. The human eye perceives the diffusion as a mixture of the colors within it (see color vision). Dithered images, particularly those with relatively few colors, can often be distinguished by a characteristic graininess or speckled appearance. </blockquote>
          <p>For more information, see this list of dithering <a href="/resources">resources</a> from around the web: explainers, algorithms, examples, etc.</p>
          <h3 class="font-serif text-lg pt-8">About this site</h3>
          <p>Dither it! is built by <a href="https://alexharris.online/">Alex Harris</a>, on twitter <a href="https://twitter.com/alexharris6">@alexharris6</a>.</p>

          <p>It was inspired by a <a href="https://solar.lowtechmagazine.com/2018/09/how-to-build-a-lowtech-website/">blog post from Low-tech Magazine</a> about how to reduce the energy usage associated with running websites. One method discussed was to reduce full color images to dithered images with very few colors and subsequently smaller file sizes. Ensuing discussion clarified that there are other, more modern ways to compress images (try <a href="https://squoosh.app/">Squoosh</a>) which achieve reduced file sizes while maintaining color. Nonetheless, dithering is a fun technique that looks cool and is interesting to learn about.</p>

          

          <p>The Dither it! source code is freely available on the <a href="https://github.com/alexharris/ditherit-v2">Dither it! Github page</a>. Please feel free to contribute, share or pilfer.</p>

          <p>Thanks to Leon Sorokin, for making <a href="https://github.com/leeoniya/RgbQuant.js">RgbQuant.js</a> and Don for making <a href="https://xiaokaike.github.io/vue-color/">vue-color</a>.</p>

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

export default {
  components: {
    Examples,
  },     
  data() {
    return {
    }
  },
  
  methods: {

  
  }
}
</script>
