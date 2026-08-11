// -----------------------------------------------------------------------------
// Ten Things The Data Says: the COPY.
//
// Two hard constraints, the same pair brand.ts and type.ts carry:
//
// 1. NO React and NO DOM types. The chart for each point is referenced by a
//    STRING KEY, resolved through TEN_THINGS_CHARTS in
//    components/tenthings/charts/index.ts. journeyDetailsData.ts is the one file
//    in this app that imports React, and it is documented as the exception that
//    proves the rule. Do not make a second.
//
// 2. NO MARKUP IN THE STRINGS. The source page used <b> inside its paragraphs.
//    Here the paragraph is plain text and `emphasis` lists the substrings to
//    bold, so nothing needs dangerouslySetInnerHTML and the copy stays greppable.
//
// Numbers live in the sibling tenThingsSeries.ts. See its header for why.
//
// -----------------------------------------------------------------------------
// SOURCE, and there are now TWO. THE PAGE IS ON THE DOG OWNER BASIS.
//
// "Lyka - Ten Things (Dog-Owner Basis).html" (2026-08-10) supersedes the
// original for the FIVE points that divide by a population: 02, 03, 05, 07 and
// 10. Households include the roughly half of homes with no dog, which could
// never buy, so Roy Morgan's count of dog owners is the honest denominator.
// Those five carry rewritten `statValue`, `statLabel`, `learn`, `worthKnowing`
// and `numbers`, and redrawn charts.
//
// "Lyka - Ten Things The Data Says.html" (2026-07-24) is still the source for
// the other five: 01, 04, 06, 08 and 09. Those are rates, counts or a time
// series, so no population figure enters them and there is nothing to redraw.
// Their PNGs are BYTE IDENTICAL across the two source files, which is what
// confirms the split is 5 and 5 rather than an editorial choice, and it is why
// their copy and their chart components are untouched.
//
// `headline`, `cardHeadline`, `implication` and `test` are CARRIED OVER
// UNCHANGED on all ten. The new source says so explicitly, and it means the
// argument and the recommendation did not move when the base did.
//
// Both sources are in the project folder, one level up, in `01 Sources/` since
// the 2026-08-11 reorganisation. Every string below is a
// source file's, with the house style pass applied:
//
//   - Em dashes removed. Replaced with a colon, a comma or a full stop.
//   - En dashes removed. Ranges are written "1 to 3", never "1-3".
//   - Hyphenated compound modifiers unhyphenated ("family home suburbs", not
//     "family-home suburbs"; "dog owner basis", not "dog-owner basis"). Genuine
//     prefixes are left alone: "non-branded" is a prefix, not a compound
//     modifier.
//
// No figure and no claim was changed.
//
// -----------------------------------------------------------------------------
// THREE OPEN CONFLICTS, AND A FOURTH THAT ARRIVED WITH THE NEW SOURCE.
//
// Points 02, 04 and 07 each carried a `discrepancy` note where the source
// disagrees with itself. All three were REMOVED on client direction
// 2026-08-10, so no point sets the field today. Point 02's was about an index of
// 179 that its rewritten copy no longer quotes, so that one is closed by the
// rewrite. Point 04's 34.1 to 36.2% and point 07's 1.60x are STILL OPEN and the
// copy still quotes both.
//
// **The new one is point 06.** Its own basis note says the ex kiosk figures of
// 125 and 84 from the seasonality report supersede the 123 and 84 the chart
// plots and the copy quotes. On 125 the peak to trough swing is 41 points, not
// the 39 the stat says. That report is not in the project folder. It is carried
// verbatim rather than acted on, because the alternative is editing a client
// facing figure to agree with a document nobody here has read.
//
// The rule that no figure gets quietly edited to make a chart agree with its own
// headline still stands, and `discrepancy` is still wired end to end, so
// restoring a visible note is one property on a record.
// -----------------------------------------------------------------------------

export type TenThingCategory =
  | 'Distribution'
  | 'Audience'
  | 'Life stage'
  | 'Geography'
  | 'Channel'
  | 'Retention';

/**
 * JOIN KEY. Resolved through TEN_THINGS_CHARTS in
 * components/tenthings/charts/index.ts.
 *
 * A key with no entry renders an empty frame with NO ERROR, which is the same
 * silent failure mode SEGMENT_COLORS and SEGMENT_IMAGES have. data/__integrity.ts
 * asserts this join on every dev page load for exactly that reason.
 */
export type TenThingChartKey =
  | 'distributionSplit'
  | 'incomeLadder'
  | 'flatShare'
  | 'retentionCuts'
  | 'cityReach'
  | 'seasonalIndex'
  | 'topRegionsReach'
  | 'mmmConfidence'
  | 'brandedSearchGap'
  | 'lapsedVsActive';

/**
 * Which denominator this point's figures divide by.
 *
 * `dogOwner` is one of the five redrawn against Roy Morgan's dog owner counts.
 * `noDenominator` is one of the five measured as a rate, a count or a time
 * series, where no population figure enters and there is nothing to redraw.
 *
 * The split is 5 and 5, and the About copy says so out loud, so
 * data/__integrity.ts asserts the count rather than trusting the prose. Colour
 * comes from BASIS_COLORS in data/brand.ts; the labels are BASIS_LABELS below.
 */
