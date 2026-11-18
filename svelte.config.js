import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // SPA-modus: appen er klient-only (ssr=false i +layout.js) og lagrer i
    // localStorage → ingen server. fallback gir én HTML som alle ruter laster.
    adapter: adapter({ fallback: 'index.html' }),
    // EduProstir віддає тренажер зі сторінки /cad/: BASE_PATH=/cad npm run build.
    paths: { base: process.env.BASE_PATH ?? '' }
  }
};

export default config;
