// -----------------------------------------------------------------------------
// Tailwind config. Deliberately almost empty.
//
// Everything meaningful is DERIVED from the theme container, so this file has
// nothing to keep in sync with anything. Re-skinning the deck does not touch it.
//
// The one rule worth restating from the old inline config, because it is still
// true and still easy to get wrong while tidying: use `theme.extend`, never
// `theme`. Replacing `theme.colors` wholesale would drop Tailwind's default
// palette and break every remaining `text-gray-*` and `bg-white` in the app.
// `tailwindPreset` only ever writes into `extend`.
// -----------------------------------------------------------------------------

import type { Config } from 'tailwindcss';
import { tailwindPreset } from './theme/tailwindPreset';

export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './theme/**/*.{ts,tsx}',
  ],
  theme: tailwindPreset.theme,
  plugins: [],
} satisfies Config;
