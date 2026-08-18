// -----------------------------------------------------------------------------
// SPEED HOUSE CONSTANTS.
//
// The half of the design system that does NOT change per client. A new client
// deck swaps theme/clients/<name>.ts and inherits everything in this file
// unchanged: the type scale, the motion curve, the elevation shape, the radii
// and the one custom breakpoint.
//
// If you find yourself editing this file for a single client, the value belongs
// in that client's theme instead. If you find yourself copying a value between
// two client themes, it belongs here.
//
// Constraints, same as the rest of theme/: no React, no DOM types, literal
// values only. Loaded by the browser, the Worker, the Tailwind config and Vite.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// TYPE
// -----------------------------------------------------------------------------
//
// Eight steps. Before this scale existed, roughly 18 distinct sizes were in use
// across the variant pages between 8.5px and 16px, each chosen locally to make
// one box fit. Half point steps are invisible as hierarchy but real as
// inconsistency, and the floor sat below every published minimum (Apple HIG
// 11pt, Material 12sp).
//
// If you are about to write `text-[9.5px]`, you are reintroducing the problem.

/**
 * The scale, in CSS px.
 *
 * LITERAL NUMBERS, deliberately: SVG `fontSize` attributes take user units, not
 * CSS strings, so a token has to be usable as a number as well as a class.
 *
 * RAISED ON 2026-08-17, every step, for readability. The deck is presented on a
 * shared screen and projected, where the old scale was tuned for reading at desk
 * distance. The important move is the prose floor going 14 to 16.
 *
 *   micro    11 -> 12       meta   12 -> 13
 *   label    13 -> 14       body   14 -> 16
 *   lead     16 -> 18       title  18 -> 22
 *   figure   24 -> 30       display 30 -> 38
 *
 * A side effect worth naming: `micro` was the only step under the 12px reading
 * floor, which is why it carried a rule restricting it to uppercase mono
 * eyebrows. At 12 it now SITS on the floor, so nothing in the app is below it
 * any more. The eyebrow convention stays because it is a typographic choice, but
 * it is no longer a legibility exemption.
 */
export const TYPE = {
  /** 12. Uppercase mono eyebrows. */
  micro: 12,
  /** 13. Figures beside a label, counts, durations, axis labels, footnotes. */
  meta: 13,
  /** 14. Chip names and stage names in dense grids. */
  label: 14,
  /** 16. Bullets and prose. THE READING FLOOR. */
  body: 16,
  /** 18. Prose in panels and modals, card titles. */
  lead: 18,
  /** 22. Pane and card headings. */
  title: 22,
  /** 30. Hero data figures. */
  figure: 30,
  /**
   * 48. Page h1, and the ONLY step set in the display face.
   *
   * Raised from 38 on 2026-08-17. The two audience pages had drifted apart: the
   * Personas heading rendered at 48 under the wheel view and 38 under the other
   * two, while Ten Things was fixed at 38, so which page had the bigger title
   * depended on a visualisation toggle. Both sit on this token now, so they
   * cannot disagree.
   */
  display: 48,
} as const;

export type TypeToken = keyof typeof TYPE;

/**
 * Line height per step, unitless.
 *
 * Paired with TYPE here rather than restated in the Tailwind config, which is
 * how the two used to drift. `theme/tailwindPreset.ts` zips these together into
 * the `fontSize` scale.
 *
 * NOTE `figure` is 1. That is tight enough that its inline box is SHORTER than
 * the font's own metrics (DM Sans wants about 1.29em), so a `figure` heading
 * overflows its block by 3 to 4px top and bottom regardless of line count. Any
 * container that fits it exactly must not also clip, or it shaves the
 * descenders. See components/tenthings/TenThingsCard.tsx.
 */
