// -----------------------------------------------------------------------------
// APEX by SPEED: REAL LYKA since 2026-08-07.
//
// Two audiences, one Roy Morgan Single Source pull each, exported from the APEX
// by SPEED Tool as `APEX_lyka_conflicted-troubleshooters.pptx` and
// `APEX_lyka_mindful-researchers (1).pptx` (both in the project folder, one
// level above the app). The raw inputs below are transcribed from the tool's
// own `data/lykaPresets.ts`, which generated those decks:
//   RFI - Hamilton Island - Full Response/APEX by SPEED Tool/apex-by-speed/
//
// THE DERIVED COLUMNS ARE COMPUTED, NOT TYPED. `tnwIndex` (the True Net Worth
// Index), `ttdStars` and `quadrant` are all derived at module load by the same
// arithmetic as the tool's `lib/apexEngine.ts`, so they cannot drift from their
// inputs. data/__integrity.ts holds an independent transcription of the PPTX
// slide 4 published values and asserts the recomputation reproduces all 28.
//
// EDITING RULES
// - Revise an audience by editing its raw input block (heavyPct, rmIndex,
//   addressableReach per channel). Everything else re-derives.
// - Adding an audience (the tool also holds Devoted Caterers and Secure
//   Sleepwalkers presets) is one input block + one apexTables entry. Do it only
//   from a reviewed export, and extend EXPECTED_TNWI in __integrity.ts with it.
// - The channel constants (knf, ttd, tier) are SPEED research values from the
//   tool's `data/constants.ts`, the single knowledge base. Cinema's attention
//   score was revised 61.4 -> 110.0 there on 2026-08-06; if the research is
//   updated again, update the tool first and mirror it here.
// - The rebase is over the rows present: adding or removing a channel changes
//   EVERY tnwIndex in that table, which is correct and expected.
// -----------------------------------------------------------------------------
import { LYKA } from './brand';

export type ApexTier =
  | 'PUBLISHING'
  | 'BROADCAST'
  | 'AUDIO'
  | 'OUTDOOR'
  | 'CINEMA'
  | 'SOCIAL'
  | 'DIGITAL';

export type ApexTableKey = 'CONFLICTED_TROUBLESHOOTERS' | 'MINDFUL_RESEARCHERS';

export type ApexSourceKey = 'RM' | 'KNF' | 'TTD';

export type QuadrantKey = 'must-win' | 'influence-booster' | 'reach-booster' | 'tangential';

export interface ApexChannelRow {
  channel: string;
  tier: ApexTier;
  /** Heavy reach %: the top tier audience for this channel. Roy Morgan. */
  heavyPct: number;
  /** Audience heavy % over population heavy %, x100. Roy Morgan. */
  rmIndex: number;
  /** Karen Nelson-Field attention score. Channel constant. */
  knfScore: number;
  /** The Trade Desk / PA Consulting premium environment multiplier. Constant. */
  ttdMultiplier: number;
  /** DERIVED from ttdMultiplier. 3 = neutral (1.00x), below 1.00x is a penalty. */
  ttdStars: 1 | 2 | 3 | 4 | 5;
  /** DERIVED: rm x knf x ttd, indexed to the mean of this table's rows = 100. */
  tnwIndex: number;
  /** Share of the audience the channel can reach in the recent window. Roy Morgan. */
  addressableReach: number;
  /** DERIVED from addressableReach and tnwIndex against the thresholds below. */
  quadrant: QuadrantKey;
}

export interface ApexTable {
  key: ApexTableKey;
  label: string;
  shortLabel: string;
  population: number;
  populationLabel: string;
  subtitle: string;
  rows: ApexChannelRow[];
}

export interface ApexMethodologySource {
  number: '01' | '02' | '03';
  key: ApexSourceKey;
  pillLabel: string;
  pillSubLabel: string;
  title: string;
  subtitle: string;
  accent: string;
  bullets: string[];
}

// -----------------------------------------------------------------------------
// The channel knowledge base. 14 channels; knf and ttd are SPEED research
// constants, identical for every audience. Mirrors the tool's constants.ts.
// -----------------------------------------------------------------------------

interface ChannelConstant {
  label: string;
  tier: ApexTier;
  knf: number;
  ttd: number;
}

