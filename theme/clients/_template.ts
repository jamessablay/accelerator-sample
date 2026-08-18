// -----------------------------------------------------------------------------
// NEW CLIENT TEMPLATE.
//
// Copy this file to `<client>.ts`, fill it in, then point `theme/index.ts` at it.
// That is the whole re-skin as far as the design system is concerned.
//
// This file is NOT imported by anything. It exists so that adding a client is a
// fill-in-the-blanks exercise against a contract rather than an archaeology
// exercise against the last client's deck.
//
// -----------------------------------------------------------------------------
// THE ONLY RULE THAT WILL BITE YOU
// -----------------------------------------------------------------------------
//
// `data/__integrity.ts` enforces hard contrast floors on every load in dev, and
// several of them are not obvious. Get these right here and the rest of the app
// follows; get them wrong and the console will tell you, loudly, on first load.
//
//   inkMuted      MUST clear 4.5:1 on page, surface, surfaceAlt AND surfaceSunk.
//                 It is the palest legal ink in the system. There is deliberately
//                 nothing below it: if something must read quiet, make it smaller
//                 or lighter in weight, never fainter.
//
//   hairlineSoft  MUST STAY BELOW 3:1 on white. This check is INVERTED, and it
//                 is the one that surprises people. The token is fill, border and
//                 stroke only, and the assertion exists so nobody "fixes" it into
//                 an ink by darkening it.
//
//   accentText    MUST clear 4.5:1 on `page`. This is the accent used for TEXT.
//   accent        Is NOT required to, because it is fills, rings and dividers.
//                 Most brand accents fail text contrast; that is why there are
//                 two of them rather than one.
//
// Check a candidate before committing to it:
//
//   import { contrast } from '../contrast';
//   contrast('#5B6E64', '#FFFBED');   // => 5.26
//
// -----------------------------------------------------------------------------

import type { ClientTheme } from '../types';

export const templateClient: ClientTheme = {
  id: 'template',

  identity: {
    client: 'Client Name',
    deckTitle: 'Client Name Audience Accelerator | SPEED',
    // Drop the wordmark in public/images/. Prefer a transparent PNG or SVG dark
    // enough to sit on `page` without a filter.
    logoSrc: '/images/client-logo.png',
    logoAlt: 'Client Name',
    // MEASURE THIS, do not copy it. The wordmark is absolutely positioned top
    // right on every page, and a wide mark at the same height as a compact one
    // collides with the page h1. Lyka's had to be reduced from the deck it was
    // copied from for exactly this reason.
    logoHeightClass: 'h-7 md:h-10',
  },

  palette: {
    // Ink, darkest to lightest.
    inkDeepest: '#000000',
    inkStrong: '#000000',
    ink: '#000000',
    inkMuted: '#000000', // see the 4.5:1 rule above

    // Accent. Two, not one: see the note above.
    accentText: '#000000', // 4.5:1 on `page`
    accent: '#000000', // fills, rings, dividers

    // Warm or secondary hues. Fill only unless you have measured otherwise.
    warm: '#000000',
    warmAlt: '#000000',
    warmSoft: '#FFFFFF',

    // Surfaces, lightest first.
    page: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#FFFFFF',
    surfaceSunk: '#FFFFFF',

    // Lines.
    hairline: '#EEEEEE',
    hairlineSoft: '#EEEEEE', // must STAY under 3:1 on white
    borderSubtle: 'rgba(0,0,0,0.08)',

    // Shadow tint as a bare r,g,b triple. house.ts varies the alpha per step.
    // Use the brand's own dark rather than black: it is most of what makes a
    // shadow read as belonging to the palette.
    shadowRgb: '0,0,0',
  },

  typefaces: {
    // Three roles. `display` carries headings, `body` is the document default,
    // `mono` is eyebrows, labels and data.
    //
    // Always keep a real fallback stack: `webfontHref` is a network request and
    // a client network can block it.
    display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    body: ['DM Sans', 'system-ui', 'sans-serif'],
    mono: ['DM Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
    // Set to null if the faces are self hosted or system.
    webfontHref: null,
  },
};
