import { defineConfig, loadEnv } from 'vite';

import vue from '@vitejs/plugin-vue';

export default ({ mode }: { mode: string }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    // essential so that vite can figure out the env during build
    envDir: '..',
    root: 'app',
    base: env.VITE_BASE_URL ?? 'test',
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '0.0.0'),
      __APP_COMMIT_SHA__: JSON.stringify(env.VITE_APP_COMMIT_SHA || 'unknown'),
    },
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
  });
};
