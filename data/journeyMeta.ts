// -----------------------------------------------------------------------------
// Top-level copy for each of the five journeys.
//
// MOVED OUT OF pages/CustomerJourney.tsx, where it was a hardcoded literal inside
// the page component. It is a second journey data source and belongs beside the
// first.
//
// WHAT CHANGED IN THE MOVE, and why it matters:
//
//   - `marketShare` and `customerShare` are GONE. They were hand-duplicated from
//     personasData.ts ("22%" / "6%" existed in both files) with nothing keeping
//     them in sync.
//   - `segmentKey` is GONE. It was a third copy of the readiness stage.
//   - `personaId` REPLACES both. Everything else is derived through that one join,
//     so a journey can no longer disagree with its own persona about anything.
//
// SOURCE: "Lyka Consumer Journeys.pptx" in the project folder. `description` is
// its "Primary behaviour-change task" and `dynamic` is its "Journey dynamic",
// both verbatim. Do not edit the prose here by hand if the deck is revised.
// -----------------------------------------------------------------------------

import { JourneyType } from '../types';

export interface JourneyMeta {
  /** Persona name, matching personasData[].name. */
  title: string;
  /** The primary behaviour-change task: the one sentence that defines the journey. */
  description: string;
  /** The journey-dynamic paragraph. 85 to 95 words. */
  dynamic: string;
  /** Short tab label. */
  label: string;
  /**
   * THE ONLY JOIN. Points at personasData[].id. Readiness stage, colour, market
   * share and customer share are all derived from the persona, never restated.
   */
  personaId: number;
}

export const journeyMeta: Record<JourneyType, JourneyMeta> = {
  [JourneyType.DISCIPLINED_OUTSOURCERS]: {
    title: 'Disciplined Outsourcers',
    description: 'Give trusted permission to change, then replace the old routine with a better one.',
    dynamic:
      'Disciplined Outsourcers are not disengaged owners. They care about long-term health but have outsourced nutritional judgement to trusted experts and established routines. They are confident, consistent and highly expert-led. The vet is extremely influential for 57%, and for 19% it is their only extremely influential source. Just 9% are extremely open to fresh food and 2% to DTC, although 85% report being somewhat open to each. The journey therefore depends on credible permission to change. They are unlikely to self-disrupt purely because fresh feeding is fashionable or emotionally appealing.',
    label: 'Outsourcers',
    personaId: 401,
  },
  [JourneyType.SECURE_SLEEPWALKERS]: {
    title: 'Secure Sleepwalkers',
    description:
      'Create a genuine reason to reconsider without making feeding feel harder or implying they have failed their dog.',
    dynamic:
      'Secure Sleepwalkers are the most resistant audience because they perceive neither a problem nor an information gap. They are hands-off, independent and confident that the current routine is adequate. They skew older, regional and more traditional in how they view their dog. Only 3% are extremely open to fresh food and 6% to DTC. They are also weakly influenced by almost every information source: 38% cite the vet as extremely influential, 28% their own research and only 4% a brand’s website or social media.',
    label: 'Sleepwalkers',
    personaId: 402,
  },
  [JourneyType.CONFLICTED_TROUBLESHOOTERS]: {
    title: 'Conflicted Troubleshooters',
    description: 'Turn uncertainty into a simple, supported and low-risk path forward.',
    dynamic:
      'Conflicted Troubleshooters have the strongest active tension. They are frequently dealing with fussiness, health issues, uncertainty and limited time. Their journey can be fast, nonlinear and trigger-led, but it is also fragile. They are the segment most likely to have a dog with a health issue at 38%, and 58% describe their dog as choosy with food. They lack confidence, have lower mental bandwidth and are more likely to seek help from social media, reviews and forums. Despite this, 68% are open to switching brands, 54% to Lyka and 40% are extremely open to fresh food.',
    label: 'Troubleshooters',
    personaId: 301,
  },
  [JourneyType.MINDFUL_RESEARCHERS]: {
    title: 'Mindful Researchers',
    description: 'Make Lyka the most credible and defensible nutritional choice.',
    dynamic:
      'Mindful Researchers already accept that food affects long-term health. Their journey is not about creating category interest; it is about helping them determine whether Lyka is the most credible, nutritionally responsible choice. They are highly confident but also highly vigilant. They rely on experts and their own research, with 70% extremely open to fresh food, 86% to DTC and 70% likely to try Lyka. They are also the highest-spending segment in the Lyka study, claiming an average of $51 per week across wet and dry food.',
    label: 'Mindful Researchers',
    personaId: 201,
  },
  [JourneyType.DEVOTED_CATERERS]: {
    title: 'Devoted Caterers',
    description: 'Turn emotional alignment into confident trial, then sustain delight.',
    dynamic:
      'Devoted Caterers are unlikely to be in true category Precontemplation. They already care deeply about food, experiment with different formats and are highly open to fresh feeding. Their journey is primarily about moving from general openness to a confident Lyka trial, then ensuring Lyka continues delivering enjoyment and variety. They judge feeding success through their dog’s visible happiness. They are confident, vigilant and emotionally invested; 82% are extremely open to fresh food, 75% to DTC and 74% are likely to try Lyka.',
    label: 'Devoted Caterers',
    personaId: 101,
  },
};

/**
 * Tab order, up the readiness ladder. Deliberately the reverse of the source
 * deck's persona numbering, so it matches STAGE_ORDER in data/audienceModel.ts
 * and the sunburst's clockwise reading order.
 *
 * REORDERED 2026-08-07, following Disciplined Outsourcers to Curious. They led
 * this strip while they were the first Unaware persona; Sleepwalkers now leads
 * it alone and Outsourcers sits third, behind Troubleshooters, because within a
 * stage the order is largest market share first (25% then 22%) and that is what
 * `stageMetrics` sorts the chips by everywhere else.
 *
 * ⚠ TWO THINGS DEPEND ON THIS ARRAY beyond the strip, and neither is obvious:
 *
 *   - JOURNEY_STAGE_NAMES, the shared x axis of every cross-journey view, is
 *     sourced from TAB_ORDER[0] ALONE. Reordering re-sources it. Integrity check
 *     3c is what makes that safe.
 *   - The gap matrix reads rows in this order, and its canary is one cell: TOP
 *     LEFT MUST READ -40. Both Sleepwalkers and Outsourcers open at -40, so this
 *     particular swap keeps it, which is exactly why it is worth stating: the
 *     canary passing does not by itself prove the order is right.
 */
export const TAB_ORDER: JourneyType[] = [
  JourneyType.SECURE_SLEEPWALKERS,
  JourneyType.CONFLICTED_TROUBLESHOOTERS,
  JourneyType.DISCIPLINED_OUTSOURCERS,
  JourneyType.MINDFUL_RESEARCHERS,
  JourneyType.DEVOTED_CATERERS,
];
