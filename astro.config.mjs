import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  outDir: './docs',
  base: '/jagd-app-silbersbach/',
  integrations: [tailwind()],
  vite: {
    build: {
      assetsDir: 'assets',
    }
  }
});