export type TenThingBasis = 'dogOwner' | 'noDenominator';

/**
 * The "The numbers" disclosure, verbatim from the source.
 *
 * Pre formatted strings, not numbers: the source mixes "49.3%", "1.15" and one
 * empty cell where it reports no figure at all. Formatting them here keeps the
 * table faithful to what was published.
 */
export interface NumbersTable {
  /**
   * The <summary> text. A collapsed <details> hides its contents from the
   * accessibility tree, so this has to describe what is inside, not just say
   * "The numbers".
   */
  summary: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  note?: string;
}

export interface TenThingMapImage {
  src: string;
  /** Long. This image has 956 postcode values and no table equivalent. */
  alt: string;
  caption: string;
  /** Per city enlargements, keyed by the hotspot's city id. */
  cities?: Readonly<Record<string, string>>;
}

export interface TenThing {
  /** '01' to '10'. The numbered chip and the stepper position. */
  id: string;
  category: TenThingCategory;
  /** The full argument. The modal h2. */
  headline: string;
  /**
   * The tile. Short, because a tile in the 5 x 2 grid is about 200px wide at
   * 1440 and about 170px at 1280.
   *
   * This exists so the answer to "the headline does not fit" is to shorten the
   * copy rather than to drop the type below the 14px prose floor in type.ts.
   * Same split as Persona.title against Persona.name.
   */
  cardHeadline: string;
  /** Which base the figures divide by. Drives the tile rail, the pill and the block. */
  basis: TenThingBasis;
  /**
   * One paragraph saying what the basis means FOR THIS POINT. Required, not
   * optional, and that is deliberate: an absent note would drop its block and
   * the modal would still look finished, which is the same silent failure the
   * media plan's unlabelled Role of Channel had. __integrity.ts asserts it is
   * non empty.
   */
  basisNote: string;
  /** The proof figure. Tabular numerals. */
  statValue: string;
  /** The uppercase mono line under the figure. */
  statLabel: string;
  /** One paragraph. Rendered under the "What we found" label. */
  learn: string;
  /** Substrings of `learn` to render bold. __integrity.ts asserts each is present. */
  emphasis?: readonly string[];
  /**
   * Rendered under the "Why it matters" label.
   *
   * It was the "Worth knowing" DISCLOSURE, collapsed behind a <details>, until
   * 2026-08-10. The new source promotes it to a visible labelled block and it is
   * one here too: a populated field nobody opens is a field nobody reads.
   */
  worthKnowing: string;
  /** Rendered under "What to do". */
  implication: string;
  /** Rendered under "What we still need to test". */
  test: string;
  numbers: NumbersTable;
  /**
   * Point 07 only. A SECOND disclosure, for a table on a different measure from
   * the chart's. RAV is an average across customers, so the change of base
   * leaves it alone, and it is the only support for the 1.60x the copy quotes
   * and for the map's own scale.
   */
  numbersSecondary?: NumbersTable;
  chart: TenThingChartKey;
  /** Point 07 only. The choropleth composite stays a PNG. */
  mapImage?: TenThingMapImage;
  /**
   * Set when the card stat and the chart do not agree, or when a figure quoted
   * in the copy is not in the table.
   *
   * RENDERED VISIBLY under the chart. This field exists so the tempting fix
   * (edit one number until they match) is never taken on a client facing figure.
   *
   * UNSET ON EVERY POINT since 2026-08-10, when the client removed all three.
   * The field and its rendering are deliberately kept: the conflicts they named
   * are still open, and re-adding a note is one property. See the file header.
   */
  discrepancy?: string;
}

/**
 * The two basis states, as they read on screen.
 *
 * `pill` is the tile legend and the modal chip. `block` is the heading on the
 * paragraph under the chart. Copy lives here rather than in brand.ts, which is
 * colour only.
 */
export const BASIS_LABELS: Readonly<Record<TenThingBasis, { pill: string; block: string }>> = {
  dogOwner: { pill: 'Dog owner basis', block: 'Measured against dog owners' },
  noDenominator: { pill: 'No denominator', block: 'No dog owner version exists' },
};

