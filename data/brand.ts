// -----------------------------------------------------------------------------
// THE DERIVED COLOUR SYSTEMS.
//
// ⚠ THIS FILE IS NO LONGER THE SOURCE OF THE PALETTE. `theme/` is.
//
// What lives here is the five colour SYSTEMS built on top of the palette: the
// sunburst's segment sets, the media plan's layer and owner sets, the Ten Things
// band, the diverging gap ramp and the media focus wash. Those encode meaning
// rather than brand, which is why they did not move into the theme container.
//
// The base palette now arrives from `theme/`, and `LYKA` below is a COMPATIBILITY
// MAPPING from the theme's semantic role names onto the literal hue names the
// ~48 existing importers use. New code should import `palette` from `theme`
// instead; this export exists so that extracting the container changed no call
// site and therefore could not change a pixel.
//
// Two hard constraints still apply, both load bearing:
//
// 1. NO React and NO DOM types. `worker/index.ts` imports LYKA to build the
//    login page, and worker/tsconfig.json runs with lib:["ES2022"], no DOM lib
//    and no @types/node. The whole `theme/` folder honours the same rule, which
//    is what lets the Worker, Tailwind's config loader and the Vite config all
//    read it.
//
// 2. LITERAL HEX ONLY, never `var(--token)`. Chart.js draws to a canvas and
//    cannot resolve CSS custom properties.
// -----------------------------------------------------------------------------

import { AGENCY, ELEVATION, ease as houseEase, palette } from '../theme';

export { lighten } from '../theme';

/**
 * The palette under its previous names.
 *
 * Each key is one role from `theme/types.ts`. The mapping is the whole of the
 * translation: no value is defined here, so a client swap propagates through
 * this object without it being edited.
 */
export const LYKA = {
  /** Deepest brand ink. Sidebar, dark chrome, primary headings. */
  tealDeepest: palette.inkDeepest,
  /** Strong brand ink and dark blocks. */
  tealDark: palette.inkStrong,
  /** Body ink. */
  ink: palette.ink,
  /** Accent for TEXT on light or cream (AA ~5:1). */
  accentInk: palette.accentText,
  /** Bright accent. Fills, focus rings, dividers. NEVER for text on cream. */
  accent: palette.accent,
  /** Warm secondary. */
  orange: palette.warm,
  /** Second warm secondary. */
  tangerine: palette.warmAlt,
  /** Palest warm tint. */
  peach: palette.warmSoft,
  /** The page ground. */
  pageBg: palette.page,
  /** Secondary surface. */
  ivory: palette.surfaceAlt,
  /** Sunken surface. */
  cream: palette.surfaceSunk,
  /** Hairline. This system uses borders where other brands use shadows. */
  mint: palette.hairline,
  /**
   * **FILL, BORDER AND STROKE ONLY. NEVER INK.**
   *
   * 1.88:1 on white, 1.75:1 on ivory. That misses AA 4.5:1 for text and also
   * misses the 3:1 non-text floor, so it cannot carry a label, an axis value or
   * an icon that means something. It said "for faint labels" until 2026-08-05,
   * and seven places had taken it at its word: the media plan KPI sub lines and
   * inactive month chips, the "tap to enlarge" hint, every modal's close
   * button, the journey table's definition icon, the score graph's y axis
   * labels and the gap matrix's "no data". All seven are `muted` now.
   *
   * `muted` is the lightest ink in this palette that clears AA, at 5.44:1 on
   * white, 5.26:1 on the cream page, 5.06:1 on ivory and 4.82:1 on the cream
   * panel. **There is no paler one.** If something needs to read as quiet, make
   * it smaller or lighter in WEIGHT, not fainter than `muted`.
   *
   * Asserted from BOTH sides by `data/__integrity.ts` check 6c.
   */
  mintMuted: palette.hairlineSoft,
  /** The palest legal ink. */
  muted: palette.inkMuted,
  /** Hairline border on light surfaces. */
  border: palette.borderSubtle,
  /** Brand-tinted shadow. Shadows here are never black. */
  shadow: ELEVATION.lg,
  /**
   * SPEED brand mark. Reserved for the SPEED wordmark, the APEX logo, and the
   * sanctioned data uses of OWNER_COLORS.speed, where the colour denotes SPEED
   * itself: the media plan (the client-requested red = SPEED legend) and the
   * Notion Coworking Setup page (the two-party Lyka/SPEED split). It is still
   * not a general UI colour.
   *
   * It comes from `theme/house.ts`, NOT from the client palette, because it is
   * the agency's mark: a re-skin must not be able to overwrite it.
   */
  speedRed: AGENCY.red,
  /** One easing curve family for everything. See theme/house.ts MOTION. */
  ease: houseEase,
} as const;

