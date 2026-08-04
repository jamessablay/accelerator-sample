// -----------------------------------------------------------------------------
// Ten Things: the NUMBERS. Every value plotted by a chart lives here.
//
// Two hard constraints, the same pair brand.ts and type.ts carry:
//
// 1. NO React and NO DOM types. Nothing here should ever need them, and keeping
//    the rule makes the file safe to import from anywhere.
//
// 2. LITERAL NUMBERS ONLY. Chart.js takes numbers, not strings, and a chart
//    must never parse its own display copy.
//
// -----------------------------------------------------------------------------
// WHY THIS FILE IS SEPARATE FROM tenThingsData.ts
//
// tenThingsData.ts holds the PUBLISHED table: pre formatted strings like
// "49.3%", "1.15" and one empty cell where the source reports no figure. Those
// strings are display, and reading a chart series back out of them means
// parsing "49.3%" into 49.3. That is the exact anti pattern audienceModel.ts is
// quarantined for: it is the only place in the app allowed to parse a "22%".
//
// So the two live side by side and data/__integrity.ts asserts they agree. If
// one is edited and the other is not, the console says so on the next dev load
// rather than the deck quietly showing two different numbers for one fact.
//
// SOURCE for every figure below: "Lyka - Ten Things The Data Says.html" in the
// project folder, which is itself built from the Lyka acquisition file to
// 29 Jun 2026, the Lyka postcode file (304,729 customers), the Mutinex GrowthOS
// MMM, ABS Census 2021 and Experian Mosaic.
// -----------------------------------------------------------------------------

/** Household income deciles, 1 lowest to 10 highest. Shared x axis for 02 and 10. */
export const INCOME_DECILES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;

// -----------------------------------------------------------------------------
// 01 Distribution: share of growth, and value per signup
// -----------------------------------------------------------------------------

/**
 * Share of the H1 FY26 growth increment against H1 FY25.
 *
 * The source reports kiosks and media separately and partnerships and referral
 * only as a combined figure, which is why the third bar is a pair. The three
 * sum to 100.0.
 */
export const GROWTH_SHARE = {
  labels: ['Kiosks', 'Media', 'Partnerships and referral'],
  values: [49.3, 22.0, 28.7],
} as const;

/**
 * RAV: value per signup against a national average of 1.00.
 *
 * "Marketing" is the source's own label for the media channel here. Kept
 * verbatim rather than harmonised to "Media", because the two panels measure
 * different things and silently renaming one would imply they are one series.
 */
export const CHANNEL_RAV = {
  labels: ['Marketing', 'Partnerships', 'Referral', 'Kiosks'],
  values: [1.15, 0.96, 0.82, 0.29],
  /** The national average. The dashed rule on the chart, and the colour split. */
  benchmark: 1.0,
} as const;

// -----------------------------------------------------------------------------
// 02 Audience: trial and retention up the income ladder
// -----------------------------------------------------------------------------

export const INCOME_LADDER = {
  labels: INCOME_DECILES,
  /** Customers per 100 households who have ever purchased. */
  everTried: [1.28, 1.77, 1.89, 2.25, 2.65, 2.75, 3.48, 3.56, 4.11, 5.08],
  /** Customers per 100 households still active. */
  stillActive: [0.35, 0.48, 0.52, 0.65, 0.81, 0.84, 1.13, 1.16, 1.43, 1.95],
  /** Share of ever tried who are still active, as a percentage. */
  retentionPct: [27.6, 27.3, 27.7, 29.1, 30.7, 30.6, 32.4, 32.6, 34.7, 38.4],
} as const;

// -----------------------------------------------------------------------------
// 03 Audience: penetration against the share of flats
// -----------------------------------------------------------------------------

/**
 * Two series on one chart, deliberately.
 *
 * The source plots penetration alone, but the headline claims the driver is the
 * postcode rather than the dwelling, and penetration alone cannot show that.
 * The average income decile column is already published in the source's own
 * numbers table and tracks penetration almost exactly, so plotting it makes the
 * chart argue its own headline. No figure is added, one is stopped being hidden.
 */
