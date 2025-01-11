import { mergeConfig, configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig({ mode: 'test' }),
  defineConfig({
    test: {
      setupFiles: ['./app/backend/commands/databaseFresh.ts'],
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      coverage: {
        reportsDirectory: '../coverage',
      },
    },
  }),
);