export const TEN_THINGS_POINTS: readonly TenThing[] = [
  // ---------------------------------------------------------------------------
  {
    id: '01',
    category: 'Distribution',
    headline:
      'Growth is coming from the cheapest distribution channel and the least valuable customer',
    cardHeadline: 'Growth is coming from the cheapest channel and the least valuable customer',
    basis: 'noDenominator',
    basisNote:
      'Average revenue per signup, compared channel by channel. No population denominator, so ' +
      'there is no dog owner version to draw.',
    statValue: '0.29 vs 1.15',
    statLabel: 'RAV: kiosk signup vs media signup',
    learn:
      'Kiosks drove 49% of growth; media drove 22%. But a kiosk signup is worth 0.29 against a ' +
      'media signup at 1.15. Partnerships (0.96) and referral (0.82) are also below average, so ' +
      'neither replaces kiosk volume with better customers.',
    emphasis: ['49% of growth', '0.29', '1.15'],
    worthKnowing:
      'Kiosks tested about 70% incremental in matched cells, a genuinely new door rather than a ' +
      'duplicate of the digital funnel. The value problem is real. The incrementality is not in doubt.',
    implication: 'Rebalance toward the higher value engine rather than leaning further on kiosks.',
    test:
      'Is the channel inherently low value, or is it location and execution? Settle first whether ' +
      'a kiosk signup is counted at the same funnel stage as a web signup. That decides whether ' +
      '0.29 is churn or a definitional artefact.',
    numbers: {
      summary: 'The numbers: four channels, share of growth and value per signup',
      columns: ['Channel', 'Share of growth', 'RAV'],
      rows: [
        ['Kiosks', '49.3%', '0.29'],
        ['Media', '22.0%', '1.15'],
        ['Partnerships', '', '0.96'],
        ['Referral', '', '0.82'],
      ],
      note:
        'RAV is value per signup against a national average of 1.00. Share of growth is not ' +
        'reported separately for partnerships and referral; the chart shows them combined at 28.7%.',
    },
    chart: 'distributionSplit',
  },

  // ---------------------------------------------------------------------------
  {
    id: '02',
    category: 'Audience',
    headline: 'There is still headroom in the premium end of the market',
    cardHeadline: 'There is still headroom in the premium end of the market',
    basis: 'dogOwner',
    basisNote:
      "This chart divides by Roy Morgan's count of dog owners, the people who could actually buy, " +
      'not by households.',
    statValue: '95 in 100',
    statLabel: 'dog owners have never tried Lyka',
    learn:
      'The richest tenth of areas reaches 4.86 per 100 dog owners ever tried and 1.87 still ' +
      'active, 3.97x the poorest tenth. On the base that can actually buy, 95 in 100 dog owners ' +
      'in the wealthiest areas have still never tried Lyka.',
    emphasis: ['4.86 per 100 dog owners', '1.87', '3.97x'],
    worthKnowing:
      'Switching from households to dog owners barely moves this ladder (4.07x becomes 3.97x), ' +
      'which is the useful finding: the income effect is real, not an artefact of richer areas ' +
      'keeping fewer dogs. Only 12.3% of dog owners are strongly moved by advertising, and ' +
      'Mindful Researchers and Devoted Caterers are 52% of that reachable group.',
    implication:
      'Keep prioritising premium audiences. Weight to channels that over index on affluence: ' +
      'SVOD, BVOD, cinema, premium digital video.',
    test:
      'Broad reach against targeted premium, measured on long term growth rather than first order CPA.',
    numbers: {
      summary: 'The numbers: trial, active base and retention across the ten income deciles',
      columns: [
        'Decile',
        'Ever tried per 100 dog owners',
        'Active per 100 dog owners',
        'Retention',
      ],
      rows: [
        ['1', '1.20', '0.33', '27.6%'],
        ['2', '1.60', '0.44', '27.3%'],
        ['3', '1.80', '0.50', '27.7%'],
        ['4', '2.10', '0.61', '29.1%'],
        ['5', '2.40', '0.74', '30.7%'],
        ['6', '2.60', '0.80', '30.6%'],
        ['7', '3.20', '1.04', '32.4%'],
        ['8', '3.30', '1.08', '32.6%'],
        ['9', '4.00', '1.39', '34.7%'],
        ['10', '4.86', '1.87', '38.4%'],
      ],
      note:
        'Decile 1 is the lowest household income, decile 10 the highest. The ever tried column is ' +
        "the source chart's own value labels, which it prints to one decimal place except for the " +
        'top decile. The active column is DERIVED: the source publishes only the totals, and ' +
        'retention is a rate among customers, so it is the same on either base and moves ever ' +
        'tried onto the active base exactly. It reproduces the 1.87 the source states for the top ' +
        'decile. Treat it as SPEED arithmetic, not as a published research figure.',
    },
    chart: 'incomeLadder',
  },

  // ---------------------------------------------------------------------------
  {
    id: '03',
    category: 'Audience',
    headline: 'Lyka wins in dense, affluent postcodes, less so in family home suburbs',
    cardHeadline: 'Lyka wins in dense, affluent postcodes',
    basis: 'dogOwner',
    basisNote:
      "This chart divides by Roy Morgan's count of dog owners, the people who could actually buy, " +
      'not by households. Roy Morgan does not publish dog owners below region level, so each ' +
      "postcode is given its region's dog ownership rate: that captures differences between " +
      'regions but not within them.',
    statValue: '1.64x',
    statLabel: 'most flats against fewest flats, per dog owner',
    learn:
      'Penetration rises with the share of flats, and the dog owner base makes the gap wider: ' +
      '1.64x between the flattest and least flat fifth of postcodes, against 1.41x on households. ' +
      'Flat heavy areas own fewer dogs, so the household measure was hiding part of the effect.',
    emphasis: ['1.64x', '1.41x on households'],
    worthKnowing:
      'A region grain cross check that needs no estimate at all puts the same gap at 2.16x. But ' +
      'the driver is still the postcode, not the flat: the best flat postcodes are small and sit ' +
      'in decile 10, and the biggest are among the worst. Brief it as affluent inner city, never ' +
      'as "apartments".',
    implication:
      'Invest in premium urban precincts: lift screens, concierge partnerships, precinct ' +
      'activation. Brief it as affluent inner city, never as "apartments".',
    test:
      'Do residential lift screens and precinct activation in affluent apartment postcodes beat ' +
      'broad metro digital outdoor on cost per acquisition?',
    numbers: {
      summary:
        'The numbers: flats share, active customers and average income decile across five ' +
        'quintiles of postcodes',
      columns: [
        'Flat share quintile',
        'Flats',
        'Active per 100 dog owners',
        'Avg income decile',
      ],
      rows: [
        ['Fewest flats', '1%', '0.80', '6.9'],
        ['2nd', '4%', '0.87', '6.1'],
        ['Middle', '8%', '0.83', '6.1'],
        ['4th', '17%', '0.89', '6.3'],
        ['Most flats', '52%', '1.31', '7.7'],
      ],
      note:
        'The national rate is 1.03 per 100 dog owners. The income column is the evidence for the ' +
        'headline\'s claim that the driver is the postcode rather than the dwelling; it is not ' +
        'plotted on the redrawn chart, and it is unaffected by the change of base because it ' +
        'describes the income mix of the postcodes rather than a rate over a population.',
    },
    chart: 'flatShare',
  },

  // ---------------------------------------------------------------------------
  {
    id: '04',
    category: 'Audience',
    headline: 'Two segments, two reasons to buy, but only one of them changes retention',
    cardHeadline: 'Two segments, two reasons to buy, one retention curve',
    basis: 'noDenominator',
    basisNote:
      'Retention is a rate among customers who already joined. Both sides of the sum are ' +
      'customers, so the surrounding population never enters it.',
    statValue: '34.1 to 36.2%',
    statLabel: 'retention across inner metro dwelling quartiles: flat',
    learn:
      'The inner city professional buys on expert endorsement; the outer suburban family buys on ' +
      "the dog's own response. That is a difference in the reason to buy, not in loyalty: " +
      'retention is flat across dwelling quartiles but climbs steadily with income.',
    emphasis: ['difference in the reason to buy, not in loyalty'],
    worthKnowing:
      'So outer suburban areas lapse faster because they are less affluent, not because they live ' +
      'in houses. This is a duration finding, not a value one. Spend per customer is not in it.',
    implication:
      'Separate creative and message by segment. Do not separate the retention plan by dwelling ' +
      'type, separate it by income.',
    test:
      'Does finer micro segmentation beat a simple two segment split, once cost to serve is included?',
    numbers: {
      summary: 'The numbers: retention across a dwelling cut and an income cut',
      columns: ['Cut', 'Retention'],
      rows: [
        ['Most houses', '32.7%'],
        ['2', '32.8%'],
        ['3', '34.8%'],
        ['Most flats', '35.0%'],
        ['Deciles 1 to 3', '27.5%'],
        ['4 to 6', '30.3%'],
        ['7 to 8', '32.5%'],
        ['9 to 10', '36.6%'],
      ],
      note: 'The first four rows are the dwelling cut. The last four are the income cut.',
    },
    chart: 'retentionCuts',
  },

  // ---------------------------------------------------------------------------
  {
    id: '05',
    category: 'Life stage',
    headline: 'Every market is at a different stage, so one national plan fits none of them',
    cardHeadline: 'Every market is at a different stage, so one national plan fits none',
    basis: 'dogOwner',
    basisNote:
      "This chart divides by Roy Morgan's count of dog owners, the people who could actually buy, " +
      'not by households.',
    // ONE LINE in the tile, about 147px at 1280, or the hairline lifts out of
    // line with the rest of the row. "1.23 vs 1.21" is 12 characters and fits.
    statValue: '1.23 vs 1.21',
    statLabel: 'Brisbane and Melbourne per 100 dog owners: level',
    learn:
      'Sydney leads at 1.49 per 100 dog owners, then the ACT at 1.33. Brisbane (1.23) and ' +
      'Melbourne (1.21) are level, and Perth (0.85) is further back than the household view ' +
      'suggested.',
    emphasis: ['1.49 per 100 dog owners', '1.23', '1.21'],
    worthKnowing:
      'On households Brisbane looked a clear step ahead of Melbourne. It was not: Brisbane simply ' +
      "owns more dogs, 43 adults in 100 against Melbourne's 39. Markets really are at different " +
      'stages, but the spacing was wrong. Do not say Brisbane is a year ahead of Melbourne.',
    implication: 'Use Sydney as the innovation market. Prove there, then scale into less mature states.',
    test:
      'Why does Melbourne underperform in two specific belts: New Homes and Hopes corridors ' +
      '(short 2,001 customers at Sydney cohort rates) and Independence and Careers professional ' +
      'belts (short 1,906)?',
    numbers: {
      summary: 'The numbers: active customers per 100 dog owners across six markets',
      columns: ['Market', 'Active per 100 dog owners'],
      rows: [
        ['Sydney', '1.49'],
        ['ACT', '1.33'],
        ['Brisbane', '1.23'],
        ['Melbourne', '1.21'],
        ['Perth', '0.85'],
        ['Adelaide', '0.71'],
      ],
      note:
        'The national rate is 1.03. The ACT is a sixth row the household version did not carry, ' +
        'and tenure and the active count are not on the redrawn chart. The source publishes dog ' +
        'ownership rates for only two of these markets, Brisbane at 43 adults in 100 and ' +
        'Melbourne at 39, which is what closes the gap between those two.',
    },
    chart: 'cityReach',
  },

  // ---------------------------------------------------------------------------
  {
    id: '06',
    category: 'Life stage',
    headline: 'Two months of the year are dependable. The rest are not',
    cardHeadline: 'Two months of the year are dependable. The rest are not',
    basis: 'noDenominator',
    // THE PARENTHETICAL IS THE SOURCE'S OWN AND IT CONTRADICTS THIS POINT'S
    // CHART. 125 against the 123 plotted makes the swing 41 points, not the 39
    // the stat says. The seasonality report it cites is not in the project
    // folder. Carried verbatim rather than acted on: see the header.
    basisNote:
      'A national time series. Geography plays no part. (The ex kiosk figures of 125 and 84 from ' +
      'the seasonality report supersede these, for a different reason.)',
    statValue: '39 points',
    statLabel: 'peak to trough swing, January to September',
    learn:
      'January indexes 123 and September 84 once the growth trend is stripped out. The pattern ' +
      'holds across the last two years. The months in between are not yet reliable.',
    emphasis: ['123', '84'],
    worthKnowing:
      'We tested whether this is demand or promotion and could not separate them: media activity ' +
      'also peaks in January, at index 119. So the honest read is that the shape is real and the ' +
      'cause is open.',
    implication:
      'Flight weight into November to January and ease through the September trough rather than ' +
      'running flat.',
    test:
      'Is the January peak category driven (new dogs over summer) or promotionally driven? That ' +
      'decides whether weight lands before or during the peak.',
    numbers: {
      summary: 'The numbers: the twelve month demand index, 100 is the average month',
      columns: ['Month', 'Index'],
      rows: [
        ['Jan', '123'],
        ['Feb', '110'],
        ['Mar', '97'],
        ['Apr', '98'],
        ['May', '93'],
        ['Jun', '99'],
        ['Jul', '98'],
        ['Aug', '96'],
        ['Sep', '84'],
        ['Oct', '104'],
        ['Nov', '100'],
        ['Dec', '97'],
      ],
      note: 'Growth trend removed. Bars are drawn from the 100 baseline, not from zero.',
    },
    chart: 'seasonalIndex',
  },

  // ---------------------------------------------------------------------------
  {
    id: '07',
    category: 'Geography',
    headline: 'Value has an address, and it is a short list',
    cardHeadline: 'Value has an address, and it is a short list',
    basis: 'dogOwner',
    basisNote:
      "This chart divides by Roy Morgan's count of dog owners, the people who could actually buy, " +
      'not by households. The RAV table and the map below are unaffected: value per signup is an ' +
      'average across customers, so no population divides it.',
    statValue: '2.09',
    statLabel: 'Sydney Central, the best region, per 100 dog owners',
    learn:
      'The strongest regions are Sydney Central and Sydney Northern, both just ' +
      'over 2 per 100 dog owners, then Melbourne Inner City and Melbourne Central, then the Gold ' +
      'Coast and Sunshine Coast. Value per signup is an average across customers, so the 1.60x ' +
      'value concentration is unaffected by the change of base.',
    emphasis: ['2 per 100 dog owners', '1.60x'],
    worthKnowing:
      'The priority list barely moves: 11 of the top 12 regions are the same on both measures, ' +
      'with Canberra coming in and Sydney Outer Western dropping out. The geography of value is ' +
      'robust to the denominator.',
    implication:
      'Concentrate premium video and high impact outdoor into the priority regions rather than ' +
      'spreading metro wide.',
    test:
      'Can tightly targeted outdoor beat radio or BVOD on cost per acquisition inside a ' +
      'concentrated catchment?',
    numbers: {
      summary:
        'The numbers: the top 18 of 58 regions by active customers per 100 dog owners, with the ' +
        'boundary match quality for each',
      columns: ['Region', 'Active per 100 dog owners', 'Boundary match'],
      rows: [
        ['Sydney: Central', '2.09', 'B'],
        ['Sydney: Northern', '2.08', 'A'],
        ['Melbourne: Inner City', '1.62', 'C'],
        ['Melbourne: Central', '1.60', 'A'],
        ['Qld Country: Gold Coast', '1.55', 'A'],
        ['Qld Country: Sunshine Coast', '1.54', 'A'],
        ['Sydney: Gosford/Wyong', '1.47', 'A'],
        ['Brisbane: Western', '1.45', 'A'],
        ['Sydney: Southern', '1.40', 'A'],
        ['Brisbane: City & Northern', '1.40', 'A'],
        ['NSW Country: ACT', '1.33', 'A'],
        ['Brisbane: Eastern', '1.30', 'B'],
        ['Sydney: Outer Western', '1.24', 'A'],
        ['NSW Country: Wollongong', '1.18', 'A'],
        ['Melbourne: Outer North East', '1.15', 'A'],
        ['Melbourne: Northern', '1.14', 'A'],
        ['NSW Country: Newcastle', '1.09', 'A'],
        ['Vic Country: Geelong', '1.07', 'A'],
      ],
      note:
        'The national rate is 1.03. Boundary match is how well the Lyka postcode file lines up ' +
        'with the Roy Morgan region: A matches closely, B is a reasonable match, C should be ' +
        'treated with caution. Note the best region and the third best are not A.',
    },
    numbersSecondary: {
      summary: 'The numbers: value per signup, the ten highest value SA4 regions',
      columns: ['SA4 region', 'RAV', 'Penetration', 'Headroom'],
      rows: [
        ['Sydney: Northern Beaches', '1.34', '3.06', '9'],
        ['Sydney: North Sydney and Hornsby', '1.20', '1.83', '193'],
        ['Sydney: Sutherland', '1.19', '2.35', '35'],
        ['Perth: Inner', '1.18', '1.19', '98'],
        ['Brisbane Inner City', '1.15', '1.78', '56'],
        ['Sydney: Eastern Suburbs', '1.13', '2.40', '17'],
        ['Australian Capital Territory', '1.13', '1.33', '302'],
        ['Illawarra', '1.10', '1.20', '23'],
        ['Melbourne: Inner South', '1.10', '1.75', '106'],
        ['Southern Highlands and Shoalhaven', '1.07', '1.32', '17'],
      ],
      note:
        'RAV is value per signup against a national average of 1.00, on SA4 regions and a ' +
        'household penetration column. It is kept because value per signup is an average across ' +
        'customers and so is unaffected by the change of base, and because it is what the map ' +
        'below plots. The copy quotes 1.60x and the highest value here is 1.34x, as is the map ' +
        'legend. That conflict is unresolved: settle it with the client rather than by editing ' +
        'either figure.',
    },
    chart: 'topRegionsReach',
    mapImage: {
      src: '/images/ten-things/map-composite.png',
      alt:
        'Five choropleth maps of Australian capital cities showing value per signup by postcode. ' +
        'Sydney, 194 postcodes, with the highest value concentrated across the north shore, the ' +
        'northern beaches and the eastern suburbs, and the lowest across the western and south ' +
        'western suburbs. Melbourne, 185 postcodes, with high value through the inner south and ' +
        'inner east and low value across the outer north and west. Brisbane, 102 postcodes, with ' +
        'a large high value block through the inner north. Perth, 73 postcodes, with high value ' +
        'concentrated in the inner ring along the river and the coast. Adelaide, 60 postcodes, ' +
        'with high value through the central hills and low value in the outer north. The scale ' +
        'runs from 0.73 times the national average to 1.34 times.',
      caption:
        'ABS 2021 postal area boundaries. RAV measured on 956 postcodes, 84.7% of households. ' +
        'Scale clipped at the 5th and 95th percentile. Click a city to open it full size.',
      cities: {
        sydney: '/images/ten-things/map-sydney.png',
        melbourne: '/images/ten-things/map-melbourne.png',
        brisbane: '/images/ten-things/map-brisbane.png',
        perth: '/images/ten-things/map-perth.png',
        adelaide: '/images/ten-things/map-adelaide.png',
      },
    },
  },

  // ---------------------------------------------------------------------------
  {
    id: '08',
    category: 'Channel',
    headline: 'The model proves advertising works. It cannot yet say which channel',
    cardHeadline: 'The model proves advertising works. It cannot say which channel',
    basis: 'noDenominator',
    basisNote:
      'A diagnostic about what the media model can identify. No denominator involved.',
    statValue: 'Aggregate only',
    statLabel: 'what the MMM can and cannot support',
    learn:
      'The MMM establishes that media drives growth in aggregate. It cannot reliably attribute ' +
      'incremental performance between channels: the channel split inherits an identifiability ' +
      'problem.',
    emphasis: ['between'],
    worthKnowing:
      'The aggregate story is robust: other media gained 14,507 while Meta lost 9,352 since the ' +
      'peak. It is the per channel credit that is contested, not the total.',
    implication:
      'Validate channel decisions with experiments. Do not move budget on MMM channel ' +
      'coefficients alone.',
    test: 'A controlled geographic holdout to establish true incremental contribution per channel.',
    numbers: {
      summary: 'The numbers: three claims and the confidence the model supports for each',
      columns: ['Claim', 'Status'],
      rows: [
        ['Advertising drives growth overall', 'Established'],
        ['Meta against other channel split', 'Contested: identifiability'],
        ['Per channel incrementality', 'Not identified: needs geo holdout'],
      ],
    },
    chart: 'mmmConfidence',
  },

  // ---------------------------------------------------------------------------
  {
    id: '09',
    category: 'Channel',
    headline: 'Demand is being created and then lost before it converts',
    cardHeadline: 'Demand is being created and then lost before it converts',
    basis: 'noDenominator',
    basisNote:
      'National counts and shares of search behaviour. Nothing here divides by an area.',
    statValue: '9 : 1',
    // SHORTENED to fit three lines at 1280, where "acquisitions," is a 13
    // character unbreakable token in a 147px column and forced a fourth line.
    // That broke the row: the stat block went 81px to 96px and lifted this
    // tile's hairline 15px out of line with its four neighbours. The documented
    // rule is to shorten the label, never to raise the min height. "signups" is
    // this page's own word for the same event (see points 01 and 07).
    statLabel: 'non-branded to branded signups, lifetime',
    learn:
      'External interest in Lyka has risen sharply. Branded search has held flat at 10 to 11% of ' +
      'search contribution for three straight years, and no campaign has produced organic lift.',
    emphasis: ['flat at 10 to 11%'],
    worthKnowing:
      "82% of Lyka's base comes from the two segments that research before buying, from just 26% " +
      'of the market. Lyka is absent from the vet recommendation answers those people use to ' +
      'validate the decision.',
    implication:
      'Point part of the brand budget at where interest lands rather than at generating more of it.',
    test:
      'Does improving presence at the research moment lift branded conversion, with media weight ' +
      'held constant?',
    numbers: {
      summary: 'The numbers: branded share of search contribution across three financial years',
      columns: ['Financial year', 'Branded share of search contribution', 'Interest index'],
      rows: [
        ['FY24', '10.5%', '100'],
        ['FY25', '10.8%', '118'],
        ['FY26', '10.6%', '135'],
        ['Lifetime ratio', '9:1 non-branded to branded', ''],
      ],
      note:
        'The two columns are different quantities: a percentage and an index rebased to FY24. ' +
        'The chart puts them on separate axes for that reason.',
    },
    chart: 'brandedSearchGap',
  },

  // ---------------------------------------------------------------------------
  {
    id: '10',
    category: 'Retention',
    headline: 'Trial is not the binding constraint. Survival is.',
    cardHeadline: 'Trial is not the binding constraint. Survival is.',
    basis: 'dogOwner',
    basisNote:
      "This chart divides by Roy Morgan's count of dog owners, the people who could actually buy, " +
      'not by households.',
    statValue: '3.71',
    // Shortened for the same reason as point 05: the value must fit one line and
    // the label must not take a fourth. Both figures survive in `learn`.
    statLabel: 'lapsed per 100 dog owners in Sydney Central',
    learn:
      'Every strong market carries more lapsed customers than active ones. Sydney Central leads ' +
      'on both counts: 3.71 lapsed per 100 dog owners against 2.09 active. Two thirds of ' +
      'everyone who has ever tried Lyka is now inactive.',
    emphasis: ['3.71 lapsed per 100 dog owners against 2.09 active'],
    worthKnowing:
      'The win back geography survives the change of base: 7 of the top 8 markets are the same on ' +
      'households and on dog owners. The one change worth making is the running order. Lead the ' +
      'reactivation plan with Sydney Central rather than the Gold Coast.',
    implication:
      'Treat reactivation as an acquisition channel in its own right, weighted to the strongest ' +
      'win back markets: Gold Coast, Brisbane Inner, Northern Beaches, Melbourne Inner South.',
    test:
      'Obtain lapse dates, then run a geographically weighted reactivation campaign against a ' +
      'matched holdout: cost per reactivated customer versus cost per new acquisition.',
    numbers: {
      summary:
        'The numbers: lapsed and active customers per 100 dog owners across the twelve strongest ' +
        'markets',
      columns: ['Region', 'Lapsed per 100 dog owners', 'Active per 100 dog owners'],
      rows: [
        ['Sydney: Central', '3.71', '2.09'],
        ['Qld Country: Gold Coast', '3.22', '1.55'],
        ['Sydney: Northern', '3.09', '2.08'],
        ['Qld Country: Sunshine Coast', '3.09', '1.54'],
        ['Melbourne: Inner City', '3.08', '1.62'],
        ['Sydney: Gosford/Wyong', '3.02', '1.47'],
        ['Melbourne: Central', '2.87', '1.60'],
        ['Brisbane: City & Northern', '2.72', '1.40'],
        ['Sydney: Southern', '2.62', '1.40'],
        ['Sydney: Outer Western', '2.48', '1.24'],
        ['Brisbane: Western', '2.45', '1.45'],
        ['Brisbane: Eastern', '2.35', '1.30'],
      ],
      note:
        'Lapsed and active are disjoint groups, so a bar on the chart is everyone who ever tried ' +
        'and the two figures add. The source chart draws the bar total as the LAPSED figure with ' +
        'active overlaid inside it, which reads as a part to whole: Sydney Central looks like ' +
        '2.09 of 3.71 when the true reading is 2.09 of 5.80. The household version of this chart ' +
        'had the same defect and was stacked for the same reason.',
    },
    chart: 'lapsedVsActive',
  },
];

