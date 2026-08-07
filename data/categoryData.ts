// -----------------------------------------------------------------------------
// Lyka readiness ladder: the four stages plus the centre disc.
//
// SOURCE
// - Stage definitions: the four Roy Morgan Single Source profile exports in
//   .../New Business/Lyka/Roy Morgan/ ("Unaware Owner.prwx", "Curious Owner.prwx",
//   "Considering Owner.prwx", "Ready Owner.prwx"). Those files hold the actual
//   query definitions, so the four stage names are research artefacts, not
//   agency invention.
// - Segment narratives and every percentage: "Audience Personas_Enriched Version
//   for Aaron.docx" in the same folder.
//
// FIGURE INTEGRITY
// Every PERSONA percentage is quoted from that document. Market shares sum to
// 100% (11 + 15 + 25 + 22 + 27) and Lyka customer shares sum to 100% (27 + 55 +
// 9 + 6 + 3). The only derived numbers are the two Curious totals, which are
// arithmetic on sourced figures.
//
// ⚠ THE STAGE TOTALS BELOW MOVED ON 2026-08-07 and the personas did not. Lyka
// asked for Disciplined Outsourcers (22% of market, 6% of customers) to sit in
// CURIOUS rather than Unaware / Unconvinced, so:
//
//   Unaware  49% -> 27% of market,  9% -> 3% of customers  (Sleepwalkers alone)
//   Curious  25% -> 47% of market,  9% -> 15% of customers (Troubleshooters
//                                                           plus Outsourcers)
//
// Nothing else in the model changes. Considering and Ready are untouched, both
// columns still total 100%, and the deck's central argument is unaffected: the
// friction gap is still 26% of market against 82% of customers.
//
// These four figures are HAND WRITTEN and audienceModel.ts SUMS the same totals
// from the personas independently. Integrity check 7b asserts the two agree, so
// moving a persona without editing this file fails loudly rather than silently.
//
// The centre disc carries NO absolute count. There is no verified Australian dog
// population figure in the source pack, and an invented volume on a deck whose
// credibility rests on real numbers is not worth the polish.
//
// KEYS ARE A JOIN KEY across five places: personasData[].category, these keys,
// SEGMENT_COLORS in data/brand.ts, RING_LAYOUT / CENTRE_KEY in
// PersonaCompositionChart, and SEGMENT_IMAGES in CategoryDetail (which keys off
// `title`, parenthetical included). data/__integrity.ts asserts all of them.
// -----------------------------------------------------------------------------

export interface CategoryDetail {
  title: string;
  snapshot: string;
  description?: string;
  /** Share of the Australian dog-owner market, e.g. "27%". */
  marketShare?: string;
  /** Share of Lyka's current customer base, e.g. "3%". */
  customerShare?: string;
  /** The behaviour-change task for this stage. */
  movement?: string;
  triggers: string[];
  barriers: string[];
  motivations: string[];
  influences: string[];
  decisionCriteria: string[];
  winningPlays: string[];
  kpis: string[];
}

/** Fields the Segment Deep Dive panel does not render. Kept for type compatibility. */
const UNRENDERED = {
  triggers: [],
  barriers: [],
  motivations: [],
  influences: [],
  decisionCriteria: [],
  winningPlays: [],
  kpis: [],
};

