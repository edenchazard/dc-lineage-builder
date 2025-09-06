export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint'
  ],
  css: [
    'reset-css',
    '~/assets/styling/style.css',
    '~/assets/layouts/theming.css'
  ],
  // Use default TypeScript configuration
  typescript: {
    strict: true
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    clientSecret: process.env.CLIENT_SECRET || '',
    mysqlPort: parseInt(process.env.MYSQL_PORT || '3306'),
    mysqlHost: process.env.MYSQL_HOST || '',
    mysqlUser: process.env.MYSQL_USER || '',
    mysqlDatabase: process.env.MYSQL_DATABASE || '',
    mysqlPassword: process.env.MYSQL_PASSWORD || '',
    // Public keys (exposed to client-side)
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || '/'
    }
  },
  nitro: {
    ignore: ['app/**']
  },
  ignore: ['app/**']
})