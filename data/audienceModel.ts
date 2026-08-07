// -----------------------------------------------------------------------------
// Derived audience metrics. THE ONLY PLACE THAT PARSES A "22%" STRING.
//
// WHY THIS FILE EXISTS
// Every share in personasData.ts is a string with a percent sign, because it is
// transcribed verbatim from the research document. Any visualisation needs
// numbers. Without this file each new view would call parseFloat on its own, and
// the eight persona and journey views would carry eight subtly different
// roundings of the same figure.
//
// NOTHING HERE IS A NEW FACT. Every value is either read straight out of
// personasData.ts or is arithmetic on figures that are. If a number is not
// derivable from the research, it does not belong in this file.
//
// STAGE TOTALS ARE SUMMED FROM THE PERSONAS, not read from categoryData. That
// makes categoryData's 49 / 25 / 15 / 11 an independent cross-check rather than a
// second source of truth, and data/__integrity.ts asserts the two agree.
//
// No React and no DOM types, so this file stays importable from anywhere.
// -----------------------------------------------------------------------------

import { personaCategories, Persona } from './personasData';
import { categoryData } from './categoryData';

// -----------------------------------------------------------------------------
// Absolute volumes
// -----------------------------------------------------------------------------
//
// ⚠ UNSOURCED. 9.86M is NOT in "Audience Personas_Enriched Version for Aaron.docx"
// and NOT in "Lyka Consumer Journeys.pptx". Both were searched. It came in on a
// reference slide with no citation attached.
//
// The header of data/categoryData.ts records the earlier decision to carry no
// absolute count at all, on the grounds that an invented volume on a deck whose
// credibility rests on real numbers is not worth the polish. That reasoning still
// stands. This constant exists so the figure is controlled from ONE place:
//
//   - Set to a number  -> every view may render absolute volumes.
//   - Set to null      -> every view falls back to percentages only, no other edit.
//
// GET A CITATION BEFORE THIS GOES IN FRONT OF LYKA, or set it to null.
export const TOTAL_DOG_OWNERS: number | null = 9_860_000;

/** `"22%"` -> `22`. The single parse point for every share string in the app. */
export const pct = (share: string): number => {
  const n = parseFloat(share);
  return Number.isFinite(n) ? n : 0;
};

/** Share of `TOTAL_DOG_OWNERS`, or null when no total is set. */
const volumeFor = (sharePct: number): number | null =>
  TOTAL_DOG_OWNERS === null ? null : Math.round((TOTAL_DOG_OWNERS * sharePct) / 100);

/** `9_860_000` -> `"9.86M"`. Used for band labels where a full number would not fit. */
export const formatVolume = (n: number | null): string | null => {
  if (n === null) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
};

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface PersonaMetrics {
  persona: Persona;
  /** Share of the Australian dog-owner market, as a number. */
  marketPct: number;
  /** Share of Lyka's current customer base, as a number. */
  customerPct: number;
  /**
   * customerPct / marketPct. Above 1 the persona over-indexes in Lyka's base,
   * below 1 it is under-converted relative to its size.
   */
  conversionIndex: number;
  /**
   * Owners in this persona, if TOTAL_DOG_OWNERS is set.
   *
   * THERE IS DELIBERATELY NO `customerVolume`. `customerPct` is a share of
   * LYKA'S CUSTOMER BASE, not of the dog-owner market, and Lyka's subscriber
   * count is not in the research pack. Multiplying it by TOTAL_DOG_OWNERS
   * produces a number that looks authoritative and means nothing. If a
   * subscriber count ever lands, add a separate constant for it.
   */
  marketVolume: number | null;
}

export interface StageMetrics {
  /** The join key: 'Unaware' | 'Curious' | 'Considering' | 'Ready'. */
  key: string;
  /** Display label without the parenthetical share, e.g. "Unaware / Unconvinced". */
  label: string;
  marketPct: number;
  customerPct: number;
  conversionIndex: number;
  /** See the note on PersonaMetrics: market only, never customers. */
  marketVolume: number | null;
  personas: PersonaMetrics[];
}

// -----------------------------------------------------------------------------
// The ladder
// -----------------------------------------------------------------------------

/**
 * Reading order, up the ladder. Matches the sunburst's clockwise order and the
 * Consumer Journey tab strip, so all views tell the story the same way round.
 *
 * NOTE this is the REVERSE of the array order in personasData.ts, which runs
 * Ready first. Map over STAGE_ORDER, never over the raw persona array, or the
 * ladder renders backwards.
 */
