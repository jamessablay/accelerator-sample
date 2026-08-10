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
// ONE EXCEPTION TO THAT RULE EXISTS AND IS A KNOWN PROBLEM: `FLIGHTING_PCT` was
// taken from the hidden sheet, and it contradicts the visible plan. Read the
// block comment on it before trusting or re-deriving the dashed overlay.
//
// The plan year runs October -> September. Values are AUD.
//
// TOTAL RE-VERIFIED 2026-08-10, after the client's consolidation round and the
// later Radio -> Nova fold: the 19 rows' `budget` fields sum to $11,000,000,
// their monthly cells sum to $11,000,000, no row's monthly cells disagree with
// its own budget, and the stage totals are
// (4,205,000 / 5,700,000 / 1,095,000 / 0 / 0). Every in-house row is still $0.
// (SHOW IT / CHECK IT each moved $50,000 when Radio Segment folded into Nova;
// see that removal note below. They were 4,255,000 / 5,650,000 before.)
//
// **THE STAGE TOTALS MATCHING IS THE PROOF THE MERGES WERE CLEAN.** Two pairs
// of rows became one row each and one row was deleted, and if any of that had
// lost or double counted a dollar, SHOW IT or CHECK IT would have moved. The
// client supplied both merged budgets ($2,150,000 and $3,100,000) and both are
// exactly the sum of the parts, so nothing needed reconciling.
//
// The row count no longer matches the workbook. It was 23 to 2026-08-09; the
// cell for cell tie back to the visible sheet holds for the rows that survive
// unchanged, and every departure is commented at its row.
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
// ⚠ THE 2026-08-10 ROUND CONSOLIDATED ROWS, so this map is now MANY TABS TO ONE
// ROW in two places and one tab has no row at all. That breaks the tidy
// assumption a re-audit wants to make, which is exactly why it is written down:
// three of the entries below will otherwise read as missing or duplicated
// creative. Row count went 23 to 20 to 19 (10 SPEED, 9 in house) after Radio
// Segment folded into Nova; MEDIA_TOTAL did not move (both merges, and the
// fold, are the sum of their parts).
//
//   PR & Morning Shows      -> PR & Morning Shows (mockup, Nine, Seven)
//   Screens tab   G1 LINEAR -> Premium Linear News & Sport TV (mockup, Seven, Nine)
//                              [tab name != row name, and now TWO ROWS DEEP:
//                              "Linear TV" -> "Linear TV News" (2026-08-07) ->
//                              MERGED WITH AFL Season Spot Plan (2026-08-10)]
//                 G9 BVOD   -> BVOD & SVOD, row 1: six on the tab, FIVE wired
//                              (Paramount+ removed on client direction
//                              2026-08-06; see the note on that row)
//                 G12 YouTube -> YouTube (mockup, YouTube logo)
//   SVOD & LG Samsung Tv    -> BVOD & SVOD row 2 (4 SVOD logos) + Samsung & LG (mockup)
//   Cinema                  -> Cinema (auditorium, Val Morgan, 3 posters)
//   Trilogy Outdoor         -> Outdoor Impact (mockup + JCDecaux, oOh!, QMS)
//                              [tab name != row name: "Outdoor Stature" until
//                              2026-08-10, renamed on client direction]
//   Radio Partnership       -> (NO ROW as of 2026-08-10). Radio Segment was
//                              removed when its $50,000 folded into the Nova Ear
//                              Worm line; this tab is now unused, like the
//                              Podcast tab's Acast half. nova-studio.jpg is
//                              unreferenced (still in public/images/); do not
//                              re-wire it. The row is gone, not the asset.
//   Podcast tab             -> Podcaster Performance (Toni and Ryan) ONLY.
//                              ⚠ THIS TAB IS NOW HALF UNUSED. It also holds the
//                              Acast logo, and ACAST PODCASTS WAS REMOVED FROM
//                              THE PLAN ENTIRELY on client direction 2026-08-10.
//                              acast.png stays in public/images/, unreferenced.
//                              Do not re-wire it: the row is gone, not the logo.
//   Intergration [sic]      -> BBL & Cricket Integration Seven & TripleM, which
//                              is ONE ROW carrying what were two: the BBL live
//                              moment + KFC BBL logo and the MMM booth + Triple M
//                              logo (merged on client direction 2026-08-10).
//                              It also REUSES seven.png from the Screens tab.
//                              It reused sca.png too until 2026-08-06, when the
//                              client removed that card; sca.png is still wired
//                              to Always On Radio, so nothing is orphaned.
//   Radio                   -> Always On Radio (ARN, SCA, Nova)
//   Local Messaging Outdoor -> Local OOH (shelter + JCDecaux, oOh!, QMS)
//   REA                     -> realestate.com.au (logo + Thriving Index mockup).
//                              ⚠ THE MOCKUP IS NO LONGER THE WORKBOOK'S. See the
//                              2026-08-07 note below; the path is unchanged, so a
//                              filename audit will not show it.
//   Uber Pet                -> Uber Pet (logo + in car mockup)
//
// NOT FROM THE WORKBOOK, so the audit above will never find a source for these.
// Expected, not dropped assets. All three came from the client on 2026-08-06, in
// "Changes to the intereactive media plan.pptx" (Downloads) with loose PNG exports
// beside it in the project folder. **PREFER THE DECK EMBED OVER THE LOOSE EXPORT
// unless it is smaller**, because two of the three exports had lost resolution:
//   nova-earworm.jpg    <- deck slide 10 embed, header cropped   1306x629 (export was 1039x501)
//   we-mean-well.jpg    <- deck slide 12 embed, full frame       1672x941 (export was a 1163x603 crop)
//   social-creators.jpg <- picture.png, THE LOOSE EXPORT         1333x584 (embed was only 1284x563)
//
// TWO MORE CLIENT CREATIVES LANDED 2026-08-07, and they are the ones this manifest
// would otherwise miss entirely, because both REPLACED A FILE IN PLACE:
//   thriving-index.jpg  <- "Accelerator Feedback - For Aaron.pptx" slide 2 embed
//                          (Downloads), 1499x929 cropped from a 1672x941 embed.
//                          Was a 1536x1024 workbook mockup.
//   nova-studio.jpg     <- the same deck, slide 3 embed, 1672x941 uncropped.
//                          **Was a 738x738 WORKBOOK image**, so this row no longer
//                          matches its Radio Partnership tab either.
//
// Neither path changed, so `images` still reads the same two strings and NOTHING
// in this file or in any asset check moved. **A REPLACED ASSET IS INVISIBLE TO A
// PATH AUDIT in a way an added or removed one is not**: check 5d only asks whether
// a declared path resolves, and it still does. That is why both are written down
// here rather than left to the binary diff.
//
// THE LOOSE EXPORTS BESIDE THE DECK WERE NOT USED, for the third and fourth time:
//   laptop.png     971x642  against the embed's 1672x941   (1.72x linear)
//   landscape.png 1013x570  against the embed's 1672x941   (1.65x linear)
// Both are the same mock and the same framing as their embed (landscape.png
// rescales to a mean absolute difference of 1.8/255), just smaller. **Treat the
// loose file as the INSTRUCTION and the deck embed as the ASSET.** Keep both as
// the record of the framing the client chose.
//
// Neither needed re-cropping: unlike the pass 17 slides, these two embeds carry no
// slide chrome. Verified before cutting, not assumed.
//
// The old REA mockup was the Thriving Index as a standalone page; the new one is a
// property LISTING page with the Thriving Index panel inside it. The old Nova shot
// was a 1:1 crop; the new one is the 16:9 frame. Both filenames still describe
// what is featured, which is why neither was renamed.
//
// `imageWeights` on Radio Segment stayed [1.4, 1] through the Nova swap. The card
// mat is a FIXED 230px HIGH box with `object-contain`, so height binds and a wider
// image renders LARGER, not smaller: the square drew 198x198 in that card and the
// 16:9 frame draws 352x198. Widening the weight to suit was unnecessary.
//
// Also note three files now UNREFERENCED but still on disk, all removed on
// client direction rather than by mistake: paramount.png (BVOD & SVOD),
// toni-and-ryan.jpg (Podcaster Performance) and, since 2026-08-10, acast.png
// (its whole row was deleted). Do not re-wire any of them.
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
 * FLIGHTING_PCT (the dashed "Planned flighting weight" overlay on the Budget
 * header chart) is now DERIVED from the plan's own monthly grand totals, and is
 * defined at the FOOT of this file, after PLAN_LAYERS, because it sums over
 * every row. See the note there. Client direction 2026-08-10: the old overlay
 * came from a hidden sheet and did not match the plan, so it is fixed to the
 * monthly totals.
 */

