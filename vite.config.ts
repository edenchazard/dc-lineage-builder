import { defineConfig, loadEnv } from 'vite';

import vue from '@vitejs/plugin-vue';
import { configDefaults } from 'vitest/config';

export default ({ mode }: { mode: string }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    // essential so that vite can figure out the env during build
    envDir: '..',
    root: 'app',
    base: env.VITE_BASE_URL ?? 'test',
    server: {
      proxy: {
        api: {
          target: 'http://app:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [vue()],
    css: {
      transformer: 'lightningcss',
    },
    build: {
      outDir: '../dist',
      cssMinify: 'lightningcss',
    },
    test: {
      setupFiles: ['./app/backend/commands/databaseFresh.ts'],
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      coverage: {
        reportsDirectory: '../coverage',
      },
    },
  });
};
