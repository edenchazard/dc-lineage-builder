import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/config';

export default ({ mode }: { mode: string }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    // essential so that vite can figure out the env during build
    envDir: '..',
    root: 'app',
    build: {
      outDir: '../dist',
    },
    base: env.VITE_APP_URL ?? '',
    server: {
      proxy: {
        [env.VITE_API_URL ?? '/api']: {
          target: 'http://app:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [vue()],
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      coverage: {
        reportsDirectory: '../coverage',
      },
    },
  });
};
