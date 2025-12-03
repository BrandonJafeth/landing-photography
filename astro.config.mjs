// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.gadeafotografia.com',
  output: 'server', // Habilita SSR para API routes
  
  vite: {
    plugins: [tailwindcss()],
  },

  // @ts-ignore
  adapter: vercel(),

  integrations: [
    react(),
    sitemap(),
  ]
});