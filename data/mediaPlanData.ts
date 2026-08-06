// -----------------------------------------------------------------------------
// Interactive Media Plan data: the LYKA plan.
//
// Source of truth: "Interactive Media Plan Briefing Template for Lyka.xlsx"
// (one folder above the app), sheet "Budget Distribution $ Lyka SPEE" for the
// numbers and the three VISIBLE "Media Description" sheets (SHOW IT, CHECK IT,
// PROVE IT) for the pop-up copy. Hidden content was excluded per client
// direction, exactly as on the Hamilton Island build: the hidden
// "Budget Distribution $ Lyka" sheet (the superseded first pass and the only
// place the in-house channels carry dollars), the hidden TRY IT and SHARE IT
// description sheets (their stages keep their visible budget rows but carry no
// description copy), and the hidden "Australian Open Integration" row.
//
// The plan year runs October -> September. Values are AUD.
//
// OWNERSHIP is the structural difference from the Hamilton plan. Every row is
// either SPEED managed (owner: 'speed', red bars, monthly dollars summing to
// exactly $11.0M) or Lyka in house (owner: 'lyka', green bars). Per client
// direction the in-house rows show FLIGHTING ONLY: `activeMonths` marks when
// the channel is live (from the sheet's green cell fills), `monthly` is all
// zeros and `budget` is 0, so they contribute nothing to any total or chart.
//
// The workbook's own monthly grand-total row omits PROVE IT (its stage-total
// row has no monthly cells), so monthly totals here are DERIVED from rows.
// January is $3,295,000, not the sheet's stated $3,200,000.
//
// Copy hygiene applied while porting: the xlsx's mojibake em dashes and curly
// quotes were replaced per house style (no em dashes), hyphenated compound
// modifiers unhyphenated, and obvious typos fixed ("Progamatic", "Non
// Skipable", "Large Formt", "Utilsing"). Cinema's "Role of the Channel" cell
// is truncated mid word IN THE WORKBOOK ("...thriving check t"); the dangling
// token was trimmed rather than an ending invented.
//
// -----------------------------------------------------------------------------
// THE CREATIVE MANIFEST, and why it is written down.
//
// Every image below comes from a VISIBLE channel tab, and A DROPPED LOGO IS
// SILENT: the gallery simply renders one card fewer and looks deliberate. Two
// were dropped on the first pass and only found by re-auditing the workbook
// against this file (QMS on Local OOH, then 10play and Kayo on BVOD & SVOD), so
// the mapping is recorded here to make the next audit a diff rather than a hunt.
//
// The check is: extract each visible tab's drawing rels, list its images, and
// confirm every one appears against the row named here. Reconcile by TAB, not by
// the description copy: the tabs are headed "Visuals to be included" and are the
// governing source for images, and on the Screens tab they are further grouped by
// a label in column G ("LINEAR TV" G1, "BVOD" G9, "YouTube" G12) which is what
// assigns a logo to a row.
//
//   PR & Morning Shows      -> PR & Morning Shows (mockup, Nine, Seven)
//   Screens tab   G1 LINEAR -> Linear TV (mockup, Seven, Nine)
//                 G9 BVOD   -> BVOD & SVOD, row 1: SIX logos
//                 G12 YouTube -> YouTube (mockup, YouTube logo)
//   SVOD & LG Samsung Tv    -> BVOD & SVOD row 2 (4 SVOD logos) + Samsung & LG (mockup)
//   Cinema                  -> Cinema (auditorium, Val Morgan, 3 posters)
//   Trilogy Outdoor         -> Outdoor Stature (mockup + JCDecaux, oOh!, QMS)
//   Radio Partnership       -> Radio Partnership (studio, Nova)
//   Podcast tab             -> Acast Podcasts (Acast) + Podcaster Performance (Toni and Ryan)
//   Intergration [sic]      -> BBL (live moment, KFC BBL) + MMM Sports (booth, Triple M)
//   Radio                   -> Always On Radio (ARN, SCA, Nova)
//   Local Messaging Outdoor -> Local OOH (shelter + JCDecaux, oOh!, QMS)
//   REA                     -> realestate.com.au (logo + Thriving Index mockup)
//   Uber Pet                -> Uber Pet (logo + in car mockup)
//
// Deliberately unused: the visible LYKA LOGO tab's three files are the Lyka
// wordmark and a "Fed Puppers" badge, which are brand assets rather than channel
// creative (the app's own mark is public/images/lyka-logo.png). The hidden
// Research Social and Book social tabs hold stale Hamilton Island socials.
//
// The oOh! logo appears twice in the workbook as two near identical files
// (568x262 and 570x262, different bytes); both map to the one ooh.png.
// -----------------------------------------------------------------------------

