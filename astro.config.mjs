import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL canonico del sito. Su Netlify `URL` è l'indirizzo principale del sito:
// oggi *.netlify.app, e diventa automaticamente il dominio quando lo colleghi.
// `SITE_URL` permette di forzarlo a mano.
const site = process.env.SITE_URL || process.env.URL || 'https://chiaraguzzone.it';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
