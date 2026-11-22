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

  // Keep the strictness level of the original project. Customise the generated
  // configs here rather than maintaining a separate root tsconfig file.
  typescript: {
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: false,
      },
    },
    sharedTsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: false,
      },
    },
    nodeTsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: false,
        types: ['node'],
        paths: {
          // Needed so the `$api` augmentation in app/types/api.d.ts merges with
          // Nuxt's real NuxtApp type instead of declaring an ambient module.
          '#app': ['../node_modules/nuxt/dist/app'],
          '@/*': ['../app/*'],
          '@tests/*': ['../tests/*'],
        },
      },
      // Tests import source files that call Nuxt auto-imports (`useNuxtApp`,
      // `useRuntimeConfig`). They only need the generated global types — not
      // runtime stubs — because those calls happen inside API handlers that
      // the tests never invoke. `files` avoids the generated app exclude.
      files: [
        './types/imports.d.ts',
        './types/nitro-imports.d.ts',
        '../app/types/api.d.ts',
      ],
      include: ['../tests/**/*', '../vitest.config.ts'],
    },
  },

  nitro: {
    preset: 'node-server',
    experimental: {
      tasks: true,
    },
    typescript: {
      tsConfig: {
        compilerOptions: {
          noUncheckedIndexedAccess: false,
        },
      },
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
