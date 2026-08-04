// -----------------------------------------------------------------------------
// Derived journey metrics, and the canonical score-string parser.
//
// THE PARSER LIVES HERE, NOT IN THE GRAPH. JourneyScoreGraph used to own it, but
// once more than one view needs the numbers a parser inside a component becomes a
// duplication waiting to happen. The behaviour is unchanged, character for
// character, so the existing graph renders identically.
//
// EVERYTHING DERIVED HERE IS LABELLED AS DERIVED IN THE UI. The 50 emotional and
// rational scores are the study's own 0 to 100 ratings. `gap`, `openingGap` and
// `leadMode` are arithmetic SPEED performs on top of them. Any view that shows a
// gap or a lead mode must say so, or it reads as a research finding.
// -----------------------------------------------------------------------------

import { journeys, JourneyStageDetail, JourneySubCategory } from './journeyDetailsData';
import { journeyMeta, JourneyMeta, TAB_ORDER } from './journeyMeta';
import { personaMetricsById, PersonaMetrics } from './audienceModel';
import { JourneyType, JourneySubCategoryKey } from '../types';

// -----------------------------------------------------------------------------
// Score parsing
// -----------------------------------------------------------------------------
//
// The format is load bearing and documented in CLAUDE.md:
//   "Emotional 80 – Love, pride and a strong identity."
//    ^ label     ^ value  ^ DASH REQUIRED (hyphen, en dash or em dash, not a colon)
//
// A colon parses the number and silently loses the descriptor. No separator at
// all falls through to stripping non-digits, which concatenates every digit in
// the string: "Emotional 82 worry at 3am" yields 823.