const CHANNEL_CONSTANTS = {
  'linear-tv':         { label: 'Linear TV (FTA)',        tier: 'BROADCAST',  knf: 107.1, ttd: 1.00 },
  'svod':              { label: 'SVOD (streaming)',       tier: 'BROADCAST',  knf: 107.1, ttd: 1.40 },
  'bvod':              { label: 'BVOD (catch up TV)',     tier: 'BROADCAST',  knf: 107.1, ttd: 1.40 },
  'pay-tv':            { label: 'Pay TV',                 tier: 'BROADCAST',  knf: 107.1, ttd: 1.00 },
  'radio':             { label: 'Radio',                  tier: 'AUDIO',      knf: 103.2, ttd: 1.20 },
  'podcasts':          { label: 'Podcasts',               tier: 'AUDIO',      knf: 103.2, ttd: 1.20 },
  'outdoor':           { label: 'Outdoor (Out & About)',  tier: 'OUTDOOR',    knf: 71.7,  ttd: 1.05 },
  'social':            { label: 'Social media',           tier: 'SOCIAL',     knf: 65.8,  ttd: 0.75 },
  'music-streaming':   { label: 'Music streaming',        tier: 'AUDIO',      knf: 65.8,  ttd: 1.10 },
  'cinema':            { label: 'Cinema',                 tier: 'CINEMA',     knf: 110.0, ttd: 1.15 },
  'digital-news':      { label: 'Digital news',           tier: 'PUBLISHING', knf: 57.6,  ttd: 1.35 },
  'online-video':      { label: 'Online video / YouTube', tier: 'DIGITAL',    knf: 57.6,  ttd: 1.00 },
  'digital-magazines': { label: 'Digital magazines',      tier: 'PUBLISHING', knf: 50.0,  ttd: 1.15 },
  'online-display':    { label: 'Online display',         tier: 'DIGITAL',    knf: 50.0,  ttd: 0.85 },
} as const satisfies Record<string, ChannelConstant>;

type ChannelKey = keyof typeof CHANNEL_CONSTANTS;

// -----------------------------------------------------------------------------
// Raw audience inputs: the Roy Morgan pull, per channel. From lykaPresets.ts.
// -----------------------------------------------------------------------------

interface ApexAudienceInput {
  key: ChannelKey;
  heavyPct: number;
  rmIndex: number;
  addressableReach: number;
}

const CONFLICTED_TROUBLESHOOTERS_INPUTS: ApexAudienceInput[] = [
  { key: 'linear-tv',         heavyPct: 17.9, rmIndex: 101, addressableReach: 67.8 },
  { key: 'svod',              heavyPct: 7.3,  rmIndex: 102, addressableReach: 31.2 },
  { key: 'bvod',              heavyPct: 11.6, rmIndex: 139, addressableReach: 25.7 },
  { key: 'pay-tv',            heavyPct: 3.3,  rmIndex: 91,  addressableReach: 14.1 },
  { key: 'radio',             heavyPct: 21.8, rmIndex: 110, addressableReach: 65.9 },
  { key: 'podcasts',          heavyPct: 7.6,  rmIndex: 110, addressableReach: 22.3 },
  { key: 'outdoor',           heavyPct: 26.0, rmIndex: 106, addressableReach: 63.0 },
  { key: 'social',            heavyPct: 30.2, rmIndex: 103, addressableReach: 88.3 },
  { key: 'music-streaming',   heavyPct: 5.1,  rmIndex: 112, addressableReach: 15.8 },
  { key: 'cinema',            heavyPct: 20.3, rmIndex: 118, addressableReach: 22.8 },
  { key: 'digital-news',      heavyPct: 26.8, rmIndex: 102, addressableReach: 81.8 },
  { key: 'online-video',      heavyPct: 18.5, rmIndex: 98,  addressableReach: 55.4 },
  { key: 'digital-magazines', heavyPct: 9.6,  rmIndex: 116, addressableReach: 27.6 },
  { key: 'online-display',    heavyPct: 18.0, rmIndex: 106, addressableReach: 54.6 },
];