import { LAYER_COLORS, type LayerKey, type OwnerKey, type Weight } from './brand';

export const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] as const;

/** SPEED managed working media. The in-house rows carry no dollars at all. */
export const MEDIA_TOTAL = 11_000_000;
export const TOTAL_BUDGET = 11_000_000;

/**
 * The workbook's FLIGHTING row: the planned monthly weight of the budget, as
 * percentages summing to 100. Drawn as the dashed overlay on the stacked
 * monthly budget chart (dollar values are pct / 100 * MEDIA_TOTAL).
 */
export const FLIGHTING_PCT = [7.66, 8.51, 7.2, 13.9, 10.2, 8.0, 8.0, 6.0, 8.5, 8.0, 8.5, 5.53] as const;

// LayerKey and OwnerKey are declared in data/brand.ts so LAYER_COLORS and
// OWNER_COLORS can be typed without a circular import. Re-exported here so the
// existing importers (InteractiveMediaPlan, ChannelDetail) keep working.
// `export type` is required: tsconfig has isolatedModules.
export type { LayerKey, OwnerKey, Weight };

export interface ChannelDetailCopy {
  assets?: string;
  role?: string;
  strategyLink?: string;
  comesToLife?: string;
  metrics?: string;
}

export interface MediaRow {
  channel: string;
  /**
   * Who runs and funds the channel. Drives the gantt bar colour (via
   * OWNER_COLORS), the Budget / % cells ("In house" instead of dollars), and
   * the pop-up (no spend chart on a lyka row). The legend under the grid is
   * the key: green = Lyka in house, red = SPEED.
   */
  owner: OwnerKey;
  /** Format descriptor from the briefing (sub-label / pop-up Assets fallback). */
  assets?: string;
  /** Spend per month, indexed to MONTHS (Oct -> Sep). All zeros on lyka rows. */
  monthly: number[];
  budget: number;
  /**
   * In-house flighting: which months the channel is live, indexed to MONTHS.
   * Only meaningful (and only set) when owner is 'lyka' and there are no
   * dollars to derive bars from. SPEED rows derive their bars from `monthly`.
   */
  activeMonths?: boolean[];
  /**
   * How much presence the channel has each month, indexed to MONTHS, null when
   * it is not running. Read cell by cell from the workbook's bar shading, which
   * is an editorial weighting and NOT derivable from spend: see the `Weight`
   * comment in data/brand.ts for the evidence. Drives the gantt bar shade.
   */
  weight: (Weight | null)[];
  /** Performance still being finalised: render as a clearly-marked stub. */
  provisional?: boolean;
  detail?: ChannelDetailCopy;
  /** Example-creative images extracted from the briefing channel tabs. */
  images?: string[];
  /** Relative widths for a horizontal image row (flex-grow per image). Defaults to equal. */
  imageWeights?: number[];
  /** A second horizontal row of example images rendered below the main ones. */
  extraImages?: string[];
  /** Captions paired 1:1 with extraImages. */
  extraCaptions?: string[];
  /** Short example caption lines from the briefing. Paired 1:1 with images when pairedImages is set. */
  captions?: string[];
  /** Render images side by side with their caption above each, not as a single-image gallery. */
  pairedImages?: boolean;
  /** Stack images vertically (one under the other) instead of the single-image gallery. */
  stackedImages?: boolean;
  /** In a stacked layout, render the first image smaller (e.g. a logo lockup above a full-width creative). */
  stackedFirstSmall?: boolean;
}

export interface PlanLayer {
  key: LayerKey;
  /**
   * Funnel rail fill. Literal hex from data/brand.ts LAYER_COLORS, not a CSS
   * var: Chart.js draws to a canvas and cannot resolve custom properties.
   * Text drawn on top must use LAYER_COLORS[key].ink, never hardcoded white.
   * Gantt bars do NOT use this: they are owner coloured (OWNER_COLORS).
   */
  color: string;
  /** The stage's one-line task, from the budget sheet's stage header. */
  blurb: string;
  rows: MediaRow[];
}

// -----------------------------------------------------------------------------
// SHOW IT: name the problem and the solve
// -----------------------------------------------------------------------------

