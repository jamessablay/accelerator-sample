// -----------------------------------------------------------------------------
// THE ACTIVE THEME.
//
// This is the one line a new client deck changes.
//
//   import { lyka } from './clients/lyka';
//   export const theme = lyka;          <-  swap this
//
// Everything downstream derives from `theme`:
//   theme/cssVars.ts        -> the :root custom properties, injected into
//                              index.html by the Vite plugin
//   theme/tailwindPreset.ts -> the Tailwind scale (colours, type, radii, motion)
//   data/brand.ts           -> the five derived colour systems + a compatibility
//                              export under the old literal token names
//   worker/index.ts         -> the login page
//
// So a palette value now lives in exactly ONE place. Before the container, the
// same fourteen hexes were maintained by hand in three files that nothing
// checked against each other: the palette module, a `:root` mirror, and a
// Tailwind colour namespace that turned out to be entirely unused.
//
// Constraints, inherited by everything in this folder: no React, no DOM types,
// literal values only. This module is loaded by the browser, the Cloudflare
// Worker (which has no DOM lib), Tailwind's config loader and the Vite config,
// so anything environment specific here breaks at least one of them.
// -----------------------------------------------------------------------------

import { lyka } from './clients/lyka';
import { darken } from './contrast';
import {
  ELEVATION_ALPHA,
  ELEVATION_SHAPE,
  MOTION,
  type ElevationToken,
} from './house';
import type { ClientTheme } from './types';

/** The client this deck is for. Swap this line to re-skin. */
export const theme: ClientTheme = lyka;

/** Shorthand, because palette is by far the most read part of the theme. */
export const palette = theme.palette;

/** The easing curve in force: the house one unless the client overrides it. */
export const ease = theme.easeOverride ?? MOTION.ease;

/**
 * How far the sidebar ground sits below the brand's darkest ink.
 *
 * 0.475 is solved, not picked. It is the point where the derived ground holds
 * the active pill above the 3:1 non-text floor with real headroom (3.39:1 for
 * Lyka) while still reading as a brand tone rather than as black. Raising it
 * walks back toward the flat black this replaced; lowering it starts eating the
 * selected state, which is the failure nobody notices until they are presenting.
 */
const NAV_DARKEN = 0.475;

/**
 * The sidebar ground. Derived from the client's darkest ink unless overridden.
 *
 * The sidebar is SPEED house chrome and stays a dark, recessive surface. What
 * changed is that it is now the CLIENT'S dark rather than a flat #000, so the
 * deck's furniture belongs to the brand without competing with the content.
 */
export const NAV_BG = palette.navBg ?? darken(palette.inkDeepest, NAV_DARKEN);

/**
 * Elevation, composed: house SHAPE plus the client's shadow TINT.
 *
 * Kept as finished CSS strings because both Chart.js and inline styles consume
 * them directly and neither can resolve a custom property.
 */
export const ELEVATION = (Object.keys(ELEVATION_SHAPE) as ElevationToken[]).reduce(
  (acc, key) => {
    acc[key] = `${ELEVATION_SHAPE[key]} rgba(${palette.shadowRgb},${ELEVATION_ALPHA[key]})`;
    return acc;
  },
  {} as Record<ElevationToken, string>,
);

export * from './house';
export * from './contrast';
export type { ClientTheme, Palette, Typefaces, Identity } from './types';
