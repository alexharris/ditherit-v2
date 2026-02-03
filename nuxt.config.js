export default {
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    title: 'Dither it!: a web application for dithering images',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'description',
        content: 'Dither it! is a web application for processing images using dithering. Dithering is a process for reducing the number of colors used in an image.'        
      },
      { name: "twitter:site", 
        content: "@alexharris6" 
      },
      { name: "twitter:card", 
        content: "summary" },
      {
        name: "twitter:url",
        content: "https://ditherit.com",
      },
      {
        name: "twitter:title",
        content: "Dither it!",
      },
      {
        name: "twitter:description",
        content: "An image dithering tool.",
      },
      {
        name: "twitter:image",
        content: "https://ditherit.com/_nuxt/img/blueyellow_earth.b4e250b.jpg",
      },      
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        hid: 'fathom',
        innerHTML: `(function(f,a,t,h,o,m){a[h]=a[h]||function(){(a[h].q=a[h].q||[]).push(arguments)};o=f.createElement('script');m=f.getElementsByTagName('script')[0];o.async=1;o.src=t;o.id='fathom-script';m.parentNode.insertBefore(o,m)})(document,window,'//cdn.usefathom.com/tracker.js','fathom');fathom('set','siteId','AHDLJXNJ');fathom('trackPageview');`
      },
      {
        src: '//static.getclicky.com/js',
        async: true,
        'data-id': '101479686'
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa'],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  generate: {
    dir: 'docs'
  }
}