const MINDFUL_RESEARCHERS_INPUTS: ApexAudienceInput[] = [
  { key: 'linear-tv',         heavyPct: 17.8, rmIndex: 100, addressableReach: 70.7 },
  { key: 'svod',              heavyPct: 7.9,  rmIndex: 111, addressableReach: 33.6 },
  { key: 'bvod',              heavyPct: 13.1, rmIndex: 157, addressableReach: 27.5 },
  { key: 'pay-tv',            heavyPct: 3.6,  rmIndex: 100, addressableReach: 15.7 },
  { key: 'radio',             heavyPct: 23.2, rmIndex: 117, addressableReach: 71.0 },
  { key: 'podcasts',          heavyPct: 7.9,  rmIndex: 116, addressableReach: 23.8 },
  { key: 'outdoor',           heavyPct: 29.2, rmIndex: 119, addressableReach: 68.5 },
  { key: 'social',            heavyPct: 32.6, rmIndex: 111, addressableReach: 91.7 },
  { key: 'music-streaming',   heavyPct: 6.0,  rmIndex: 132, addressableReach: 17.1 },
  { key: 'cinema',            heavyPct: 22.3, rmIndex: 130, addressableReach: 25.7 },
  { key: 'digital-news',      heavyPct: 29.6, rmIndex: 112, addressableReach: 88.1 },
  { key: 'online-video',      heavyPct: 21.1, rmIndex: 112, addressableReach: 65.7 },
  { key: 'digital-magazines', heavyPct: 13.0, rmIndex: 158, addressableReach: 34.1 },
  { key: 'online-display',    heavyPct: 23.5, rmIndex: 138, addressableReach: 67.1 },
];

// -----------------------------------------------------------------------------
// The derivation. Same arithmetic as the tool's lib/apexEngine.ts + quadrant.ts.
// -----------------------------------------------------------------------------

/**
 * 1.00x = "no premium effect" = the neutral midpoint (3 of 5). Below 1.00 reads
 * as a penalty, above as an uplift. Keeps the star count honest against the
 * multiplier it represents.
 */
export const assignStars = (ttd: number): 1 | 2 | 3 | 4 | 5 =>
  ttd >= 1.3 ? 5 : ttd >= 1.1 ? 4 : ttd >= 1.0 ? 3 : ttd >= 0.85 ? 2 : 1;

/** Below or at this addressable reach a channel cannot deliver meaningful scale. */
export const REACH_THRESHOLD = 40;
/** Below this TNW Index a channel is below average influence. */
export const INDEX_THRESHOLD = 100;

/**
 * Strict greater-than for reach: a channel exactly on the 40% line is treated
 * as below scale, matching the tool and the whitepaper's worked example.
 */
export const assignQuadrant = (addressableReach: number, tnwIndex: number): QuadrantKey => {
  const highReach = addressableReach > REACH_THRESHOLD;
  const highIndex = tnwIndex >= INDEX_THRESHOLD;
  if (highReach && highIndex) return 'must-win';
  if (!highReach && highIndex) return 'influence-booster';
  if (highReach && !highIndex) return 'reach-booster';
  return 'tangential';
};

/**
 * rm x knf x ttd per row, indexed to the mean of the rows present = 100, then
 * sorted by tnwIndex descending (channel name breaks ties), which is the PPTX
 * slide 4 order.
 */
const buildRows = (inputs: ApexAudienceInput[]): ApexChannelRow[] => {
  const raw = inputs.map((r) => {
    const c = CHANNEL_CONSTANTS[r.key];
    return r.rmIndex * c.knf * c.ttd;
  });
  const mean = raw.reduce((s, v) => s + v, 0) / raw.length;
  return inputs
    .map((r, i) => {
      const c = CHANNEL_CONSTANTS[r.key];
      const tnwIndex = Math.round((raw[i] / mean) * 100);
      return {
        channel: c.label,
        tier: c.tier,
        heavyPct: r.heavyPct,
        rmIndex: r.rmIndex,
        knfScore: c.knf,
        ttdMultiplier: c.ttd,
        ttdStars: assignStars(c.ttd),
        tnwIndex,
        addressableReach: r.addressableReach,
        quadrant: assignQuadrant(r.addressableReach, tnwIndex),
      };
    })
    .sort((a, b) => b.tnwIndex - a.tnwIndex || a.channel.localeCompare(b.channel));
};

export const apexTables: Record<ApexTableKey, ApexTable> = {
  CONFLICTED_TROUBLESHOOTERS: {
    key: 'CONFLICTED_TROUBLESHOOTERS',
    label: 'Conflicted Troubleshooters',
    shortLabel: 'Troubleshooters',
    population: 4_359_105,
    populationLabel: '4.36M Australians',
    subtitle: 'Reach x Attention x Premium',
    rows: buildRows(CONFLICTED_TROUBLESHOOTERS_INPUTS),
  },
  MINDFUL_RESEARCHERS: {
    key: 'MINDFUL_RESEARCHERS',
    label: 'Mindful Researchers',
    shortLabel: 'Researchers',
    population: 1_394_804,
    populationLabel: '1.39M Australians',
    subtitle: 'Reach x Attention x Premium',
    rows: buildRows(MINDFUL_RESEARCHERS_INPUTS),
  },
};

