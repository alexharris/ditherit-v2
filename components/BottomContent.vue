<template>
<div>

    <div
      class="flex  gap-16 flex-col md:flex-row border-t border-dashed border-red-500 pt-8 mt-24 px-4 mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64 "
    >
      <div class="w-full md:w-1/3">
        <h3 class="text-lg font-serif">Quant Error</h3>
        <p>The Dither it! blog.</p>
        <p>
          <strong>January 26, 2021</strong>: The
          <nuxt-link to="/quant">Q4 Report</nuxt-link> is up on 
          <em>Quant Error</em>. Numbers, links, not very exciting!
        </p> 
        <p><a href="/quant">Read more</a></p>        
      </div>
      <div class="w-full md:w-1/3">
        <h3 class="text-lg font-serif">Resources</h3>
        <p>A list of dithering <a href="/resources">resources</a> from around the web. Explainers, algorithms, examples, etc.</p>
      </div>      
      <div class="w-full md:w-1/3">
        <h3 class="text-lg font-serif">Support</h3>
        <p class="pb-8">Support the continued existence of Dither it! with a small donation.</p>
        <style>.bmc-button img{height: 34px !important;width: 35px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{padding: 7px 15px 7px 10px !important;line-height: 35px !important;height:51px !important;text-decoration: none !important;display:inline-flex !important;color:#ffffff !important;background-color:#FF5F5F !important;border-radius: 8px !important;border: 1px solid transparent !important;font-size: 18px !important;letter-spacing:0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Arial', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#ffffff !important;}</style><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/alexharris" @click="coffeeClick()"><img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee"><span style="margin-left:5px;font-size:18px !important;">Buy me a coffee</span></a>
      </div>  
    </div>

    <Examples />
    
    <div class="mt-32 px-4 border-t border-dashed border-red-500 pt-16 flex mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64 flex-col md:flex-row">
      
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
          
      </div>
</div>
</template>


<script>
import Examples from '~/components/Examples.vue'

export default {
  components: {
    Examples
  },     
  data() {
    return {
    }
  },
  
  methods: {
    coffeeClick() {
      fathom('trackGoal', 'ZCRPUIOP', 0)
    },
  
  }
}
</script>
