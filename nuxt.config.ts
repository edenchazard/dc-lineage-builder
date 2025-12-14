// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-08',
  ssr: false,
  devtools: { enabled: true },

  app: {
    baseURL: process.env.VITE_BASE_URL || '/',
    head: {
      title: 'Lineage Builder',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A tool for working with Dragon Cave lineages.',
        },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css' /*  './assets/layouts/theming.css' */],

  runtimeConfig: {
    // Server-side only
    clientSecret: process.env.CLIENT_SECRET || '',
    port: parseInt(process.env.PORT || '3000'),
    db: {
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      host: process.env.MYSQL_HOST || '',
      user: process.env.MYSQL_USER || '',
      database: process.env.MYSQL_DATABASE || '',
      password: process.env.MYSQL_PASSWORD || '',
    },
    salt: 'salt',
    // Public (exposed to client)
    public: {
      baseURL: process.env.VITE_BASE_URL || '/',
    },
  },

  vite: {
    css: {
      transformer: 'lightningcss',
    },
    build: {
      cssMinify: 'lightningcss',
    },
  },
  modules: ['@pinia/nuxt'],
});
