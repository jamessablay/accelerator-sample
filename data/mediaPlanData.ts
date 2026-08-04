// -----------------------------------------------------------------------------
// Interactive Media Plan data
//
// CONTENT STATUS: still the Hamilton Island FY26 plan. The numbers, channel
// list, month order and all `detail` copy are Hamilton's and are pending a Lyka
// brief. Only the colour wiring was converted in the Lyka shell pass.
//
// Original source of truth: "Interactive Media Plan Briefing Template for
// Hamilton Island.xlsx" -> visible sheet "Budget Distribution $3.5" (the live
// macro plan) + "Media Description" (per-channel pop-up copy). Hidden sheets
// and hidden columns were excluded per client direction.
//
// Fiscal year runs November -> October. Values are in AUD.
// Total media $4.85M + $150k production = $5.0M.
//
// The optional `provisional` flag renders a PENDING pill + a "finalised" note
// for any row whose performance numbers are still being confirmed. Not set on
// any row currently; set it back to true on a row to flag it again.
// -----------------------------------------------------------------------------

import { LAYER_COLORS, type LayerKey } from './brand';

export const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'] as const;

export const MEDIA_TOTAL = 4850000;
export const PRODUCTION = 150000;
export const TOTAL_BUDGET = 5000000;

// LayerKey is declared in data/brand.ts so LAYER_COLORS can be typed without a
// circular import. Re-exported here so the existing importers (
// InteractiveMediaPlan, ChannelDetail) keep working unchanged.
// `export type` is required: tsconfig has isolatedModules.
export type { LayerKey };

export interface ChannelDetailCopy {
  assets?: string;
  role?: string;
  strategyLink?: string;
  comesToLife?: string;
  metrics?: string;
}

export interface MediaRow {
  channel: string;
  /** Asset descriptor shown in the grid's Assets column. */
  assets: string;
  /** Spend per month, indexed to MONTHS (Nov -> Oct). */
  monthly: number[];
  budget: number;
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
  /** Render images side by side with their caption above each (Social formats), not as a single-image gallery. */
  pairedImages?: boolean;
  /** Stack images vertically (one under the other) instead of the single-image gallery. */
  stackedImages?: boolean;
  /** In a stacked layout, render the first image smaller (e.g. a logo lockup above a full-width creative). */
  stackedFirstSmall?: boolean;
}

export interface PlanLayer {
  key: LayerKey;
  /**
   * Funnel rail + gantt bar fill. Literal hex from data/brand.ts LAYER_COLORS,
   * not a CSS var: Chart.js draws to a canvas and cannot resolve custom
   * properties. Text drawn on top must use LAYER_COLORS[key].ink, never
   * hardcoded white (white on Tangerine is 2.43:1).
   */
  color: string;
  rows: MediaRow[];
}

const SCREENS_VIDEO_DETAIL: ChannelDetailCopy = {
  assets: 'Masterbrand 30s + Unlisted Content Trailers 30s x 3 to 5 versions',
  role: 'Screens and streaming is our primary consideration foundation. It delivers the immersive, high attention experience with Hamilton Island visible in full screen, lean back environments.',
  strategyLink: 'Directly supports priming the audience. BVOD, SVOD and YouTube provide high attention environments where the Hamilton Island story can be seen in premium, immersive formats. Upweighted Nov to Feb to prime into booking for the softer seasons.',
  comesToLife: 'Place across 9Now, SBS On Demand, 7plus, Kayo Sports, Paramount+, Stan Sport, Netflix, Disney+ and YouTube. Prioritise premium pre roll and full screen video around drama, sport and travel entertainment, and buy passion packs in Nov to Jan, our peak priming season (e.g. Cricket, Australian Open).',
  metrics: 'Views',
};

