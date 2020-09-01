<template>
<div>
    <div
      class="flex flex-col md:flex-row border-t border-dashed border-red-500 pt-8 mt-24 px-4 mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:md-64 "
    >
      <div class="pr-8 flex flex-col w-full md:w-1/2">
        <h3>Updates</h3>
        <p>
          <strong>August 2, 2020</strong>: The
          <nuxt-link to="/quant">second entry</nuxt-link> in
          <em>Quant Error</em> has been posted, with Q2 numbers, a bug fix, and
          a very exciting phpBB update.
        </p>
        <p>
          <strong>April 11, 2020</strong>: We are pleased to announce
          <em>Quant Error</em>, the Dither it! blog. Read the first post
          <nuxt-link to="/quant">here</nuxt-link>, featuring a quarterly report
          on some Dither it! usage stats, and some select Dither it! projects
          from our users.
        </p>
      </div>
      <div
        class="w-full md:w-1/2 inline-block p-6 flex flex-col sm:flex-row md:flex-col justify-center items-center align-center bg-red-100 rounded"
      >
        <span class="mb-4">Enjoy Dither it!?</span>
        <style>.bmc-button img{height: 34px !important;width: 35px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{padding: 7px 15px 7px 10px !important;line-height: 35px !important;height:51px !important;text-decoration: none !important;display:inline-flex !important;color:#ffffff !important;background-color:#FF5F5F !important;border-radius: 8px !important;border: 1px solid transparent !important;font-size: 18px !important;letter-spacing:0.6px !important;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Arial', cursive !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#ffffff !important;}</style><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/alexharris" @click="coffeeClick()"><img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee"><span style="margin-left:5px;font-size:18px !important;">Buy me a coffee</span></a>
        <!-- <a class="border-0" href="https://www.paypal.me/alexharris6">
          <svg class="w-32 float-left starburst" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100.819 103.278" xml:space="preserve">
            <path stroke-miterlimit="10" d="M22.426,12.262c3.916,13.892,1.229,19.672-17.174,24.251
            c12.256,16.732,10.45,22.707-0.797,34.271C17.508,69.64,26.115,70.05,21.196,90.95c14.174-7.54,21.099-5.277,32.574,7.018
            c5.328-17.213,16.752-15.636,26.442-10.295c-4.098-18.033,0-20.902,15.164-22.951c-13.524-9.017-10.246-15.983,0.409-25
            c-15.573-3.623-19.671-6.558-16.803-23.771c-17.213,7.787-21.115-1.59-27.262-11.017C45.786,19.23,37.994,17.771,22.426,12.262z"/>
            <text x="22" y="45" class="text-sm">Support</text>
            <text x="22" y="65" class="text-sm">Dither it!</text>
          </svg> 
        </a> -->
        <!-- <p class="text-lg p-8">Enjoy Dither it!? <a href="https://www.paypal.me/alexharris6">Make a donation</a> to help us keep the lights on.</p> -->
      </div>
    </div>
    <div class="mt-16 px-4 border-t border-dashed border-red-500 pt-8 flex mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:md-64 flex-col">
      <h3>Examples</h3>
      <h4 class="mt-16">Red Monochrome</h4>
      <div class="flex flex-col md:flex-row text-center justify-center items-center mt-4">
        <div class="w-full md:w-5/12"><img class="mx-auto" src="~/assets/examples/cover-the-earth.jpg" /></div>
        <div class="w-full md:w-2/12 self-center"><img class="example-arrow w-16 mx-auto" src="~/assets/arrow.svg" /></div>
        <div class="w-full md:w-5/12"><img class="mx-auto" src="~/assets/examples/dither_cover-the-earth.jpg" /></div>
      </div>
      <h4 class="mt-16">Original 8 Color</h4>
      <div class="flex flex-col md:flex-row items-center text-center mt-8 ">
        <div class="w-full md:w-5/12"><img class="mx-auto" src="~/assets/examples/beauty-spot.jpg" /></div>
        <div class="w-full md:w-2/12 self-center"><img class="example-arrow w-16 mx-auto" src="~/assets/arrow.svg" /></div>
        <div class="w-full md:w-5/12"><img class="mx-auto" src="~/assets/examples/beauty-spot-dither.jpg" /></div>
      </div>
      <h4 class="mt-16">RGBY</h4>
      <div class="flex flex-col md:flex-row text-center mt-8 ">
        <div class="w-full md:w-5/12"><img class="mx-auto" src="~/assets/examples/duck.jpg" /></div>
        <div class="w-full md:w-2/12 self-center"><img class="example-arrow w-16 mx-auto" src="~/assets/arrow.svg" /></div>
        <div class="w-full md:w-5/12"><img class="mx-auto" src="~/assets/examples/duck-dither.jpg" /></div>
      </div>
      <h4 class="mt-16">Black & White</h4>
      <div class="flex flex-col md:flex-row items-center">
        <div class="w-full md:w-5/12"><img class="mx-auto" src="~/assets/examples/corolla.jpg" /></div>
        <div class="w-full md:w-2/12 self-center"><img class="example-arrow w-16 mx-auto" src="~/assets/arrow.svg" /></div>
        <div class="w-full md:w-5/12"><img class="mx-auto" src="~/assets/examples/corolla-dither.jpg" /></div>
      </div>                  
    </div>
    
    <div class="mt-32 px-4 border-t border-dashed border-red-500 pt-16 flex mx-2 sm:mx-8 md:mx-16 lg:mx-32 xl:md-64 flex-col md:flex-row">
      
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
export default {
  data() {
    return {

    }
  },
  methods: {
    coffeeClick() {
      console.log('hello');
      fathom('trackGoal', 'ZCRPUIOP', 0)
    },
  }
}
</script>