/** The provenance line, shown once under the grid. */
export const TEN_THINGS_SOURCES =
  'Lyka customer file by postcode | Roy Morgan Single Source Apr 2025 to Mar 2026, dog owners, ' +
  'people aged 14+ | ABS Census 2021 on ABS ASGS 2021 boundaries | Lyka acquisition file to ' +
  '29 Jun 2026 | Mutinex GrowthOS MMM | Experian Mosaic';

/**
 * The caveat on the two postcode grain charts.
 *
 * ON THE PAGE, NOT IN A COMMENT. Roy Morgan does not publish dog owners below
 * region level, so points 03 and 07 give each postcode its region's rate. That
 * is an estimate inside a deck whose whole argument is that it uses the honest
 * denominator, so it has to be visible rather than known.
 *
 * TWO LENGTHS, ONE CONST, and the split is measured rather than stylistic. The
 * full text set the Sources strip to 122px at 1280x720, which pushed the grid's
 * scroll from 45px to 160px: a caveat that knocks a one viewport deck off one
 * viewport has a real cost. `short` keeps the disclosure unmissable on the page
 * and `full` sits in the About dialog with the rest of the basis explanation,
 * which is where a reader looking for the methodology would go anyway. Keeping
 * them in one object is what stops the two drifting into different claims.
 */
