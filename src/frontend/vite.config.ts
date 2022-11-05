import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
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