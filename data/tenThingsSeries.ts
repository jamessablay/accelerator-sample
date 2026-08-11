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
// -----------------------------------------------------------------------------
// SOURCE, and there are now TWO.
//
// "Lyka - Ten Things (Dog-Owner Basis).html" (2026-08-10) is the current source
// for the five points that divide by a population: 02, 03, 05, 07 and 10. Every
// one of those was REDRAWN against Roy Morgan's count of dog owners, on the
// argument that households include the roughly half of homes with no dog and so
// could never buy.
//
// "Lyka - Ten Things The Data Says.html" (2026-07-24) is still the source for
// the other five: 01, 04, 06, 08 and 09. Those are rates, counts or a time
// series, so no population figure enters them and there is nothing to redraw.
// **Their PNGs are byte identical across the two source files**, verified by
// hashing every embedded image, which is what confirms the split is exactly
// 5 and 5 rather than an editorial choice about what to revisit.
//
// Both are in the project folder, one level up, in `01 Sources/` since the
// 2026-08-11 reorganisation. Behind them: the Lyka customer
// file by postcode, Roy Morgan Single Source Apr 2025 to Mar 2026 (dog owners,
// people aged 14+), ABS Census 2021 on ABS ASGS 2021 boundaries, and for the
// unchanged five the Lyka acquisition file to 29 Jun 2026, the Mutinex GrowthOS
// MMM and Experian Mosaic.
//
// The household era series are KEPT where something still renders them, and
// each says so. Nothing here is a stale duplicate: if a series has no consumer,
// delete it rather than leaving two bases side by side for a future reader to
// pick from.
// -----------------------------------------------------------------------------

/** Household income deciles, 1 lowest to 10 highest. The x axis for point 02. */
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

/**
 * Trial and the surviving base up the income ladder, PER 100 DOG OWNERS.
 *
 * `everTried` is the redrawn chart's own printed value labels. Nine are given to
 * one decimal place because that is the precision the chart prints; decile 10 is
 * 4.86 because the copy states it exactly ("4.86 per 100 dog owners ever tried
 * and 1.87 still active").
 *
 * -----------------------------------------------------------------------------
 * `stillActive` IS DERIVED, NOT PUBLISHED, AND THAT IS AN OPEN ITEM.
 *
 * The redrawn chart labels only the stacked totals, so the active sub series
 * appears nowhere in the new source and no underlying table was supplied. It is
 * recoverable exactly, because RETENTION IS BASE INVARIANT: it is a rate among
 * customers, so both sides of the sum are customers and the denominator cancels.
 * `retentionPct` below is therefore unchanged from the household version and is
 * the only figure needed to move `everTried` onto the active base.
 *
 * Two independent checks that this is right, not merely plausible:
 *
 *   1. Decile 10 comes out at 4.86 x 0.384 = 1.866, which rounds to the 1.87 the
 *      copy publishes. data/__integrity.ts check 12c asserts it, in the same
 *      shape as the APEX check that reproduces its decks' published values.
 *   2. Measuring the bar geometry off the source PNG gives 0.320, 0.431, 0.475,
 *      0.596, 0.740, 0.773, 1.027, 1.082, 1.359, 1.856. The derivation agrees to
 *      within 0.03 everywhere, which is inside the precision a 1dp `everTried`
 *      can carry.
 *
 * **Still ask the analyst for the underlying table.** Two methods agreeing is
 * good evidence and it is not a published figure, so the numbers table labels
 * this column as derived and the deck should not quote it as research.
 * -----------------------------------------------------------------------------
 */
const LADDER_EVER_TRIED = [1.2, 1.6, 1.8, 2.1, 2.4, 2.6, 3.2, 3.3, 4.0, 4.86] as const;
/** Share of ever tried who are still active. BASE INVARIANT, so unchanged. */
const LADDER_RETENTION_PCT = [27.6, 27.3, 27.7, 29.1, 30.7, 30.6, 32.4, 32.6, 34.7, 38.4] as const;

