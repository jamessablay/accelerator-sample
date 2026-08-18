// -----------------------------------------------------------------------------
// THE CLIENT THEME CONTRACT.
//
// Everything a new client deck has to supply, and nothing it does not. Adding a
// client is one file in theme/clients/ that satisfies this interface, plus one
// line in theme/index.ts. Everything downstream (the CSS custom properties, the
// Tailwind scale, the Worker login page, every chart) derives from it.
//
// THE NAMES HERE ARE SEMANTIC, NOT LITERAL, and that is the whole point of the
// container. The previous system named its tokens after Lyka's actual hues
// (`tealDeepest`, `mint`), which reads as nonsense the moment a client's brand
// is red: you end up with `tealDeepest: '#8B0000'`. A role name survives a
// re-skin; a hue name does not.
//
// `data/brand.ts` still exports the old literal names as a compatibility layer,
// so the ~48 files importing `LYKA` keep working unchanged. New code should
// prefer the semantic names from here.
//
// Constraints: no React, no DOM types, literal values only.
// -----------------------------------------------------------------------------

/**
 * The core palette. Every value is a role, and the comment on each says what it
 * is allowed to be used FOR, because several of these are legal as a fill and
 * illegal as text.
 */
export interface Palette {
  // --- Ink, darkest to lightest -------------------------------------------
  /** Darkest brand ink. Page chrome, dark bands, primary headings. */
  inkDeepest: string;
  /** Strong brand ink. Dark blocks and secondary chrome. */
  inkStrong: string;
  /** Body ink. The default text colour of the app. */
  ink: string;
  /**
   * The PALEST LEGAL INK in the system. Must clear AA 4.5:1 on `page`,
   * `surface`, `surfaceAlt` and `surfaceSunk`.
   *
   * There is deliberately nothing below this. If something needs to read as
   * quiet, make it SMALLER or LIGHTER IN WEIGHT, never fainter. Asserted from
   * both sides in data/__integrity.ts.
   */
  inkMuted: string;

  // --- Accent --------------------------------------------------------------
  /** Accent for TEXT on a light surface. Must clear AA 4.5:1 on `page`. */
  accentText: string;
  /**
   * Bright accent. Fills, focus rings, dividers, chart series.
   * NOT for text on a light surface: it is typically under 3:1 there.
   */
  accent: string;

  // --- Warm secondaries ----------------------------------------------------
  /** Warm secondary. Fill only unless measured. */
  warm: string;
  /** Second warm secondary. Fill only unless measured. */
  warmAlt: string;
  /** Palest warm. A tint, safe behind dark ink. */
  warmSoft: string;

  // --- Surfaces, lightest first --------------------------------------------
  /** The page ground. */
  page: string;
  /** Cards and panels that sit on the page. Usually white. */
  surface: string;
  /** A slightly deeper surface for nested panels and image mats. */
  surfaceAlt: string;
  /** Deeper still. Sunken wells, table stripes, inert chips. */
  surfaceSunk: string;

  // --- Lines ---------------------------------------------------------------
  /** Hairline border. This system uses borders where others use shadows. */
  hairline: string;
  /**
   * Softer hairline. **FILL, BORDER AND STROKE ONLY. NEVER INK.**
   * Typically under the 3:1 non-text floor, so it cannot carry a label, an axis
   * value, or an icon that means something.
   */
  hairlineSoft: string;
  /** Very subtle border, expressed as rgba so it composites on any surface. */
  borderSubtle: string;

  // --- Shadow --------------------------------------------------------------
  /**
   * The shadow tint as a bare `r,g,b` triple, e.g. `'0,86,72'`.
   *
   * A triple rather than a finished shadow string because theme/house.ts owns
   * the elevation SHAPE and varies alpha per step. Shadows in this system are
   * tinted with the brand's own dark, never black.
   */
  shadowRgb: string;