export const FLAT_SHARE = {
  labels: ['Fewest flats', '2', '3', '4', 'Most flats'],
  /** Customers per 100 households. */
  penetration: [0.96, 0.94, 0.94, 1.03, 1.33],
  /** Average household income decile of the postcodes in the quintile. */
  avgIncomeDecile: [6.9, 6.1, 6.1, 6.3, 7.7],
} as const;

// -----------------------------------------------------------------------------
// 04 Audience: retention by dwelling, and retention by income
// -----------------------------------------------------------------------------

/**
 * Two cuts of the same base, and the contrast IS the finding: dwelling type does
 * nothing to retention, income moves it steadily.
 *
 * They are separate arrays because they are not one series. Plotting them as one
 * eight bar row would invite a left to right read across a boundary that does
 * not exist.
 */
export const RETENTION_CUTS = {
  dwelling: {
    labels: ['Most houses', '2', '3', 'Most flats'],
    values: [32.7, 32.8, 34.8, 35.0],
  },
  income: {
    labels: ['Deciles 1 to 3', '4 to 6', '7 to 8', '9 to 10'],
    values: [27.5, 30.3, 32.5, 36.6],
  },
} as const;

// -----------------------------------------------------------------------------
// 05 Life stage: each capital at a different point in the lifecycle
// -----------------------------------------------------------------------------

export const CITY_LIFECYCLE = [
  { city: 'Sydney', penetration: 1.49, tenureDays: 260, active: 26121 },
  { city: 'Melbourne', penetration: 1.2, tenureDays: 243, active: 19687 },
  { city: 'Brisbane', penetration: 1.55, tenureDays: 250, active: 6717 },
  { city: 'Perth', penetration: 0.99, tenureDays: 221, active: 7142 },
  { city: 'Adelaide', penetration: 0.68, tenureDays: 219, active: 3439 },
] as const;

// -----------------------------------------------------------------------------
// 06 Life stage: the annual demand shape
// -----------------------------------------------------------------------------

/**
 * Monthly index with the growth trend stripped out. 100 is the average month.
 *
 * The baseline of 100 is a real, defined value, not an axis convenience, which
 * is why the chart anchors its bars there rather than truncating an axis to
 * make a 39 point swing visible.
 */
export const SEASONAL_INDEX = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  values: [123, 110, 97, 98, 93, 99, 98, 96, 84, 104, 100, 97],
  baseline: 100,
} as const;

// -----------------------------------------------------------------------------
// 07 Geography: the ten highest value regions
// -----------------------------------------------------------------------------

/**
 * SA4 regions by RAV. `headroom` is the source's own column and is NOT plotted:
 * it is carried here so the tooltip can show it without a second lookup.
 *
 * NOTE the recorded discrepancy on this point. The card stat says 1.60x and the
 * highest value here is 1.34x. See `discrepancy` on the record in
 * tenThingsData.ts. Do not reconcile them by editing either number.
 */
export const TOP_REGIONS_RAV = [
  { region: 'Sydney: Northern Beaches', rav: 1.34, penetration: 3.06, headroom: 9 },
  { region: 'Sydney: North Sydney and Hornsby', rav: 1.2, penetration: 1.83, headroom: 193 },
  { region: 'Sydney: Sutherland', rav: 1.19, penetration: 2.35, headroom: 35 },
  { region: 'Perth: Inner', rav: 1.18, penetration: 1.19, headroom: 98 },
  { region: 'Brisbane Inner City', rav: 1.15, penetration: 1.78, headroom: 56 },
  { region: 'Sydney: Eastern Suburbs', rav: 1.13, penetration: 2.4, headroom: 17 },
  { region: 'Australian Capital Territory', rav: 1.13, penetration: 1.33, headroom: 302 },
  { region: 'Illawarra', rav: 1.1, penetration: 1.2, headroom: 23 },
  { region: 'Melbourne: Inner South', rav: 1.1, penetration: 1.75, headroom: 106 },
  { region: 'Southern Highlands and Shoalhaven', rav: 1.07, penetration: 1.32, headroom: 17 },
] as const;

