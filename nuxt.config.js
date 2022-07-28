export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Dither it!: a web application for dithering images',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Dither it! is a web application for processing images using dithering. Dithering is a process for reducing the number of colors used in an image.'        
      },
      { name: "twitter:site", content: "@alexharris6" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        hid: "twitter:url",
        name: "twitter:url",
        content: "https://ditherit.com",
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: "Dither it!",
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: "An image dithering tool.",
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: "https://ditherit.com/_nuxt/img/blueyellow_earth.b4e250b.jpg",
      },      
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    
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