  // --- Chrome --------------------------------------------------------------
  /**
   * OPTIONAL. The sidebar ground.
   *
   * Omit it and the theme derives `darken(inkDeepest, 0.475)`, which holds the
   * brand hue and drops the value, so any client gets a sidebar that is
   * unmistakably theirs without anyone choosing a hex. Set it only to override.
   *
   * ⚠ THE CONSTRAINT THAT DECIDES THIS VALUE IS NOT LEGIBILITY, IT IS THE ACTIVE
   * PILL. The nav's selected item is filled with `accentText`, so the lighter
   * this ground becomes the LESS that pill separates from it. Against pure black
   * the pill sits at 4.15:1; the derived Lyka value holds 3.39:1; a mid tone
   * brand teal would drop it under the 3:1 non-text floor and the selected state
   * would start to disappear.
   *
   * Label contrast moves the other way and is never the binding constraint, so
   * checking "can I read the nav" against a candidate answers the wrong
   * question. `data/__integrity.ts` asserts both halves.
   *
   * Historical note: this surface was made a mid brand teal once during the
   * original shell pass and reverted, partly on the argument that the sidebar is
   * SPEED house chrome. It carries a near black brand tone now, which keeps it
   * reading as chrome while removing the flat black.
   */
  navBg?: string;
}

/**
 * A face this deck serves itself, rather than fetching from a font CDN.
 *
 * Needed for a client's REAL corporate typeface, which is normally licensed
 * rather than freely hosted. `theme/cssVars.ts` turns each of these into an
 * `@font-face` rule injected into the document head.
 *
 * ⚠ A licensed face here is a legal artefact, not just an asset. Serving it from
 * `public/` publishes it: confirm the licence covers WEB EMBEDDING on a publicly
 * reachable host, which is a different grant from a desktop licence, before a
 * deck carrying one goes public.
 */
export interface SelfHostedFace {
  /** The `font-family` name this face binds to. */
  family: string;
  /** Path under public/, e.g. `/fonts/Balgin-700.woff2`. */
  src: string;
  /** Weight this file provides. A single file is ONE weight, not a range. */
  weight: number | string;
  style?: 'normal' | 'italic';
  /** Defaults to `swap`: show fallback text immediately, swap when loaded. */
  display?: 'swap' | 'block' | 'fallback' | 'optional';
}

/** Typeface assignments. Three roles, matching the three CSS families. */
export interface Typefaces {
  /** Headings and anything marked `.font-display`. */
  display: string[];
  /** Body copy. The document default. */
  body: string[];
  /** Eyebrows, labels, data and code. */
  mono: string[];
  /**
   * The stylesheet URL that loads any CDN hosted faces, or `null` if every face
   * is self hosted or a system face.
   *
   * Declared here rather than hardcoded in index.html so a client swap cannot
   * leave the previous client's fonts loading. Injected by the Vite plugin.
   */
  webfontHref: string | null;
  /** Faces served from public/. Rendered as `@font-face` rules. */
  selfHosted?: SelfHostedFace[];
  /**
   * Weights the DISPLAY family actually ships.
   *
   * Load bearing when the display face is a single weight file: asking for a
   * weight that does not exist makes the browser SYNTHESISE it by smearing the
   * outlines, which looks like a slightly broken version of the real face rather
   * than like an error. `theme/cssVars.ts` pins headings to the nearest weight
   * that exists instead of letting that happen.
   */
  displayWeights?: number[];
}

/** Who the deck is for, and what it is called. */
export interface Identity {
  /** Client name as it appears in copy, e.g. "Lyka". */
  client: string;
  /** The `<title>` and the metadata name. */
  deckTitle: string;
  /** Client wordmark, served from public/. Rendered top right on every page. */
  logoSrc: string;
  /** Alt text for the wordmark. */
  logoAlt: string;
  /**
   * Rendered height classes for the wordmark.
   *
   * Per client, and it has to be: a wide wordmark at the same height as a
   * compact one collides with the page heading. This is the number that was
   * previously hardcoded in App.tsx with a comment explaining it had been
   * reduced from the previous client's.
   */
  logoHeightClass: string;
}

/** A complete client theme. */
export interface ClientTheme {
  id: string;
  identity: Identity;
  palette: Palette;
  typefaces: Typefaces;
  /**
   * Optional per-client override of the house easing curve. Almost never set;
   * present because a brand with a stated motion language should be able to
   * express it without editing house.ts.
   */
  easeOverride?: string;
}