export const STAGE_ORDER = ['Unaware', 'Curious', 'Considering', 'Ready'] as const;

export const CENTRE_KEY = 'Australian Dog Owners';

/** Strips the parenthetical share off a categoryData title: "Curious (47%)" -> "Curious". */
const stripShare = (title: string): string => title.replace(/\s*\([^)]*\)\s*$/, '').trim();

const allPersonas: Persona[] = personaCategories.flatMap((c) => c.personas);

const toPersonaMetrics = (persona: Persona): PersonaMetrics => {
  const marketPct = pct(persona.marketShare);
  const customerPct = pct(persona.customerShare);
  return {
    persona,
    marketPct,
    customerPct,
    conversionIndex: marketPct > 0 ? customerPct / marketPct : 0,
    marketVolume: volumeFor(marketPct),
  };
};

export const personaMetrics: PersonaMetrics[] = allPersonas.map(toPersonaMetrics);

/** Lookup by persona id. Used by the journey model to join a journey to its persona. */
export const personaMetricsById: Record<number, PersonaMetrics> = Object.fromEntries(
  personaMetrics.map((m) => [m.persona.id, m]),
);

export const stageMetrics: StageMetrics[] = STAGE_ORDER.map((key) => {
  // Sorted largest first so the widest chip leads inside a band.
  const personas = personaMetrics
    .filter((m) => m.persona.category === key)
    .sort((a, b) => b.marketPct - a.marketPct);

  const marketPct = personas.reduce((s, m) => s + m.marketPct, 0);
  const customerPct = personas.reduce((s, m) => s + m.customerPct, 0);

  return {
    key,
    label: stripShare(categoryData[key]?.title ?? key),
    marketPct,
    customerPct,
    conversionIndex: marketPct > 0 ? customerPct / marketPct : 0,
    marketVolume: volumeFor(marketPct),
    personas,
  };
});

export const stageMetricsByKey: Record<string, StageMetrics> = Object.fromEntries(
  stageMetrics.map((s) => [s.key, s]),
);

// -----------------------------------------------------------------------------
// The two gaps
// -----------------------------------------------------------------------------
//
// The split is the research's own logic, not a chart device. Unaware and Curious
// do not believe they have a problem, so no amount of friction removal moves
// them: that is a belief gap. Considering and Ready already believe, and are held
// back by price, subscription, freezer space, transition and fear of rejection at
// the bowl: that is a friction gap. The two need different money and different
// creative, which is why the split is drawn at all.

export interface AudienceGap {
  id: 'belief' | 'friction';
  label: string;
  /** The strategic play. Rendered uppercase. */
  play: string;
  /** One line on why these stages sit together. */
  rationale: string;
  stageKeys: string[];
  marketPct: number;
  customerPct: number;
}

const buildGap = (
  id: AudienceGap['id'],
  label: string,
  play: string,
  rationale: string,
  stageKeys: string[],
): AudienceGap => {
  const stages = stageKeys.map((k) => stageMetricsByKey[k]).filter(Boolean);
  return {
    id,
    label,
    play,
    rationale,
    stageKeys,
    marketPct: stages.reduce((s, x) => s + x.marketPct, 0),
    customerPct: stages.reduce((s, x) => s + x.customerPct, 0),
  };
};

export const GAPS: AudienceGap[] = [
  buildGap(
    'belief',
    'Belief gap',
    'Grow: shift belief',
    'They perceive no problem, so they will not move on their own.',
    ['Unaware', 'Curious'],
  ),
  buildGap(
    'friction',
    'Friction gap',
    'Convert: clear friction',
    'They believe. Cost and anxiety hold them.',
    ['Considering', 'Ready'],
  ),
];

// -----------------------------------------------------------------------------
// Headline
// -----------------------------------------------------------------------------

/**
 * The deck's central argument, computed rather than asserted: the friction-gap
 * stages are a small share of the market and a large share of the customer base.
 * Currently 26% of market against 82% of customers.
 */
export const INVERSION = {
  get marketPct() {
    return GAPS[1].marketPct;
  },
  get customerPct() {
    return GAPS[1].customerPct;
  },
};

/** Largest conversion index across the ladder, used to scale index bars. */
export const MAX_CONVERSION_INDEX = Math.max(...personaMetrics.map((m) => m.conversionIndex));
