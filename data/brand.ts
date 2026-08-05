// -----------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for every brand colour in the app.
//
// Two hard constraints on this file, both load bearing:
//
// 1. NO React and NO DOM types. `worker/index.ts` imports LYKA to build the
//    login page, and worker/tsconfig.json runs with lib:["ES2022"], no DOM lib
//    and no @types/node. Adding a React import breaks the Worker type check.
//
// 2. LITERAL HEX ONLY, never `var(--token)`. Chart.js draws to a canvas and
//    cannot resolve CSS custom properties. Every colour that reaches a chart
//    has to be a real value here.
//
// index.html's `:root` block MIRRORS the LYKA object below. Change both together.
//
// Palette source: RFI - Lyka/lyka-rfi/styles/globals.css, which is the only
// place in this workspace where Lyka's brand is correctly implemented. (The
// Lyka Showcase Accelerator was never actually re-themed and is still SPEED
// red. Do not use it as a colour reference.)
// -----------------------------------------------------------------------------

export const LYKA = {
  /** Deepest teal. Sidebar, dark chrome, primary headings. */
  tealDeepest: '#003D33',
  /** Dark Teal. Lyka's primary ink and dark blocks. */
  tealDark: '#005648',
  /** Deep teal-tinted body ink. */
  ink: '#143C33',
  /** Darker teal for accent TEXT on light or cream (AA ~5:1). */
  accentInk: '#0A7D68',
  /** Bright Teal. Fills, focus rings, dividers. NEVER for text on cream. */
  accent: '#10B193',
  /** Lyka Orange. */
  orange: '#FF886B',
  /** Tangerine. */
  tangerine: '#F68B1F',
  /** Peach. */
  peach: '#FEE9DA',
  /** Off-White page background. */
  pageBg: '#FFFBED',
  /** Ivory secondary background. */
  ivory: '#F9F6F1',
  /** Cream panel. */
  cream: '#F0F2E9',
  /** Light Mint hairline. Lyka uses borders where other brands use shadows. */
  mint: '#DBE6DC',
  /**
   * Muted mint. **FILL, BORDER AND STROKE ONLY. NEVER INK.**
   *
   * 1.88:1 on white, 1.75:1 on ivory. That misses AA 4.5:1 for text and also
   * misses the 3:1 non-text floor, so it cannot carry a label, an axis value or
   * an icon that means something. It said "for faint labels" until 2026-08-05,
   * and seven places had taken it at its word: the media plan KPI sub lines and
   * inactive month chips, the "tap to enlarge" hint, every modal's close
   * button, the journey table's definition icon, the score graph's y axis
   * labels and the gap matrix's "no data". All seven are `muted` #5B6E64 now.
   *
   * `muted` is the lightest ink in this palette that clears AA, at 5.44:1 on
   * white, 5.26:1 on the cream page, 5.06:1 on ivory and 4.82:1 on the cream
   * panel. **There is no paler one.** If something needs to read as quiet, make
   * it smaller or lighter in WEIGHT, not fainter than `muted`.
   *
   * `VariantSwitcher.tsx` already recorded the lesson: a 9px eyebrow in this
   * token was deleted in the type pass as "the worst size-and-contrast pairing
   * on either page". `TEN_THINGS.inertFill` is the same hex, correctly labelled
   * fill only. Asserted by `data/__integrity.ts` check 6c.
   */
  mintMuted: '#A9C3B4',
  /** Teal-tinted muted text. */
  muted: '#5B6E64',
  /** Hairline border on light surfaces. */
  border: 'rgba(0,86,72,0.08)',
  /** Teal-tinted shadow. Lyka shadows are never black. */
  shadow: '0 18px 40px -16px rgba(0,86,72,0.22)',
  /**
   * SPEED brand mark. Reserved for the SPEED wordmark, the APEX logo, and one
   * sanctioned data use: OWNER_COLORS.speed on the media plan, where the colour
   * denotes SPEED itself (the client-requested red = SPEED legend). It is still
   * not a general UI colour.
   */
  speedRed: '#E8151B',
  /** Lyka uses one easing curve for everything. */
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// -----------------------------------------------------------------------------
// Segment colours (the Personas sunburst + the Consumer Journey tab strip)
// -----------------------------------------------------------------------------
//
// Design rules:
// - Two hue families (teal spine, terracotta/tangerine spine) across four
//   lightness bands, so the wheel reads as a funnel outward even in greyscale.
// - Every `base` and `lighter` is dark enough to carry the white in-wedge
//   labels on its own. The rgba(0,0,0,0.45) halo in PersonaCompositionChart is
//   a legibility aid, not a rescue.
// - FLOOR: no wedge fill below 2.7:1 contrast against white. Below that the
//   label has to flip to dark ink, which the label renderer does not support.
// - The two warm bands are canonical Lyka Orange (#FF886B) and Tangerine
//   (#F68B1F) darkened along their own hue axis. The canonical values are
//   2.34:1 and 2.43:1 against white and cannot carry white labels.
//
// KEYS ARE THE SEGMENT KEY STRINGS and are a join key across five places:
// personasData[].category, categoryData keys, this map, STAGE_LAYOUT / CENTRE_KEY
// in the sunburst, and journeyTopLevelDetails[].segmentKey in CustomerJourney.
//
// A mismatch fails SILENTLY: an unmatched key here falls through to the fallback
// below and renders the wrong colour with no error. data/__integrity.ts asserts
// every one of those joins in dev. Keep it wired up.

export interface SegmentColorSet {
  /** The ring wedge itself. */
  base: string;
  /** The ring wedge on hover or selection. */
  hover: string;
  /** Persona children of this wedge. */
  lighter: string;
  /** Persona children on hover or selection. */
  lighterHover: string;

  // ---------------------------------------------------------------------------
  // Added for the wide persona views (Readiness Ladder, Mindset Flow).
  //
  // The sunburst hardcodes '#FFFFFF' labels because every one of its fills is
  // dark. A proportional ladder fills half the screen with a single colour, and
  // at that size the dark bands read as heavy and hide the smaller stages. The
  // ladder therefore fills LIGHT for the market bar and DARK for the customer
  // bar, which also happens to encode the right thing: unrealised versus
  // realised.
  //
  // That means text now lands on light fills, so a pair-based ink token is
  // required. This mirrors LAYER_COLORS.ink exactly, which exists for the same
  // reason on the media plan. Do NOT reach for `text-white` on a tint.
  // ---------------------------------------------------------------------------

  /** Very light fill for large areas. ALWAYS pair with `tintInk`, never white. */
  tint: string;
  /** Text drawn ON `base` or `lighter`. */
  ink: string;
  /** Text drawn ON `tint`. */
  tintInk: string;
}

export const SEGMENT_COLORS: Record<string, SegmentColorSet> = {
  // ---------------------------------------------------------------------------
  // LYKA readiness ladder. Used by the Personas sunburst and the Segment panel.
  //
  // The ramp is deliberate and carries the ladder's meaning: muted grey-green
  // for the audience outside the funnel, then terracotta, then warm orange as
  // tension and intent build, resolving into Lyka's own brand teal at Ready.
  // It ends on the brand colour because Ready is the converted state.
  // ---------------------------------------------------------------------------

  // Centre disc: the whole dog-owner market. 12.3:1 vs white.
  'Australian Dog Owners': {
    base: '#003D33', hover: '#00524A', lighter: '#0A6B5A', lighterHover: '#0C7D69',
    tint: '#DCE9E5', ink: '#FFFFFF', tintInk: '#003D33',
  },
  // 49% of market but only 9% of Lyka customers. Muted on purpose: this is the
  // audience that perceives no problem. 4.9:1 base, 3.5:1 lighter.
  Unaware: {
    base: '#5B6E64', hover: '#6B8074', lighter: '#7C8B7E', lighterHover: '#8E9C90',
    tint: '#E3E8E4', ink: '#FFFFFF', tintInk: '#37453E',
  },
  // The tension stage. Terracotta reads as friction, which is the whole story
  // of the Conflicted Troubleshooters. 7.5:1 base, 5.0:1 lighter.
  Curious: {
    base: '#8C3D24', hover: '#A04730', lighter: '#B0553B', lighterHover: '#C4664A',
    tint: '#F3DFD7', ink: '#FFFFFF', tintInk: '#6E2F1B',
  },
  // Warming. 4.7:1 base, 3.2:1 lighter.
  Considering: {
    base: '#B8571C', hover: '#C9631F', lighter: '#D9761B', lighterHover: '#E5851F',
    tint: '#FBE6D2', ink: '#FFFFFF', tintInk: '#8A4013',
  },
  // Converted, so it lands on Lyka teal. 5.1:1 base, 3.4:1 lighter.
  Ready: {
    base: '#0A7D68', hover: '#0C8E76', lighter: '#0E9C82', lighterHover: '#12A88C',
    tint: '#D6EDE7', ink: '#FFFFFF', tintInk: '#075746',
  },

};

/** Used when a segment key is not in SEGMENT_COLORS. Deliberately the centre-disc set. */
export const SEGMENT_COLOR_FALLBACK: SegmentColorSet = SEGMENT_COLORS['Australian Dog Owners'];

export const getSegmentColor = (key: string): SegmentColorSet =>
  SEGMENT_COLORS[key] ?? SEGMENT_COLOR_FALLBACK;

// -----------------------------------------------------------------------------
// Media plan layer colours (the funnel rail and both Chart.js budget views)
// -----------------------------------------------------------------------------
//
// Separation rule vs the segments: segments own the DARK band (3.2 to 12.3:1),
// media layers own the LIGHT band. They never co-occur on screen (different
// pages), so the layers can use the canonical Lyka hues without colliding.
//
// `ink` is required, not decoration. White on Tangerine is 2.43:1 and on Orange
// is 2.34:1, so the rail labels and header cells must be driven from `ink`
// rather than a hardcoded text-white. One ink, #003D33, serves all five stages
// (worst pair 4.51:1 on SHOW IT teal), so adjacent rails never flip ink.
//
// The five keys are Lyka's funnel stages from the media plan briefing workbook.
// The three FUNDED stages carry the chart hues (teal, tangerine, orange); TRY IT
// and SHARE IT are Lyka-in-house-only stages with zero SPEED spend, so their
// quiet fills (peach, muted mint) only ever render on the funnel rail. Both
// charts filter to `budget > 0` rows and never see them.
//
// LayerKey is declared HERE, not in mediaPlanData, so LAYER_COLORS can be typed
// without a circular import. mediaPlanData re-exports it so its two existing
// importers (InteractiveMediaPlan, ChannelDetail) keep working unchanged.

export type LayerKey = 'SHOW IT' | 'CHECK IT' | 'PROVE IT' | 'TRY IT' | 'SHARE IT';

export interface LayerColorSet {
  /** Rail background and chart series. */
  base: string;
  /** Chart.js area fill under a line. */
  area: string;
  /** Text drawn ON TOP of `base`. Never assume white. */
  ink: string;
}

export const LAYER_COLORS: Record<LayerKey, LayerColorSet> = {
  'SHOW IT':  { base: '#10B193', area: 'rgba(16,177,147,0.18)',  ink: '#003D33' }, // ink 4.51:1
  'CHECK IT': { base: '#F68B1F', area: 'rgba(246,139,31,0.22)',  ink: '#003D33' }, // ink 5.03:1
  'PROVE IT': { base: '#FF886B', area: 'rgba(255,136,107,0.20)', ink: '#003D33' }, // ink 5.24:1
  'TRY IT':   { base: '#FEE9DA', area: 'rgba(254,233,218,0.30)', ink: '#003D33' }, // ink 10.43:1
  'SHARE IT': { base: '#A9C3B4', area: 'rgba(169,195,180,0.25)', ink: '#003D33' }, // ink 6.50:1
};

// -----------------------------------------------------------------------------
// Media plan OWNER colours (the gantt bars and the bottom-of-plan legend)
// -----------------------------------------------------------------------------
//
// The Lyka plan splits every channel by who runs it, and the client asked for
// exactly this encoding: GREEN bars are Lyka in house, RED bars are SPEED
// managed. Bars encode OWNER; the rail and the two budget charts encode STAGE.
// The two dimensions never share a surface, so the hues cannot collide.
//
// `lyka` is an existing system hue (LYKA.accentInk, SEGMENT_COLORS.Ready.base):
// no new colour. `speed` is LYKA.speedRed, the one sanctioned data use of SPEED
// red (see its comment above). White ink: 5.06:1 on the green, 4.61:1 on the
// red. Against the white grid track the bars sit at 4.89:1 and 4.45:1.
//
// Colour is not the only encoding: in-house rows also read "In house" in the
// Budget column and say so in their pop-up, so the green/red pair degrades
// safely for colour-blind viewers.

export type OwnerKey = 'speed' | 'lyka';

export interface OwnerColorSet {
  /** Gantt bar fill and legend swatch. */
  base: string;
  /** Chart.js area fill under the in-house pop-up accents. */
  area: string;
  /** Text drawn ON TOP of `base`. */
  ink: string;
}

export const OWNER_COLORS: Record<OwnerKey, OwnerColorSet> = {
  lyka:  { base: '#0A7D68', area: 'rgba(10,125,104,0.15)', ink: '#FFFFFF' },
  speed: { base: '#E8151B', area: 'rgba(232,21,27,0.12)',  ink: '#FFFFFF' },
};

/**
 * Mix `hex` toward white by `t` (0 to 1), returning an `rgb()` string.
 *
 * Lives here rather than in the chart components (which each used to carry an
 * identical private copy) because it is pure string math and both budget charts
 * shade their per-channel series with it. Same constraints as the rest of this
 * file: no React, no DOM.
 */
export const lighten = (hex: string, t: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
};

// -----------------------------------------------------------------------------
// Ten Things chart series. A THIRD colour band.
// -----------------------------------------------------------------------------
//
// SEGMENT_COLORS owns the DARK range (the personas wheel) and LAYER_COLORS the
// LIGHT range (the media plan). Those two never collide because they live on
// different pages. Ten Things is a third page, so it gets its own named band
// rather than borrowing either and inheriting a meaning it does not have.
//
// EVERY RATIO BELOW IS STATED AGAINST THE CREAM MAT (LYKA.pageBg #FFFBED), not
// against white, because that is the surface these fills actually sit on.
//
// THE RULE: 3:1 against the mat is the floor for a STROKE (a line, a dashed
// benchmark rule, a small marker). LYKA.accent is 2.62:1 and LYKA.tangerine is
// 2.35:1, so BOTH ARE FILL ONLY. The instinct to draw a teal line in
// LYKA.accent produces a 2.62:1 hairline that vanishes on the mat. Every line
// in the nine charts uses seriesInk, warmInk or benchmark.
//
// data/__integrity.ts asserts the stroke floor, so a future edit cannot quietly
// promote a fill token to a line colour.

export const TEN_THINGS = {
  /** The outer / total set. Large bar and area fills. 2.62:1 vs mat. FILL ONLY. */
  seriesFill: '#10B193',
  /** Lines, points, markers, above-benchmark bars. 4.89:1 vs mat. */
  seriesInk: '#0A7D68',
  /** The retained / valuable subset. 11.8:1 vs mat, and 4.51:1 against seriesFill. */
  seriesDeep: '#003D33',
  /** Below-benchmark fill. 2.35:1 vs mat. FILL ONLY, and any label on it is seriesDeep. */
  warnFill: '#F68B1F',
  /**
   * The only warm value that survives as a STROKE. 4.59:1 vs mat.
   * Same hex as SEGMENT_COLORS.Considering.base, so this is a new NAME for an
   * existing hue rather than a new colour in the system.
   */
  warmInk: '#B8571C',
  /** Not measured / not identified. 1.82:1, so it ALWAYS carries a benchmark hairline. */
  inertFill: '#A9C3B4',
  /** Bubble fill. Alpha so overlapping bubbles read as overlaps, not as one shape. */
  bubbleFill: 'rgba(16,177,147,0.55)',
  /** Dashed benchmark rules and their captions. 5.25:1 vs mat. */
  benchmark: '#5B6E64',
} as const;

/**
 * The tokens that may be used as a STROKE. Asserted against the 3:1 floor in
 * data/__integrity.ts. Anything not in here is a fill.
 */
export const TEN_THINGS_STROKE_TOKENS = [
  'seriesInk',
  'seriesDeep',
  'warmInk',
  'benchmark',
] as const;

// -----------------------------------------------------------------------------
// THE GAP RAMP. A FOURTH COLOUR BAND, and a diverging one.
//
// SEGMENT_COLORS owns the dark range (the wheel), LAYER_COLORS the light (the
// media plan), TEN_THINGS a third band on the cream mat. This is the fourth, and
// unlike the other three it is a SCALE rather than a set: the journey gap matrix
// fills 25 cells from it.
//
// The two hues are NOT new. They are EMOTIONAL_COLOR and RATIONAL_COLOR from
// JourneyScoreGraph, already used by every curve in the app and already used by
// the Compare view's gap bar. Positive gap means feeling runs ahead of reason, so
// it takes the warm hue; negative takes teal. A reader who has looked at any
// other journey view has already learned the pairing.
//
// -----------------------------------------------------------------------------
// WHY THE ALPHA IS CAPPED AT 0.50, WHICH IS THE LOAD BEARING PART.
//
// A diverging ramp with a number printed in every cell normally forces the ink to
// FLIP: light steps take dark text, dark steps take white. Two adjacent cells one
// step apart then disagree, which is exactly what makes a value labelled heatmap
// look broken.
//
// The way out is to spend the saturation on the BAR and keep the wash inside the
// light band, so ONE ink serves all 25 cells. Measured against LYKA.tealDeepest
// at the ceiling, which is the worst case at both ends:
//
//   #B8571C at 0.50 over white = #DCAB8E   5.99:1
//   #0A7D68 at 0.50 over white = #85BEB4   5.85:1
//
// Both clear AA with margin, and the real data never reaches the ceiling: the
// largest |gap| is 40, which lands at alpha 0.456.
//
// RAISING GAP_WASH_MAX BREAKS THIS. data/__integrity.ts asserts both ends against
// TEXT_FLOOR on every dev page load so a future edit cannot do it quietly.
// -----------------------------------------------------------------------------

/** Feeling ahead of reason. Matches EMOTIONAL_COLOR in JourneyScoreGraph. */
export const GAP_POSITIVE_HUE = '#B8571C';
/** Reason ahead of feeling. Matches RATIONAL_COLOR in JourneyScoreGraph. */
export const GAP_NEGATIVE_HUE = '#0A7D68';

/**
 * Symmetric clamp on the ramp, in gap points.
 *
 * 45 rather than the observed 40, inherited from the Compare view's bar so the
 * two encodings share a scale. A cell beyond this clamps, which is why
 * __integrity warns when the data moves outside GAP_DOMAIN.
 */
export const GAP_SCALE_MAX = 45;

/** Alpha at |gap| = 0+. Enough to read as a fill rather than as an empty cell. */
export const GAP_WASH_MIN = 0.1;
/** Alpha at the clamp. DO NOT RAISE: see the header. Asserted in __integrity. */
export const GAP_WASH_MAX = 0.5;

/** Composite an `#rrggbb` over white at `alpha`, returning an OPAQUE `#rrggbb`. */
const overWhite = (hex: string, alpha: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(alpha * c + (1 - alpha) * 255);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
};

/**
 * The cell fill for a gap value. Returns an OPAQUE hex, never `rgba()`.
 *
 * Opaque matters: the matrix draws its hairlines with `gap-px` over a mint
 * container, so a translucent cell would let mint bleed through and shift every
 * wash by an amount that depends on what is behind it.
 *
 * `gap === 0` is a THIRD STATE, not a point on the ramp. A zero wash is
 * indistinguishable from an empty cell, and two of the 25 cells are exactly
 * zero, so they get cream and a centre tick instead.
 */
export const gapWash = (gap: number): string => {
  if (gap === 0) return LYKA.cream;
  const magnitude = Math.min(Math.abs(gap), GAP_SCALE_MAX) / GAP_SCALE_MAX;
  const alpha = GAP_WASH_MIN + (GAP_WASH_MAX - GAP_WASH_MIN) * magnitude;
  return overWhite(gap > 0 ? GAP_POSITIVE_HUE : GAP_NEGATIVE_HUE, alpha);
};

/** The one ink every cell uses. Paired against both ramp ends in __integrity. */
export const GAP_INK = LYKA.tealDeepest;

/**
 * The steps __integrity checks as fill and ink PAIRS.
 *
 * The ends are the worst case, but the neutral band is checked too: a midtone
 * chosen to look right against white is the step most likely to fail, and it is
 * the one nobody looks at.
 */
export const GAP_RAMP = [
  { label: `-${GAP_SCALE_MAX}`, fill: gapWash(-GAP_SCALE_MAX), ink: GAP_INK },
  { label: '-20', fill: gapWash(-20), ink: GAP_INK },
  { label: '0', fill: gapWash(0), ink: GAP_INK },
  { label: '+20', fill: gapWash(20), ink: GAP_INK },
  { label: `+${GAP_SCALE_MAX}`, fill: gapWash(GAP_SCALE_MAX), ink: GAP_INK },
] as const;

// -----------------------------------------------------------------------------
// Shared chart chrome. Chart.js defaults to #666 for legends and #e5e5e5 for
// grids, both off brand on cream.
// -----------------------------------------------------------------------------

export const CHART_INK = LYKA.ink;
export const CHART_MUTED = LYKA.muted;
export const CHART_GRID = 'rgba(0,86,72,0.08)';
/** Slice and bar separators, matched to the page background rather than pure white. */
export const CHART_SEPARATOR = LYKA.pageBg;
