// -----------------------------------------------------------------------------
// LYKA. Fresh, human grade dog food, direct to consumer subscription.
//
// Palette source of record: `RFI - Lyka/lyka-rfi/styles/globals.css`, the only
// place in this workspace where Lyka's brand is correctly implemented.
//
// ⚠ Do NOT use `Showcase Accelerator - Lyka` as a colour reference. Despite the
// name it was never actually re-themed: its hero overlay is still SPEED red, its
// config declares only `brand.red`, and its own design review enforces a red
// only palette that would flag Lyka teal as a violation.
//
// Every value below is byte identical to what shipped before the theme container
// existed, so extracting it changed no pixel. The NAMES changed, from hue names
// to role names; `data/brand.ts` maps them back for existing callers.
// -----------------------------------------------------------------------------

import type { ClientTheme } from '../types';

export const lyka: ClientTheme = {
  id: 'lyka',

  identity: {
    client: 'Lyka',
    deckTitle: 'Lyka Audience Accelerator | SPEED',
    logoSrc: '/images/lyka-logo.png',
    logoAlt: 'Lyka',
    // Solid dark teal on transparency, roughly 8.5:1 on the page ground, so it
    // needs no filter. Sized DOWN from the wordmark it replaced: this mark is
    // far wider at equal height and would otherwise collide with the page h1.
    logoHeightClass: 'h-7 md:h-10',
  },

  palette: {
    // Ink
    inkDeepest: '#003D33',
    inkStrong: '#005648',
    ink: '#143C33',
    // 5.44:1 on white, 5.26:1 on the page ground, 5.06:1 on surfaceAlt,
    // 4.82:1 on surfaceSunk. There is no paler legal ink in this palette.
    inkMuted: '#5B6E64',

    // Accent
    accentText: '#0A7D68',
    accent: '#10B193',

    // Warm secondaries. Canonical Lyka Orange and Tangerine measure 2.34:1 and
    // 2.43:1 against white, so neither can carry text. Fill only.
    warm: '#FF886B',
    warmAlt: '#F68B1F',
    warmSoft: '#FEE9DA',

    // Surfaces
    page: '#FFFBED',
    surface: '#FFFFFF',
    surfaceAlt: '#F9F6F1',
    surfaceSunk: '#F0F2E9',

    // Lines
    hairline: '#DBE6DC',
    // 1.88:1 on white, 1.75:1 on surfaceAlt. Misses AA for text AND the 3:1
    // non-text floor. Seven places once used it as a label colour and all seven
    // were moved to `inkMuted`. Asserted to keep FAILING in __integrity 6c, so
    // that the fill/ink boundary is pinned from both sides.
    hairlineSoft: '#A9C3B4',
    borderSubtle: 'rgba(0,86,72,0.08)',

    // Shadows are tinted with the brand dark, never black.
    shadowRgb: '0,86,72',
  },

  typefaces: {
    // BALGIN is Lyka's REAL corporate display face (TYPEHEIST), self hosted from
    // public/fonts. It replaced Poppins on 2026-08-17.
    //
    // ⚠ LICENCE. Every earlier note in this repo recorded Balgin as NOT licensed
    // here, with Poppins standing in as the agreed warm, rounded proxy. The file
    // was supplied for this deck, and serving it from public/ PUBLISHES it, so
    // the grant that matters is web embedding on a publicly reachable host,
    // which is a separate thing from a desktop licence. Confirm that before this
    // ships publicly. Reverting is two lines here plus deleting the woff2.
    //
    // ONE WEIGHT ONLY. The supplied file is 700. Anything asking for 400 or 600
    // in this family gets a SYNTHESISED weight, which reads as a subtly broken
    // Balgin rather than as a missing font, so `displayWeights` pins it.
    display: ['Balgin', 'Inter', 'system-ui', 'sans-serif'],

    // INTER for body, replacing DM Sans on 2026-08-17. Chosen for a more modern,
    // more neutral text face with a large x-height, which is what carries the
    // readability increase in the type scale.
    body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],

    // DM Mono is unchanged: it still carries eyebrows, labels and data.
    mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],

    webfontHref:
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap',

    selfHosted: [
      { family: 'Balgin', src: '/fonts/Balgin-700.woff2', weight: 700 },
    ],

    displayWeights: [700],
  },
};
