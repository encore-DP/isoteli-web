// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://isoteli.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/detalle-producto'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  image: {
    // Autoriza la optimización de imágenes remotas provenientes de WordPress Headless y CDN
    remotePatterns: [{ protocol: 'https' }],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
