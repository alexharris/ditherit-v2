<template>
    <div class="flex flex-col w-full container px-4 lg:px-16 lg:w-2/3 mx-auto text-red-700 mb-20 items-start">
        <div class="flex flex-col md:flex-row items-center justify-between w-full">
            <h1 class="text-3xl text-left uppercase order-2 md:order-1">
                Dither Resources
            </h1>
            <div class="w-48 order-1 md:order-2">
                <a href="https://ditherit.com"><Logo /></a>
            </div>
        </div>
        <hr />
        <p class="text-lg my-8">A list of dithering resources from around the internet.</p>
        <h2><a href="https://surma.dev/things/ditherpunk/index.html">Ditherpunk — The article I wish I had about monochrome image dithering</a></h2>
        <p>A great, comprehensive and technical run-down of many different dithering methods.</p>
        <h2><a href="https://solar.lowtechmagazine.com/about.html">Low-tech Magazine Solar Website</a></h2>
        <p>The inspiration for Dither it!, this page discusses Low-tech Magazine's decision to use dithered images on the solar powered version of their site.</p>  
        <h2><a href="http://leeoniya.github.io/RgbQuant.js/demo/">RgbQuant.js</a></h2>
        <p>The quantization library that powers Dither it!</p>      
        <h2><a href="https://github.com/ibezkrovnyi/image-quantization">Image-q</a></h2>
        <p>A fork of RgbQuant.js with some additional features. Dither it! might switch to this at some point.</p>
        <h2><a href="https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html">Image Dithering: Eleven Algorithms and Source Code</a></h2>
        <p>A helpful artcile with great examples an in-depthinfo.</p>      
        <h2><a href="https://doodad.dev/dither-me-this/">Dither me this</a></h2>
        <p>A site very similar to Dither it!</p>     
        <h2><a href="https://legacy.imagemagick.org/Usage/quantize/">Image dithering with ImageMagick</a></h2>
        <p>ImageMagick has some robust looking quantization and dithering functionality.</p> 
        <h2><a href="https://www.php.net/manual/en/function.imagetruecolortopalette.php">PHP imagetruecolortopalette</a></h2>
        <p>A PHP function for very simple image dithering.</p>                 
        <div class="my-12 bg-red-200 p-4 rounded shadow w-full flex flex-row items-center text-xl">
            <svg class="pr-4 w-1/2 md:w-auto" xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 24 24" fill="none" stroke="#c53030" stroke-width="2" stroke-linecap="round" stroke-linejoin="bevel"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <p>Something missing from this list? <a href="https://twitter.com/alexharris6"> Tweet me @alexharris6</a>.</p>
        </div>                         
    <!-- Fathom - simple website analytics - https://usefathom.com -->
    <script>
      ;(function(f, a, t, h, o, m) {
        a[h] =
          a[h] ||
          function() {
            ;(a[h].q = a[h].q || []).push(arguments)
          }
        ;(o = f.createElement('script')),
          (m = f.getElementsByTagName('script')[0])
        o.async = 1
        o.src = t
        o.id = 'fathom-script'
        m.parentNode.insertBefore(o, m)
      })(document, window, '//cdn.usefathom.com/tracker.js', 'fathom')
      fathom('set', 'siteId', 'AHDLJXNJ')
      fathom('trackPageview')
    </script>
    <!-- / Fathom -->
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
 head: {
    title: 'Dithering Resources - Dither it!',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'Dither resources',
        name: 'Resources about dithering',
        content: 'Links to various pages on the internet dealing with dithering'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },    
  components: {
    Logo,
  },
  data() {
    return {

    }
  },
  computed: {

  },
  methods: {


  }
}
</script>

<style scoped>
img {
    @apply max-w-full;
}

p {
    @apply pb-4;
}

h2 {
    @apply text-xl;
}

h4 {
    @apply pb-6;
}

a {
    /* @apply font-bold; */
}

a:hover {
    @apply text-red-800 ;
}

hr {
    @apply border-b border-red-700 my-4 w-full;
}

</style>
