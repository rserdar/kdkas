// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.kdkasansor.com',
  integrations: [
    icon(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      customPages: [],
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/Legacy/'),
      serialize(item) {
        if (item.url === 'https://www.kdkasansor.com/') {
          return { ...item, changefreq: 'daily', priority: 1.0 };
        }
        if (
          item.url.includes('/asansor-tipleri/') ||
          item.url.includes('/modeller/') ||
          item.url.includes('/servisler/')
        ) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        return { ...item, priority: 0.6 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
