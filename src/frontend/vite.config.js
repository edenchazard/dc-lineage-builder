import { createVuePlugin as vue } from "vite-plugin-vue2";
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    base: env.VITE_APP_URL,
    server: {
      proxy: {
        '^/api': {
            target: 'http://api',
            changeOrigin: true
        }
      }
    },
    plugins: [vue()]
  });
};