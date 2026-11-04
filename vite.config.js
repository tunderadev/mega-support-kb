// Build harness for the kb export. The export ships only src/; this file, package.json,
// src/app.html and src/routes/+layout.js are what it takes to render the pages.
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ pages: 'build', assets: 'build', strict: true }),
      extensions: ['.svelte', '.svx'],
      preprocess: [
        mdsvex({
          extensions: ['.svx'],
          layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) },
        }),
      ],
      prerender: { entries: ['/kb'], handleHttpError: 'fail' },
    }),
  ],
});
