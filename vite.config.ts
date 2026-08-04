import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The `define` block that injected process.env.API_KEY / GEMINI_API_KEY was
// removed in the Lyka conversion: it was AI Studio scaffolding and no source
// file ever read either value. `.env.local` and its typo'd duplicate went too.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