export const INCOME_LADDER = {
  labels: INCOME_DECILES,
  /** Customers per 100 dog owners who have ever purchased. Published. */
  everTried: LADDER_EVER_TRIED,
  /** Customers per 100 dog owners still active. DERIVED: see the note above. */
  stillActive: LADDER_EVER_TRIED.map(
    (v, i) => Math.round(v * LADDER_RETENTION_PCT[i]) / 100,
  ) as readonly number[],
  retentionPct: LADDER_RETENTION_PCT,
  /** The two figures the copy publishes for decile 10. Asserted against the derivation. */
  publishedTopDecile: { everTried: 4.86, stillActive: 1.87 },
} as const;

// -----------------------------------------------------------------------------
// 03 Audience: penetration against the share of flats
// -----------------------------------------------------------------------------

/**
 * REDRAWN per 100 dog owners, and the change of base WIDENS the gap.
 *
 * On households the flattest fifth ran 1.41x the least flat. On dog owners it is
 * 1.64x (1.31 / 0.80), because flat heavy areas own fewer dogs, so the household
 * measure was hiding part of the effect.
 *
 * The redrawn chart drops the average income decile line the household version
 * carried. That column is KEPT here and in the numbers table, because it is
 * still the evidence for the headline's claim that the driver is the postcode
 * rather than the dwelling, and it is unaffected by the change of base (it
 * describes the income mix of the postcodes in each quintile, not a rate over a
 * population). It simply is not plotted any more.
 *
 * ⚠ THIS IS ONE OF THE TWO POSTCODE GRAIN CHARTS. Roy Morgan does not publish
 * dog owners below region level, so each postcode is given its region's dog
 * ownership rate. That captures differences BETWEEN regions and not WITHIN them.
 * The source says so and so does the app: see TEN_THINGS_ESTIMATE_NOTE in
 * tenThingsData.ts, which is rendered on the page rather than left in a comment.
 */
export const FLAT_SHARE = {
  labels: ['Fewest flats', '2nd', 'Middle', '4th', 'Most flats'],
  /** Share of dwellings that are flats, per quintile. The chart's second label line. */
  flatsPct: [1, 4, 8, 17, 52],
  /** Active customers per 100 dog owners. */
  penetration: [0.8, 0.87, 0.83, 0.89, 1.31],
  /** Average household income decile of the postcodes in the quintile. Not plotted. */
  avgIncomeDecile: [6.9, 6.1, 6.1, 6.3, 7.7],
} as const;

/**
 * The national rate, active customers per 100 dog owners.
 *
 * The dashed benchmark on points 03, 05 and 07, all three of which are drawn on
 * the same base and therefore share it. One constant rather than three, so a
 * revision cannot move one chart's rule and leave the other two behind.
 */
export const NATIONAL_PER_100_DOG_OWNERS = 1.03;

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
// 05 Life stage: how far each market has actually got
// -----------------------------------------------------------------------------

/**
 * REDRAWN per 100 dog owners, and the running order changes.
 *
 * On households Brisbane read 1.55 against Melbourne's 1.20, a clear step ahead.
 * It is not: Brisbane simply owns more dogs (43 adults in 100 against
 * Melbourne's 39), and on the true base they are level at 1.23 and 1.21. Perth
 * also falls further back than the household view suggested, 0.99 to 0.85.
 *
 * TWO STRUCTURAL CHANGES, both the source's. The ACT is a SIXTH row that the
 * household chart did not carry at all. And tenure and the active count are gone
 * from the chart, which stops it being a bubble: the household version plotted
 * penetration against tenure with area as the active base, and the new source
 * plots one measure as bars. Those two columns are NOT carried forward here,
 * because they are household era figures with no consumer left and keeping them
 * beside a dog owner series is how a future reader picks the wrong one.
 */
