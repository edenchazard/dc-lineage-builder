import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { configDefaults } from 'vitest/config';

export default ({ mode }: { mode: string }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    root: 'app',
    build: {
      outDir: '../dist',
    },
    base: env.VITE_APP_URL,
    server: {
      proxy: {
        [env.VITE_APP_URL + 'api']: {
          target: 'http://app:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [vue(), legacy()],
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      coverage: {
        reportsDirectory: '../coverage',
      },
    },
  });
};