/** Value only. Used for the y-domain, where the descriptor is irrelevant. */
export const parseScoreValue = (scoreString: string): number => {
  if (scoreString.includes('>')) {
    const parts = scoreString.split('>');
    const valPart = parts[1]?.trim() || parts[0]?.trim();
    const match = valPart.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  const match = scoreString.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

/** Value plus the descriptor after the dash. The descriptor drives the tooltip. */
export const parseScoreData = (scoreString: string): { value: number; label: string } => {
  if (scoreString.includes('>')) {
    const parts = scoreString.split('>');
    const valPart = parts[1]?.trim() || parts[0]?.trim();
    const val = parseInt(valPart.replace(/[^0-9]/g, '') || '0', 10);
    return { value: val, label: '' };
  }
  const match = scoreString.match(/(\d+)\s*[-–—]\s*(.*)/);
  if (match) {
    return { value: parseInt(match[1], 10), label: match[2].trim() };
  }
  const simpleVal = parseInt(scoreString.replace(/[^0-9]/g, '') || '0', 10);
  return { value: simpleVal, label: '' };
};

/**
 * Semicolon delimited, per the format rule the table's renderStandardList relies
 * on. Authoring a cell with full stops only makes it render as one long bullet.
 */
export const splitBullets = (field: string): string[] =>
  field
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * True when a score descriptor stops mid-sentence.
 *
 * WHY THIS EXISTS. Devoted Caterers / Action ends at "...transition progress and
 * ease of". That is truncated IN THE SOURCE PPTX, verified against the deck, so
 * journeyDetailsData.ts is faithful and regenerating will not fix it. Every other
 * one of the 50 descriptors ends in a full stop, which makes the test reliable.
 *
 * Views that surface a descriptor prominently flag it rather than hiding it or
 * inventing an ending. Remove this helper once the study author supplies the
 * missing text.
 */
export const isTruncatedDescriptor = (label: string): boolean => {
  const t = label.trim();
  return t.length > 0 && !/[.!?"”'’)]$/.test(t);
};

// -----------------------------------------------------------------------------
// Derived metrics
// -----------------------------------------------------------------------------

/** DERIVED. Emotion led, rational led, or neither. See LEAD_MODE_THRESHOLDS. */
export type LeadMode = 'Emotion led' | 'Rational led' | 'Balanced';

/**
 * Thresholds on the Precontemplation gap (emotional minus rational).
 *
 * Chosen against the real spread, which is strongly bimodal rather than
 * continuous: the two Unaware personas both sit at -40, Researchers at -15, and
 * the two warm personas at +20 and +25. Any cut inside those gaps gives the same
 * grouping, so the exact numbers are not load bearing. Revisit them if the study
 * is revised.
 */
export const LEAD_MODE_THRESHOLDS = { emotionLed: 15, rationalLed: -30 } as const;

const classifyLeadMode = (gap: number): LeadMode => {
  if (gap >= LEAD_MODE_THRESHOLDS.emotionLed) return 'Emotion led';
  if (gap <= LEAD_MODE_THRESHOLDS.rationalLed) return 'Rational led';
  return 'Balanced';
};

export interface StageScores {
  stage: string;
  emotional: number;
  rational: number;
  /** DERIVED: emotional minus rational. Positive means the heart runs ahead. */
  gap: number;
}

export interface JourneyMetrics {
  type: JourneyType;
  meta: JourneyMeta;
  /** The persona this journey belongs to, with its shares and conversion index. */
  persona: PersonaMetrics;
  /** Readiness stage key, derived from the persona. Never restated on the journey. */
  segmentKey: string;
  /** The five Transtheoretical stages, full detail. */
  stages: JourneyStageDetail[];
  scores: StageScores[];
  /** DERIVED: the gap at Precontemplation. The belief gap, quantified. */
  openingGap: number;
  /** DERIVED. */
  leadMode: LeadMode;
}

const buildMetrics = (type: JourneyType): JourneyMetrics => {
  const meta = journeyMeta[type];
  const persona = personaMetricsById[meta.personaId];
  const sub: JourneySubCategory | undefined =
    journeys[type]?.subCategories[JourneySubCategoryKey.MACRO_JOURNEY];
  const stages = sub?.stages ?? [];

  const scores: StageScores[] = stages.map((s) => {
    const emotional = parseScoreValue(s.emotionalScore);
    const rational = parseScoreValue(s.rationalScore);
    return { stage: s.title, emotional, rational, gap: emotional - rational };
  });

  const openingGap = scores[0]?.gap ?? 0;

  return {
    type,
    meta,
    persona,
    // Derived, not restated. personasData is the only place a stage is declared.
    segmentKey: persona?.persona.category ?? '',
    stages,
    scores,
    openingGap,
    leadMode: classifyLeadMode(openingGap),
  };
};

/** All five journeys, ordered up the readiness ladder. */
export const journeyMetrics: JourneyMetrics[] = TAB_ORDER.map(buildMetrics);

export const journeyMetricsByType: Record<JourneyType, JourneyMetrics> = Object.fromEntries(
  journeyMetrics.map((j) => [j.type, j]),
) as Record<JourneyType, JourneyMetrics>;

/**
 * Fixed 0 to 100 domain. The graph's default is a per-journey auto domain, which
 * is fine in isolation but makes any cross-journey comparison misleading: a
 * Sleepwalker curve peaking at 65 and a Caterer curve peaking at 95 render at the
 * same height. Every multi-journey view passes this instead.
 */
export const SHARED_SCORE_DOMAIN: [number, number] = [0, 100];

/**
 * Stage names, in order. THE SHARED X AXIS for any cross-journey view.
 *
 * Derived from `journeyMetrics[0]` ALONE, which is `TAB_ORDER[0]`. Nothing about
 * that guarantees the other four agree, and until the gap matrix promoted these
 * to column headers nothing checked. A journey whose stages were renamed,
 * reordered or truncated would render real numbers under the wrong headers with
 * nothing on screen saying so. `data/__integrity.ts` check 3c is what makes the
 * "identical across all five" claim true rather than merely expected.
 *
 * Note the second order trap: reordering `TAB_ORDER` in journeyMeta.ts looks
 * cosmetic but re-sources this axis.
 */
export const JOURNEY_STAGE_NAMES: string[] = journeyMetrics[0]?.stages.map((s) => s.title) ?? [];

/**
 * DERIVED. Observed range of `gap` across all 25 cells: -40 to +30.
 *
 * The matrix ramp is calibrated to `GAP_SCALE_MAX` (45), so today every cell is
 * inside the scale. A revised study that pushes a gap past this does not error,
 * it CLAMPS, and two different gaps then render as the same colour. __integrity
 * warns on it for that reason.
 */
export const GAP_DOMAIN: [number, number] = [-40, 30];

// -----------------------------------------------------------------------------
// Cross-journey findings, DERIVED AT RUNTIME rather than written down.
//
// Both of the statements the gap matrix makes on screen are facts about the
// current 25 numbers, not about the model. Hardcoding either would let a revised
// study leave a confident sentence on screen that its own data no longer
// supports, which is the worst failure a deck can have. These return the shape
// the copy is assembled from, or null, so the view can say nothing instead.
//
// No React and no DOM types, same as the rest of this file.
// -----------------------------------------------------------------------------

export interface UniversalStageShift {
  stageIndex: number;
  stageName: string;
  /** True when every journey's gap moved DOWN, meaning toward reason. */
  towardReason: boolean;
  deltas: { label: string; delta: number }[];
}

/**
 * The first stage, if any, where EVERY journey's gap moves the same way.
 *
 * Today this is Preparation, toward reason, in all five. It is the only stage
 * index where the five deltas share a sign and none is zero.
 */
export const findUniversalStageShift = (
  metrics: JourneyMetrics[],
): UniversalStageShift | null => {
  const n = metrics[0]?.scores.length ?? 0;
  for (let i = 1; i < n; i++) {
    const deltas = metrics.map((m) => (m.scores[i]?.gap ?? 0) - (m.scores[i - 1]?.gap ?? 0));
    if (deltas.length === 0) continue;
    const allDown = deltas.every((d) => d < 0);
    const allUp = deltas.every((d) => d > 0);
    if (!allDown && !allUp) continue;
    return {
      stageIndex: i,
      stageName: metrics[0].scores[i].stage,
      towardReason: allDown,
      deltas: metrics.map((m, k) => ({ label: m.meta.label, delta: deltas[k] })),
    };
  }
  return null;
};

export interface LevelCell {
  row: number;
  col: number;
  journey: JourneyMetrics;
  stageName: string;
  /** Emotional and rational are equal here, so one value covers both. */
  score: number;
  /**
   * Which side was AHEAD at the neighbouring stage, so the OTHER side is the one
   * that closed the gap. Null when it cannot be told.
   *
   * NAMED FOR WHAT IT MEASURES, not for what the sentence says. An earlier
   * version called this `arrivedFrom`, and the copy then read it as "the side
   * that caught up", which printed both findings exactly backwards on screen.
   * `caughtUp` below is the derived half; use that for prose.
   */
  wasAhead: 'feeling' | 'reason';
  /** The side that closed the gap. Always the opposite of `wasAhead`. */
  caughtUp: 'feeling' | 'reason';
}

/**
 * Cells where emotional exactly equals rational, and which side closed the gap.
 *
 * There are two today and they mean OPPOSITE things, which is the whole reason
 * this returns a direction: without it the finding reads as one fact twice.
 *
 * The rule is just the neighbouring stage's sign, preferring the previous stage
 * and falling back to the next at index 0. Negative means reason was ahead, so
 * feeling is what rose to meet it.
 *
 *   Devoted Caterers / Preparation, arriving from +25:  reason caught up.
 *   Secure Sleepwalkers / Contemplation, arriving from -40: feeling caught up.
 */
export const findLevelCells = (metrics: JourneyMetrics[]): LevelCell[] =>
  metrics.flatMap((m, row) =>
    m.scores.flatMap((s, col) => {
      if (s.gap !== 0) return [];
      const neighbour = m.scores[col - 1] ?? m.scores[col + 1];
      if (!neighbour || neighbour.gap === 0) return [];
      const wasAhead = neighbour.gap > 0 ? ('feeling' as const) : ('reason' as const);
      return [
        {
          row,
          col,
          journey: m,
          stageName: s.stage,
          score: s.emotional,
          wasAhead,
          caughtUp: wasAhead === 'feeling' ? ('reason' as const) : ('feeling' as const),
        },
      ];
    }),
  );