export const CITY_REACH = [
  { city: 'Sydney', perHundred: 1.49 },
  { city: 'ACT', perHundred: 1.33 },
  { city: 'Brisbane', perHundred: 1.23 },
  { city: 'Melbourne', perHundred: 1.21 },
  { city: 'Perth', perHundred: 0.85 },
  { city: 'Adelaide', perHundred: 0.71 },
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
// 07 Geography: where Lyka actually reaches dog owners
// -----------------------------------------------------------------------------

/**
 * The top 18 of 58 Roy Morgan regions, active customers per 100 dog owners.
 *
 * This REPLACES RAV as the point's primary chart. The two measure different
 * things and both survive: RAV is value per signup, an average across customers,
 * so it is unaffected by the change of base and keeps its own table and the map
 * below. This is reach, which is exactly what the change of base moves.
 *
 * -----------------------------------------------------------------------------
 * `match` IS A CAVEAT, NOT A SERIES, AND IT DOES NOT AGREE WITH THE PROSE.
 *
 * Lyka's customer file is by postcode and Roy Morgan's regions are not postal
 * boundaries, so each region carries how well the two line up:
 *
 *   A  boundary matches Roy Morgan closely
 *   B  reasonable match
 *   C  treat with caution
 *
 * **The region the copy leads with, Sydney Central at 2.09, is a B, and the
 * third is a C.** The source encodes that in the bar fill and its own prose does
 * not mention it. Carried here and stated in the chart caption rather than
 * dropped, on the same rule as every other honesty item on this page.
 *
 * ⚠ IT IS DELIBERATELY NOT ENCODED IN THE BAR FILL HERE. The source draws A dark
 * green, B light green and C grey, which is the same green-against-grey pairing
 * the basis pill uses, in the same modal: a reader could take a light green bar
 * for "dog owner basis". The grade rides on an annotation beside the value
 * instead, and every bar keeps one fill. Same reasoning as the gap matrix
 * marking its focus cells with an outline because its fill IS the datum.
 * -----------------------------------------------------------------------------
 */
export const TOP_REGIONS_REACH = [
  { region: 'Sydney: Central', perHundred: 2.09, match: 'B' },
  { region: 'Sydney: Northern', perHundred: 2.08, match: 'A' },
  { region: 'Melbourne: Inner City', perHundred: 1.62, match: 'C' },
  { region: 'Melbourne: Central', perHundred: 1.6, match: 'A' },
  { region: 'Qld Country: Gold Coast', perHundred: 1.55, match: 'A' },
  { region: 'Qld Country: Sunshine Coast', perHundred: 1.54, match: 'A' },
  { region: 'Sydney: Gosford/Wyong', perHundred: 1.47, match: 'A' },
  { region: 'Brisbane: Western', perHundred: 1.45, match: 'A' },
  { region: 'Sydney: Southern', perHundred: 1.4, match: 'A' },
  { region: 'Brisbane: City & Northern', perHundred: 1.4, match: 'A' },
  { region: 'NSW Country: ACT', perHundred: 1.33, match: 'A' },
  { region: 'Brisbane: Eastern', perHundred: 1.3, match: 'B' },
  { region: 'Sydney: Outer Western', perHundred: 1.24, match: 'A' },
  { region: 'NSW Country: Wollongong', perHundred: 1.18, match: 'A' },
  { region: 'Melbourne: Outer North East', perHundred: 1.15, match: 'A' },
  { region: 'Melbourne: Northern', perHundred: 1.14, match: 'A' },
  { region: 'NSW Country: Newcastle', perHundred: 1.09, match: 'A' },
  { region: 'Vic Country: Geelong', perHundred: 1.07, match: 'A' },
] as const;

/** What each `match` grade means. Rendered in the chart caption and the tooltip. */
export const MATCH_QUALITY = {
  A: 'boundary matches Roy Morgan closely',
  B: 'reasonable match',
  C: 'treat with caution',
} as const;

/**
 * SA4 regions by RAV, value per signup. HOUSEHOLD ERA AND STILL CORRECT.
 *
 * Kept, and still rendered, as point 07's second disclosure. RAV is an average
 * across customers, so no population divides it and the change of base leaves it
 * alone: the new source says so in as many words ("value per signup is an
 * average across customers, so the 1.60x value concentration is unaffected by
 * the change of base"). It is the only support for the 1.60x the copy quotes and
 * for the choropleth map's own 0.73x to 1.34x scale, which is why the map stayed
 * when the source dropped it.
 *
 * NOTE THE UNRESOLVED CONFLICT. The copy says 1.60x and the highest value here
 * is 1.34x, as does the map legend. It carried a visible `discrepancy` note
 * until the client had all three removed on 2026-08-10. The conflict is open.
 * Do not reconcile it by editing either number.
 *
 * `headroom` is the source's own column and is NOT plotted: it is carried so the
 * table can show it without a second lookup.
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
// 10 Retention: the lapsed base against the active one, by region
// -----------------------------------------------------------------------------

/**
 * Lapsed and active per 100 dog owners, across the twelve strongest markets.
 *
 * REDRAWN, and the cut changes as well as the base: the household version was
 * ten income deciles, this is twelve regions.
 *
 * -----------------------------------------------------------------------------
 * ⚠ THE NEW SOURCE REPEATS THE EXACT ERROR THE HOUSEHOLD VERSION WAS FIXED FOR.
 *
 * Its chart draws each bar's TOTAL LENGTH as the lapsed figure, with the active
 * figure overlaid inside it. Lapsed and active are DISJOINT groups, so that
 * reads as a part to whole: Sydney Central looks like "2.09 of 3.71 are active"
 * when the true reading is 2.09 of 5.80. The same overlay ran across all ten
 * columns of the household chart and was stacked for the same reason; anyone
 * comparing against either PNG will see different bars, and this is why.
 *
 * Stacked, a bar is everyone who has ever tried and the split inside it is real.
 * The arithmetic also checks out against the copy: 2.09 / 5.80 is 36% still
 * active, which is the "two thirds of everyone who has ever tried Lyka is now
 * inactive" the copy states, and it matches the national retention rate.
 * -----------------------------------------------------------------------------
 *
 * `active` here must equal `perHundred` in TOP_REGIONS_REACH for all twelve
 * regions these two share. They are transcribed from two different charts, so
 * agreeing is a real cross check rather than a tautology, and check 12d asserts
 * it. The household era totals (101,091 active, 203,221 lapsed, 109,545 in the
 * top three deciles) have no counterpart on this cut and are gone with it.
 */
export const LAPSED_VS_ACTIVE = [
  { region: 'Sydney: Central', lapsed: 3.71, active: 2.09 },
  { region: 'Qld Country: Gold Coast', lapsed: 3.22, active: 1.55 },
  { region: 'Sydney: Northern', lapsed: 3.09, active: 2.08 },
  { region: 'Qld Country: Sunshine Coast', lapsed: 3.09, active: 1.54 },
  { region: 'Melbourne: Inner City', lapsed: 3.08, active: 1.62 },
  { region: 'Sydney: Gosford/Wyong', lapsed: 3.02, active: 1.47 },
  { region: 'Melbourne: Central', lapsed: 2.87, active: 1.6 },
  { region: 'Brisbane: City & Northern', lapsed: 2.72, active: 1.4 },
  { region: 'Sydney: Southern', lapsed: 2.62, active: 1.4 },
  { region: 'Sydney: Outer Western', lapsed: 2.48, active: 1.24 },
  { region: 'Brisbane: Western', lapsed: 2.45, active: 1.45 },
  { region: 'Brisbane: Eastern', lapsed: 2.35, active: 1.3 },
] as const;