export const LINE_HEIGHT: Record<TypeToken, number> = {
  micro: 1.4,
  meta: 1.45,
  label: 1.45,
  body: 1.6,
  lead: 1.6,
  title: 1.35,
  // 1.1, raised from 1. That 1 was the cause of a real defect: a line box
  // SHORTER than the font's own metrics, so a `figure` heading overflowed its
  // block by 3 to 4px top and bottom whatever the line count, and any container
  // that fitted it exactly then clipped the descenders. The fix at the time was
  // to remove `overflow-hidden` from the one container that noticed. Giving the
  // step real leading fixes the cause rather than the symptom.
  figure: 1.1,
  display: 1.1,
};

/**
 * Letter spacing for uppercase labels, in em.
 *
 * The old values ran 0.14em to 0.22em, compensating for Bebas Neue. Poppins and
 * DM Mono replaced it, and wide tracking destroys word shape at small sizes.
 * Tightening also buys back horizontal room.
 */
export const TRACKING = {
  /** 0.08em. Uppercase eyebrows at `micro`. */
  eyebrow: '0.08em',
  /** 0.06em. Uppercase at `meta` and above, where less help is needed. */
  caps: '0.06em',
  /** -0.015em. Display headings. Poppins is wide; this tightens it. */
  display: '-0.015em',
} as const;

/**
 * Font size for text inside a scaled SVG, in viewBox user units.
 *
 * THE PROBLEM THIS SOLVES. An SVG with `width: 100%` scales its whole coordinate
 * system to the container, so a `fontSize` attribute is a size relative to the
 * DRAWING, not to the page. The same `fontSize={10}` rendered at 15.0px in the
 * journey table (viewBox 800 in a 1088px box) and 6.8px in the strip (viewBox
 * 1500 in a 1022px box). Declared sizes were therefore meaningless as a
 * legibility guarantee.
 *
 * TRADE-OFF, on purpose: text holds a fixed apparent size while the drawing
 * scales, so as the container narrows the type grows relative to the geometry
 * and will eventually collide rather than shrink politely. Every caller pairs
 * this with a minimum width below which it renders a simpler fallback.
 *
 * @param targetPx      Desired rendered size in CSS px. Use a TYPE token.
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
  return targetPx / (containerPx / viewBoxWidth);
};

// -----------------------------------------------------------------------------
// MOTION
// -----------------------------------------------------------------------------
//
// ONE easing curve for the whole app. This used to be asserted by a `*` rule in
// index.html, which never worked: a `*` selector is specificity 0-0-0 and every
// `ease-out` / `ease-in-out` utility class is 0-1-0, so the utilities won
// regardless of source order. It is a Tailwind `transitionTimingFunction`
// override now, which makes the utilities themselves resolve to the house curve.

export const MOTION = {
  /** The house curve. The default for every transition and every animation. */
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /**
   * The other two members of the same family, so that `ease-in` and `ease-out`
   * remain semantically honest instead of being overridden into one curve.
   *
   * "One easing curve for everything" was the original intent and it was the
   * right instinct expressed slightly too bluntly: a thing entering the screen
   * and a thing leaving it should not decelerate identically. These are the
   * standard/decelerate/accelerate triple, all from the same cubic family, so
   * the app still reads as one motion language.
   */
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  duration: {
    /** 150ms. Hover, focus, colour changes. */
    fast: '150ms',
    /** 300ms. Sidebar collapse, panel slides. */
    base: '300ms',
    /** 500ms. Page entry. */
    slow: '500ms',
  },
} as const;

// -----------------------------------------------------------------------------
// ELEVATION
// -----------------------------------------------------------------------------
//
// SHAPE here, COLOUR from the client theme. A shadow's offsets and blur are a
// house decision; its tint is a brand one, because this system tints shadows
// with the brand's own dark rather than using black. `theme/cssVars.ts` composes
// the two.
//
// Before this existed the deck ran a brand tinted shadow on 17 elements beside
// Tailwind's neutral grey `shadow-sm` on 9 more, plus `shadow-2xl` on 3 and a
// one-off on 1. Four elevations, three of them unintentional.

