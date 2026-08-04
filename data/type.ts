// -----------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for type size. Sibling of brand.ts, same contract.
//
// Two hard constraints, both load bearing:
//
// 1. NO React and NO DOM types. This file is imported by SVG views that also run
//    through the Worker type check via brand.ts's neighbours. Keep it plain.
//
// 2. LITERAL NUMBERS ONLY. SVG `fontSize` attributes take user units, not CSS
//    strings, so a token has to be usable as a number as well as a class.
//
// index.html's `theme.extend.fontSize` MIRRORS the PX values below, generating
// `text-micro` through `text-display`. Change both together.
//
// -----------------------------------------------------------------------------
// WHY THIS FILE EXISTS
//
// Before it, roughly 18 distinct sizes were in use across the two variant pages
// between 8.5px and 16px: 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5,
// 14, 14.5, 15, 16. Each had been chosen locally to make one box fit. Half point
// steps are invisible as hierarchy but real as inconsistency, and the floor sat
// below every published minimum (Apple HIG 11pt, Material 12sp).
//
// Eight steps. If you are about to write `text-[9.5px]`, you are reintroducing
// the problem.
// -----------------------------------------------------------------------------

/**
 * The scale, in CSS px.
 *
 * `micro` is the ONLY step below the 12px reading floor, and it is reserved for
 * uppercase mono eyebrows: caps have no descenders and a taller apparent
 * x-height, so 11px uppercase reads about like 12.5px lowercase. Never set
 * lowercase text or prose at `micro`.
 */
export const TYPE = {
  /** 11. Uppercase mono eyebrows ONLY. */
  micro: 11,
  /** 12. Figures beside a label, counts, durations, axis labels, footnotes. */
  meta: 12,
  /** 13. Chip names and stage names in dense grids. */
  label: 13,
  /** 14. Bullets and prose in the dense views. THE READING FLOOR. */
  body: 14,
  /** 16. Prose in panels and modals, card titles. */
  lead: 16,
  /** 18. Pane and card headings. */
  title: 18,
  /** 24. Hero data figures. */
  figure: 24,
  /** 30. Page h1. */
  display: 30,
} as const;

export type TypeToken = keyof typeof TYPE;

/**
 * Letter spacing for uppercase labels, in em.
 *
 * The old values ran 0.14em to 0.22em. That was compensating for Bebas Neue,
 * which the Lyka conversion replaced with Poppins and DM Mono, and wide tracking
 * destroys word shape at small sizes. Tightening it also buys back horizontal
 * room, which is part of how the size increase was paid for.
 */
export const TRACKING = {
  /** 0.08em. Uppercase eyebrows at `micro`. */
  eyebrow: '0.08em',
  /** 0.06em. Uppercase at `meta` and above, where less help is needed. */
  caps: '0.06em',
} as const;

/**
 * Font size for text inside a scaled SVG, in viewBox user units.
 *
 * THE PROBLEM THIS SOLVES. An SVG with `width: 100%` scales its whole coordinate
 * system to the container, so a `fontSize` attribute is a size relative to the
 * drawing, not to the page. The same `fontSize={10}` was rendering at 15.0px in
 * the journey Table (viewBox 800 in a 1088px box) and 6.8px in the Strip
 * (viewBox 1500 in a 1022px box). Declared sizes were therefore meaningless as a
 * legibility guarantee, and the two Personas SVG views halved again whenever a
 * detail panel opened.
 *
 * Pass the measured container width (see hooks/useElementSize) and the
 * viewBox width, and a token renders at its real CSS px in every view.
 *
 * TRADE-OFF, on purpose: text now holds a fixed apparent size while the drawing
 * scales, so as the container narrows the type grows relative to the geometry
 * and will eventually collide rather than shrink politely. Every caller pairs
 * this with a minimum width below which it renders a simpler fallback.
 *
 * @param targetPx      The desired rendered size in CSS px. Use a TYPE token.
 * @param containerPx   Measured container width. 0 or null before first measure.
 * @param viewBoxWidth  The SVG's viewBox width in user units.
 */
export const svgFont = (
  targetPx: number,
  containerPx: number | null,
  viewBoxWidth: number,
): number => {
  // Before the first ResizeObserver callback there is no measurement. Falling
  // back to the raw target means the first paint is wrong only if the scale is
  // not 1, and it is never zero or NaN, which would blank the labels.
  if (!containerPx || containerPx <= 0) return targetPx;
  const scale = containerPx / viewBoxWidth;
  return targetPx / scale;
};
