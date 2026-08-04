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
// SOURCE
//
// "Lyka - Ten Things The Data Says.html" in the project folder, one level up.
// Every string below is that file's, with the house style pass applied:
//
//   - 29 em dashes removed. Replaced with a colon, a comma or a full stop.
//   - 9 en dashes removed. Ranges are written "1 to 3", never "1-3".
//   - Hyphenated compound modifiers unhyphenated ("family home suburbs", not
//     "family-home suburbs"). Genuine prefixes are left alone: "non-branded" is
//     a prefix, not a compound modifier.
//
// No figure and no claim was changed. Where the source disagrees with itself,
// the `discrepancy` field says so on screen. See point 07.
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
  | 'cityLifecycle'
  | 'seasonalIndex'
  | 'topRegionsRav'
  | 'mmmConfidence'
  | 'brandedSearchGap'
  | 'lapsedPool';

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
  /** The proof figure. Tabular numerals. */
  statValue: string;
  /** The uppercase mono line under the figure. */
  statLabel: string;
  /** One paragraph. */
  learn: string;
  /** Substrings of `learn` to render bold. __integrity.ts asserts each is present. */
  emphasis?: readonly string[];
  /** The "Worth knowing" disclosure. */
  worthKnowing: string;
  implication: string;
  test: string;
  numbers: NumbersTable;
  chart: TenThingChartKey;
  /** Point 07 only. The choropleth composite stays a PNG. */
  mapImage?: TenThingMapImage;
  /**
   * Set when the card stat and the chart do not agree, or when a figure quoted
   * in the copy is not in the table.
   *
   * RENDERED VISIBLY under the chart. This field exists so the tempting fix
   * (edit one number until they match) is never taken on a client facing figure.
   */
  discrepancy?: string;
}