const activeConsideration: PlanLayer = {
  key: 'Active Consideration',
  color: LAYER_COLORS['Active Consideration'].base,
  rows: [
    {
      channel: 'Screens: BVOD, SVOD and YouTube',
      assets: 'Masterbrand 30s + Unlisted Content Trailers',
      monthly: [230000, 75000, 230000, 280000, 230000, 205000, 125000, 170000, 0, 110000, 0, 0],
      budget: 1655000,
      detail: SCREENS_VIDEO_DETAIL,
      images: ['/images/svod.png', '/images/bvod.png', '/images/youtube-logo.png', '/images/youtube.png'],
      imageWeights: [1, 1, 1.4, 2.2],
      captions: ['SVOD platforms', 'BVOD and free to air', 'YouTube', 'YouTube ad examples'],
      extraImages: ['/images/tv3.png', '/images/tv2.png'],
      extraCaptions: ['BVOD: Water + Chef', 'SVOD / YouTube: Beach Walk'],
    },
    {
      channel: 'Screens: LG and Samsung TV',
      assets: 'Carousel / Expandable Video, Unlisted Content Trailers 30s x 3 to 5 versions',
      monthly: [50000, 0, 50000, 50000, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 150000,
      detail: {
        assets: 'Carousel / Expandable Video, Unlisted Content Trailers 30s x 3 to 5 versions',
        role: 'Large screen connected TVs such as LG and Samsung own the homepage, which is the first stop of the viewing journey.',
        strategyLink: 'Links to the strategy of immersive viewing experiences in premium places, right at the start of picking your viewing app.',
        comesToLife: 'Both LG and Samsung homescreens run over the peak priming period of Nov to Feb to showcase the Unlisted Content Trailers and further boost the screens strategy.',
        metrics: 'Views',
      },
      images: ['/images/lg.png', '/images/samsung.png'],
      captions: ['LG', 'Samsung'],
    },
    {
      channel: 'Screens: Cinema (SA4)',
      assets: 'Unlisted Content Trailers 30s x 3 to 5 versions by SA4 area',
      monthly: [0, 20000, 100000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 120000,
      detail: {
        assets: 'Unlisted Content Trailers 30s x 3 to 5 versions depending on SA4 area',
        role: 'Cinema delivers a captive, full screen environment with minimal distraction, powerful for emotional storytelling. Its role is to showcase Hamilton Island at scale in a premium visual setting.',
        strategyLink: "Creates high impact immersion among postcode selectable, high value audiences. Aligns with the plan's focus on fewer, bigger, better placements where quality of presence beats a long tail of thin reach.",
        comesToLife: 'SA4 targeted cinema placements in premium locations and pre travel mindsets, running the Unlisted Content trailer.',
        metrics: 'Attendance',
      },
      images: ['/images/doomsday.jpg', '/images/dune.jpg', '/images/jumanji.jpg'],
    },
    {
      channel: 'Digital News & Print',
      assets: 'Immersive digital formats + full / double page print with QR to Unlisted Content',
      monthly: [250000, 0, 180000, 260000, 95000, 0, 0, 0, 130000, 70000, 0, 0],
      budget: 985000,
      detail: {
        assets: 'Unlisted Content Trailers 30s x 3 to 5 versions, immersive digital formats. Full page colour for print with possible use of QR code to Unlisted Content.',
        role: 'Digital news, print and magazines provide trusted, premium editorial environments where audiences are in a slower, more considered mindset.',
        strategyLink: 'Places the brand in high attention contexts that over index among affluent travellers. Rather than chasing mass reach, these channels ensure impressions land with the right audience in environments suited to consideration.',
        comesToLife: 'Fairfax print magazines and digital, AFR, Sydney Morning Herald, The Age, AFR Mag, Courier-Mail. Premium video placements and high quality print.',
        metrics: 'Views, CTR, Readership',
      },
      images: ['/images/print-age.png', '/images/print-smh.png', '/images/print-couriermail.png', '/images/print-afr.png'],
    },
    {
      channel: 'Podcasts',
      assets: 'Mix of 30s + host reads, 3 to 5 versions of the relevant Unlisted Content trailer',
      monthly: [60000, 0, 60000, 80000, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 200000,
      detail: {
        assets: 'Mix of 30s and host reads, 3 to 5 versions of the relevant Unlisted Content trailer',
        role: 'Podcasts create intimate, high engagement audio moments where listeners are already connected to hosts, themes and personal interests. Their role is to build consideration through trusted voices.',
        strategyLink: 'Surrounds high value travellers in lean in environments tied to lifestyle, culture, wellbeing, finance, property and aspiration. Audio keeps Hamilton Island present during reflective moments when audiences are open to considering travel.',
        comesToLife: "Select titles such as Mamamia Out Loud, Life Uncut, She's on the Money, The Imperfects, Equity Mates Investing, The Property Couch, The Daily Aus and Hamish & Andy. Use host reads.",
        metrics: 'Example metric dependant on the final approaches deployed, e.g. CPM, downloads, streams, brand lift',
      },
      images: ['/media-plan/podcast-tab-1.jpeg', '/media-plan/podcast-tab-2.jpeg', '/media-plan/podcast-tab-3.png'],
    },
    {
      channel: 'Property Platforms (SA4)',
      assets: 'Digital / native formats delivering Unlisted Content, 3 to 5 versions by SA4 area',
      monthly: [40000, 0, 40000, 50000, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 130000,
      detail: {
        assets: 'Digital / native formats that deliver Unlisted Content, 3 to 5 depending on SA4 area',
        role: 'A high reach weekly platform for our audience, with a contextual link to "unlisted" that is unexpected.',
        strategyLink: 'The context does the targeting work. People browsing realestate.com.au and Domain are already in an aspirational mindset, making Hamilton Island relevant as both an escape and a lifestyle upgrade. Targeted by SA4 listings.',
        comesToLife: 'realestate.com.au and Domain via digital formats and native content to deliver the unlisted trailer / content.',
        metrics: 'Views, CTR',
      },
      images: ['/images/property.png', '/images/property-listing.png'],
      stackedImages: true,
      stackedFirstSmall: true,
    },
    {
      channel: 'Social',
      assets: '15s and 30s cut for platform, Unlisted Content',
      monthly: [40000, 25000, 40000, 40000, 25000, 25000, 25000, 10000, 10000, 20000, 0, 0],
      budget: 260000,
      detail: {
        assets: '15s and 30s fit for platform Unlisted Content trailers, multiple versions',
        role: 'Drive active consideration by helping high intent luxury travellers see Hamilton Island as a premium, differentiated and experience rich destination worth investigating further.',
        strategyLink: 'Deepens engagement with high intent luxury travellers by showcasing the premium, curated Hamilton Island experience.',
        comesToLife: 'Fit for platform, branded cutdown social ads that showcase curated itineraries, premium inclusions and unique island experiences. Short form video and native social creative build aspiration while driving deeper engagement with luxury travellers already showing travel intent.',
        metrics: 'Video views',
      },
      images: ['/images/ac-social1.png', '/images/ac-social2.png'],
      captions: ["Show the version that's right for you", 'Speak to couples with a luxury, romantic focus'],
      pairedImages: true,
    },
  ],
};

const research: PlanLayer = {
  key: 'Research',
  color: LAYER_COLORS['Research'].base,
  rows: [
    {
      channel: 'Social (traffic)',
      assets: 'Traffic-driving social, value and reassurance led',
      monthly: [25000, 25000, 25000, 30000, 20000, 20000, 20000, 20000, 20000, 15000, 15000, 15000],
      budget: 250000,
      detail: {
        assets: 'Short form video, carousel and static',
        role: 'Reduce planning friction and reinforce confidence by helping consumers understand exactly what the Hamilton Island experience includes and why it justifies the premium.',
        strategyLink: 'Supports users already comparing destinations, accommodation and package value, moving them from passive interest into active trip planning and site exploration.',
        comesToLife: 'Bespoke social content helps travellers understand what they get and why the experience is worth the premium. Carousel, static and short form assets highlight accommodation, inclusions, itineraries and service moments to drive deeper site engagement.',
        metrics: 'Engaged sessions',
      },
      images: ['/images/r-social1.png', '/images/r-social2.png'],
      captions: ['Make value clear. Reduce uncertainty', 'Reassure with experiences and variety'],
      pairedImages: true,
    },
    {
      channel: 'Search (generic + pmax)',
      assets: 'Generic search + Performance Max',
      monthly: [58400, 50250, 54550, 59400, 49400, 47900, 28800, 32200, 32200, 51800, 42000, 43100],
      budget: 550000,
      detail: {
        assets: 'Responsive Search Ads; images, video and copy for PMax',
        role: "Capture and convert high intent travel demand across generic search and Google's broader ecosystem.",
        strategyLink: 'Intercepts travellers actively planning holidays while extending reach beyond keyword search through audience led automation.',
        comesToLife: 'Search captures active travel intent through destination, experience and competitor led queries, while PMax expands reach using CRM audience signals, traveller behaviours and property specific creative.',
        metrics: 'Booking-flow entry and engaged sessions (calendar interaction, room comparisons)',
      },
    },
  ],
};

const book: PlanLayer = {
  key: 'Book',
  color: LAYER_COLORS['Book'].base,
  rows: [
    {
      channel: 'Social (convert)',
      assets: 'Conversion-led social',
      monthly: [27200, 20650, 24750, 27200, 22400, 22400, 12300, 14700, 14700, 24600, 19500, 19600],
      budget: 250000,
      detail: {
        assets: 'Short form video, carousel, static, catalogue ads',
        role: 'Convert high intent audiences into bookings by reducing final uncertainty and reinforcing value without over relying on discounting.',
        strategyLink: 'Uses CRM powered audience signals and conversion optimised creative to capture demand already generated upstream.',
        comesToLife: 'Conversion led creative reinforces booking confidence through direct book benefits, premium upgrades, availability and flexible booking messaging. Dynamic social formats target high intent audiences already engaged with the brand or booking journey.',
        metrics: 'Bookings',
      },
      images: ['/images/book-social1.png', '/images/book-social2.png'],
      stackedImages: true,
    },
    {
      channel: 'Search (brand)',
      assets: 'Brand search',
      monthly: [30000, 35000, 27500, 27500, 25000, 22500, 20000, 20000, 20000, 22500, 25000, 25000],
      budget: 300000,
      detail: {
        assets: 'Responsive Search Ads targeting exact match brand keywords',
        role: 'Capture high intent demand and defend branded search against OTAs and competitors.',
        strategyLink: 'Acts as the always on conversion layer, closing demand already created through upper and mid funnel activity.',
        comesToLife: 'Brand search prioritises visibility during peak booking periods and protects efficient direct bookings through tightly controlled keyword coverage, bidding and ad relevance across Hamilton Island branded terms.',
        metrics: 'Bookings',
      },
    },
  ],
};

export const PLAN_LAYERS: PlanLayer[] = [activeConsideration, research, book];

/** All rows flattened, in render order. */
export const ALL_ROWS: MediaRow[] = PLAN_LAYERS.flatMap((l) => l.rows);

/** Monthly column totals across every channel (matches the briefing's Total row). */
export const MONTHLY_TOTALS: number[] = MONTHS.map((_, i) =>
  ALL_ROWS.reduce((sum, row) => sum + (row.monthly[i] || 0), 0),
);
