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

/** Stage names, in order. Identical across all five journeys. */
export const JOURNEY_STAGE_NAMES: string[] = journeyMetrics[0]?.stages.map((s) => s.title) ?? [];
