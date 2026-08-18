import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

import { renderFontLinks, renderThemeCss } from './theme/cssVars';
import { theme } from './theme';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Inject the client theme into index.html at transform time.
 *
 * THE POINT: index.html carries no brand values at all now. The palette, the
 * webfont URL and the document title are all read from the theme container, in
 * dev and in build alike, so re-skinning the deck cannot leave a stale hex or
 * the previous client's fonts loading behind the new ones.
 *
 * The variables have to be an inline <style> rather than part of the compiled
 * stylesheet because that stylesheet is itself generated from them. Custom
 * property resolution happens after the cascade, so declaration order between
 * the two does not matter.
 */
const themeHtml = (): Plugin => ({
  name: 'speed-accelerator-theme',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html
        .replace('<!--@theme:title-->', theme.identity.deckTitle)
        .replace('<!--@theme:fonts-->', renderFontLinks())
        .replace('<!--@theme:css-->', `<style>\n${renderThemeCss()}\n    </style>`),
  },
});

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), themeHtml()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    // The deck was one 718 kB chunk, every page and every chart eagerly loaded
    // to render a landing page that uses neither. Pages are React.lazy now; this
    // splits the two heavy shared libraries out of the entry so they are fetched
    // once and cached, rather than re-bundled into whichever page chunk happens
    // to reach them first.
    rollupOptions: {
      output: {
        // A FUNCTION, not the object form. The object form matches bare
        // specifiers, and the app imports `react-dom/client`, so `'react-dom'`
        // matched nothing and ~130 kB of React DOM stayed in the entry chunk
        // while the "react" chunk came out at 11 kB. Matching on the resolved
        // path catches every subpath.
        //
        // Chart.js is deliberately NOT listed. Only three of the seven pages
        // touch it, and Rollup already gives shared dynamic dependencies their
        // own chunk; naming it here instead promoted it into the entry's static
        // graph, which made Vite emit a <link modulepreload> for all 184 kB of
        // it on a landing page that draws no charts at all.
        manualChunks: (id) =>
          id.includes('node_modules/react-dom') || id.includes('node_modules/react/')
            ? 'react'
            : undefined,
      },
    },
  },
});