export const ELEVATION_SHAPE = {
  /** Resting card. Barely there. */
  sm: '0 1px 2px -1px',
  /** Raised card, hover state. */
  md: '0 8px 20px -10px',
  /** Panel, popover. The original single value this system had. */
  lg: '0 18px 40px -16px',
  /** Modal, lightbox. */
  xl: '0 28px 60px -20px',
} as const;

export type ElevationToken = keyof typeof ELEVATION_SHAPE;

/** Alpha applied to the client's shadow tint at each step. */
export const ELEVATION_ALPHA: Record<ElevationToken, number> = {
  sm: 0.1,
  md: 0.16,
  lg: 0.22,
  xl: 0.28,
};

// -----------------------------------------------------------------------------
// SPACING
// -----------------------------------------------------------------------------
//
// SEMANTIC padding steps for surfaces, on top of Tailwind's numeric scale rather
// than replacing it. `p-4` still means 16px and every existing utility is
// untouched; these add names for the handful of decisions that should be
// consistent across the deck and were previously re-guessed per component.
//
// Generous on purpose. The deck is presented on a shared screen, and the tight
// interior padding was a response to fitting a one viewport grid, which the type
// scale increase and the fluid Ten Things grid together make unnecessary.

export const SPACE = {
  /** 14px. Dense cells: gantt rows, table cells, chips. */
  tight: '14px',
  /** 22px. The standard card and tile interior. */
  card: '22px',
  /** 32px. Panels, modals, anything holding sustained prose. */
  panel: '32px',
  /** 48px. Between major sections on the scrolling pages. */
  section: '48px',
} as const;

// -----------------------------------------------------------------------------
// RADII
// -----------------------------------------------------------------------------
//
// Three roles, not three sizes picked per component. The deck had `rounded-2xl`
// on 35 elements, `rounded-xl` on 21 and `rounded-lg` on 19 in overlapping
// roles, which is what makes a card language read as drifting rather than
// varied.

export const RADIUS = {
  /** 6px. Chips, pills, badges, small controls. */
  control: '6px',
  /** 12px. Cards, tiles, panels. */
  card: '16px',
  /** 20px. Modals and other surfaces that sit above the page. */
  surface: '20px',
  /** Fully round. Tab pills, the scrollbar thumb. */
  full: '999px',
} as const;

// -----------------------------------------------------------------------------
// AGENCY
// -----------------------------------------------------------------------------

/**
 * SPEED's own marks. House, not client, which is exactly why they live here:
 * every previous deck carried `speedRed` inside the CLIENT palette object,
 * where a re-skin would reasonably have overwritten it.
 */
export const AGENCY = {
  /**
   * SPEED brand red. Reserved for the SPEED wordmark, the APEX logo, and the
   * sanctioned data uses where the colour denotes SPEED itself: the media plan's
   * red = SPEED legend, and the two party split on the Notion page. It is not a
   * general UI colour, and a focus ring must never use it.
   */
  red: '#E8151B',
} as const;

// -----------------------------------------------------------------------------
// BREAKPOINTS
// -----------------------------------------------------------------------------

/**
 * ONE custom breakpoint, and it exists because the stock scale is backwards for
 * this app's grids.
 *
 * The sidebar takes 320px, so a 1280 viewport is the TIGHTEST layout here, not a
 * roomy one. Tailwind's `xl:` fires at exactly 1280 and `2xl:` not until 1536,
 * so there is no stock step meaning "1440 and up, where there is actually room".
 * Measured on the Ten Things grid: a tile is 171x277 at 1280 with as little as
 * 10px of slack, and 203x339 at 1440 with 98 to 147px. Those want different type.
 *
 * A viewport query is not a container query. Use `roomy:` only where a
 * measurement says the box actually grows past 1400.
 */
export const SCREENS = {
  roomy: '1400px',
} as const;
