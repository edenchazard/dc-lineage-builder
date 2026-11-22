const withTrailingSlash = (value: string) =>
  value.endsWith('/') ? value : `${value}/`;

const env = process.env;
const baseURL = withTrailingSlash(
  env.NUXT_APP_BASE_URL ?? env.VITE_BASE_URL ?? '/',
);

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  modules: ['@pinia/nuxt', '@nuxt/eslint'],

  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Lineage Builder',
    },
  },

  routeRules: {
    '/how-to': { redirect: { to: `${baseURL}tutorial`, statusCode: 302 } },
    '/disclaimer': { redirect: { to: `${baseURL}about`, statusCode: 302 } },
  },

  css: [
    'reset-css',
    '~/assets/styling/style.css',
    '~/assets/layouts/theming.css',
  ],

  vite: {
    css: {
      transformer: 'lightningcss',
    },
  },

  typescript: {
    nodeTsConfig: {
      compilerOptions: {
        types: ['node'],
        paths: {
          // Needed so the `$api` augmentation in app/types/api.d.ts merges with
          // Nuxt's real NuxtApp type instead of declaring an ambient module.
          '#app': ['../node_modules/nuxt/dist/app'],
          '@/*': ['../app/*'],
          '@tests/*': ['../tests/*'],
        },
      },
      // `files` bypasses the generated node config's app exclude.
      files: [
        './types/imports.d.ts',
        './types/nitro-imports.d.ts',
        '../app/types/api.d.ts',
      ],
      include: ['../tests/**/*', '../vitest.config.ts'],
    },
  },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  runtimeConfig: {
    // Matching NUXT_* env vars override these at runtime.
    clientSecret: '',
    lineageHashSalt: 'salt',
    db: {
      host: '',
      port: 3306,
      user: '',
      password: '',
      database: '',
    },
    public: {
      // Docker injects these at build time, so keep the build-time fallback.
      appVersion: env.NUXT_PUBLIC_APP_VERSION ?? env.VITE_VERSION ?? 'dev',
      appCommitSha:
        env.NUXT_PUBLIC_APP_COMMIT_SHA ?? env.VITE_COMMIT_SHA ?? 'unknown',
    },
  },
});