// -----------------------------------------------------------------------------
// MEDIA FOCUS: the emphasis on the Consumer Journey stages media addresses
// -----------------------------------------------------------------------------
//
// Requested by Lyka on 2026-08-07, to make two stages easy to find while
// presenting. What it marks is declared in data/mediaFocus.ts; this is only the
// colour. A FIFTH band, deliberately, alongside the wheel's dark SEGMENT_COLORS,
// the media plan's light LAYER_COLORS, TEN_THINGS and the gap ramp.
//
// WHY ITS OWN BAND rather than reusing `LYKA.accent` or a segment tint. This
// wash lands on top of views that already encode something in colour: the
// journey tab strip and every card border are the PERSONA'S stage colour, and a
// segment tint here would read as "this column belongs to that stage". The
// emphasis is orthogonal to both, so it gets a hue nothing else in these views
// fills with.
//
// ⚠ THE GAP MATRIX DOES NOT USE `wash`, AND MUST NOT. Its 25 cells are already
// filled by a diverging ramp where the fill IS the datum, so a green overlay
// there does not add emphasis, it corrupts a reading. It takes `edge` as an
// outline instead. Any future view that fills its cells has the same problem.
//
// Contrast, all asserted in data/__integrity.ts check 6d:
//   LYKA.muted on wash      4.75:1  the body text of every table cell
//   LYKA.ink on wash        7.99:1
//   LYKA.tealDeepest on wash 12.3:1  headers
//   edge on wash            4.43:1  above the 3:1 non-text floor
//   edge on white           5.07:1  so the rule survives on an unwashed surface
//   tagInk on tagBg         5.07:1  AA for the tag itself
export const FOCUS = {
  /** Column wash. Light enough that `LYKA.muted` body copy still clears AA. */
  wash: '#E3F2EC',
  /**
   * Hover on a washed, clickable cell. LIGHTER than `wash`, not darker, and that
   * is the opposite of what the unwashed cells do (white to `LYKA.ivory`).
   *
   * Deliberate, and forced by the same arithmetic as the gantt shading. The ink
   * on these cells is `LYKA.muted`, which clears AA on `wash` at 4.75:1 with
   * very little room. One step DARKER lands at 4.48:1, under AA, so darkening on
   * hover would make a cell fractionally illegal exactly while a reader is
   * pointing at it. Lifting toward white can only improve it.
   */
  washHover: '#EDF7F3',
  /** Rule and outline. Also the tag fill. */
  edge: '#0A7D68',
  tagBg: '#0A7D68',
  tagInk: '#FFFFFF',
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
  // 27% of market but only 3% of Lyka customers. Muted on purpose: this is the
  // audience that perceives no problem. 4.9:1 base, 3.5:1 lighter.
  Unaware: {
    base: '#5B6E64', hover: '#6B8074', lighter: '#7C8B7E', lighterHover: '#8E9C90',
    tint: '#E3E8E4', ink: '#FFFFFF', tintInk: '#37453E',
  },
  // The tension stage, and since 2026-08-07 the biggest one: 47% of market
  // against 15% of customers. Terracotta reads as friction, which is the whole
  // story of the Conflicted Troubleshooters. 7.5:1 base, 5.0:1 lighter.
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
// SECOND SANCTIONED CONSUMER (2026-08-10): the Notion Coworking Setup page reuses
// `base` and `ink` from both owner sets as the two-party Lyka/SPEED split (the
// shared-space hub, the practice-step actor tags, the privacy owner chips). The
// `weight` rungs are gantt-specific and are NOT used there. Same meaning as here,
// green = Lyka, red = SPEED, so the reuse is consistent rather than a new use.
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

/**
 * How much presence a channel has in a given month, straight from the workbook.
 *
 * The briefing sheet shades every bar cell at one of three intensities per
 * owner, and **it is an editorial weighting, not a function of spend.** That was
 * tested before building it: the darkest red spans $10,000 to $2,000,000 and the
 * mid red spans $5,000 to $1,000,000, so the ranges overlap almost completely.
 * Cinema settles it outright, with December at $70,000 shaded medium and
 * February at the same $70,000 shaded heavy. And the in-house rows carry all
 * three shades while having no dollars at all.
 *
 * So it cannot be derived and is read cell by cell into `MediaRow.weight`.
 */
export type Weight = 'heavy' | 'medium' | 'light';

export interface OwnerColorSet {
  /** Legend swatch, owner pill, and the mid rung of `weight`. */
  base: string;
  /** Chart.js area fill under the in-house pop-up accents. */
  area: string;
  /** Text drawn ON TOP of `base`. */
  ink: string;
  /**
   * The three gantt bar fills. OWNER is carried by hue and WEIGHT by lightness,
   * which is what makes the two readable at once: the two families are
   * luminance matched rung for rung (green 8.66 / 5.06 / 3.07 against red 8.03 /
   * 4.61 / 3.07 vs white), so heavy green and heavy red are only 1.08:1 apart
   * and hue is doing all the owner work.
   *
   * **Every rung clears 3:1 against white**, the non-text floor for a meaningful
   * mark, which is the constraint that sets the range. The obvious approach of
   * lightening the base by a fixed HLS step fails it: it lands the light green
   * at 1.77:1 and the light red at 2.84:1. These are solved for target contrast
   * with hue and saturation held instead. Asserted in `data/__integrity.ts`.
   *
   * -------------------------------------------------------------------------
   * THE LIGHT RUNGS NOW SIT ON THE FLOOR, AND THAT IS THE WHOLE STORY OF THIS
   * TOKEN (2026-08-06). Asked to make the light shade lighter, both were solved
   * down to 3.07:1, which is as light as anything here can legally be. Green
   * moved usefully, `#0E9C82` 3.44:1 to `#0FA68B` 3.07:1, widening the medium to
   * light step from 1.47:1 to 1.65:1. **Red barely moved**, `#F16266` 3.14:1 to
   * `#F1666A` 3.07:1 and a step of 1.47:1 to 1.50:1, because red was already
   * sitting on the floor before anyone asked.
   *
   * **There is no headroom left, and the reason is a tautology worth writing
   * down: "looks lighter" IS "closer to white", so a rung cannot look lighter
   * than 3:1 against white while still clearing 3:1 against white.** Further
   * lightening is a decision to go below the floor, not a tuning exercise.
   *
   * THREE LEVERS ARE THEREFORE ALREADY SPENT, and saying so is cheaper than
   * having the next person rediscover them:
   *   - Lightening `light` again breaches the floor and `__integrity` fails.
   *   - Darkening `medium` to widen the step moves THE BRAND COLOUR: `medium`
   *     is `accentInk` / `speedRed` and equals `base`, which draws the legend
   *     swatch and the owner pill. It would take SPEED red off SPEED red.
   *   - Desaturating rather than lightening does nothing, because contrast is
   *     luminance: it changes the hue's purity, not its apparent lightness.
   *
   * If the tail still does not read as tailing off, the honest options are to
   * accept it, to breach the floor deliberately (2.50:1 is `#11B99A` and
   * `#F48386`, a clearly visible lift), or to stop encoding the third level
   * with lightness at all.
   *
   * One side benefit, since both landed on the same target: the light rungs are
   * luminance matched at 1.00:1, tighter than the 1.08:1 and 1.10:1 above them,
   * so hue carries even more of the owner work than it did.
   *
   * COST, recorded because it breaks a property this file used to have: the
   * light green is no longer an existing token. Heavy and medium are still
   * `tealDark` and `accentInk`, but `#0FA68B` replaces what was
   * `SEGMENT_COLORS.Ready.lighter`. That token is UNCHANGED and still owns its
   * wheel wedge; this is a fourth green, deliberately.
   * -------------------------------------------------------------------------
   */
  weight: Record<Weight, string>;
}

export const OWNER_COLORS: Record<OwnerKey, OwnerColorSet> = {
  lyka: {
    base: '#0A7D68',
    area: 'rgba(10,125,104,0.15)',
    ink: '#FFFFFF',
    weight: { heavy: '#005648', medium: '#0A7D68', light: '#0FA68B' }, // 8.66 / 5.06 / 3.07 : 1
  },
  speed: {
    base: '#E8151B',
    area: 'rgba(232,21,27,0.12)',
    ink: '#FFFFFF',
    weight: { heavy: '#A20F13', medium: '#E8151B', light: '#F1666A' }, // 8.03 / 4.61 / 3.07 : 1
  },
};

// `lighten()` moved to theme/contrast.ts and is re-exported from the top of this
// file, so both budget charts and the APEX methodology bar keep their import
// path. It sits beside the WCAG maths now because the two are always used
// together: you lighten a token precisely when the raw one fails a floor.

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
  // `bubbleFill` lived here (rgba(16,177,147,0.55), seriesFill at 55% so
  // overlapping bubbles read as overlaps rather than as one shape). It went on
  // 2026-08-10 with point 05's bubble chart, its only consumer.
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
// THE BASIS PAIR. Which denominator a Ten Things point divides by.
// -----------------------------------------------------------------------------
//
// Added 2026-08-10 with the dog owner basis refactor. Five of the ten points
// divide by a population and were redrawn against Roy Morgan's count of dog
// owners; the other five are rates, counts or a time series, so no population
// figure enters them and there is nothing to redraw. The distinction is marked
// on the tile rail, on a pill in the modal, and on a labelled block.
//
// NOT THE SOURCE'S OWN COLOURS. The source page uses #2E8B64 and #8A9199,
// neither of which is Lyka. Both marks below are EXISTING tokens under a new
// name, the same move TEN_THINGS.warmInk makes: `dogOwner.mark` is
// LYKA.accentInk / TEN_THINGS.seriesInk, `noDenominator.mark` is LYKA.muted.
//
// ⚠ THE OBVIOUS MATCH FOR THE SOURCE'S SOFT GREY IS LYKA.mintMuted, AND IT IS
// ILLEGAL HERE. #A9C3B4 is 1.88:1 on white, under even the 3:1 non-text floor,
// so it cannot carry a pill label and cannot serve as a rail that means
// something. Check 6c asserts it keeps failing. LYKA.muted is the palest ink in
// the palette that clears AA, so it is the floor and there is nothing quieter.
//
// Only the two tints are new values, and each is its own mark lightened 88%
// toward white. Contrast, all asserted in data/__integrity.ts check 16:
//
//   dogOwner  mark on white 5.06:1 | creamMat 4.89 | ivory 4.70 | creamPanel 4.48
//   dogOwner  markInk on mark   4.89:1   the pill label
//   dogOwner  tintInk on tint  10.33:1   the block's body copy
//   dogOwner  mark on tint      4.29:1   the block's left rail, over the 3:1 floor
//   noDenom   mark on white 5.44:1 | creamMat 5.25 | ivory 5.05 | creamPanel 4.82
//   noDenom   markInk on mark   5.25:1
//   noDenom   tintInk on tint  10.43:1
//   noDenom   mark on tint      4.66:1
//
// `dogOwner.tint` #E2EFED sits close to FOCUS.wash #E3F2EC. That is allowed for
// the same reason SEGMENT_COLORS and LAYER_COLORS may share a band: the two
// never appear on the same page, FOCUS being a Consumer Journey device. Do not
// consolidate them, because the meanings are unrelated and one moving would
// silently move the other.
export const BASIS_COLORS = {
  dogOwner: {
    /** Tile rail, pill fill, block rail. = LYKA.accentInk. */
    mark: '#0A7D68',
    /** The pill label, on `mark`. = LYKA.pageBg. */
    markInk: '#FFFBED',
    /** The block panel. `mark` lightened 88% toward white. */
    tint: '#E2EFED',
    /** The block's body copy, on `tint`. = LYKA.ink. */
    tintInk: '#143C33',
  },
  noDenominator: {
    /** = LYKA.muted, the palest ink in the palette that clears AA. */
    mark: '#5B6E64',
    markInk: '#FFFBED',
    tint: '#EBEEEC',
    tintInk: '#143C33',
  },
} as const;

export type BasisKey = keyof typeof BASIS_COLORS;

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
