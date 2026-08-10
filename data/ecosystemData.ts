// -----------------------------------------------------------------------------
// PLUGGING INTO THE ECOSYSTEM: all copy for the eighth page.
//
// Source of truth: `Plugging Into The Existing Ecosystem.html`, one folder up in
// `Accelerator - Lyka/`. Every string below traces to that page. This is NOT a
// transcription of its markup: the content is recast for the app's house system
// (the Notion Coworking Setup precedent). Never invent a claim not in the source.
//
// HOUSE STYLE PASS applied here, once, so the components never carry raw source
// copy (the same discipline data/notionCoworkingData.ts and data/tenThingsData.ts
// follow):
//   - No hyphenated compound modifiers. The source has several; rewritten:
//     "best-in-class" -> "best in class", "test-and-learn" -> "test and learn",
//     "decision-making" -> "decision making", "mix-modelling" -> "mix modelling".
//   - No em dashes. The source's two ("add perspective — not headcount",
//     "day to day — ensuring") became a comma.
//   - `|` for UI separators, `:` for labels, "to" for ranges.
//   - The `×` in "Lyka × SPEED" is a real U+00D7 multiplication sign. Keep it.
//   - The `’` in possessives is a real U+2019 apostrophe.
//
// PURE TS. No React, no DOM types: this file is only data. It adds no silent
// string-key joins, no asset paths and no new colour pairs, so it needs no
// data/__integrity check (same as notionCoworkingData.ts).
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Header (page host). The hero from the source: eyebrow, the three-clause title,
// then the negative ("not to replace") and positive ("it is to plug in") framing.
// -----------------------------------------------------------------------------

export const PAGE_EYEBROW = 'Lyka × SPEED | Our role';
export const PAGE_TITLE = 'Plug in. Strengthen what works. Make the whole thing work harder.';
/** The source hero's "neg": what our role is NOT. Rendered muted. */
export const PAGE_INTRO_NEGATIVE =
  'Lyka already has a sophisticated internal team, strong data capabilities and best in class measurement tools in place. Our role is not to replace or disrupt that infrastructure.';
/** The source hero's "pos": what our role IS. Rendered emphasised. */
export const PAGE_INTRO_POSITIVE =
  'It is to plug in, strengthen what already works, and make the whole ecosystem work harder.';

// -----------------------------------------------------------------------------
// A. How it fits together (the source's SVG hub diagram, rebuilt as DOM/CSS).
// -----------------------------------------------------------------------------

export const FIT_EYEBROW = 'How it fits together';
export const FIT_HEADLINE = 'Four connections into what already exists';

/** The central hub: Lyka's ecosystem, and the three things already in place. */
export const ECOSYSTEM_HUB = {
  eyebrow: 'Already in place',
  title: 'Lyka’s ecosystem',
  items: [
    'A sophisticated internal team',
    'Strong data capabilities',
    'Best in class measurement tools',
  ],
} as const;

export interface EcosystemConnection {
  id: string;
  title: string;
  body: string;
}

/** The four connections that plug into the hub. */
export const CONNECTIONS: readonly EcosystemConnection[] = [
  {
    id: 'partnerships',
    title: 'Measurement partnerships',
    body: 'Operationalise the incrementality and mix modelling tools already there.',
  },
  {
    id: 'analysts',
    title: 'Alongside the analysts',
    body: 'Compare notes, share use cases, add perspective, not headcount.',
  },
  {
    id: 'by-design',
    title: 'Measurement by design',
    body: 'Testing and variation built into campaigns from the outset.',
  },
  {
    id: 'complementary',
    title: 'Complementary data',
    body: 'New data, technology and partners, integrated safely.',
  },
];

export const FIT_CAPTION = 'Nothing replaced. Everything additive.';

// -----------------------------------------------------------------------------
// B. What we would actually do (the four numbered pillars).
// -----------------------------------------------------------------------------

export const PILLARS_EYEBROW = 'The four';
export const PILLARS_HEADLINE = 'What we would actually do';

export interface EcosystemPillar {
  number: string;
  title: string;
  lede: string;
  body: readonly string[];
}

export const PILLARS: readonly EcosystemPillar[] = [
  {
    number: '01',
    title: 'Maximise existing measurement partnerships',
    lede: 'Lyka already has established incrementality and media mix modelling partners.',
    body: [
      'We can help operationalise these platforms day to day, ensuring campaigns are structured, populated and activated in ways that improve the quality of measurement.',
      'That means designing campaigns with testing, variation and measurement requirements built in from the outset, improving both immediate learnings and the accuracy of future models.',
    ],
  },
  {
    number: '02',
    title: 'Work alongside Lyka’s analysts',
    lede: 'Lyka’s internal analytics capability is already highly advanced.',
    body: [
      'We would work collaboratively with the team, sharing use cases, approaches and learnings from other environments to identify opportunities to enhance reporting, analysis and decision making.',
      'The objective is not to duplicate capability, but to compare notes, share experience and add new perspectives where they create value.',
    ],
  },
  {
    number: '03',
    title: 'Build measurement into campaign design',
    lede: 'Measurement should not be an afterthought.',
    body: [
      'Where appropriate, we would embed test and learn structures directly into campaign planning, including audience, geographic, creative or investment variation.',
      'This creates stronger inputs for incrementality testing and modelling, and progressively builds a richer evidence base for future media decisions.',
    ],
  },
  {
    number: '04',
    title: 'Bring additional data into the ecosystem',
    lede: 'Complementary data, technology and partner capabilities, added to what already exists.',
    body: [
      'We can introduce these into Lyka’s existing infrastructure without disturbing it.',
      'Where contractual or partner restrictions limit direct data sharing, we can still integrate those capabilities safely and effectively.',
    ],
  },
];

// -----------------------------------------------------------------------------
// The principle band (the source's dark middle band, three phrases).
// -----------------------------------------------------------------------------

export const PRINCIPLE_EYEBROW = 'The principle';
export const PRINCIPLES: readonly string[] = [
  'No duplication',
  'No unnecessary complexity',
  'Everything additive',
];

// -----------------------------------------------------------------------------
// The outcome (the dark closing band). Lowercase is deliberate: the items read
// as continuations of the heading "...ecosystem that: makes better use of...".
// -----------------------------------------------------------------------------

export const OUTCOME_EYEBROW = 'The outcome';
export const OUTCOME_HEADLINE = 'A connected measurement and data ecosystem that:';
export const OUTCOMES: readonly string[] = [
  'makes better use of existing tools',
  'strengthens campaign design and testing',
  'improves the quality of measurement inputs',
  'complements Lyka’s internal analytics capability',
  'continuously improves the evidence behind media investment decisions',
];
