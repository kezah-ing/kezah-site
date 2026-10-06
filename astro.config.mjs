import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// The editor (/keystatic) is the only part that runs on a server; every public page is pre-built.
export default defineConfig({
  site: 'https://kezahkayitesi.com',
  output: 'static',
  build: { assets: 'assets' },
  adapter: vercel(),
  integrations: [react(), markdoc(), keystatic(), sitemap({ filter: (p) => !p.includes('/keystatic') })],
  devToolbar: { enabled: false },
});
