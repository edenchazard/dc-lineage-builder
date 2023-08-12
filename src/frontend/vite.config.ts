import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';

export default ({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: env.VITE_APP_URL,
    css: {
      postcss: {
        plugins: [autoprefixer(), postcssNesting()],
      },
    },
    server: {
      proxy: {
        '^/api': {
          target: 'http://api',
          changeOrigin: true,
        },
      },
    },
    plugins: [vue(), legacy()],
  });
};