/** The national average RAV. Bars are drawn as a deviation from here, not from zero. */
export const RAV_BENCHMARK = 1.0;

// -----------------------------------------------------------------------------
// 08 Channel: what the MMM can and cannot support
// -----------------------------------------------------------------------------

/**
 * NOT A CHART SERIES. Three claims and their status.
 *
 * The source draws this as three descending matplotlib bars whose heights encode
 * nothing: there is no numeric axis, the y label is the literal string
 * "confidence in the claim", and the values are words. It is a slide graphic.
 * It renders as three HTML status rows instead, so the text is selectable, it
 * reflows, and no aria-label has to recite the whole thing.
 *
 * `level` drives only the fill: 3 established, 2 contested, 1 not identified.
 */
export const MMM_CONFIDENCE = [
  {
    claim: 'Advertising drives growth overall',
    status: 'Established',
    level: 3,
    note: 'Robust in aggregate. Other media gained 14,507 while Meta lost 9,352 since the peak.',
  },
  {
    claim: 'Meta against other channel split',
    status: 'Contested',
    level: 2,
    note: 'The split inherits an identifiability problem. It is the credit that is contested, not the total.',
  },
  {
    claim: 'Per channel incrementality',
    status: 'Not identified',
    level: 1,
    note: 'Needs a controlled geographic holdout.',
  },
] as const;

// -----------------------------------------------------------------------------
// 09 Channel: interest climbs, unprompted conversion does not
// -----------------------------------------------------------------------------

/**
 * Two series over three financial years, and they are NOT the same quantity.
 *
 * The source plots both on one axis captioned "index / %", which pins the
 * branded share series to the floor so 10.5% reads as roughly zero. They are
 * split onto two axes here. Same six numbers, and the divergence, which is the
 * whole argument, becomes readable rather than being an artefact of the floor.
 */
export const BRANDED_SEARCH = {
  labels: ['FY24', 'FY25', 'FY26'],
  /** Branded share of search contribution, as a percentage. Left axis. */
  brandedSharePct: [10.5, 10.8, 10.6],
  /** External interest in the brand, indexed to FY24 = 100. Right axis. */
  interestIndex: [100, 118, 135],
} as const;

// -----------------------------------------------------------------------------
// 10 Retention: the lapsed pool against the active business
// -----------------------------------------------------------------------------

/**
 * Lapsed and active by income decile.
 *
 * THESE TWO GROUPS ARE DISJOINT. The source chart overlays them, drawing a short
 * green "active" bar in front of a full height gold "lapsed" bar, which reads as
 * a part to whole: at decile 1 it looks like 689 of 1,810 are active, when the
 * true reading is 689 of 2,499. The rebuild STACKS them, so a column is everyone
 * who ever tried and the split inside it is real.
 *
 * That is a correctness change, not a styling one. Anyone comparing against the
 * original PNG will see different bars and should read this comment first.
 *
 * Totals verified against the source's own stated figures:
 *   active sums to 101,091, lapsed sums to 203,221,
 *   lapsed in deciles 8 to 10 is 34,364 + 39,095 + 36,086 = 109,545.
 */
export const LAPSED_POOL = {
  labels: INCOME_DECILES,
  active: [689, 1788, 3370, 4465, 7474, 9659, 13686, 16646, 20805, 22509],
  lapsed: [1810, 4765, 8810, 10883, 16868, 21950, 28590, 34364, 39095, 36086],
  /** Stated in the source copy. __integrity.ts asserts the arrays above sum to these. */
  totals: { active: 101091, lapsed: 203221, lapsedTopThreeDeciles: 109545 },
} as const;