// LayerKey and OwnerKey are declared in data/brand.ts so LAYER_COLORS and
// OWNER_COLORS can be typed without a circular import. Re-exported here so the
// existing importers (InteractiveMediaPlan, ChannelDetail) keep working.
// `export type` is required: tsconfig has isolatedModules.
export type { LayerKey, OwnerKey, Weight };

/**
 * The pop-up rationale. FIELD NAMES DO NOT MATCH EITHER THE WORKBOOK COLUMN OR
 * THE RENDERED LABEL, so the mapping is written down here. All five come from a
 * visible "Media Description" sheet.
 *
 * | field         | workbook column        | label in ChannelDetail | order |
 * |---------------|------------------------|------------------------|-------|
 * | strategyLink  | B The Consumer Journey | Strategy               | 1     |
 * | role          | D Role of the Channel  | Role of Channel        | 2     |
 * | comesToLife   | E How It Comes to Life | Implementation         | 3     |
 * | assets        | C The Assets           | Assets                 | 4     |
 * | metrics       | F How We Measure It    | Key metrics            | 5     |
 *
 * The rendered ORDER is the client's and is deliberately not the sheet's. It is
 * set in one place, `tableRows` in ChannelDetail.tsx; changing it here does
 * nothing, since object key order is not read.
 */
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
  /**
   * Replaces the DISPLAYED dollar figure on a SPEED row, in the grid's Budget
   * cell and in the pop-up's ownership strip. Added 2026-08-10 for the client's
   * "replace $50,000 on Radio Segment to 'Package'".
   *
   * IT CHANGES DISPLAY ONLY. `budget` and `monthly` are untouched, so the row
   * still contributes its money to MEDIA_TOTAL, to its stage total and to both
   * budget charts, which is what the client chose: the spend is real and bought
   * inside a package, it is not spend that left the plan.
   *
   * **The % cell blanks with it, and that is not cosmetic.** A row reading
   * "Package" beside "0.5%" hands back the exact figure the label is there to
   * withhold, since the reader has MEDIA_TOTAL at the foot of the grid.
   *
   * KNOWN AND FLAGGED: the two chart pop-ups still show this row's dollars,
   * because it is still part of the total they sum to. Hiding it there would
   * make the columns stop adding up to $11.0M. If the figure has to disappear
   * everywhere, the money has to leave the plan, which is a different decision.
   *
   * Never set this on a `lyka` row: the in-house branch renders "In house"
   * first and the label would be a value that renders nowhere. Asserted.
   */
  budgetLabel?: string;
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
        // "dogs", not the workbook's "pets", on client direction 2026-08-06.
        strategyLink: 'CREATE RECOGNITION: Help dog lovers see the issue in their own dogs and start looking for the signs of thriving.',
        comesToLife: 'Flood social with the strongest morning show moments, supported by paid amplification against Lyka’s audience.',
        metrics: 'Reach; video views; completion rate; engagement; shares; saves; comments; branded search; site visits.',
      },
    },
    // RADIO SEGMENT WAS REMOVED HERE on client direction 2026-08-10 (Marah, in
    // the briefing Excel and confirmed in writing: "included that $50K and added
    // this to the Nova Ear Worm section, new total for this line should be
    // $400K"). Its $50,000 was folded into the Nova Ear Worm (Rosella Boy) with
    // Wippa line in CHECK IT (now $400,000); the client zeroed the Radio
    // Partnership line in the workbook. A $0 SPEED row cannot stay (a 'Package'
    // budgetLabel on a $0 row fails __integrity 5b-iii), so the row is removed
    // rather than kept empty. SHOW IT 4,255,000 -> 4,205,000, CHECK IT
    // 5,650,000 -> 5,700,000, MEDIA_TOTAL unchanged at $11,000,000.
    // `nova-studio.jpg` is now unreferenced (still in public/images/, like
    // acast.png), the Radio Partnership tab is unused, and the row's "Fine Dog
    // Syndrome host segment" rationale is dropped with it (flagged to the client
    // rather than folded into Nova's copy). The `budgetLabel` field and its
    // rendering are kept but currently unused; see `budgetLabel` on MediaRow.
    // ACAST PODCASTS WAS REMOVED HERE on client direction 2026-08-10 ("remove
    // 'Acast Podcast' line completely from table"). It was an in-house row, so
    // it carried no dollars and no total moved; the workbook's Podcast tab still
    // has it, which is why the manifest above records the removal. `acast.png`
    // is still in public/images/, now unreferenced, exactly like paramount.png
    // and toni-and-ryan.jpg: a deliberate removal, not a dropped asset.
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
      // MERGED ROW, client direction 2026-08-10: "combine 'Linear TV' and 'AFL
      // Season Spot Plan' line into 1 x Line", named by the client, budget
      // stated by the client as $2,150,000 and flighting "to now be combined".
      //
      // The row it replaces was "Linear TV" until 2026-08-07 and "Linear TV
      // News" until now. THREE workbook rows are behind this one name, so the
      // manifest above carries it in the [tab name != row name] list; the
      // Screens tab's column G label still reads LINEAR TV.
      //
      // ARITHMETIC, and it is why nothing else moved: 400,000 + 1,750,000 =
      // 2,150,000, which is the client's own figure, so MEDIA_TOTAL, the SHOW IT
      // stage total and every other row's % are all untouched. The monthly cells
      // are added index by index and the two flights do not overlap (Linear ran
      // Oct, Nov, Jan, Feb; AFL ran Mar to Sep), so the combined array is a
      // union and December stays dark in both.
      channel: 'Premium Linear News & Sport TV',
      owner: 'speed',
      assets: 'News & AFL | Seven, Nine, Foxtel',
      monthly: [100000, 100000, 0, 100000, 100000, 250000, 250000, 250000, 250000, 250000, 250000, 250000],
      budget: 2150000,
      weight: ['heavy', 'heavy', null, 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium'],
      // MERGED RATIONALE SUPPLIED BY THE CLIENT 2026-08-10 (Marah, from the
      // briefing Excel): "you can keep STRATEGY the same, the rest will just need
      // to be updated to ensure it reflects a blend of both LTV & AFL". So
      // `assets`, `role`, `comesToLife` and `metrics` are her blended copy,
      // verbatim (straight apostrophes normalised to curly to match this file);
      // `strategyLink` is UNCHANGED per her instruction and still carries both
      // original directives. This replaces the earlier back-to-back merge.
      // FLAGGED to the client: her `metrics` lists "message take-out" twice, a
      // by-product of blending both rows' metrics. Left verbatim, not deduped.
      detail: {
        assets: 'Three 30-second masterbrand films: Poo, Pep and Polish across News and AFL Season.',
        role: 'Build mass awareness, stature and fame for Lyka’s three-step thriving check. And also provide continuity across high-reach, high-affinity sport (AFL) to check mentally throughout the season.',
        strategyLink: 'SHOW WHAT THRIVING LOOKS LIKE: Move owners from recognising the problem to understanding the visible signs. KEEP THE CHECK TOP OF MIND: Sustain recognition of the trilogy beyond summer and reinforce the behaviour through repeated exposure.',
        comesToLife: 'Launch the trilogy within the 6pm news across Seven and Nine, extending the campaign’s trusted news environment. And run the trilogy consistently within premium AFL coverage across Seven and Foxtel, maintaining momentum after the summer sporting burst.',
        metrics: 'Target-audience reach; frequency; completed spots; campaign awareness; message take-out; brand recognition, trilogy exposure; brand awareness; message take-out; search and site-response uplift.',
      },
      // NO CARD WAS LOST IN THE MERGE. AFL's only image was seven.png, which
      // Linear TV already wired at index 1, so the gallery is the same three
      // cards rather than four with a duplicate. AFL's caption read
      // "Seven | Foxtel"; the card is the Seven mark, so it stays "Seven" and
      // Foxtel is named in the copy and the assets line. There is no Foxtel
      // logo in the workbook, so none was invented.
      images: ['/images/linear-tv.jpg', '/images/seven.png', '/images/nine.png'],
      imageWeights: [2.6, 1, 1],
      captions: ['The trilogy in the 6pm news', 'Seven', 'Nine'],
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
        // SUPPLIED BY THE CLIENT 2026-08-06, and it closes the one real content
        // gap in the plan. The workbook's "The Consumer Journey" cell for Cinema
        // is EMPTY, which is why this row rendered four rationale rows and
        // opened on Role of Channel. It came from the client rather than being
        // written here, so all 21 funded rows now carry all five fields and
        // `KNOWN_BLANK` in data/__integrity.ts is empty again.
        strategyLink: 'MAKE THRIVING UNMISSABLE: Bring Poo, Pep and Polish to life with the scale, attention and emotional impact of the big screen.',
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
        // "the trilogy of films", not "the films", on client direction
        // 2026-08-06. PARAMOUNT+ REMOVED FROM THIS COPY on client direction
        // 2026-08-10 ("remove the Paramount+ wording on BVOD"), so the copy now
        // matches the gallery, which dropped the Paramount+ card on 2026-08-06.
        comesToLife: 'Serve the trilogy of films in sequence, moving from Poo to Pep to Polish and building the complete thriving story over time. Utilising the high attention channels across all of BVOD (7plus, 9Now, SBS) and SVOD (Binge, Netflix, Amazon Prime, Disney+).',
        metrics: 'Completed views; sequential exposure; trilogy completion; cost per completed view; brand lift.',
      },
      // FIVE BVOD logos. The Screens tab labels its visuals in column G, and the
      // "BVOD" label at G9 covers rows 9 to 10, which hold SIX: 7plus, 9Now,
      // Paramount+, SBS, 10play AND Kayo. The `comesToLife` copy above (rendered
      // as "Implementation") names only three of them (Paramount+ removed from
      // the copy 2026-08-10), but that column is the
      // strategy note and the tab is headed "Visuals to be included", so the tab
      // governs the gallery.
      //
      // PARAMOUNT+ IS DELIBERATELY OMITTED, on client direction 2026-08-06: its
      // card was crossed out on a review screenshot. **This note is the whole
      // point of the manifest.** The tab has six and this row wires five, so the
      // next audit WILL flag a missing logo, and the documented lesson is that a
      // dropped logo is silent and gets restored as a bug. It is not a bug here.
      // Do not re-add `/images/paramount.png` without a client instruction.
      // (The file is still in public/images/, now unreferenced, so reversing
      // this is one entry in each array rather than a re-extraction.)
      //
      // IMAGES AND CAPTIONS ARE PAIRED BY INDEX. Removing one and not the other
      // shifts every later caption onto the wrong logo, and every card still
      // looks perfectly deliberate. Both arrays lost index 2 together.
      images: ['/images/7plus.png', '/images/9now.png', '/images/sbs-on-demand.png', '/images/10play.png', '/images/kayo.png'],
      captions: ['BVOD: 7plus', 'BVOD: 9Now', 'BVOD: SBS On Demand', 'BVOD: 10play', 'BVOD: Kayo'],
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
      // "Outdoor Stature" until 2026-08-10, renamed on client direction. One
      // field, the documented shape for a channel rename here: the grid label,
      // the pop-up heading, the "{channel} rationale" heading and the flighting
      // chart title all derive from it.
      //
      // NOTE the workbook's own `role` copy below still reads "fame, stature
      // and repeated visibility". That is the client's word in their own
      // rationale, not a stale echo of the row name, so it is left verbatim and
      // flagged rather than quietly swapped to "impact".
      channel: 'Outdoor Impact',
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
      // "& SCA" dropped from the title on client direction 2026-08-06, and the
      // SCA LOGO followed on the same direction, so SCA is off THIS ROW
      // entirely, title and creative.
      //
      // It is not off the plan. `sca.png` is still wired to Always On Radio, and
      // the MMM Sports Commentary row's copy still reads "across Seven and SCA".
      // The consistent reading is that SCA is represented by its consumer facing
      // brand, Triple M, rather than by the holding company logo, which is why
      // the MMM row keeps both the name and the Triple M mark. Left as is.
      // MERGED ROW, client direction 2026-08-10: "combine BBL Cricket
      // Integration Seven and MMM Sports Commentary Integration lines into 1",
      // named by the client (their spelling of "TripleM" is kept as written)
      // and budgeted by the client at $3,100,000.
      //
      // ARITHMETIC: 3,000,000 + 100,000 = 3,100,000, the client's own figure, so
      // MEDIA_TOTAL, the CHECK IT stage total and every other row's % are
      // untouched. Monthly cells add index by index (Dec 1,000,000 + 50,000,
      // Jan 2,000,000 + 50,000) and both rows carried the SAME weight array, so
      // the shading is unchanged rather than reconciled.
      //
      // THE SCA NOTE ABOVE NOW RESOLVES ITSELF. SCA came off this row's title
      // and creative on 2026-08-06 while the MMM row's `role` copy still read
      // "across Seven and SCA", on the reading that SCA is represented by its
      // consumer facing brand. That brand is now IN THE ROW NAME, so the copy
      // below and the title agree for the first time. `sca.png` remains wired to
      // Always On Radio and nothing is orphaned.
      channel: 'BBL & Cricket Integration Seven & TripleM',
      owner: 'speed',
      assets: 'Sponsorship | Segment',
      monthly: [0, 0, 1050000, 2050000, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 3100000,
      weight: [null, null, 'medium', 'heavy', null, null, null, null, null, null, null, null],
      // BOTH SOURCE ROWS' COPY, VERBATIM AND BACK TO BACK, on the same reasoning
      // as the merged Premium Linear row in SHOW IT: the client merged two lines
      // and did not supply merged copy, and inventing a blended rationale would
      // put agency writing in a field they read as theirs. `metrics` again lists
      // the union, with MMM's three terms lowercased to sit mid list. **Flagged;
      // replace wholesale if the client sends a single merged rationale.**
      //
      // "LIVE COMMENTARY" in `strategyLink` is the client's 2026-08-06 wording,
      // not the workbook's "LIVE GAME". "game" is deliberately left standing in
      // `comesToLife`, where the dog "enters the game" and the substitution
      // would not read.
      detail: {
        assets: 'Seven sponsorship across Linear TV and BVOD; opening and closing billboards; squeezebacks; pull-throughs; segment sponsorship; bespoke cricket integration; masterbrand trilogy spot plan. Bespoke MMM integrated segment; James Brayshaw and Brad Haddin commentary; Seven TV integration linkage; social and audio cutdowns.',
        role: 'Deliver high reach and deep engagement with Lyka’s audience during the December to January category peak, increasing share of voice when purchase interest is highest. Create theatre of the mind and connect the radio and television ideas into one distinctive sporting moment across Seven and SCA.',
        strategyLink: 'TURN THE CHECK INTO A HIGH PERFORMANCE HABIT: Connect Poo, Pep and Polish with the visible signs of a high performing dog. BRING THE CHECK INTO THE LIVE COMMENTARY: Use the drama and familiarity of sports commentary to make Lyka’s high performance dog impossible to ignore.',
        comesToLife: 'A bespoke spot emulates a cricket match before a dog intercepts the game and shows off their Pep and Polish. This is a high performance dog, just like the cricketers. The integration is supported by the full trilogy spot plan. The MMM sports telecast is interrupted when the Lyka dog enters the game. James Brayshaw and Brad Haddin expertly relay what is unfolding on the pitch, timed to link with the bespoke Lyka TV spot airing on Seven. The MMM team would add it into their socials.',
        metrics: 'Incremental reach; frequency; sponsorship awareness; integration engagement; completed BVOD views; brand recall; three step check recall; branded search; site visits; segment reach; social views; engagement.',
      },
      // ALL FIVE CARDS SURVIVE THE MERGE, regrouped into the house pattern this
      // deck already uses on Outdoor Impact: mockups in `images`, partner logos
      // in `extraImages`. Five cards in one row would have put two 16:9 mockups
      // at 2.6 against three logos at 1, squeezing both mockups to about a third
      // of the gallery. Two mockups at equal weight up top, three logos below.
      //
      // Seven had been moved up into `images` on 2026-08-06 when SCA's card came
      // off, because `extraImages` cards are `flexGrow: 1, flexBasis: 0` and a
      // LONE survivor stretches across the whole gallery. That reason is spent:
      // the lower row now carries three.
      images: ['/images/bbl-live.jpg', '/images/mmm-booth.jpg'],
      imageWeights: [1, 1],
      captions: ['The Lyka dog stops play', 'Brayshaw and Haddin call the interruption'],
      extraImages: ['/images/bbl.png', '/images/seven.png', '/images/triple-m.png'],
      extraCaptions: ['KFC BBL', 'Seven', 'Triple M'],
    },
    {
      // Renamed on client direction 2026-08-06, and this one is a STATION
      // CHANGE, not a title tidy: MMM out, Nova with Wippa in, "Lou & Jach Show
      // Sponsorship" off, and "Rosala" corrected to "Rosella". The workbook has
      // this row as "MMM Launch with Lu & Jarch" and Lu & Jarch have moved to
      // the Podcaster Performance row below, so the client is revising the
      // briefing, not correcting the port.
      //
      // THE KNOCK ON COPY IS NOW RESOLVED, and the sequence is the point. The
      // rename left `comesToLife` naming MMM and Lou & Jach and the gallery
      // showing Triple M, all contradicting the new title. That was FLAGGED
      // rather than rewritten, and the client then supplied replacement
      // Activation copy outright, which is a better outcome than a guess.
      // Only ONE thing is still inherited: the Paid & Organic Social row that
      // amplifies this one still lists "MMM cutdowns" in its assets. Flagged.
      channel: 'Nova Ear Worm (Rosella Boy) with Wippa',
      owner: 'speed',
      assets: 'Segment | Socials',
      // Client direction 2026-08-10 (Marah, in the briefing Excel, confirmed in
      // writing): the Radio Segment package's $50,000 was folded into this line,
      // taking it $350,000 to $400,000. The extra $50,000 lands in NOVEMBER
      // (Oct $200,000 / Nov $200,000), matching the client's own monthly split.
      // This moves $50,000 SHOW IT -> CHECK IT (SHOW IT 4,255,000 -> 4,205,000,
      // CHECK IT 5,650,000 -> 5,700,000); MEDIA_TOTAL is unchanged at
      // $11,000,000 and January is still $3,295,000 (money moved Oct -> Nov).
      monthly: [200000, 200000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      budget: 400000,
      weight: ['heavy', 'heavy', null, null, null, null, null, null, null, null, null, null],
      detail: {
        // "Rosella", not the workbook's "Rosala": the client corrected the
        // spelling with the rename above, and leaving it here would put both
        // spellings in one pop-up.
        assets: 'Original Poo, Pep and Polish song composed by Rosella Boy and his dad; in-show launch; presenter discussion; station content highlights; social cutdowns.',
        role: 'Create a culturally relevant performance that makes the check famous, memorable and easy to repeat.',
        strategyLink: 'MAKE THE CHECK ENTERTAINING: Turn Poo, Pep and Polish into an earworm owners remember and repeat.',
        // REPLACED WHOLESALE by client copy 2026-08-06, which resolves the MMM
        // reference this row was flagged for. Supplied verbatim apart from one
        // fix: the source ran "live in Nova It is then replayed" as a single
        // sentence, so the missing full stop was added. "in Nova" is the
        // client's own preposition and is left as written.
        comesToLife: 'Wippa launches the song live in Nova. It is then replayed as a content highlight throughout the day and extended across the Nova social channels.',
        metrics: 'Radio reach; frequency; content plays; listener response; social video views; engagement; song recall; three step check recall; branded search uplift.',
      },
      // TRIPLE M OUT, NOVA IN, client direction 2026-08-06. `triple-m.png` is
      // still wired to MMM Sports Commentary, correctly, so nothing is orphaned.
      //
      // `nova-earworm.jpg` IS NOT FROM THE BRIEFING WORKBOOK, which is worth
      // recording because every other image on this page is. All 52 embedded
      // workbook images were enumerated tab by tab while looking for it, and the
      // only Nova studio frame in there is the two adult presenters shot that
      // already ships as `nova-studio.jpg` (no boy, counter reads 247,831). This
      // one came from the client separately, as `boy.png` in the project folder.
      // **So a re-audit against the workbook will not find its source. That is
      // expected, not a dropped asset.**
      //
      // RE-CUT 2026-08-06 FROM THE CHANGE DECK, at 1306x629 rather than the
      // 1039x501 loose export, 1.26x linear. The client's `Changes to the
      // intereactive media plan.pptx` embeds this photo at higher resolution than
      // the PNG they exported beside it, and these cards ENLARGE in the lightbox,
      // so the pixels are worth having.
      //
      // The embed is a whole SLIDE, with a black "CHECK IT" header over the top,
      // and cropping that off by heuristic FAILED: the header is black with WHITE
      // text, so a "row is mostly black" scan stopped inside the headline and left
      // half a line of type across the top of the card. The crop row was instead
      // MEASURED, by searching for the top that best matches `boy.png` (the
      // client's own correctly framed export) and taking the minimum: row 111,
      // diff 0.73/255, aspect 2.076 against their 2.074. Both start on the same
      // black band, so the framing is theirs, not invented.
      //
      // Weighted 2.6 to 1 against the Nova logo, which is Radio Segment's exact
      // shape and the documented house pattern. Deliberately the same as its
      // sibling Nova row rather than tuned to this file's wider 2.07:1 aspect:
      // the two Nova rows reading alike is worth more than a snugger fit, and
      // the card is a click into the lightbox for anyone reading the detail.
      images: ['/images/nova-earworm.jpg', '/images/nova.png'],
      imageWeights: [2.6, 1],
      captions: ['Wippa and Rosella Boy launch the song', 'Nova'],
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
        // MMM -> NOVA ON THIS ROW, client direction 2026-08-06, and BOTH
        // instances went. The annotation arrow pointed at `comesToLife`, but
        // `assets` carried the same station reference two lines above it, and
        // changing one would have left a single pop-up crediting two different
        // stations for the same song. This row amplifies the Ear Worm, which is
        // now Nova, so neither reference could stay. "Rosella" was corrected
        // here in the same pass, for the same reason.
        assets: 'Rosella Boy hero song content; Nova cutdowns; creator versions; audience responses; paid amplification assets.',
        role: 'Build viral momentum, social participation and behavioural reinforcement in the environment where the song first gains traction.',
        strategyLink: 'TURN RECALL INTO PARTICIPATION: Encourage owners and creators to perform, reinterpret and share the Poo, Pep and Polish check.',
        comesToLife: 'Boost the original song and Nova content. As creators and audiences post their own versions, shift amplification behind the strongest responses to sustain and expand the song cycle.',
        metrics: 'Reach; video views; completion rate; creator participation; user generated content volume; shares; saves; engagement; earned reach; site visits.',
      },
      // FIRST CREATIVE ON THIS ROW. Supplied by the client as `picture.png` in
      // the project folder, 2026-08-06: five phone frames of creators posting
      // their own versions of the song, which is exactly what the Activation
      // copy above describes. NOT FROM THE WORKBOOK, like `nova-earworm.jpg`,
      // so the header manifest records it and a re-audit will not find a source.
      // Converted 1333x584 RGBA PNG (1478KB) to JPEG q85 (150KB, 90% smaller);
      // alpha checked first and fully opaque on every pixel.
      //
      // `stackedImages` FOR A SINGLE IMAGE, deliberately, and it is a sizing
      // decision rather than the two-image logo-lockup pattern it was built for.
      // At 2.28:1 this is the widest creative in the plan, and the default
      // gallery would letterbox it to 452x198 inside an 896px card, leaving
      // about 210px of empty mat each side: the documented "whitespace inside a
      // card reads as a mistake" problem. The stacked branch uses a narrower
      // `max-w-2xl` frame and a taller 380px mat, so it renders 640x281 with
      // roughly 16px of side mat. 41% wider, and the five phone screens are
      // worth the extra pixels. It costs the caption, since that branch passes
      // no label, which is acceptable here: the frames are self evidently social
      // and the Activation line sits directly above them.
      images: ['/images/social-creators.jpg'],
      stackedImages: true,
    },
    {
      // Renamed on client direction 2026-08-06: Toni and Ryan off, Lu & Jarch
      // and their "We Mean Well" podcast on. Reads as the other half of the Ear
      // Worm change above, moving Lu & Jarch off radio and onto the podcast row.
      //
      // THE ROW IS FULLY LU & JARCH AS OF THE SAME DAY. The rename left the
      // copy naming Toni and Ryan as lead talent and a PHOTOGRAPH of them in the
      // gallery, which was flagged rather than patched because a photo cannot be
      // relabelled: new talent needs a new image, not new alt text. The client
      // then supplied one. Both copy references and both gallery images are
      // replaced below, so nothing on this row names the old talent.
      channel: 'Podcaster Performance Lu & Jarch "We Mean Well"',
      owner: 'speed',
      assets: 'Segment | Socials',
      monthly: [0, 100000, 0, 0, 100000, 0, 0, 0, 0, 0, 0, 0],
      budget: 200000,
      weight: [null, 'heavy', null, null, 'heavy', null, null, null, null, null, null, null],
      detail: {
        // "Lu & Jarch", not "Toni and Ryan", in BOTH fields, client direction
        // 2026-08-06. Two annotation arrows, one per field, and both were needed:
        // the old talent was named twice on one pop-up.
        assets: 'Bespoke song recreations and social videos from selected podcasters, led by Lu & Jarch; podcast mentions; social cutdowns.',
        role: 'Extend the song cycle through trusted talent with strong audio and social influence, bringing new interpretations and audiences into the idea.',
        strategyLink: 'MAKE THE CHECK FEEL PERSONAL: Use familiar podcast voices to embed the song and the three signs within highly engaged communities.',
        comesToLife: 'Key podcasters recreate the Poo, Pep and Polish song in their own style and publish it across their social channels, with Lu & Jarch recommended as lead talent.',
        metrics: 'Completed listens; podcast reach; social reach; video views; engagement; shares; creator response; three step check recall; branded search.',
      },
      // BOTH OLD CARDS CROSSED OUT on the review screenshot and replaced by one
      // client supplied image: the "We Mean Well" studio with Lu & Jarch, a corgi
      // and a Lyka bowl, plus a phone frame of the same moment as a social post.
      // NOT FROM THE WORKBOOK; recorded in the header manifest with the other two.
      //
      // RE-CUT 2026-08-06 FROM THE CHANGE DECK at the FULL FRAME, 1672x941
      // against the loose export's 1163x603: 1.50x linear, and less cropped. The
      // loose `use-this-picture.png` turned out to be a tighter 1.93:1 crop of
      // this same 16:9 photo, so the deck's own embed is better on both counts.
      // No slide chrome on this one, and no alpha, so it converts directly.
      //
      // The first pass shipped from the loose PNG, and getting that right needed a
      // step worth keeping: it carried a 51px FULLY TRANSPARENT strip across the
      // top plus a 1px feathered edge (alpha 14 on the first row, 174 down the
      // first column). Flattening straight to JPEG would have baked a 51px white
      // band above a dark studio photo and a pale hairline down its left side.
      // **Check WHERE a PNG's transparency is before deciding how to flatten it:
      // a fully transparent band is a crop, not a matte.**
      //
      // `stackedImages` for a single wide image, same sizing reason as Paid &
      // Organic Social: at 1.78:1 the default gallery would letterbox it to
      // 352x198 in an 896px card, where stacked renders it 618x348. 76% bigger,
      // which four faces, a dog and a phone screen earn. `acast.png` is untouched
      // and still wired to Acast Podcasts. `toni-and-ryan.jpg` is now
      // UNREFERENCED but left on disk, as `paramount.png` was; both are photos of
      // talent no longer on the plan, so remove them together in a cleanup pass.
      images: ['/images/we-mean-well.jpg'],
      stackedImages: true,
    },
    {
      // Formats widened on client direction 2026-08-06: "30 Second Spots" out,
      // "30secs, Live Reads, Segments" in. No trailing full stop: this is a
      // label, and it is also the pop-up's <h2> and the Media column cell.
      channel: 'Always On Radio | 30secs, Live Reads, Segments',
      owner: 'speed',
      assets: '2 stations',
      monthly: [0, 150000, 0, 200000, 300000, 200000, 200000, 200000, 200000, 200000, 200000, 150000],
      budget: 2000000,
      weight: [null, 'heavy', null, 'heavy', 'heavy', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'light'],
      detail: {
        // THREE FIELDS REWRITTEN BY THE CLIENT 2026-08-06, all widening this row
        // from a spots buy to a personality and topicality play. Supplied as
        // marked up copy: `assets` struck "seven day BMAD spot plan; rotating
        // reminders and masterbrand messaging" and added the DJ reads clause,
        // `role` gained the "biggest must win channel" clause, and `comesToLife`
        // gained three sentences.
        //
        // House style applied on the way in, per the workspace rules: their
        // "30-second" is "30 second" here and "on air", "must win" and "short
        // term" were already unhyphenated in their copy.
        //
        // ONE WORD CHANGED AND IT IS FLAGGED: their text read "The later allows
        // short term insights...", which does not parse. "The latter" is the only
        // sensible reading, since it refers back to the on air segments, so that
        // is what ships. One word to revert if the intent was different.
        assets: '30 second radio spots reinforcing the 3Ps check; Live topical DJ reads, on air segments throughout the year.',
        role: 'Remain a constant in Lyka’s most important channel and build personality and topicality in our biggest must win channel, using daily repetition to reinforce the check and build behavioural memory.',
        strategyLink: 'MAKE THE 3Ps A DAILY HABIT: Keep Poo, Pep and Polish front of mind as a simple check owners perform regularly.',
        comesToLife: 'Run 30 second spots across breakfast, morning, afternoon and drive, seven days a week. Each exposure reminds dog owners to check Poo, Pep and Polish and consider whether their dog is truly thriving. Drive personality and topicality through Live reads and on air segments throughout the year to keep this topic in popular culture. The latter allows short term insights to change in and out throughout the year. Would seek to have 2 station buy for reach.',
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
      // CONDENSED TO FEBRUARY AND MARCH, client direction 2026-08-10 ("can we
      // condense the flighting for the 'realestate.com.au' line to only 2
      // months February & March").
      //
      // THE MONEY IS COMPRESSED, NOT REMOVED, which is the decision behind this
      // and the reason MEDIA_TOTAL is still $11,000,000. It ran $10,000 in each
      // of Feb and Mar then $5,000 a month Apr to Sep; the $30,000 tail moved
      // into the two surviving months rather than leaving the plan, which would
      // have taken the grand total to $10,970,000 and re-derived every other
      // row's %. The client offered to supply new budgets and the alternative
      // was put to them; holding the total was the call.
      //
      // The split is EVEN because the two months it replaces were even
      // ($10,000 each). Nothing here is weighted by a judgement nobody made.
      monthly: [0, 0, 0, 0, 25000, 25000, 0, 0, 0, 0, 0, 0],
      budget: 50000,
      // Feb heavy / Mar medium are the WORKBOOK'S OWN weights for these two
      // months, kept rather than re-levelled now that both carry $25,000. That
      // is not an inconsistency: the shading is an editorial presence weighting
      // and is provably not a function of spend (Cinema shades two identical
      // $70,000 months differently). Re-levelling would be inventing an
      // editorial call; keeping them invents nothing. Apr to Sep null out, or
      // integrity 5b-ii warns that a weight is rendering nowhere.
      weight: [null, null, null, null, 'heavy', 'medium', null, null, null, null, null, null],
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

// FLIGHTING_PCT: the dashed "Planned flighting weight" overlay, as monthly
// percentages summing to 100. DERIVED from the plan's own monthly grand totals
// on client direction 2026-08-10 (Marah: the old overlay "does not match this
// plan"; fix it "to the proper totals per month, based on the GRAND CAMPAIGN
// TOTAL per month"). Deriving it means the overlay can never disagree with the
// bars again: the chart draws pct / 100 * MEDIA_TOTAL, which reproduces each
// month's grand total exactly. It replaced a hardcoded array taken from a
// HIDDEN workbook sheet that matched neither plan (January was 13.9% against
// the real 30.0%); see git history. Sums over PLAN_LAYERS, so it lives here.
const MONTHLY_TOTALS: number[] = MONTHS.map((_, i) =>
  PLAN_LAYERS.reduce(
    (sum, layer) => sum + layer.rows.reduce((s, row) => s + (row.monthly[i] ?? 0), 0),
    0,
  ),
);
export const FLIGHTING_PCT: number[] = MONTHLY_TOTALS.map((v) => (v / MEDIA_TOTAL) * 100);
