import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Repo: albrth647-png/auditwithproof-web → GitHub Pages sirve en /auditwithproof-web/
// Si algún día se muda a dominio propio o Cloudflare Pages, aquí se cambia base ('/').
export default defineConfig({
  site: 'https://albrth647-png.github.io',
  base: '/auditwithproof-web',
  vite: {
    plugins: [tailwindcss()],
  },
});
