// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n'
  ],
  // plugins: ['~/plugins/bus'],
  //css: ['~/assets/css/main.css', '~/assets/sass/normalize.scss', '~/assets/sass/main.scss'],
  css: ['~/assets/sass/main.scss'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    plugins: ["../server/plugins/mongodb.ts"],
    externals: {},
  },
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' },
      { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr.json' }
    ],
    pages: {
      admin: false
    },
    defaultLocale: 'en',
    langDir: 'locales/',

    strategy: 'prefix_except_default',
    // → https://mellowresort.com/
    // → https://mellowresort.com/es/
    // → https://mellowresort.com/fr/

    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'lang',
      redirectOn: 'root', 
    }
  },
  runtimeConfig: {
    ///mode
    mode: process.env.MODE,
    // mongodbUri
    mongodbUri: process.env.MONGO_URI,

    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      //gtmId: 'GTM-N3484GLZ'
    },
    vercelBlobToken: process.env.BLOB_READ_WRITE_TOKEN,
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  experimental: {
    headNext: true,
    inlineSSRStyles: false
  },
  devServer: {
    port: 3001,
  }
})
