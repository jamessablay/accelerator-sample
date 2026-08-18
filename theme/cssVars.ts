// -----------------------------------------------------------------------------
// THE :root BLOCK, DERIVED.
//
// This used to be seventeen hand written custom properties in index.html with a
// comment reading "MIRRORS the LYKA object in data/brand.ts. Change both
// together." Nothing enforced that, and nothing could: the palette module is
// plain TS and the mirror was HTML.
//
// It is generated from the active theme now, so the two cannot disagree. There
// is no check to run and no discipline to remember, because there is no longer a
// second copy to drift.
//
// The output is injected into index.html's <head> by the Vite plugin in
// vite.config.ts, in BOTH dev and build. It has to be an inline <style> in head
// rather than part of the main stylesheet: the page ground and body ink are
// painted from these variables, and a <link> stylesheet resolves after first
// paint, which would flash the browser default white behind a cream deck.
//
// NAMING. The prefix is `--brand-`, not `--lyka-`. A variable named after one
// client in a system whose whole purpose is to be re-skinned per client is the
// exact class of thing this refactor exists to remove.
// -----------------------------------------------------------------------------

import { ELEVATION, NAV_BG, ease, palette, theme } from './index';
import { AGENCY, RADIUS } from './house';

/** `--brand-*` name for each palette role. Keep in step with styles/app.css. */
const PALETTE_VARS: Array<[string, string]> = [
  ['--brand-ink-deepest', palette.inkDeepest],
  ['--brand-ink-strong', palette.inkStrong],
  ['--brand-ink', palette.ink],
  ['--brand-ink-muted', palette.inkMuted],
  ['--brand-accent-text', palette.accentText],
  ['--brand-accent', palette.accent],
  ['--brand-warm', palette.warm],
  ['--brand-warm-alt', palette.warmAlt],
  ['--brand-warm-soft', palette.warmSoft],
  ['--brand-page', palette.page],
  ['--brand-surface', palette.surface],
  ['--brand-surface-alt', palette.surfaceAlt],
  ['--brand-surface-sunk', palette.surfaceSunk],
  ['--brand-hairline', palette.hairline],
  ['--brand-hairline-soft', palette.hairlineSoft],
  ['--brand-border', palette.borderSubtle],
  // Chrome. Derived, not authored: see NAV_BG in theme/index.ts.
  ['--brand-nav-bg', NAV_BG],
];

/** Quote a family name only when it contains a space, as CSS requires. */
const quote = (f: string): string => (/\s/.test(f) ? `'${f}'` : f);

/**
 * `@font-face` rules for the client's self hosted faces.
 *
 * These go in the head alongside the variables rather than in the compiled
 * stylesheet, so the browser can start fetching the face during head parsing
 * instead of after the stylesheet resolves.
 */
const renderFontFaces = (): string =>
  (theme.typefaces.selfHosted ?? [])
    .map(
      (f) => `
    @font-face {
      font-family: '${f.family}';
      src: url('${f.src}') format('woff2');
      font-weight: ${f.weight};
      font-style: ${f.style ?? 'normal'};
      font-display: ${f.display ?? 'swap'};
    }`,
    )
    .join('\n');

/**
 * Render the `<style>` contents for the document head.
 *
 * Includes the two paint critical base rules (`html, body`) alongside the
 * variables, for the flash reason above: shipping the variables without the
 * rule that uses them would still leave first paint on the browser default.
 */
export const renderThemeCss = (): string => {
  const vars = [
    ...PALETTE_VARS,
    ['--brand-shadow-sm', ELEVATION.sm],
    ['--brand-shadow-md', ELEVATION.md],
    ['--brand-shadow-lg', ELEVATION.lg],
    ['--brand-shadow-xl', ELEVATION.xl],
    ['--brand-radius-control', RADIUS.control],
    ['--brand-radius-card', RADIUS.card],
    ['--brand-radius-surface', RADIUS.surface],
    ['--brand-ease', ease],
    ['--agency-red', AGENCY.red],
  ]
    .map(([name, value]) => `      ${name}: ${value};`)
    .join('\n');

  // Pin headings to a weight the display family actually ships. A single weight
  // file asked for 600 gets a SYNTHESISED weight: the browser smears the
  // outlines, which reads as a subtly broken version of the real face rather
  // than as a missing font, so it survives review.
  const displayWeight = theme.typefaces.displayWeights?.length
    ? Math.max(...theme.typefaces.displayWeights)
    : null;

  return `${renderFontFaces()}

    :root {
${vars}
    }

    html, body {
      font-family: ${theme.typefaces.body.map(quote).join(', ')};
      color: var(--brand-ink);
      background: var(--brand-page);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
${
  displayWeight
    ? `
    /* The display family ships ${theme.typefaces.displayWeights!.join(', ')} and nothing else,
       so anything set in it is pinned to a weight that exists. Scoped to h1 and
       the explicit utility: h2 to h6 are Inter and carry their own weights. */
    h1, .font-display {
      font-weight: ${displayWeight};
    }`
    : ''
}
  `.trim();
};

/**
 * Font `<link>`s for the head: preloads for self hosted faces, then the CDN
 * stylesheet if there is one.
 *
 * The preloads matter more than they look. A self hosted face is only
 * DISCOVERED when the `@font-face` rule is parsed and only FETCHED when
 * something on the page actually uses it, so a display face lands late and the
 * headings visibly swap after first paint. Preloading starts the fetch during
 * head parsing instead. `crossorigin` is required even for a same origin font:
 * fonts are always fetched in CORS mode, and without it the preload does not
 * match the later request and the file is fetched twice.
 */
export const renderFontLinks = (): string => {
  const out: string[] = [];

  for (const face of theme.typefaces.selfHosted ?? []) {
    out.push(
      `<link rel="preload" as="font" type="font/woff2" href="${face.src}" crossorigin />`,
    );
  }

  const href = theme.typefaces.webfontHref;
  if (href) {
    out.push(
      '<link rel="preconnect" href="https://fonts.googleapis.com" />',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
      `<link rel="stylesheet" href="${href}" />`,
    );
  }

  return out.join('\n    ');
};
