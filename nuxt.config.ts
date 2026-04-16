// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui'],

  ssr: false,

  app: {
    head: {
      title: 'Dither it!',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content:
            'Dither it! is a web application for processing images using dithering.'
        },
        { name: 'theme-color', content: '#C53030' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      include: ['rgbquant', 'gifuct-js'],
      force: true
    },
    server: {
      allowedHosts: ['alexs-mac-mini.tail701361.ts.net']
    }
  },

  vue: {
    compilerOptions: {
      // Treat img-comparison-slider as a custom element
      isCustomElement: tag => tag === 'img-comparison-slider'
    }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