export const categoryData: Record<string, CategoryDetail> = {
  'Australian Dog Owners': {
    title: 'Australian Dog Owners',
    marketShare: '100%',
    customerShare: '100%',
    snapshot:
      'The whole dog-owner market, sorted by how ready each owner is to change how they feed their dog.',
    description:
      'The ladder runs Unaware, Curious, Considering, Ready. It is a readiness model, not a demographic one: owners move along it when something changes for their dog, and they do not always move one rung at a time. Both non-sequential jumps the research names start from Curious: an acute health or fussiness trigger can take a Conflicted Troubleshooter straight to Ready, and an expert recommendation can move a Disciplined Outsourcer to Considering or Ready. Read alongside the customer-share figures, the ladder makes Lyka\'s central commercial problem visible: 82% of current customers come from the two smallest, warmest stages, which together are only 26% of the market.',
    movement: 'Move owners up the ladder, and convert further down it than Lyka does today.',
    ...UNRENDERED,
  },

  Unaware: {
    title: 'Unaware / Unconvinced (27%)',
    marketShare: '27%',
    customerShare: '3%',
    snapshot:
      'The largest single persona in the market and the weakest near-term conversion opportunity. They perceive no problem to solve.',
    description:
      'Secure Sleepwalkers sit here alone. They are relaxed and hands-off, confident the current routine is good enough, and the least open segment on every measure: 3% extremely open to fresh food, 6% to DTC, 31% likely to try Lyka. They skew older, female, regional and lower income, with older dogs but fewer perceived health problems, which may reflect lower vigilance rather than lower need. Price, convenience and familiarity dominate brand choice, and they buy from a small repertoire of established supermarket brands. Their claimed weekly food spend is $31 against a market average of $37, which makes Lyka\'s premium more visible. Resistance here is closer to absolute than conditional: this is the one stage where scale should not be mistaken for convertibility, and direct response investment should stay limited until a dog-related trigger appears.',
    movement: 'Build familiarity and category belief before a trigger, not conversion pressure after it.',
    ...UNRENDERED,
  },

  Curious: {
    title: 'Curious (47%)',
    marketShare: '47%',
    customerShare: '15%',
    snapshot:
      'Nearly half the market and the largest realistic audience-shifting opportunity, on two very different routes in.',
    description:
      'Two distinct personas sit here. Conflicted Troubleshooters (25% of market) are younger, less experienced and more time-pressured, and their dogs generate real feeding problems: 38% have a dog with a health issue against 29% of the market, and 58% describe their dog as choosy against 49%. They experience feeding as trial and error and lack the confidence to judge competing advice, yet they are not low value: 58.9% say they want the best and are willing to pay for it, index 146. The constraint is confidence, not aspiration. Disciplined Outsourcers (22% of market) arrive from the opposite direction. They are responsible and routine-oriented, and have delegated nutritional judgement to a vet, breeder or established brand; 57% name the vet as an extremely influential source and for 19% the vet is their only one. So this stage holds both the biggest growth prize and the two audiences needing the most different arguments: one needs a simple, low-risk answer, the other needs credible permission to change. Together they are 47% of the market and only 15% of the customer base.',
    movement: 'Curious to Considering. An acute health trigger can jump straight to Ready, and an expert recommendation can move an Outsourcer to Considering or Ready.',
    ...UNRENDERED,
  },

  Considering: {
    title: 'Considering (15%)',
    marketShare: '15%',
    customerShare: '55%',
    snapshot:
      'Only 15% of the market but 55% of Lyka customers. This is where the business currently converts.',
    description:
      'Mindful Researchers are nutrition-first owners who treat food as a long-term health decision. Metropolitan, mostly 25 to 44, professionally employed and higher income, with 31.5% earning $100,000 or more personally, index 132, and 94.2% agreeing quality matters more than price, index 130. They combine veterinary or breeder advice with their own research and comparison, and their comfort with brands like Royal Canin shows they respond to tailored, clinically framed propositions. They are already highly aligned: 70% extremely open to fresh food, 86% to DTC, 70% likely to try Lyka. A meaningful proportion are behaviourally Ready already, so the segment should be split into upper-Considering and Ready audiences at activation rather than treated as one.',
    movement: 'Considering to Ready to Trial. Resolve evidence, price, transition and convenience objections in order.',
    ...UNRENDERED,
  },

  Ready: {
    title: 'Ready (11%)',
    marketShare: '11%',
    customerShare: '27%',
    snapshot:
      'The smallest stage and the most aligned. The task is not to change belief, it is to make starting feel easy.',
    description:
      'Devoted Caterers see feeding as one of the clearest ways to express love, and they measure success through visible enjoyment: is the dog excited, satisfied, eating happily. Younger to midlife, metropolitan, higher-income family households with children, where the dog is treated as family. They already experiment, with 46% providing mixed meals against 36% of the market, and they skew premium and fresh. Alignment with Lyka is the highest of any segment: 82% extremely open to fresh food, 75% to DTC, 74% likely to try Lyka within six months. The Roy Morgan Ready overlay confirms the mindset, with 56.6% wanting the best and willing to pay, index 140. Their dog\'s response is the decision-maker, so a nutritional argument will not overcome the fear of rejection at the bowl.',
    movement: 'Ready to Trial to repeat purchase and advocacy.',
    ...UNRENDERED,
  },
};