export const TEN_THINGS_ESTIMATE_NOTE = {
  short:
    'Two charts estimate dog owners below region level. See About this basis.',
  full:
    'Roy Morgan does not publish dog owners below region level, so the two postcode grain charts ' +
    "give each postcode its region's dog ownership rate. That captures differences between " +
    'regions but not within them. The apartment chart also carries a region grain cross check ' +
    'that needs no such estimate.',
} as const;

/**
 * "About this basis": the two page level sections the new source added.
 *
 * They open from a button beside the legend rather than sitting on the grid,
 * because the grid is a one viewport 5 x 2 frame and seeing all ten at once is
 * the point of the page. See the layout note in pages/TenThings.tsx.
 *
 * -----------------------------------------------------------------------------
 * TWO DEPARTURES FROM THE SOURCE'S OWN COPY, both deliberate.
 *
 * 1. "green tag" is "teal tag" here, because the marker is BASIS_COLORS teal
 *    #0A7D68 rather than the source page's #2E8B64 green. Naming a colour that
 *    is not on screen is worse than not naming one.
 *
 * 2. THE SOURCE'S THIRD PARAGRAPH IS NOT CARRIED, and two of its three
 *    sentences are why. "Click any point for the chart and the detail" is
 *    already the page lede. "Click a chart to enlarge it" is FALSE here: only
 *    point 07's map opens a Lightbox, the Chart.js charts do not. And "this
 *    sits alongside the original Ten Things The Data Says and the re-check
 *    note, both unchanged" is FALSE here too: there is one page and it IS the
 *    dog owner version, so the household one is superseded rather than running
 *    beside it.
 *
 *    That paragraph is navigation and provenance copy for a standalone HTML
 *    document, and this is an app. If the provenance half is wanted, write a
 *    sentence that is true of the deck rather than restoring one that is not.
 * -----------------------------------------------------------------------------
 */
