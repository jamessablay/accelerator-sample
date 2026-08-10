// -----------------------------------------------------------------------------
// NOTION COWORKING SETUP: all copy for the seventh page.
//
// Source of truth: `Lyka Notion Coworking Setup.pptx`, a 10-slide deck in
// .../The Speed Agency - Documents/New Business/Lyka/. Every string below traces
// to a slide (see docs/notion-page-plan.md section 3 for the slide-by-slide map).
// This is NOT a slide transcription: the content is recast for an interactive
// webpage. Never invent a claim or a figure that is not in the deck.
//
// HOUSE STYLE PASS applied here, once, so the components never carry raw deck
// copy (the same discipline data/tenThingsData.ts follows):
//   - No em dashes. The deck is full of them; rewritten to a colon, comma or
//     full stop, whichever the sentence wants.
//   - No hyphenated compound modifiers: "dog parent audiences", not
//     "dog-parent". (Exception: proper nouns like GA4.)
//   - `|` for UI separators, `:` for labels, "to" for ranges.
//   - The `×` in "Lyka × SPEED" is a real U+00D7 multiplication sign. Keep it.
//
// PURE TS. No React, no DOM types: this file is only data, and keeping it plain
// means the two-party colours stay in the components (they come from
// OWNER_COLORS in brand.ts, the one sanctioned reuse on this page).
//
// The actor union is a typed string, so tsc enforces it and no data/__integrity
// check is needed: there are no silent string-key joins, no asset paths and no
// new colour pairs on this page.
// -----------------------------------------------------------------------------

/** Who a practice step belongs to. `both` = a joint moment. */
export type CoworkActor = 'lyka' | 'speed' | 'both';

export interface CoworkPillar {
  id: string;
  number: string;
  title: string;
  blurb: string;
  items: readonly string[];
}
export interface CoworkStep {
  number: string;
  title: string;
  body: string;
}
export interface CoworkPracticeStep extends CoworkStep {
  actor: CoworkActor;
}
export interface CoworkContrast {
  before: string;
  after: string;
}
/** A growing stack in the compounding visual. `level` is 1 to 3, not a measure. */
export interface CoworkMonth {
  label: string;
  level: number;
}

// -----------------------------------------------------------------------------
// Header (page host)
// -----------------------------------------------------------------------------

export const PAGE_EYEBROW = 'Lyka × SPEED | Ways of working';
export const PAGE_TITLE = 'One shared space for Lyka × SPEED';
/** Slide 2's thesis, tightened for a subtitle. */
export const PAGE_SUBTITLE =
  'A single Notion workspace both teams, and both Claudes, keep current. Less re-explaining, more building on what we already know.';

// -----------------------------------------------------------------------------
// A. The problem (slide 2)
// -----------------------------------------------------------------------------

export const PROBLEM_HEADLINE = 'Knowledge should not live in inboxes';
export const PROBLEM_BODY =
  'Context scatters across emails, decks, calls and files. It ages fast, and gets lost. Both our teams have powerful AI, but it only knows what it is told.';
export const PROBLEM_QUESTION =
  'What if we shared one living space that both teams, and both AIs, kept current?';

/** The four scattered chips that converge into one space. */
export const SCATTERED_SOURCES: readonly string[] = [
  'Emails',
  'Decks',
  'Call notes',
  'Files',
];
export const ONE_SHARED_SPACE = 'One shared space';

// -----------------------------------------------------------------------------
// B. The shared space (slide 3)
// -----------------------------------------------------------------------------

export const HUB = {
  lyka: { team: 'Lyka team', ai: "Lyka's Claude" },
  speed: { team: 'SPEED team', ai: "SPEED's Claude" },
  centre: 'Shared Space',
  centreSub: 'A single Notion workspace we both work in, always current.',
  caption:
    'Both teams read and contribute, and both AIs use it to find, draft, and add knowledge.',
} as const;

export const SHARED_SPACE_HEADLINE = 'One shared space for Lyka × SPEED';

// -----------------------------------------------------------------------------
// C. Four places (slide 4)
// -----------------------------------------------------------------------------

export const PILLARS_HEADLINE = 'Everything about our work, in four places';

export const PILLARS: readonly CoworkPillar[] = [
  {
    id: 'strategy',
    number: '01',
    title: 'Shared Strategy & Context',
    blurb: 'The thinking both teams build from.',
    items: [
      'Positioning',
      'Dog parent audiences',
      'Growth priorities',
      'Media strategy',
      'Ways of working',
    ],
  },
  {
    id: 'meetings',
    number: '02',
    title: 'Meeting Notes & Decisions',
    blurb: 'What we agreed, and what is still open.',
    items: [
      'Chemistry & planning notes',
      'Key decisions',
      'Open questions',
      'Actions',
    ],
  },
  {
    id: 'data',
    number: '03',
    title: 'Data & Measurement Context',
    blurb: 'The numbers, and the assumptions behind them.',
    items: [
      'GA4 notes',
      'Subscription & retention metrics',
      'Media spend',
      'Assumptions',
    ],
  },
  {
    id: 'documents',
    number: '04',
    title: 'Working Documents',
    blurb: 'The work in progress, drafted in the open.',
    items: [
      'Draft briefs',
      'Strategy territories',
      'Hypotheses',
      'Reporting commentary',
    ],
  },
];