// -----------------------------------------------------------------------------
// Tier styling. Dark fills carrying white pill text; each pair is asserted
// against AA in data/__integrity.ts.
// -----------------------------------------------------------------------------

export const TIER_COLOURS: Record<ApexTier, { bg: string; fg: string; label: string; description: string }> = {
  PUBLISHING: {
    bg: LYKA.tealDark,
    fg: '#ffffff',
    label: 'Publishing',
    description: 'Digital news and magazines.',
  },
  BROADCAST: {
    bg: LYKA.accentInk,
    fg: '#ffffff',
    label: 'Broadcast',
    description: 'Linear TV, BVOD catch up, SVOD streaming and Pay TV.',
  },
  AUDIO: {
    bg: LYKA.tealDeepest,
    fg: '#ffffff',
    label: 'Audio',
    description: 'Radio, podcasts, and music streaming.',
  },
  OUTDOOR: {
    bg: LYKA.muted,
    fg: '#ffffff',
    label: 'Outdoor',
    description: 'Out of home, including Heavy Out & About audiences.',
  },
  CINEMA: {
    bg: '#8C3D24',
    fg: '#ffffff',
    label: 'Cinema',
    description: 'Theatrical big screen environment.',
  },
  SOCIAL: {
    bg: '#B8571C',
    fg: '#ffffff',
    label: 'Social',
    description: 'Cluttered social feeds. TTD finds premium perceptions are diminished.',
  },
  DIGITAL: {
    bg: '#2C5F73',
    fg: '#ffffff',
    label: 'Digital',
    description: 'Online video, YouTube and online display.',
  },
};

// -----------------------------------------------------------------------------
// The Growth Quadrant frame (BCG adapted). Copy verbatim from the tool and the
// PPTX slide 5. QUAD_STYLES pairs are asserted against AA in __integrity.ts.
// -----------------------------------------------------------------------------

export interface QuadrantMeta {
  key: QuadrantKey;
  label: string;
  action: string;
  /** Which half of each axis this quadrant occupies, for laying out its label. */
  highReach: boolean;
  highIndex: boolean;
}

export const QUADRANTS: Record<QuadrantKey, QuadrantMeta> = {
  'must-win': {
    key: 'must-win',
    label: 'Must-win',
    action: 'Protect and scale investment. The foundation of the plan.',
    highReach: true,
    highIndex: true,
  },
  'influence-booster': {
    key: 'influence-booster',
    label: 'Influence booster',
    action: 'Invest for quality and pair with a reach channel to amplify.',
    highReach: false,
    highIndex: true,
  },
  'reach-booster': {
    key: 'reach-booster',
    label: 'Reach booster',
    action: 'Use for awareness and frequency only. Do not over invest.',
    highReach: true,
    highIndex: false,
  },
  tangential: {
    key: 'tangential',
    label: 'Tangential',
    action: 'Justify specifically or remove from plan. De-prioritise by default.',
    highReach: false,
    highIndex: false,
  },
};

/**
 * Region tint + the ink its corner label prints in. The tints follow the app's
 * meaning ramp: teal mint for the converted best case, warm for caution, grey
 * for de-prioritised. Dot labels print in LYKA.ink on all four (9.9:1 worst).
 */
export const QUAD_STYLES: Record<QuadrantKey, { tint: string; ink: string }> = {
  'must-win':          { tint: '#D6EDE7', ink: '#075746' }, // ink 6.96:1
  'influence-booster': { tint: '#E8F0F4', ink: '#2C5F73' }, // ink 6.08:1
  'reach-booster':     { tint: '#FAEEDA', ink: '#8A4013' }, // ink 6.48:1
  tangential:          { tint: '#F1F3F5', ink: '#5B6E64' }, // ink 4.89:1
};

// -----------------------------------------------------------------------------
// Methodology copy: the About tab's formula bar and three source cards.
// Copy from the tool's constants.ts (its knowledge base); accents stay Lyka.
// -----------------------------------------------------------------------------