export const TEN_THINGS_ABOUT: readonly { heading: string; paragraphs: readonly string[] }[] = [
  {
    heading: 'The same ten points, measured against dog owners wherever that is possible',
    paragraphs: [
      'Roy Morgan tells us how many dog owners live in each of 58 regions across Australia. That ' +
        'is the honest denominator for anything about share of a market: households include the ' +
        'roughly half of homes with no dog, which could never buy. In this version, every chart ' +
        'that divides by a population has been redrawn on dog owners, and that is the only ' +
        'version shown.',
      'Five of the ten points have such a denominator: premium headroom, apartments, market ' +
        'maturity, the geography of value and the lapsed base. They carry a teal tag. The other ' +
        'five, channel value, retention, seasonality, the media model and the search leak, are ' +
        'measured as rates, counts or a time series, so no population figure enters them and ' +
        'there is nothing to redraw. They keep their original chart and carry a grey tag.',
    ],
  },
  {
    heading: '"95 in 100 have never tried": which 100?',
    paragraphs: [
      'Point 02 reads the same on either base, but for a reason worth knowing. Nationally there ' +
        'is almost exactly one dog owner per household (1.07), so per 100 households and per 100 ' +
        'dog owners give nearly identical answers: 5.08 and 4.86 ever tried in the wealthiest ' +
        'tenth.',
      'If instead you express it per dog owning household, only about half of all homes, the ' +
        'same fact becomes roughly 89 in 100. All three are true; they answer different ' +
        'questions. This deck uses dog owners throughout, because that is the population Roy ' +
        'Morgan actually counted and it needs no extra assumption.',
    ],
  },
];
