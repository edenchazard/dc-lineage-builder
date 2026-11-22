const withTrailingSlash = (value: string) =>
  value.endsWith('/') ? value : `${value}/`;

const env = process.env;
const baseURL = withTrailingSlash(
  env.NUXT_APP_BASE_URL ?? env.VITE_BASE_URL ?? '/',
);

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  ssr: true,

  modules: ['@pinia/nuxt'],

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
    build: {
      cssMinify: 'lightningcss',
    },
  },

  nitro: {
    preset: 'node-server',
  },

  hooks: {
    'prepare:types': ({
      tsConfig,
      serverTsConfig,
      nodeTsConfig,
      sharedTsConfig,
    }) => {
      // Keep the strictness level of the original project while still using
      // Nuxt's generated project references.
      for (const config of [
        tsConfig,
        serverTsConfig,
        nodeTsConfig,
        sharedTsConfig,
      ]) {
        config.compilerOptions ??= {};
        config.compilerOptions.noUncheckedIndexedAccess = false;
      }
    },
    'nitro:config': (nitroConfig) => {
      nitroConfig.typescript ??= {};
      nitroConfig.typescript.tsConfig ??= {};
      nitroConfig.typescript.tsConfig.compilerOptions ??= {};
      nitroConfig.typescript.tsConfig.compilerOptions.noUncheckedIndexedAccess = false;
    },
  },

  runtimeConfig: {
    // Private (server-only) values. Override at runtime with NUXT_ prefixed env vars.
    clientSecret: env.NUXT_CLIENT_SECRET ?? env.CLIENT_SECRET ?? '',
    lineageHashSalt:
      env.NUXT_LINEAGE_HASH_SALT ?? env.LINEAGE_HASH_SALT ?? 'salt',
    db: {
      host: env.NUXT_DB_HOST ?? env.MYSQL_HOST ?? '',
      port: Number(env.NUXT_DB_PORT ?? env.MYSQL_PORT ?? 3306),
      user: env.NUXT_DB_USER ?? env.MYSQL_USER ?? '',
      password: env.NUXT_DB_PASSWORD ?? env.MYSQL_PASSWORD ?? '',
      database: env.NUXT_DB_DATABASE ?? env.MYSQL_DATABASE ?? '',
    },

    public: {
      appVersion: env.NUXT_PUBLIC_APP_VERSION ?? env.VITE_VERSION ?? 'dev',
      appCommitSha:
        env.NUXT_PUBLIC_APP_COMMIT_SHA ?? env.VITE_COMMIT_SHA ?? 'unknown',
    },
  },
});