export const apexMethodologySources: ApexMethodologySource[] = [
  {
    number: '01',
    key: 'RM',
    pillLabel: 'RM INDEX',
    pillSubLabel: 'Heavy reach',
    title: 'Roy Morgan Single Source',
    subtitle: 'Heavy reach: who over indexes for each channel',
    accent: '#1d8a6b',
    bullets: [
      'Heavy: the top tier audience for each channel.',
      'RM Index = audience heavy reach % divided by all population heavy reach %, times 100.',
      'Index 100 = population average. Above 100 = your audience over indexes.',
      'Single Source: one survey, one respondent, fully cross referenced.',
    ],
  },
  {
    number: '02',
    key: 'KNF',
    pillLabel: 'KNF SCORE',
    pillSubLabel: 'Attention quality',
    title: 'Karen Nelson-Field, Amplified Intelligence',
    subtitle: 'Attention Economy and How Media Works | WARC 2020',
    accent: LYKA.accent,
    bullets: [
      'Eye gaze attention: 17,000+ ad views across AU, UK and US, second by second.',
      'Channel scores: TV 107.1, Radio 103.2, OOH 71.7.',
      'Cinema 110.0, Social 65.8, Online video 57.6, Online display 50.0.',
      'SVOD and BVOD assigned the TV score: lean back, full screen, premium.',
    ],
  },
  {
    number: '03',
    key: 'TTD',
    pillLabel: 'TTD/PAC PREMIUM',
    pillSubLabel: 'Premium value',
    title: 'The Trade Desk | PA Consulting',
    subtitle: 'The Premium Media Payoff | PA Consulting | Australia 2026',
    accent: LYKA.tangerine,
    bullets: [
      'Matched cell experiment: premium vs non premium across TV, audio and digital.',
      'Streaming TV times 1.40: 3.5x aspirational, 2.4x quality vs non premium.',
      'Premium digital news times 1.35: 14x brand popularity, 12.4x relevance.',
      'Social media times 0.75: cluttered feeds diminish premium perceptions.',
    ],
  },
];

// -----------------------------------------------------------------------------
// The About tab's positioning copy. Client supplied, verbatim from the tool's
// AboutView.tsx. Do not edit the wording here without a client instruction.
// -----------------------------------------------------------------------------

export const APEX_ABOUT = {
  eyebrow: 'About APEX by SPEED',
  headline: 'Plan for attention, not just reach.',
  lead: 'Not all reach is created equal.',
  body:
    'APEX by SPEED goes beyond reach to reveal which media channels truly garner attention and build trust through ' +
    'premium signals. By combining Australian audience data (Roy Morgan), attention quality (Karen Nelson-Field) and ' +
    'premium media environment signals (The Trade Desk / PA Consulting), it creates a powerful True Net Worth Index ' +
    'for smarter planning. The result is a clear, actionable framework adapted from the Boston Consulting Group ' +
    'that helps planners invest with confidence, prioritising the channels that truly count.',
} as const;

// -----------------------------------------------------------------------------
// Source credits. A view credits ONLY the sources its own numbers come from;
// both current views (the TNW table and the quadrant) use all three.
// -----------------------------------------------------------------------------

export const SOURCE_RM = 'Roy Morgan Single Source';
export const SOURCE_KNF = 'Karen Nelson-Field / Amplified Intelligence';
export const SOURCE_PREMIUM = 'The Trade Desk / PA Consulting, Australia 2026';
export const SOURCE_CREDIT = [SOURCE_RM, SOURCE_KNF, SOURCE_PREMIUM].join('  |  ');

// -----------------------------------------------------------------------------
// Score pill banding (unchanged Lyka styling).
// -----------------------------------------------------------------------------

export type ScoreBand = 'strong' | 'mid' | 'weak';

export const scoreStrength = (n: number): ScoreBand => {
  if (n >= 120) return 'strong';
  if (n >= 90) return 'mid';
  return 'weak';
};

export const SCORE_BAND_STYLES: Record<ScoreBand, { border: string; bg: string; fg: string }> = {
  strong: { border: LYKA.accentInk, bg: LYKA.mint,  fg: LYKA.tealDeepest },
  mid:    { border: LYKA.tangerine, bg: LYKA.peach, fg: '#8C3D24' },
  weak:   { border: '#C0392B', bg: '#FCE4E1', fg: '#7A241B' },
};

export const APEX_SOURCE_INFO: Record<ApexSourceKey, { tooltipShort: string }> = {
  RM:  { tooltipShort: 'Roy Morgan index. Audience heavy reach % over all population heavy reach %, times 100. Index 100 = population average.' },
  KNF: { tooltipShort: 'Karen Nelson-Field attention score. Eye gaze, second by second. Higher = more sustained active attention.' },
  TTD: { tooltipShort: 'The Trade Desk / PA Consulting premium environment multiplier. x1.40 = strongest premium signal.' },
};