// -----------------------------------------------------------------------------
// D. How it works (slides 5 and 6)
// -----------------------------------------------------------------------------

export const SETUP_HEADLINE = 'Your Claude, plugged into our shared space';

export const SETUP_STEPS: readonly CoworkStep[] = [
  {
    number: '01',
    title: 'Connect',
    body: 'Connect your Claude to your space, once. Lyka already has Notion and Claude.',
  },
  {
    number: '02',
    title: 'Ask & draft',
    body: 'Ask questions and get answers from what is really in the space. Draft briefs and notes with it.',
  },
  {
    number: '03',
    title: 'Contribute',
    body: 'Add what you create for us to see. The space stays current, on both sides.',
  },
];

export const SETUP_FOOTNOTE =
  'We work the same way on our side, so the space always reflects the latest thinking.';

export const PRACTICE_HEADLINE = 'How it feels in practice';

export const PRACTICE_STEPS: readonly CoworkPracticeStep[] = [
  {
    number: '01',
    title: 'We meet',
    body: 'Planning session on an upcoming Lyka campaign. Notes land in the space.',
    actor: 'both',
  },
  {
    number: '02',
    title: 'Lyka adds context',
    body: "A new recipe launch or subscription change. Lyka's Claude helps write it up.",
    actor: 'lyka',
  },
  {
    number: '03',
    title: 'SPEED drafts',
    body: "SPEED's Claude picks it up and drafts strategy territories.",
    actor: 'speed',
  },
  {
    number: '04',
    title: 'We refine together',
    body: 'Decisions and next steps captured live.',
    actor: 'both',
  },
];

/** Label for each actor, used on the practice step tags and the hub diagram. */
export const ACTOR_LABEL: Record<CoworkActor, string> = {
  lyka: 'Lyka',
  speed: 'SPEED',
  both: 'Both',
};

// -----------------------------------------------------------------------------
// E. The context compounds (slide 7) + Private, and yours alone (slide 8)
// -----------------------------------------------------------------------------

export const COMPOUNDING_HEADLINE = 'The context compounds';
export const COMPOUNDING_BODY =
  'Every decision, brief, and insight lives in one place, and stays. New team members, or a fresh AI session, are instantly up to speed on Lyka.';
export const COMPOUNDING_CAPTION =
  'Knowledge accumulates the longer we work together.';

export const COMPOUNDING: readonly CoworkMonth[] = [
  { label: 'Month 1', level: 1 },
  { label: 'Month 3', level: 2 },
  { label: 'Month 6', level: 3 },
];

export const PRIVACY_HEADLINE = 'Private, and yours alone';
export const PRIVACY_POINTS: readonly string[] = [
  'Your space is shared only between Lyka and SPEED. No other client can see it.',
  'You access it with your own login, nothing to hand over.',
  "Every entry shows who added it, and nothing is treated as final until it is confirmed.",
];
/** The boxes outside the privacy boundary, all marked no access. */
export const PRIVACY_OUTSIDERS: readonly string[] = [
  'Other client',
  'Other client',
  'Other client',
];

// -----------------------------------------------------------------------------
// F. From scattered to shared (slide 9) + You're already set up (slide 10)
// -----------------------------------------------------------------------------

export const CONTRASTS_HEADLINE = 'From scattered to shared';

export const CONTRASTS: readonly CoworkContrast[] = [
  { before: 'Scattered emails & attachments', after: 'One living source of truth' },
  { before: 'Re-briefing every time', after: 'Both teams contribute, always current' },
  { before: 'Context stuck with one person', after: 'Everyone shares the same context' },
  { before: 'AI guessing without context', after: 'AI grounded in real context' },
  { before: 'Momentum lost between meetings', after: 'Momentum carried between meetings' },
];

export const CLOSING_HEADLINE = 'You are already set up';
export const CLOSING_LEAD = 'Notion and Claude already set up: that is all it takes.';

export const CLOSING_STEPS: readonly CoworkStep[] = [
  {
    number: '01',
    title: 'We create your space',
    body: 'We set up your shared Notion space, nothing for you to build.',
  },
  {
    number: '02',
    title: 'You connect Claude',
    body: 'You link your own Claude to the space, once.',
  },
  {
    number: '03',
    title: 'We start co-building',
    body: 'Beginning with our very next session together.',
  },
];

export const CLOSING_NOTE = 'Light touch: no new tools, no migration.';
