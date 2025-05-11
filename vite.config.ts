import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default () => {
  return defineConfig({
    // essential so that vite can figure out the env during build
    envDir: '..',
    root: 'app',
    base: './',
    server: {
      proxy: {
        './api': {
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
