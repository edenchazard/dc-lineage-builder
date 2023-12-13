import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';

export default ({ mode }: { mode: string }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    root: 'app',
    base: env.VITE_APP_URL,
    server: {
      proxy: {
        ['^' + env.VITE_APP_URL + 'api']: {
          target: 'http://app:3000',
          changeOrigin: true,
        },
      },
    },
    plugins: [vue(), legacy()],
  });
};
