// APEX is SPEED-proprietary methodology and is almost entirely client agnostic.
// The only client coupling is the two audience DEFINITIONS and their heavyPct /
// rmIndex figures, which are still a Hamilton Island HNWT traveller Roy Morgan
// pull. See the "Placeholder audience" notice in pages/ApexBySpeed.tsx.
import { LYKA } from './brand';

export type ApexTier =
  | 'PUBLISHING'
  | 'BROADCAST'
  | 'AUDIO'
  | 'OUTDOOR'
  | 'CINEMA'
  | 'SOCIAL';

export type ApexTableKey = 'HNWT_DOMESTIC' | 'HNWT_INTERNATIONAL';

export type ApexSourceKey = 'RM' | 'KNF' | 'TTD';

export interface ApexChannelRow {
  channel: string;
  tier: ApexTier;
  heavyPct: number;
  rmIndex: number;
  knfScore: number;
  methodB: number;
  ttdMultiplier: number;
  ttdStars: number;
  methodC: number;
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

export const TIER_COLOURS: Record<ApexTier, { bg: string; fg: string; label: string; description: string }> = {
  PUBLISHING: {
    bg: LYKA.tealDark,
    fg: '#ffffff',
    label: 'Publishing',
    description: 'Print and digital editorial environments. News and magazines.',
  },
  BROADCAST: {
    bg: LYKA.accentInk,
    fg: '#ffffff',
    label: 'Broadcast',
    description: 'Linear TV, BVOD catch up, and SVOD streaming.',
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
};

export const apexMethodologySources: ApexMethodologySource[] = [
  {
    number: '01',
    key: 'RM',
    pillLabel: 'RM INDEX',
    pillSubLabel: 'Who over-indexes',
    title: 'Roy Morgan Single Source',
    subtitle: 'Jan to Dec 2025 | n=64,960 | People 14+',
    accent: '#1d8a6b',
    bullets: [
      'Heavy reach triptiles per channel: top third most engaged audience.',
      'RM index: HNWT heavy% ÷ All 14+ heavy% × 100. Index 100 = population average.',
      'Outdoor: Heavy Out & About triptile, the most active OOH audience (HNWT Dom ix 149, Intl ix 162).',
      'Two audiences: HNWT Domestic (2,895,000) and HNWT International (722,000).',
      'SVOD, BVOD, Podcasts, Music streaming: addressable heavy triptile from media channels section.',
    ],
  },
  {
    number: '02',
    key: 'KNF',
    pillLabel: 'KNF SCORE',
    pillSubLabel: 'Attention quality',
    title: 'Karen Nelson-Field, Amplified Intelligence',
    subtitle: 'Attention Economy and How Media Works (2020) | WARC Guide (2020)',
    accent: LYKA.accent,
    bullets: [
      'Eye gaze tracking: 17,000+ ad views across AU, UK, US, second by second attention.',
      'Channel scores: TV 107.1 | Radio 103.2 | Newspapers 87.8 | Magazines 79.5 | OOH 71.7.',
      'Social media 65.8 | Cinema 61.4 | Online video 57.6 | Online display 50.0.',
      'Facebook impression = 0.34× TV. YouTube = 0.61× TV (published STAS equivalency).',
      'SVOD and BVOD assigned TV score (107.1): lean back, full screen, premium environment.',
    ],
  },
  {
    number: '03',
    key: 'TTD',
    pillLabel: 'TTD PREMIUM',
    pillSubLabel: 'Environment value',
    title: 'The Trade Desk Intelligence',
    subtitle: 'The Premium Media Payoff | PA Consulting | Australia | January 2026 | n=1,500',
    accent: LYKA.tangerine,
    bullets: [
      'Matched cell experiment: premium vs non premium environments across TV, audio, digital.',
      'Streaming TV ×1.40: 3.5× aspirational, 2.4× quality perception vs non premium.',
      'Premium audio ×1.20: 2.3× innovative, 1.6× relevant vs non premium audio.',
      'Premium digital news ×1.35: 14× brand popularity, 12.4× relevance vs non premium.',
      'Social media ×0.75: TTD explicitly found cluttered feeds diminish premium perceptions.',
      'OOH ×1.05 conservative: TTD does not score OOH directly.',
    ],
  },
];

const domesticRows: ApexChannelRow[] = [
  { channel: 'Print news',           tier: 'PUBLISHING', heavyPct: 13.0, rmIndex: 175, knfScore: 87.8,  methodB: 152, ttdMultiplier: 1.25, ttdStars: 4, methodC: 160 },
  { channel: 'Print magazines',      tier: 'PUBLISHING', heavyPct: 19.5, rmIndex: 173, knfScore: 79.5,  methodB: 136, ttdMultiplier: 1.25, ttdStars: 4, methodC: 143 },
  { channel: 'BVOD (catch up TV)',   tier: 'BROADCAST',  heavyPct: 12.3, rmIndex: 112, knfScore: 107.1, methodB: 119, ttdMultiplier: 1.40, ttdStars: 5, methodC: 140 },
  { channel: 'SVOD (streaming)',     tier: 'BROADCAST',  heavyPct: 14.7, rmIndex: 104, knfScore: 107.1, methodB: 110, ttdMultiplier: 1.40, ttdStars: 5, methodC: 130 },
  { channel: 'Podcasts',             tier: 'AUDIO',      heavyPct: 7.9,  rmIndex: 122, knfScore: 103.2, methodB: 125, ttdMultiplier: 1.20, ttdStars: 4, methodC: 126 },
  { channel: 'Radio',                tier: 'AUDIO',      heavyPct: 12.7, rmIndex: 109, knfScore: 103.2, methodB: 111, ttdMultiplier: 1.20, ttdStars: 4, methodC: 112 },
  { channel: 'Outdoor (Out & About)',tier: 'OUTDOOR',    heavyPct: 37.3, rmIndex: 149, knfScore: 71.7,  methodB: 106, ttdMultiplier: 1.05, ttdStars: 2, methodC: 93  },
  { channel: 'Cinema',               tier: 'CINEMA',     heavyPct: 24.2, rmIndex: 143, knfScore: 61.4,  methodB: 87,  ttdMultiplier: 1.15, ttdStars: 3, methodC: 84  },
  { channel: 'Linear TV (FTA)',      tier: 'BROADCAST',  heavyPct: 13.1, rmIndex: 86,  knfScore: 107.1, methodB: 91,  ttdMultiplier: 1.00, ttdStars: 2, methodC: 77  },
  { channel: 'Music streaming',      tier: 'AUDIO',      heavyPct: 16.2, rmIndex: 114, knfScore: 65.8,  methodB: 74,  ttdMultiplier: 1.10, ttdStars: 3, methodC: 69  },
  { channel: 'Digital news',         tier: 'PUBLISHING', heavyPct: 28.2, rmIndex: 104, knfScore: 57.6,  methodB: 59,  ttdMultiplier: 1.35, ttdStars: 5, methodC: 67  },
  { channel: 'Digital magazines',    tier: 'PUBLISHING', heavyPct: 9.4,  rmIndex: 115, knfScore: 50.0,  methodB: 57,  ttdMultiplier: 1.15, ttdStars: 3, methodC: 55  },
  { channel: 'Social media',         tier: 'SOCIAL',     heavyPct: 34.2, rmIndex: 111, knfScore: 65.8,  methodB: 72,  ttdMultiplier: 0.75, ttdStars: 1, methodC: 46  },
];

const internationalRows: ApexChannelRow[] = [
  { channel: 'Print magazines',      tier: 'PUBLISHING', heavyPct: 20.8, rmIndex: 184, knfScore: 79.5,  methodB: 143, ttdMultiplier: 1.25, ttdStars: 4, methodC: 150 },
  { channel: 'Print news',           tier: 'PUBLISHING', heavyPct: 11.9, rmIndex: 160, knfScore: 87.8,  methodB: 137, ttdMultiplier: 1.25, ttdStars: 4, methodC: 144 },
  { channel: 'SVOD (streaming)',     tier: 'BROADCAST',  heavyPct: 15.3, rmIndex: 109, knfScore: 107.1, methodB: 114, ttdMultiplier: 1.40, ttdStars: 5, methodC: 134 },
  { channel: 'BVOD (catch up TV)',   tier: 'BROADCAST',  heavyPct: 11.7, rmIndex: 105, knfScore: 107.1, methodB: 110, ttdMultiplier: 1.40, ttdStars: 5, methodC: 129 },
  { channel: 'Podcasts',             tier: 'AUDIO',      heavyPct: 8.2,  rmIndex: 125, knfScore: 103.2, methodB: 126, ttdMultiplier: 1.20, ttdStars: 4, methodC: 127 },
  { channel: 'Radio',                tier: 'AUDIO',      heavyPct: 12.8, rmIndex: 110, knfScore: 103.2, methodB: 111, ttdMultiplier: 1.20, ttdStars: 4, methodC: 112 },
  { channel: 'Outdoor (Out & About)',tier: 'OUTDOOR',    heavyPct: 40.6, rmIndex: 162, knfScore: 71.7,  methodB: 113, ttdMultiplier: 1.05, ttdStars: 2, methodC: 100 },
  { channel: 'Cinema',               tier: 'CINEMA',     heavyPct: 26.5, rmIndex: 157, knfScore: 61.4,  methodB: 94,  ttdMultiplier: 1.15, ttdStars: 3, methodC: 91  },
  { channel: 'Music streaming',      tier: 'AUDIO',      heavyPct: 17.4, rmIndex: 122, knfScore: 65.8,  methodB: 78,  ttdMultiplier: 1.10, ttdStars: 3, methodC: 72  },
  { channel: 'Linear TV (FTA)',      tier: 'BROADCAST',  heavyPct: 12.4, rmIndex: 81,  knfScore: 107.1, methodB: 85,  ttdMultiplier: 1.00, ttdStars: 2, methodC: 71  },
  { channel: 'Digital news',         tier: 'PUBLISHING', heavyPct: 28.5, rmIndex: 105, knfScore: 57.6,  methodB: 59,  ttdMultiplier: 1.35, ttdStars: 5, methodC: 67  },
  { channel: 'Digital magazines',    tier: 'PUBLISHING', heavyPct: 10.2, rmIndex: 125, knfScore: 50.0,  methodB: 61,  ttdMultiplier: 1.15, ttdStars: 3, methodC: 59  },
  { channel: 'Social media',         tier: 'SOCIAL',     heavyPct: 33.5, rmIndex: 108, knfScore: 65.8,  methodB: 69,  ttdMultiplier: 0.75, ttdStars: 1, methodC: 44  },
];

export const apexTables: Record<ApexTableKey, ApexTable> = {
  HNWT_DOMESTIC: {
    key: 'HNWT_DOMESTIC',
    label: 'HNWT Domestic',
    shortLabel: 'Domestic',
    population: 2_895_000,
    populationLabel: '2.9M Australians',
    subtitle: 'Reach × Attention × Premium environment',
    rows: domesticRows,
  },
  HNWT_INTERNATIONAL: {
    key: 'HNWT_INTERNATIONAL',
    label: 'HNWT International',
    shortLabel: 'International',
    population: 722_000,
    populationLabel: '722K Australians',
    subtitle: 'Reach × Attention × Premium environment',
    rows: internationalRows,
  },
};

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
  RM:  { tooltipShort: 'Roy Morgan index. 100 = channel mean for all Australians 14+. Higher = HNWT over indexes vs the population.' },
  KNF: { tooltipShort: 'Karen Nelson-Field attention score. Eye gaze, second by second. Higher = more sustained active attention.' },
  TTD: { tooltipShort: 'The Trade Desk premium environment multiplier. ×1.40 = strongest premium signal.' },
};
