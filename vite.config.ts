import { fileURLToPath } from 'node:url';

import { defineConfig, loadEnv } from 'vite';

import vue from '@vitejs/plugin-vue';
import { configDefaults } from 'vitest/config';

export default ({ mode }: { mode: string }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // Proxy keys are matched against the full URL, before Vite strips the base.
  const base = (env.VITE_BASE_URL ?? '').replace(/\/$/, '');

  return defineConfig({
    // essential so that vite can figure out the env during build
    envDir: '..',
    root: 'app',
    base: env.VITE_BASE_URL ?? 'test',
    server: {
      proxy: {
        [`${base}/api`]: {
          target: 'http://app:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url)),
        '@tests': fileURLToPath(new URL('./tests', import.meta.url)),
      },
    },
    css: {
      transformer: 'lightningcss',
    },
    build: {
      outDir: '../dist',
      cssMinify: 'lightningcss',
    },
    test: {
      dir: fileURLToPath(new URL('./tests', import.meta.url)),
      environment: 'happy-dom',
      exclude: [...configDefaults.exclude, '**/e2e/**'],
      coverage: {
        reportsDirectory: '../coverage',
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            include: ['unit/**/*.spec.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'integration',
            include: ['integration/**/*.spec.ts'],
            setupFiles: ['./backend/commands/databaseFresh.ts'],
          },
        },
      ],
    },
  });
};