const showIt: PlanLayer = {
  key: 'SHOW IT',
  color: LAYER_COLORS['SHOW IT'].base,
  blurb: 'Name the problem and the solve: awaken owners with Fine Dog Syndrome and introduce Poo, Pep and Polish.',
  rows: [
    {
      channel: 'PR & Morning Shows',
      owner: 'lyka',
      assets: 'Earned',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', null, null, null, null, null, null, null, null, null, null, null],
      activeMonths: [true, false, false, false, false, false, false, false, false, false, false, false],
      detail: {
        assets: 'University of Sydney research paper; expert spokesperson; media release; morning show segments.',
        role: 'Give Fine Dog Syndrome credibility, importance and national relevance within a trusted journalistic environment.',
        strategyLink: 'AWAKEN INERTIA: Introduce Fine Dog Syndrome and challenge owners to question whether fine really means thriving.',
        comesToLife: 'Launch the national conversation through morning television, supported by expert commentary and the University of Sydney research.',
        metrics: 'Earned reach; number and quality of placements; message inclusion; segment duration; sentiment; earned media value.',
      },
      images: ['/images/morning-show.jpg', '/images/nine.png', '/images/seven.png'],
      imageWeights: [2.6, 1, 1],
      captions: ['Fine Dog Syndrome on morning television', 'Nine', 'Seven'],
    },
    {
      channel: 'Social Media',
      owner: 'lyka',
      assets: 'Boosting PR morning shows',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', null, null, null, null, null, null, null, null, null, null, null],
      activeMonths: [true, false, false, false, false, false, false, false, false, false, false, false],
      detail: {
        assets: 'Morning show cutdowns; expert clips; host content; social videos; Poo, Pep and Polish checklist.',
        role: 'Amplify the conversation, make it shareable and take the issue directly to dog lovers.',
        strategyLink: 'CREATE RECOGNITION: Help dog lovers see the issue in their own pets and start looking for the signs of thriving.',
        comesToLife: 'Flood social with the strongest morning show moments, supported by paid amplification against Lyka’s audience.',
        metrics: 'Reach; video views; completion rate; engagement; shares; saves; comments; branded search; site visits.',
      },
    },
    {
      channel: 'Radio Partnership',
      owner: 'speed',
      assets: 'Segment',
      monthly: [50000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 50000,
      weight: ['heavy', null, null, null, null, null, null, null, null, null, null, null],
      detail: {
        assets: 'Integrated host segment; live discussion; listener interaction; social content with Nova’s Wippa.',
        role: 'Add personality, entertainment and cultural momentum through trusted and popular voices.',
        strategyLink: 'MAKE IT RELATABLE: Turn Fine Dog Syndrome into a conversation owners can recognise in their everyday lives.',
        comesToLife: 'On launch day, Wippa introduces Fine Dog Syndrome, discusses the signs and invites listeners to consider whether their own dog is simply fine.',
        metrics: 'Audience reach; frequency; listener interaction; social views; search uplift.',
      },
      images: ['/images/nova-studio.jpg', '/images/nova.png'],
      imageWeights: [1.4, 1],
      captions: ['Launch day with Nova’s Wippa', 'Nova'],
    },
    {
      channel: 'Acast Podcasts',
      owner: 'lyka',
      assets: 'Host reads',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', 'heavy', null, null, null, null, null, null, null, null, null, null],
      activeMonths: [true, true, false, false, false, false, false, false, false, false, false, false],
      detail: {
        assets: 'Bespoke host reads tailored to each podcast and its audience.',
        role: 'Create personal relevance through trusted hosts speaking naturally in the style of their content.',
        strategyLink: 'SAY WHAT THRIVING SHOULD LOOK LIKE: Introduce the three signs owners should look for: Poo, Pep and Polish.',
        comesToLife: 'Across the following two weeks, each Acast host shares their own take on Fine Dog Syndrome and talks listeners through the three step check.',
        metrics: 'Completed listens; reach; frequency.',
      },
      images: ['/images/acast.png'],
      captions: ['Acast host reads'],
    },
    {
      channel: 'Samsung & LG TV Home Screen Takeovers',
      owner: 'lyka',
      assets: 'Day takeovers',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', null, null, null, null, null, null, null, null, null, null, null],
      activeMonths: [true, false, false, false, false, false, false, false, false, false, false, false],
      detail: {
        assets: 'Premium Samsung and LG home screen takeover featuring Fine Dog Syndrome and Poo, Pep and Polish.',
        role: 'Add high impact incremental reach among Lyka’s affluent audience in a premium, uncluttered environment.',
        strategyLink: 'CREATE IMMEDIATE AWARENESS: Reach affluent dog owners in their homes on the same day Fine Dog Syndrome enters the national conversation.',
        comesToLife: 'Launch on the same day as the PR drive, creating surround sound impact as the story moves from earned media directly onto the home screen.',
        metrics: 'Unique household reach; impressions; frequency; home screen engagement; video views.',
      },
      images: ['/images/lg-takeover.jpg'],
      captions: ['LG home screen takeover'],
    },
    {
      channel: 'Linear TV',
      owner: 'speed',
      assets: 'News',
      monthly: [100000, 100000, 0, 100000, 100000, 0, 0, 0, 0, 0, 0, 0],
      budget: 400000,
      weight: ['heavy', 'heavy', null, 'heavy', 'heavy', null, null, null, null, null, null, null],
      detail: {
        assets: 'Three 30 second masterbrand films: Poo, Pep and Polish.',
        role: 'Build mass awareness, stature and fame for Lyka’s three step thriving check.',
        strategyLink: 'SHOW WHAT THRIVING LOOKS LIKE: Move owners from recognising the problem to understanding the visible signs.',
        comesToLife: 'Launch the trilogy within the 6pm news across Seven and Nine, extending the campaign’s trusted news environment.',
        metrics: 'Target audience reach; frequency; completed spots; campaign awareness; message take-out; brand recognition.',
      },
      images: ['/images/linear-tv.jpg', '/images/seven.png', '/images/nine.png'],
      imageWeights: [2.6, 1, 1],
      captions: ['The trilogy in the 6pm news', 'Seven', 'Nine'],
    },
    {
      channel: 'AFL Season Spot Plan',
      owner: 'speed',
      assets: 'Seven | Foxtel',
      monthly: [0, 0, 0, 0, 0, 250000, 250000, 250000, 250000, 250000, 250000, 250000],
      budget: 1750000,
      weight: [null, null, null, null, null, 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium'],
      detail: {
        assets: 'Poo, Pep and Polish masterbrand trilogy spot package across Seven and Foxtel.',
        role: 'Provide continuity across a high reach, high affinity sport and keep Lyka’s three step check mentally available throughout the AFL season.',
        strategyLink: 'KEEP THE CHECK TOP OF MIND: Sustain recognition of the trilogy beyond summer and reinforce the behaviour through repeated exposure.',
        comesToLife: 'Run the trilogy consistently within premium AFL coverage across Seven and Foxtel, maintaining momentum after the summer sporting burst.',
        metrics: 'Target audience reach; frequency; completed spots; trilogy exposure; brand awareness; message take-out; search and site response uplift.',
      },
      images: ['/images/seven.png'],
      captions: ['Seven | Foxtel'],
    },
    {
      channel: 'Cinema',
      owner: 'speed',
      assets: 'Summer blockbusters | Affluent postcodes',
      monthly: [0, 0, 70000, 150000, 70000, 0, 0, 0, 0, 0, 0, 0],
      budget: 290000,
      weight: [null, null, 'medium', 'heavy', 'heavy', null, null, null, null, null, null, null],
      detail: {
        assets: 'Three 30 second masterbrand films: Poo, Pep and Polish. Placed as one spot per film but rotated across the season.',
        role: 'Add premium, high attention reach to the screen strategy during Lyka’s peak season, building stature and fame for the three step thriving check.',
        comesToLife: 'From Boxing Day, the trilogy rotates across must see releases, including Marvel’s Avengers, Dune 3 and Jumanji. Activity is concentrated across Lyka’s priority postcodes, giving the message grand scale impact throughout the peak cinema season.',
        metrics: 'Admissions and estimated audience reach; priority postcode coverage.',
      },
      images: ['/images/cinema.jpg', '/images/val-morgan.png'],
      imageWeights: [2.6, 1],
      captions: ['The trilogy on the big screen', 'Val Morgan'],
      extraImages: ['/images/avengers.jpg', '/images/dune.jpg', '/images/jumanji.jpg'],
      extraCaptions: ['Avengers', 'Dune 3', 'Jumanji'],
    },
    {
      channel: 'BVOD & SVOD',
      owner: 'lyka',
      assets: 'Programmatic',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', 'heavy', 'medium', 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      // The sheet's green fills skip February. A one month hole in an
      // always-on channel is a formatting slip, not a planned dark month
      // (the superseded first-pass sheet funds it in February), so the
      // flighting is patched to run all year.
      activeMonths: [true, true, true, true, true, true, true, true, true, true, true, true],
      detail: {
        assets: 'The complete Poo, Pep and Polish video trilogy.',
        role: 'Deliver high attention, sequential storytelling across Lyka’s most influential screen channels.',
        strategyLink: 'SHOW WHAT THRIVING LOOKS LIKE: Help owners understand all three signs and the difference between being fine and truly thriving.',
        comesToLife: 'Serve the films in sequence, moving from Poo to Pep to Polish and building the complete thriving story over time. Utilising the high attention channels across all of BVOD (7plus, 9Now, Paramount+, SBS) and SVOD (Binge, Netflix, Amazon Prime, Disney+).',
        metrics: 'Completed views; sequential exposure; trilogy completion; cost per completed view; brand lift.',
      },
      // SIX BVOD logos, not four. The Screens tab labels its visuals in column
      // G, and the "BVOD" label at G9 covers rows 9 to 10, which hold 7plus,
      // 9Now, Paramount+, SBS, 10play AND Kayo. The Activation copy above names
      // only four of them, but that column is the strategy note and the tab is
      // headed "Visuals to be included", so the tab governs the gallery.
      images: ['/images/7plus.png', '/images/9now.png', '/images/paramount.png', '/images/sbs-on-demand.png', '/images/10play.png', '/images/kayo.png'],
      captions: ['BVOD: 7plus', 'BVOD: 9Now', 'BVOD: Paramount+', 'BVOD: SBS On Demand', 'BVOD: 10play', 'BVOD: Kayo'],
      extraImages: ['/images/binge.png', '/images/netflix.png', '/images/prime-video.png', '/images/disney-plus.png'],
      extraCaptions: ['SVOD: Binge', 'SVOD: Netflix', 'SVOD: Prime Video', 'SVOD: Disney+'],
    },
    {
      channel: 'YouTube',
      owner: 'lyka',
      assets: 'Non skippable',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', 'heavy', 'medium', 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      activeMonths: [true, true, true, true, true, true, true, true, true, true, true, true],
      detail: {
        assets: 'Sequential trilogy films; shorter video cutdowns; calls to discover more.',
        role: 'Extend reach, reinforce the three step check and connect awareness with active discovery.',
        strategyLink: 'DRIVE DISCOVERY: Encourage owners to learn more about what their dog’s visible signs may be telling them.',
        comesToLife: 'Sequential delivery takes owners through the trilogy before directing them to learn how better nutrition can help their dog thrive.',
        metrics: 'Reach; view-through rate; completed views; sequential completion; engaged site visits; search uplift; conversions.',
      },
      images: ['/images/youtube-tv.jpg', '/images/youtube-logo.png'],
      imageWeights: [2.6, 1],
      captions: ['Non skippable on the big screen', 'YouTube'],
    },
    {
      channel: 'Outdoor Stature',
      owner: 'speed',
      assets: 'Large format & triplet bus shelters',
      monthly: [0, 565000, 0, 700000, 500000, 0, 0, 0, 0, 0, 0, 0],
      budget: 1765000,
      weight: [null, 'heavy', null, 'heavy', 'heavy', null, null, null, null, null, null, null],
      detail: {
        assets: 'High impact outdoor featuring Lyka’s three step thriving checklist.',
        role: 'Build fame, stature and repeated visibility in the affluent locations with the greatest growth potential for Lyka.',
        strategyLink: 'REINFORCE: Reinforce Poo, Pep and Polish as the simple checklist every dog owner should know.',
        comesToLife: 'Use high profile sites along major arterial roads and throughout priority Lyka postcodes to make the checklist famous and unmissable.',
        metrics: 'Target postcode reach; frequency; traffic exposure; geographic search uplift; site visitation; brand awareness.',
      },
      images: ['/images/outdoor-trilogy.jpg'],
      captions: ['Triplet bus shelters: the trilogy in sequence'],
      extraImages: ['/images/jcdecaux.png', '/images/ooh.png', '/images/qms.png'],
      extraCaptions: ['JCDecaux', 'oOh!', 'QMS'],
    },
  ],
};

// -----------------------------------------------------------------------------
// CHECK IT: turn Poo, Pep and Polish into a check owners perform
// -----------------------------------------------------------------------------

const checkIt: PlanLayer = {
  key: 'CHECK IT',
  color: LAYER_COLORS['CHECK IT'].base,
  blurb: 'Turn Poo, Pep and Polish into a check owners perform: culturally relevant performances concentrated in Lyka’s peak buying season to increase ESOV.',
  rows: [
    {
      channel: 'BBL Cricket Integration Seven & SCA',
      owner: 'speed',
      assets: 'Sponsorship',
      monthly: [0, 0, 1000000, 2000000, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 3000000,
      weight: [null, null, 'medium', 'heavy', null, null, null, null, null, null, null, null],
      detail: {
        assets: 'Seven sponsorship across Linear TV and BVOD; opening and closing billboards; squeezebacks; pull-throughs; segment sponsorship; bespoke cricket integration; masterbrand trilogy spot plan.',
        role: 'Deliver high reach and deep engagement with Lyka’s audience during the December to January category peak, increasing share of voice when purchase interest is highest.',
        strategyLink: 'TURN THE CHECK INTO A HIGH PERFORMANCE HABIT: Connect Poo, Pep and Polish with the visible signs of a high performing dog.',
        comesToLife: 'A bespoke spot emulates a cricket match before a dog intercepts the game and shows off their Pep and Polish. This is a high performance dog, just like the cricketers. The integration is supported by the full trilogy spot plan.',
        metrics: 'Incremental reach; frequency; sponsorship awareness; integration engagement; completed BVOD views; brand recall; three step check recall; branded search; site visits.',
      },
      images: ['/images/bbl-live.jpg', '/images/bbl.png'],
      imageWeights: [2.6, 1],
      captions: ['The Lyka dog stops play', 'KFC BBL'],
      extraImages: ['/images/seven.png', '/images/sca.png'],
      extraCaptions: ['Seven', 'SCA'],
    },
    {
      channel: 'MMM Sports Commentary Integration',
      owner: 'speed',
      assets: 'Segment',
      monthly: [0, 0, 50000, 50000, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 100000,
      weight: [null, null, 'medium', 'heavy', null, null, null, null, null, null, null, null],
      detail: {
        assets: 'Bespoke MMM integrated segment; James Brayshaw and Brad Haddin commentary; Seven TV integration linkage; social and audio cutdowns.',
        role: 'Create theatre of the mind and connect the radio and television ideas into one distinctive sporting moment across Seven and SCA.',
        strategyLink: 'BRING THE CHECK INTO THE LIVE GAME: Use the drama and familiarity of sports commentary to make Lyka’s high performance dog impossible to ignore.',
        comesToLife: 'The MMM sports telecast is interrupted when the Lyka dog enters the game. James Brayshaw and Brad Haddin expertly relay what is unfolding on the pitch, timed to link with the bespoke Lyka TV spot airing on Seven. The MMM team would add it into their socials.',
        metrics: 'Segment reach; social views; engagement.',
      },
      images: ['/images/mmm-booth.jpg', '/images/triple-m.png'],
      imageWeights: [2.6, 1],
      captions: ['Brayshaw and Haddin call the interruption', 'Triple M'],
    },
    {
      channel: 'MMM Ear Worm (Rosala Boy) with Lou & Jach Show Sponsorship',
      owner: 'speed',
      assets: 'Segment | Socials',
      monthly: [200000, 150000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 350000,
      weight: ['heavy', 'heavy', null, null, null, null, null, null, null, null, null, null],
      detail: {
        assets: 'Original Poo, Pep and Polish song composed by Rosala Boy and his dad; in-show launch; presenter discussion; station content highlights; social cutdowns.',
        role: 'Create a culturally relevant performance that makes the check famous, memorable and easy to repeat.',
        strategyLink: 'MAKE THE CHECK ENTERTAINING: Turn Poo, Pep and Polish into an earworm owners remember and repeat.',
        comesToLife: 'Lou & Jach launch the song live within their MMM show. It is then replayed as a content highlight throughout the day and extended across MMM’s social channels.',
        metrics: 'Radio reach; frequency; content plays; listener response; social video views; engagement; song recall; three step check recall; branded search uplift.',
      },
      images: ['/images/triple-m.png'],
      captions: ['Triple M'],
    },
    {
      channel: 'Paid & Organic Social',
      owner: 'lyka',
      assets: 'Boosting Ear Worm',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', 'heavy', null, null, null, null, null, null, null, null, null, null],
      activeMonths: [true, true, false, false, false, false, false, false, false, false, false, false],
      detail: {
        assets: 'Rosala Boy hero song content; MMM cutdowns; creator versions; audience responses; paid amplification assets.',
        role: 'Build viral momentum, social participation and behavioural reinforcement in the environment where the song first gains traction.',
        strategyLink: 'TURN RECALL INTO PARTICIPATION: Encourage owners and creators to perform, reinterpret and share the Poo, Pep and Polish check.',
        comesToLife: 'Boost the original song and MMM content. As creators and audiences post their own versions, shift amplification behind the strongest responses to sustain and expand the song cycle.',
        metrics: 'Reach; video views; completion rate; creator participation; user generated content volume; shares; saves; engagement; earned reach; site visits.',
      },
    },
    {
      channel: 'Podcaster Performance Toni and Ryan',
      owner: 'speed',
      assets: 'Segment | Socials',
      monthly: [0, 100000, 0, 0, 100000, 0, 0, 0, 0, 0, 0, 0],
      budget: 200000,
      weight: [null, 'heavy', null, null, 'heavy', null, null, null, null, null, null, null],
      detail: {
        assets: 'Bespoke song recreations and social videos from selected podcasters, led by Toni and Ryan; podcast mentions; social cutdowns.',
        role: 'Extend the song cycle through trusted talent with strong audio and social influence, bringing new interpretations and audiences into the idea.',
        strategyLink: 'MAKE THE CHECK FEEL PERSONAL: Use familiar podcast voices to embed the song and the three signs within highly engaged communities.',
        comesToLife: 'Key podcasters recreate the Poo, Pep and Polish song in their own style and publish it across their social channels, with Toni and Ryan recommended as lead talent.',
        metrics: 'Completed listens; podcast reach; social reach; video views; engagement; shares; creator response; three step check recall; branded search.',
      },
      images: ['/images/toni-and-ryan.jpg', '/images/acast.png'],
      imageWeights: [1, 1.6],
      captions: ['Toni and Ryan', 'Acast'],
    },
    {
      channel: 'Always On Radio | 30 Second Spots',
      owner: 'speed',
      assets: '2 stations',
      monthly: [0, 150000, 0, 200000, 300000, 200000, 200000, 200000, 200000, 200000, 200000, 150000],
      budget: 2000000,
      weight: [null, 'heavy', null, 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      detail: {
        assets: '30 second radio spots reinforcing the 3Ps check; seven day BMAD spot plan; rotating reminders and masterbrand messaging.',
        role: 'Remain a constant in Lyka’s most important channel, using daily repetition to reinforce the check and build behavioural memory.',
        strategyLink: 'MAKE THE 3Ps A DAILY HABIT: Keep Poo, Pep and Polish front of mind as a simple check owners perform regularly.',
        comesToLife: 'Run 30 second spots across breakfast, morning, afternoon and drive, seven days a week. Each exposure reminds dog owners to check Poo, Pep and Polish and consider whether their dog is truly thriving.',
        metrics: 'BMAD reach; weekly reach; frequency; effective frequency; completed spots; three step check recall; brand awareness; branded search; site response uplift.',
      },
      images: ['/images/arn.png', '/images/sca.png', '/images/nova.png'],
      captions: ['ARN', 'SCA', 'Nova'],
    },
  ],
};

// -----------------------------------------------------------------------------
// PROVE IT: build confidence with science, experts and owner proof
// -----------------------------------------------------------------------------

const proveIt: PlanLayer = {
  key: 'PROVE IT',
  color: LAYER_COLORS['PROVE IT'].base,
  blurb: 'Build confidence with science, experts and owner proof: show owners that dogs in their own neighbourhood are already thriving on Lyka.',
  rows: [
    {
      channel: 'Local OOH | Bus Shelters',
      owner: 'speed',
      assets: 'Bus shelters',
      monthly: [0, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000, 80000],
      budget: 880000,
      weight: [null, 'heavy', 'medium', 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      detail: {
        assets: 'Static and digital bus shelter creative; suburb level Lyka dog counts; local owner testimonials; Poo, Pep and Polish proof points.',
        role: 'Build grassroots awareness and social proof in the places owners walk every day, making Lyka feel established and relevant locally.',
        strategyLink: 'MAKE PROOF FEEL CLOSE TO HOME: Show owners that thriving is already happening among dogs in their local area.',
        comesToLife: 'Use on the street outdoor in priority suburbs to feature messages such as "More dogs in [Suburb] are thriving on Lyka" alongside real local proof and testimonials.',
        metrics: 'Priority postcode reach; frequency; suburb level trials and conversions.',
      },
      images: ['/images/local-shelter.jpg'],
      captions: ['Suburb level proof: Maya’s thriving'],
      // All three OOH partners, matching the Local Messaging Outdoor tab, which
      // carries JCDecaux, oOh! and QMS exactly as the Trilogy Outdoor tab does.
      extraImages: ['/images/jcdecaux.png', '/images/ooh.png', '/images/qms.png'],
      extraCaptions: ['JCDecaux', 'oOh!', 'QMS'],
    },
    {
      channel: 'realestate.com.au',
      owner: 'speed',
      assets: 'High impact display',
      monthly: [0, 0, 0, 0, 10000, 10000, 5000, 5000, 5000, 5000, 5000, 5000],
      budget: 50000,
      weight: [null, null, null, null, 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      detail: {
        assets: 'Industry first "Lyka Thriving Count"; suburb level data; high impact display; interactive map or postcode experience; PR ready data story.',
        role: 'Reach an affluent, property engaged Lyka audience and give local proof scale, novelty and talkability.',
        strategyLink: 'MAKE THRIVING PART OF THE LOCAL AREA STORY: Connect owners’ fascination with suburbs and property to the growing number of local dogs thriving on Lyka.',
        comesToLife: 'Show where dogs are thriving across Australian suburbs through a high impact realestate.com.au partnership. The Thriving Count can also generate rankings, local stories and PR moments.',
        metrics: 'Unique reach; high impact impressions; interaction rate; postcode searches; map engagement; site visits; PR reach; trial conversions.',
      },
      images: ['/images/rea.png', '/images/thriving-index.jpg'],
      stackedImages: true,
      stackedFirstSmall: true,
    },
    {
      channel: 'Uber Pet',
      owner: 'speed',
      assets: 'App display ads',
      monthly: [0, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000, 15000],
      budget: 165000,
      weight: [null, 'heavy', 'medium', 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      detail: {
        assets: 'Journey duration display ads; destination based Lyka dog counts; local thriving messages; dynamic suburb creative. 3 ads in one trip (3Ps, Thriving Dogs, Offer).',
        role: 'Access one of the most qualified dog owner audiences available and make local proof personally relevant in real time.',
        strategyLink: 'DELIVER PROOF IN THE MOMENT: Reach verified dog owners with highly contextual evidence tied to their journey and destination.',
        comesToLife: 'During an Uber Pet journey, show riders how many dogs are thriving on Lyka near their destination and provide an offer. Our message remains visible for the full trip with 100% share of voice.',
        metrics: 'Qualified audience reach; journey impressions; completed exposure; engagement rate; clicks.',
      },
      images: ['/images/uber-pet.png', '/images/uber-pet-ride.jpg'],
      stackedImages: true,
      stackedFirstSmall: true,
    },
    {
      channel: 'Paid Social & Search',
      owner: 'lyka',
      assets: 'Always on',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', 'heavy', 'medium', 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      activeMonths: [true, true, true, true, true, true, true, true, true, true, true, true],
      detail: {
        assets: 'Localised social ads; customer testimonials; science and expert proof; suburb creative; paid search copy and landing pages.',
        role: 'Capture demand created by local media and provide the final layer of evidence owners need before trial.',
        strategyLink: 'TURN CONFIDENCE INTO CONSIDERATION: Help owners validate the proof, explore Lyka and move closer to trying it.',
        comesToLife: 'Lyka’s Social and Search team runs always on performance activity, adapting proof messages by audience, intent and location.',
        metrics: 'In house Lyka measurement.',
      },
    },
  ],
};

// -----------------------------------------------------------------------------
// TRY IT and SHARE IT: Lyka in house stages.
//
// Both stages are visible on the budget sheet (one row each, no SPEED spend),
// but their Media Description sheets are HIDDEN in the workbook and therefore
// excluded, exactly like the hidden Australian Open row. The rows carry no
// `detail`: the pop-up renders the ownership strip and flighting only.
// -----------------------------------------------------------------------------

const tryIt: PlanLayer = {
  key: 'TRY IT',
  color: LAYER_COLORS['TRY IT'].base,
  blurb: 'Remove the friction that stops owners switching: timely, highly relevant offers that make the first Lyka experience feel easy and worthwhile.',
  rows: [
    {
      channel: 'Paid Social & Social',
      owner: 'lyka',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', 'heavy', 'medium', 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      activeMonths: [true, true, true, true, true, true, true, true, true, true, true, true],
    },
  ],
};

const shareIt: PlanLayer = {
  key: 'SHARE IT',
  color: LAYER_COLORS['SHARE IT'].base,
  blurb: 'Turn visible change into owner to owner advocacy: give thriving owners simple ways to show the difference, share their story and inspire the next dog owner to try Lyka.',
  rows: [
    {
      channel: 'Lyka In House Social | CRM & Customer Community | Referral & Sharing',
      owner: 'lyka',
      monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 0,
      weight: ['heavy', 'heavy', 'medium', 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      activeMonths: [true, true, true, true, true, true, true, true, true, true, true, true],
    },
  ],
};

export const PLAN_LAYERS: PlanLayer[] = [showIt, checkIt, proveIt, tryIt, shareIt];