export const TEN_THINGS_POINTS: readonly TenThing[] = [
  // ---------------------------------------------------------------------------
  {
    id: '01',
    category: 'Distribution',
    headline:
      'Growth is coming from the cheapest distribution channel and the least valuable customer',
    cardHeadline: 'Growth is coming from the cheapest channel and the least valuable customer',
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
    statValue: '95 in 100',
    statLabel: 'of the richest households have never tried Lyka',
    learn:
      'The top income decile indexes at 179, retains best at 38%, and only 5.08 per 100 households ' +
      'have ever purchased. Against a demonstrated ceiling near 8 per 100 in the best postcodes, ' +
      'the top decile sits at about half its proven potential.',
    emphasis: ['179', '38%', '5.08 per 100 households'],
    worthKnowing:
      'Only 12.3% of dog owners are strongly moved by advertising, but Mindful Researchers and ' +
      'Devoted Caterers are 52% of that reachable group and 64% of the qualified audience. ' +
      'Precision beats reach.',
    implication:
      'Keep prioritising premium audiences. Weight to channels that over index on affluence: ' +
      'SVOD, BVOD, cinema, premium digital video.',
    test:
      'Broad reach against targeted premium, measured on long term growth rather than first order CPA.',
    numbers: {
      summary: 'The numbers: trial, active base and retention across the ten income deciles',
      columns: ['Decile', 'Ever tried per 100 HH', 'Active per 100 HH', 'Retention'],
      rows: [
        ['1', '1.28', '0.35', '27.6%'],
        ['2', '1.77', '0.48', '27.3%'],
        ['3', '1.89', '0.52', '27.7%'],
        ['4', '2.25', '0.65', '29.1%'],
        ['5', '2.65', '0.81', '30.7%'],
        ['6', '2.75', '0.84', '30.6%'],
        ['7', '3.48', '1.13', '32.4%'],
        ['8', '3.56', '1.16', '32.6%'],
        ['9', '4.11', '1.43', '34.7%'],
        ['10', '5.08', '1.95', '38.4%'],
      ],
      note: 'Decile 1 is the lowest household income, decile 10 the highest.',
    },
    chart: 'incomeLadder',
    discrepancy:
      'The index of 179 quoted above is not in this table and is not plotted. It is a separate ' +
      'measure from the per 100 household figures shown here. Confirm its basis before presenting.',
  },

  // ---------------------------------------------------------------------------
  {
    id: '03',
    category: 'Audience',
    headline: 'Lyka wins in dense, affluent postcodes, less so in family home suburbs',
    cardHeadline: 'Lyka wins in dense, affluent postcodes',
    statValue: '1.33 vs 0.94',
    statLabel: 'penetration in the flattest fifth vs the least flat',
    learn:
      'Penetration rises with the share of flats. But the effect is the postcode, not the flat: ' +
      'within a single city the apartment advantage falls to 1.16 to 1.19x, and in Brisbane it reverses.',
    emphasis: ['the postcode, not the flat'],
    worthKnowing:
      'The best flat postcodes are small and sit in decile 10: Rozelle 3.44, Balmain 3.41. The ' +
      'biggest flat postcodes are among the worst: Melbourne 3000 at 0.42, Bankstown 0.40. Rate ' +
      'and volume point in opposite directions.',
    implication:
      'Invest in premium urban precincts: lift screens, concierge partnerships, precinct ' +
      'activation. Brief it as affluent inner city, never as "apartments".',
    test:
      'Do residential lift screens and precinct activation in affluent apartment postcodes beat ' +
      'broad metro digital outdoor on cost per acquisition?',
    numbers: {
      summary: 'The numbers: penetration and average income decile across five flat share quintiles',
      columns: ['Flat share quintile', 'Penetration per 100 HH', 'Avg income decile'],
      rows: [
        ['Fewest flats', '0.96', '6.9'],
        ['2', '0.94', '6.1'],
        ['3', '0.94', '6.1'],
        ['4', '1.03', '6.3'],
        ['Most flats', '1.33', '7.7'],
      ],
      note:
        'The income column is plotted alongside penetration. The source chart showed penetration ' +
        'alone, which cannot show the confound the headline claims.',
    },
    chart: 'flatShare',
  },

  // ---------------------------------------------------------------------------
  {
    id: '04',
    category: 'Audience',
    headline: 'Two segments, two reasons to buy, but only one of them changes retention',
    cardHeadline: 'Two segments, two reasons to buy, one retention curve',
    statValue: '34.1 to 36.2%',
    statLabel: 'retention across inner metro dwelling quartiles: flat',
    learn:
      'The inner ring professional buys on expert endorsement; the outer suburban family buys on ' +
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
    discrepancy:
      'The headline range of 34.1 to 36.2% is an inner metro cut and is not the range in this ' +
      'table, which runs 32.7 to 35.0% across all dwelling quartiles. The two are measured on ' +
      'different bases. Confirm which is intended before presenting.',
  },

  // ---------------------------------------------------------------------------
  {
    id: '05',
    category: 'Life stage',
    headline: 'Every market is at a different stage, so one national plan fits none of them',
    cardHeadline: 'Every market is at a different stage, so one national plan fits none',
    // "~12 months", not "About 12 months". A stat value has to fit ONE line in
    // the tile (about 147px at 1280) or its hairline lifts out of line with the
    // rest of the row. The tilde is the source's own notation and keeps the
    // approximation, which "12 months" on its own would quietly drop.
    statValue: '~12 months',
    // Shortened from "Brisbane behind Sydney | Perth about 2 years behind
    // Brisbane" for the same reason: at 1280 that ran to four lines. Both facts
    // survive.
    statLabel: 'Brisbane behind Sydney. Perth trails by 2 years',
    learn:
      'Brisbane today looks like Sydney twelve months ago. Perth trails Brisbane by roughly two ' +
      'years. Penetration and tenure move together, which is what a lifecycle looks like.',
    worthKnowing:
      'Melbourne is the exception that matters: it loses to Sydney in every multicultural band ' +
      'while being the less multicultural city. Composition works in its favour; performance does ' +
      'not. Sydney based Lyka may simply hold a home town advantage.',
    implication: 'Use Sydney as the innovation market. Prove there, then scale into less mature states.',
    test:
      'Why does Melbourne underperform in two specific belts: New Homes and Hopes corridors ' +
      '(short 2,001 customers at Sydney cohort rates) and Independence and Careers professional ' +
      'belts (short 1,906)?',
    numbers: {
      summary: 'The numbers: penetration, average tenure and active base across five capitals',
      columns: ['City', 'Penetration', 'Avg tenure (days)', 'Active'],
      rows: [
        ['Sydney', '1.49', '260', '26,121'],
        ['Melbourne', '1.20', '243', '19,687'],
        ['Brisbane', '1.55', '250', '6,717'],
        ['Perth', '0.99', '221', '7,142'],
        ['Adelaide', '0.68', '219', '3,439'],
      ],
      note: 'Penetration is active customers per 100 households. Bubble area is the active base.',
    },
    chart: 'cityLifecycle',
  },

  // ---------------------------------------------------------------------------
  {
    id: '06',
    category: 'Life stage',
    headline: 'Demand has a dependable annual shape; two months of it, anyway',
    cardHeadline: 'Demand has a dependable annual shape; two months of it, anyway',
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
    statValue: '1.60x',
    statLabel: 'best region vs national average value per signup',
    learn:
      "Postcode level RAV concentrates in Sydney's north and east, Melbourne's inner south, " +
      "Brisbane's inner north, Perth's inner ring and Adelaide's central hills, all with " +
      'penetration still well below their own ceiling.',
    worthKnowing:
      'Half the customer base sits in 19 SA4 regions covering the same households as 258 ' +
      'postcodes. The short list costs nothing in precision.',
    implication:
      'Concentrate premium video and high impact outdoor into the priority regions rather than ' +
      'spreading metro wide.',
    test:
      'Can tightly targeted outdoor beat radio or BVOD on cost per acquisition inside a ' +
      'concentrated catchment?',
    numbers: {
      summary: 'The numbers: the ten highest value SA4 regions, with penetration and headroom',
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
      note: 'RAV is value per signup against a national average of 1.00.',
    },
    chart: 'topRegionsRav',
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
    discrepancy:
      'The headline figure of 1.60x is not on this chart. The highest SA4 shown is Sydney ' +
      'Northern Beaches at 1.34x, and the postcode map is clipped at the 95th percentile, also ' +
      '1.34x. The two figures are measured at different geographic levels. Confirm which is ' +
      'intended before this is presented.',
  },

  // ---------------------------------------------------------------------------
  {
    id: '08',
    category: 'Channel',
    headline: 'The model proves advertising works. It cannot yet say which channel',
    cardHeadline: 'The model proves advertising works. It cannot say which channel',
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
    statValue: '109,545',
    // Shortened for the same reason as point 05. The comparison is the punch, so
    // both figures stay; only the words around them go.
    statLabel: 'lapsed in the top 3 deciles | 101,091 active in all',
    learn:
      'Two-thirds of everyone who has ever tried Lyka is now inactive: 203,221 lapsed. Income ' +
      'moves ever tried by 4.0x but retention by only 1.4x. And the lapsed pool in the wealthiest ' +
      'three deciles is larger than the entire active business.',
    emphasis: ['203,221 lapsed', '4.0x', '1.4x', 'larger than the entire active business'],
    worthKnowing:
      '82.6% of the lapsed pool sits in 689 postcodes; 53.9% in the top three income deciles, the ' +
      'same areas that retain best today. These are not bad customers. They are good customers ' +
      'who left.',
    implication:
      'Treat reactivation as an acquisition channel in its own right, weighted to the strongest ' +
      'win back markets: Gold Coast, Brisbane Inner, Northern Beaches, Melbourne Inner South.',
    test:
      'Obtain lapse dates, then run a geographically weighted reactivation campaign against a ' +
      'matched holdout: cost per reactivated customer versus cost per new acquisition.',
    numbers: {
      summary: 'The numbers: lapsed and active customers across the ten income deciles',
      columns: ['Decile', 'Lapsed', 'Active'],
      rows: [
        ['1', '1,810', '689'],
        ['2', '4,765', '1,788'],
        ['3', '8,810', '3,370'],
        ['4', '10,883', '4,465'],
        ['5', '16,868', '7,474'],
        ['6', '21,950', '9,659'],
        ['7', '28,590', '13,686'],
        ['8', '34,364', '16,646'],
        ['9', '39,095', '20,805'],
        ['10', '36,086', '22,509'],
      ],
      note:
        'Lapsed and active are disjoint groups, so a column on the chart is everyone who ever ' +
        'tried. The source chart overlaid them, which read as a part to whole.',
    },
    chart: 'lapsedPool',
  },
];

/** The provenance line, shown once under the grid. */
export const TEN_THINGS_SOURCES =
  'Lyka acquisition file to 29 Jun 2026 | Lyka postcode file, 304,729 customers | ' +
  'Mutinex GrowthOS MMM | ABS Census 2021 | Experian Mosaic';
