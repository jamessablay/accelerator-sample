# CLAUDE.md — Lyka Audience Accelerator

This file gives Claude Code the architecture, data model and known quirks for this app. The workspace-level `CLAUDE.md` two folders up has the cross-project map.

> ## READ THIS FIRST: what is Lyka and what is not
>
> Converted from the **Hamilton Island** Standard Accelerator on **2026-07-31** (shell), then given the real Lyka audience model on the same day (personas and segments). Two of six pages still carry Hamilton Island content.
>
> | Real Lyka | Still Hamilton Island |
> |---|---|
> | Brand palette, typography, client logo, page chrome, every page heading | `data/mediaPlanData.ts` (FY26 numbers, channels, copy) |
> | All colour, centralised in [data/brand.ts](data/brand.ts) | `data/apexData.ts` (HNWT traveller Roy Morgan pull) |
> | **[data/personasData.ts](data/personasData.ts)** 5 personas | |
> | **[data/categoryData.ts](data/categoryData.ts)** the 4-stage readiness ladder | |
> | **[data/journeyDetailsData.ts](data/journeyDetailsData.ts)** 5 journeys × 5 stages | |
> | **[data/tenThingsData.ts](data/tenThingsData.ts)** + **[data/tenThingsSeries.ts](data/tenThingsSeries.ts)** 10 findings | |
> | The Personas sunburst, the Consumer Journey, Ten Things, and every detail panel | |
> | Hamilton Island Power BI embed **removed** | |
>
> So: **Personas, Consumer Journey and Ten Things are real. Interactive Media Plan and APEX are not.**
>
> ### Which is why those two no longer open (2026-08-04)
>
> Both pages are still wired and still complete. What a viewer opens is a designed "awaiting Lyka data" placeholder from [pages/PendingSections.tsx](pages/PendingSections.tsx), so the Hamilton Island travel plan and the affluent traveller Roy Morgan tables cannot be reached from the deck at all. `SHOW_ALL` in [App.tsx](App.tsx) is the only switch, and **`?show=all` in the URL restores the real pages for internal review**. Turning either back on for good is deleting one ternary. Do not solve this by deleting the pages.
>
> ### The audience model
>
> A four-stage readiness ladder with five personas. The stage names are not an agency framework: they are the descriptions on four **Roy Morgan Single Source profile exports** (`Unaware / Curious / Considering / Ready Owner.prwx`). Sources live in `.../The Speed Agency - Documents/New Business/Lyka/Roy Morgan/`.
>
> | Stage | Persona | Market | Lyka customers | Fit |
> |---|---|---|---|---|
> | Unaware / Unconvinced | Disciplined Outsourcers | 22% | 6% | Medium |
> | Unaware / Unconvinced | Secure Sleepwalkers | 27% | 3% | Low |
> | Curious | Conflicted Troubleshooters | 25% | 9% | High Growth Potential |
> | Considering | Mindful Researchers | 15% | 55% | Very High |
> | Ready | Devoted Caterers | 11% | 27% | Very High |
>
> Both columns sum to 100%. **The inversion between them is the deck's argument**: 82% of Lyka's customers come from the two smallest, warmest stages, which are only 26% of the market. Every panel leads with both figures for that reason.
>
> `data/personasData.ts` was **generated** from the parsed source document, not retyped, so the prose cannot drift from the research. The generator is in the session scratchpad; if the source is revised, regenerate rather than hand-edit.
>
> ### The journeys
>
> Five journeys, **one per persona**, on the Transtheoretical model: Precontemplation, Contemplation, Preparation, Action, Maintenance. So `JourneyType` has five persona members and the Consumer Journey tab strip is a persona selector, ordered up the readiness ladder to match the sunburst's clockwise reading order.
>
> All 50 emotional and rational scores are the study's own 0 to 100 ratings, not derived. `data/journeyDetailsData.ts` is **generated** by a cell-level parse of the source deck's tables.
>
> ### Still true, and still load bearing
>
> **This folder is still named `hamilton-island-accelerator`.** The rename to `lyka-accelerator` is blocked while VS Code holds directory watchers on the parent workspace. Rename it from the VS Code Explorer, or after closing the window. Nothing in the app depends on the folder name, and the `ReadOnly` attribute has already been cleared.
>
> **Two format rules the parsers depend on.** Bullet fields in `journeyDetailsData` are SEMICOLON delimited, because `renderStandardList` splits on `;`; use full stops only and the whole cell renders as one long bullet. Score strings need a DASH before the description, because `JourneyScoreGraph` matches `[-–—]` and not a colon; omit the separator entirely and it concatenates every digit in the string.
>
> **Do not "fix" the remaining travel content by find-and-replacing Hamilton to Lyka.** The media plan is travel shaped and needs a real brief, not renaming.
>
> **Never relabel `data/apexData.ts` figures as Lyka.** The file looks generic (roughly 5% client specific) so a label-only sweep is tempting, but `heavyPct` and `rmIndex` are affluent-traveller media consumption. Presenting them as dog owner behaviour, inside a panel that cites Roy Morgan Single Source by name, is the highest severity honesty failure available here. [pages/ApexBySpeed.tsx](pages/ApexBySpeed.tsx) carries a visible "Placeholder audience" notice and a deliberately client-neutral tagline for exactly this reason. Both stay until a real Lyka pull lands.

## Visualisation variants: READ BEFORE TOUCHING PERSONAS OR CONSUMER JOURNEY

Both of those pages currently render **several interchangeable views of the same
data**, chosen from a switcher in the page header. This is deliberate, temporary
review scaffolding so a direction can be chosen by looking rather than imagining.

**Personas is down to three. `slope`, labelled "Index", was cut on 2026-08-04**
(`ConversionSlope.tsx` deleted). It drew market share to customer share as
crossing lines with the conversion index on the right; the Ladder already makes
that argument with a mirrored bar and the Flow carries the index on its chips.
Removing a view is the registry entry, the `PersonaVariantId` union and the file.
A stale `?pv=slope` or a stale localStorage value is safe: `useVariant` validates
against the registry ids and falls back to the default, verified.

| Page | Registry | Views | Default |
|---|---|---|---|
| Personas | [components/personas/variants/index.ts](components/personas/variants/index.ts) | `wheel` (baseline sunburst), `ladder`, `flow` | `ladder` |
| Consumer Journey | [components/journey/variants/index.ts](components/journey/variants/index.ts) | `table` (baseline), `spine`, `tension`, `strip` | `spine` |

Selection persists to `localStorage` and is linkable via `?pv=` and `?jv=`
([hooks/useVariant.ts](hooks/useVariant.ts)). There is still no router.

**To land the decision:** delete the losing component files, cut the registry to
the survivor, and drop `VariantSwitcher` and `useVariant` from the page. The two
page components are thin hosts; each view implements one props contract
(`PersonaVizProps` / `JourneyVizProps`) and drives the same detail panels.

**Three things must survive that edit**, whichever view wins: `data/type.ts` and
`hooks/useElementSize.ts` (not scaffolding, they are the type system), the
full overlay panel behaviour in `Personas.tsx`, and the permanent 9:16 media slot
in `PersonaDetail.tsx`.

**The two baselines are deliberately untouched.** `PersonaCompositionChart` and
`JourneyDetailTable` are wrapped by adapters rather than modified, because editing
what you are A/B testing against invalidates the test. Do not "tidy" them while
the comparison is live.

### Three constraints in the new views that are load bearing

1. **`MindsetFlow` ribbon width must never imply a measured transition rate.** The
   study measures no movement between stages. Width encodes the SOURCE STAGE'S
   market share, meaning how many people are sitting there to be moved, ribbons
   are constant width because a taper implies a rate, and the legend says so on
   screen. Every edge quotes a persona's `movement` field verbatim; the two dashed
   routes are the two non-sequential jumps the research names.
2. **`gap`, `openingGap` and `leadMode` are derived, not study ratings.** The 50
   emotional and rational scores are the study's own. Anything computed from them
   must be labelled as SPEED arithmetic wherever it is shown, or it reads as a
   research finding.
3. **A source cell is truncated.** Devoted Caterers / Action `rationalScore` ends
   mid-sentence at `"...transition progress and ease of"`. Verified: it is cut off
   **in the PPTX itself**, so `journeyDetailsData.ts` is faithful and regenerating
   will not fix it. `isTruncatedDescriptor()` detects it and the spine and strip
   views print a note. Do not invent an ending.

### The derived model

[data/audienceModel.ts](data/audienceModel.ts) is the only place a `"22%"` string
is parsed. Every view reads numbers from it, so they cannot round differently.

- **Stage totals are SUMMED from the personas**, not read from `categoryData`.
  That makes `categoryData`'s 49 / 25 / 15 / 11 an independent cross-check, and
  `__integrity.ts` asserts the two agree.
- **`TOTAL_DOG_OWNERS = 9_860_000` is UNSOURCED.** It is in neither source
  document (both were searched). It exists as one constant so absolutes can be
  removed with a one-line edit: set it to `null` and every view falls back to
  percentages. Get a citation before this goes in front of Lyka. Note this
  contradicts the header of `categoryData.ts`, which records an earlier decision
  to carry no absolute count at all.
- **There is deliberately no `customerVolume`.** `customerPct` is a share of
  LYKA'S CUSTOMER BASE, not of the market, and Lyka's subscriber count is not in
  the pack. Multiplying it by `TOTAL_DOG_OWNERS` yields an authoritative looking
  number that means nothing.

## What this is

A SPEED Standard Accelerator for **Lyka** (fresh, human grade dog food, direct to consumer subscription, lyka.com.au). Six pages:

- **Personas**: a custom 3-layer SVG sunburst. Five Lyka personas across a four-stage readiness ladder. Default landing page.
- **Consumer Journey**: 5 segment-specific six-stage journeys, each with an emotional + rational score line over time.
- **Interactive Media Plan**: macro block grid + Chart.js pop-ups, modelled on the Carnival FY26 reference. **Shows a placeholder** until a Lyka brief lands; the built page is behind `?show=all`.
- **APEX by SPEED**: the channel scorecard. **Shows a placeholder** until a Lyka Roy Morgan pull lands; the built page is behind `?show=all`.
- **Business Dashboard**: a designed empty state awaiting a Lyka Power BI report.
- **Ten Things The Data Says**: ten findings in a one viewport 5 x 2 grid, each opening a modal with a Chart.js chart, the published numbers, an implication and a test. Real Lyka. Ported 2026-08-03 from a standalone HTML page. Last in the nav.

Lineage: **Xero PITCH Accelerator** → **Hamilton Island Audience Accelerator** → this. The polar geometry helpers (`polarToCartesian`, `describeSunburstArc`, `describeLabelArc`) are Xero inheritance.

- Live: **not deployed.** Local only by decision. See "Deploy" for what to do when that changes.
- Repo: **[The-Speed-Agency/speed-x-lyka-accelerator](https://github.com/The-Speed-Agency/speed-x-lyka-accelerator)**, private, created 2026-08-04. Branch `lyka-main`, an orphan with no Hamilton Island history. **Two local branches must never be pushed.** See "Source control".

## Stack

- React 19 + TypeScript 5.8 on Vite 6
- Tailwind CSS **via CDN** in [index.html](index.html) — no local `tailwind.config.js`. An inline `tailwind.config` in that file adds real `lyka-*` colour utilities (`bg-lyka-cream`, `text-lyka-ink`). Brand CSS custom properties live in the same file's `<style>` block.
- Custom SVG sunburst for the wheel (no chart library); **Chart.js 4 via `react-chartjs-2`** for the Interactive Media Plan charts only.
- HTML5 `<video autoplay loop muted playsinline>` for persona vignettes
- **Poppins** (display) + **DM Sans 300 to 700** (body) + **DM Mono** (labels) from Google Fonts
- `netlify.toml` and `wrangler.jsonc` are both present and configured but neither is currently linked to a site

There is **no router**. Navigation is a `Page` enum in [types.ts](types.ts) consumed by a switch in [App.tsx](App.tsx).

## Routing model

Six pages:

```ts
// types.ts
export enum Page {
  BUSINESS_DASHBOARD = 'Business Dashboard',
  TEN_THINGS = 'Ten Things The Data Says',
  PERSONAS = 'Personas',
  CUSTOMER_JOURNEY = 'Consumer Journey',
  INTERACTIVE_MEDIA_PLAN = 'Interactive Media Plan',
  APEX_BY_SPEED = 'APEX by SPEED',
}
```

**Adding a page touches exactly eight places**, and nothing else in the app needs to know: `types.ts` (the enum), a new `components/icons/*Icon.tsx` (the sidebar renders `{item.icon}` unconditionally, so a missing icon is a blank cell), the page component, two edits in `App.tsx` (import and switch case), two in `Sidebar.tsx` (import and `navItems`), then `metadata.json`.

- **Personas** is the default landing page.
- **Two of the six nav items do not open their page.** Interactive Media Plan and APEX by SPEED render a placeholder unless `?show=all` is in the URL. See "Which is why those two no longer open" at the top of this file. The nav still lists both, deliberately: the deck should read as six sections with two pending, not as four.
- **Sidebar order differs from the enum order.** The visible nav order is set by the `navItems` array in [components/Sidebar.tsx](components/Sidebar.tsx), where **APEX by SPEED sits above Interactive Media Plan** (the two were swapped). The `Page` enum order above is just the enum definition, not the rendered order.
- **Ten Things sits last, below Interactive Media Plan.** It shipped second, on the argument that the ten findings set up the audience model. Moved on request 2026-08-04: the deck leads with who the audience is and closes on the evidence. The rendered order is the `navItems` array, so moving it is a one line change and nothing else needs to know.
- **Business Dashboard** is a designed empty state. It previously embedded a Power BI report belonging to **another client**, which was removed. To wire Lyka's report, set `REPORT_URL` at the top of [pages/BusinessDashboard.tsx](pages/BusinessDashboard.tsx) to a publish-to-web `app.powerbi.com/view?r=...` URL and the iframe renders in place of the empty state.
- **Interactive Media Plan** is the FY26 macro block plan, modelled on the Carnival FY26 reference. A funnel-stage grid (Active Consideration | Research | Book) of media channels with monthly gantt flighting bars and Budget + % columns, fed by [data/mediaPlanData.ts](data/mediaPlanData.ts) (sourced from the briefing workbook's visible `Budget Distribution $3.5` + `Media Description` sheets). Each funnel rail shows the layer name plus its **% of media** (Active Consideration 72.3% / Research 16.5% / Book 11.4%). The rail label size derives from the layer's row count, because a vertical label's available length is the rail height, not its width. Clicking a gantt bar opens a channel pop-up (rationale + dark-label execution table, then an **Examples** creative gallery, then an area flighting chart with point labels). The gold **Budget** header opens a stacked-by-media monthly bar chart, the **%** header opens a budget-allocation pie. A bottom line states the working-media + production total. Uses Chart.js via `react-chartjs-2`. Components live in [components/mediaplan/](components/mediaplan/). The page is compressed (smaller header/KPIs, tight gaps, `pb-4`) so it fits a normal-height viewport without scrolling. **No dashed average-spend line and no provisional fineprint** (both removed per client feedback).
- **APEX by SPEED** is the channel scorecard tab added after the initial build. Behind the placeholder, like the media plan above.

## Data model

All data lives in flat TypeScript files under `data/`. There is no database, no fetch, no JSON file. Editing data = editing TS source.

| File | What it holds |
|---|---|
| [data/personasData.ts](data/personasData.ts) | **Real Lyka.** 5 personas in a single `PersonaType.LYKA_AUDIENCE` bucket, grouped by 4 readiness-stage strings. Generated from the source research document, not hand typed. Exports `personaCategories`. |
| [data/personaMedia.ts](data/personaMedia.ts) | **The persona films, joined by persona id.** Deliberately NOT in `personasData.ts`, which is generated. `PERSONA_VIDEOS` plus `personaVideo()`. Both directions of the join are asserted in dev. |
| [data/audienceModel.ts](data/audienceModel.ts) | **Derived, no new facts.** THE ONLY PLACE THAT PARSES A `"22%"` STRING. `stageMetrics`, `personaMetrics`, `conversionIndex`, `GAPS`, `TOTAL_DOG_OWNERS`. See "The derived model" below. |
| [data/journeyMeta.ts](data/journeyMeta.ts) | Top-level copy per journey, moved out of the page component. Joins to a persona by `personaId` and restates nothing else. |
| [data/journeyModel.ts](data/journeyModel.ts) | Derived journey metrics plus the canonical score-string parsers, moved out of `JourneyScoreGraph`. |
| [data/categoryData.ts](data/categoryData.ts) | **Real Lyka.** 5 entries: the centre disc plus the 4 readiness stages. Each `title` carries its market share, e.g. `"Considering (15%)"`. Adds `marketShare`, `customerShare` and `movement`; the 7 legacy list fields render nowhere and are empty. |
| [data/journeyDetailsData.ts](data/journeyDetailsData.ts) | **Real Lyka.** 5 personas × 1 `MACRO_JOURNEY` × 5 Transtheoretical stages. Generated from the source deck by a cell-level table parse. Per-stage: `doingThinking`, `painPoints`, `influences`, `momentsToWin`, `emotionalScore`, `rationalScore`, `duration`, `definition`, and `coreQuestion` on Action only. Bullet fields are semicolon delimited; scores carry an en dash. **Not pure data:** imports React and five icon components. |
| [data/tenThingsData.ts](data/tenThingsData.ts) | **Real Lyka.** The ten findings: copy, published numbers tables, and the `chart` join key. No React. |
| [data/tenThingsSeries.ts](data/tenThingsSeries.ts) | **Real Lyka.** Every number a Ten Things chart plots. Separate from the copy on purpose; see below. |
| [data/brand.ts](data/brand.ts) | **The single source of truth for colour.** The `LYKA` palette, `SEGMENT_COLORS` + `getSegmentColor()`, `LayerKey` + `LAYER_COLORS`, `TEN_THINGS`, and the `CHART_*` chrome constants. No React, no DOM types, literal hex only. See "Brand and typography". |
| [data/__integrity.ts](data/__integrity.ts) | Dev-only assertions on the data joins `tsc` cannot see. Imported from `index.tsx` behind `import.meta.env.DEV`, so it is tree shaken out of production. |
| [data/apexData.ts](data/apexData.ts) | **Still Hamilton.** The APEX methodology (SPEED generic, carries over) plus two audience tables whose `heavyPct` / `rmIndex` are an affluent-traveller Roy Morgan pull. See the warning in the header. |
| [data/mediaPlanData.ts](data/mediaPlanData.ts) | **Still Hamilton.** The FY26 media plan. `MONTHS` (Nov→Oct), `PLAN_LAYERS` (Active Consideration / Research / Book), `ALL_ROWS`, `MONTHLY_TOTALS`, and the budget constants. Each `MediaRow` has `monthly` (12 values), `budget`, optional `detail` (role/strategyLink/comesToLife/metrics), `images`, `captions`, `imageWeights` (per-image flex-grow in the horizontal Examples row), `extraImages` + `extraCaptions` (a **second** Examples row, e.g. the Screens TV mock-ups), and layout flags `provisional`, `pairedImages`, `stackedImages`. Sourced from the briefing workbook's **visible** `Budget Distribution $3.5` + `Media Description` sheets. **BVOD, SVOD and YouTube are merged into one `Screens: BVOD, SVOD and YouTube` row** (summed spend, budget $1,655,000); `Special Format (LG & Samsung)` is renamed `Screens: LG and Samsung TV`. **Budget constants are `MEDIA_TOTAL = 4,850,000` + `PRODUCTION = 150,000` = `TOTAL_BUDGET = 5,000,000`**, matching the row-budget sum (includes the +$10k Research Social Mar/Apr add). |

### Persona schema

Every field is rendered. The Hamilton schema carried 8 fields that rendered nowhere (`quote`, `budget`, `prefs`, `goals`, `decisionCriteria`, `population`, `hnwtShare`, `solutionFit`); they were dropped or replaced with the source document's actual fields.

```ts
interface Persona {
  id: number;
  name: string;           // Persona name from the source doc, e.g. "Mindful Researchers"
  title: string;          // Short wheel label, abbreviated to fit the arc
  category: string;       // Readiness stage. MUST be a categoryData key.
  stageLabel: string;     // Stage heading as written in the source, e.g. "UNAWARE / UNCONVINCED"
  marketShare: string;    // Share of the dog-owner market, e.g. "15%"
  customerShare: string;  // Share of Lyka's customer base, e.g. "55%"
  solutionFit: string;    // Verbatim: "Very High" | "High Growth Potential" | "Medium" | "Low"
  fitRationale: string;   // The justification for that rating
  movement: string;       // The stated movement goal
  snapshot: string;       // First line of the source Snapshot, used as the pull-out
  description: string;    // The rest of the source Snapshot, joined
  barriers: string[];     // Source "Key Barriers", verbatim
  triggers: string[];     // Source "Key Triggers", verbatim
  motivations: string[];  // Source "Core Motivations", verbatim
  influences: string[];   // Source "Media Consumption", verbatim
  avatar: string;         // EMPTY by design
  videoUrl: string;       // EMPTY by design
}
```

`title` is the wheel label and is shortened from `name` to fit the arc. The two Unaware personas share a quadrant, so they get 45 degree wedges and their titles are abbreviated hardest (`Outsourcers`, `Sleepwalkers`). The full name is shown in the detail panel `<h2>`.

**`avatar` and `videoUrl` are empty on every record and should stay that way**, including now that the films exist. **The five Lyka persona vignettes landed 2026-08-04 and are joined by persona id in [data/personaMedia.ts](data/personaMedia.ts), not typed into this generated file.** A path written into a generated file survives exactly until the next regeneration, and its loss is silent: the slot simply reverts to its empty state. `videoUrl` stays a valid per record override and `personaVideo()` prefers it; nothing sets it. Filling either field with Hamilton Island's films would put another client's footage on a Lyka deck.

**Do not add fields the UI does not render.** That was the main waste in the Hamilton data.

### The five personas

```
Australian Dog Owners  (centre disc)
├── Unaware / Unconvinced (49%)   Disciplined Outsourcers (22%) | Secure Sleepwalkers (27%)
├── Curious (25%)                 Conflicted Troubleshooters
├── Considering (15%)             Mindful Researchers
└── Ready (11%)                   Devoted Caterers
```

Percentages are share of the dog-owner market. Each persona also carries its share of Lyka's current customer base (6 / 3 / 9 / 55 / 27), and the inversion between the two columns is the deck's central argument.

Unaware is the only stage with two personas, so its quadrant splits into two 45 degree wedges while the other three personas each get a full 90 degrees.

Source: the enriched audience personas document and the four Roy Morgan Single Source profile exports, both in `.../New Business/Lyka/Roy Morgan/`.

## Sunburst chart

[components/personas/PersonaCompositionChart.tsx](components/personas/PersonaCompositionChart.tsx) renders the wheel. Pure custom SVG, no chart library. ViewBox `-5 -5 340 340`, centre `(165, 165)`.

### Ring geometry: 3 concentric layers

The four readiness stages take one quadrant each, reading **clockwise from 12 o'clock** so the ladder runs in natural reading order. `polarToCartesian` applies `(angle - 90)`, so 0 degrees is 12 o'clock and angles increase clockwise.

| Layer | Inner r | Outer r | Wedges | Span | Contents |
|---|---|---|---|---|---|
| Centre disc (`centreDisc`) | 0 | 52 | 1 | 360° | Australian Dog Owners |
| Stage ring (`stage`) | 55 | 108 | 4 | 90° each | 0-90 Unaware, 90-180 Curious, 180-270 Considering, 270-360 Ready |
| Personas ring (`persona`) | 111 | 165 | 5 | 45° or 90° | Unaware splits into 2 wedges of 45°; the other three stages give one persona a full 90° |

**Arcs are equal, not proportional to market share.** The stages are 49 / 25 / 15 / 11 percent, so proportional arcs would squeeze Ready to 40 degrees. The share figures are shown as text on each wedge and in the panels instead, and the page header says so explicitly, because a viewer would otherwise reasonably read arc width as volume. If this is ever switched to proportional, derive the sweeps from `categoryData[key].marketShare` rather than hardcoding them.

The stage ring and the centre disc are hard-coded layout objects (`STAGE_LAYOUT`, `CENTRE_KEY`); only the persona ring is derived from the `categories` prop, grouped by `persona.category`.

### Click semantics

- Click the centre disc → `onSelectCategory('Australian Dog Owners')` → opens that panel.
- Click any stage wedge → `onSelectCategory(<stage key>)` → opens the Segment Deep Dive.
- Click a persona wedge → `onSelectPersona(persona)` → opens the persona panel.

The `selectedCategoryKey` emitted by the chart is the raw segment key (e.g. `"Considering"`), which matches `categoryData` keys directly. There is no prefix to strip.

**Fade rule:** selecting anything dims all wedges except the selection and its parent stage, so the path from market to persona stays readable. The centre disc never fades: it is the context for everything.

### Colour map

Segment colours come from `SEGMENT_COLORS` in **[data/brand.ts](data/brand.ts)**, the single source of truth. The chart imports it aliased so its call sites read unchanged:

```ts
import { getSegmentColor as getCategoryColor } from '../../data/brand';
```

Each ring wedge uses `base`/`hover`; persona children use the `lighter`/`lighterHover` of their parent wedge.

| Element | `base` | `lighter` (children) | base : white |
|---|---|---|---|
| Centre disc | `#003D33` deepest teal | `#0A6B5A` | 12.3:1 |
| Ring 1 right | `#005648` Lyka Dark Teal | `#0E9C82` | 8.5:1 |
| Ring 1 left | `#8C3D24` deep terracotta | `#B0553B` | 7.5:1 |
| Ring 2 right | `#0A7D68` Lyka accent ink | `#0E9C82` | 5.1:1 |
| Ring 2 left | `#B8571C` warm dark | `#D9761B` | 4.7:1 |

Two hue families (a teal spine and a terracotta spine) across four lightness bands, so the wheel reads as a funnel outward **even in greyscale**. Ring 1 and the centre disc have no persona children, so their `lighter` swatches are unrendered but populated for API symmetry.

**Floor: no wedge fill below 2.7:1 against white.** Every value above is dark enough to carry the white in-wedge labels on its own; the halo is an aid, not a rescue. The two warm bands are canonical Lyka Orange `#FF886B` and Tangerine `#F68B1F` darkened along their own hue axis, because the canonical values are 2.34:1 and 2.43:1 and cannot carry white text. [data/__integrity.ts](data/__integrity.ts) asserts this floor on every dev page load.

**`SegmentColorSet` also carries `tint`, `ink` and `tintInk`.** The sunburst
hardcodes `#FFFFFF` labels because every one of its fills is dark. The wide
persona views fill LIGHT for the market bar and DARK for the customer bar, which
also encodes the right thing: unrealised against realised. Text therefore lands on
light fills, so ink is a pair, exactly as `LAYER_COLORS.ink` already is on the
media plan. **Never put white on a `tint`.** Contrast is now checked PAIR BASED:
the 2.7:1 white floor still applies to `base` / `hover` / `lighter` /
`lighterHover`, and `ink` on `base` and `tintInk` on `tint` must clear 4.5:1.

The Consumer Journey tab strip **derives** from the same map via a `segmentKey` field on `journeyTopLevelDetails`, so a tab can never drift from its wedge. It used to hold a duplicated `accent` hex; that is gone.

**Wheel colours and media-plan layer colours never collide** because they occupy different lightness bands and never appear on the same page: segments own the dark band (3.2 to 12.3:1), media layers own the light band.

**All wheel labels carry a legibility halo.** `getTextStyle` (and the centre-disc label) apply `paint-order: stroke` with a `rgba(0,0,0,0.45)` outline behind the white fill, so labels stay readable on any wedge colour. Keep this when adding wedges.

### Centre disc label

`"Australian Dog Owners"` renders as **horizontal centred text** inside the disc using `<tspan>` lines and a vertical offset, not as an arc. `splitTitleWithCount()` wraps it to at most 3 lines. It currently carries no parenthetical share, so the helper falls straight through to `wrapText`.

### Stage labels: arc, with the share on its own line

The four stage labels render as a `<textPath>` along their wedge arc, via `splitTitleWithCount(title, 13, 2)` so the market share sits on its own line.

**That split is not cosmetic.** `"Unaware / Unconvinced (49%)"` is 27 characters and clips at both ends of a 90 degree arc on a single line. Splitting also makes all four labels visually consistent.

**Orientation is left to the default flip rule.** `STAGE_LAYOUT` sets `forceOrient: null` on all four, so the rule (`90 < normalizedMid < 300` gives CCW) applies: mid 45 CW, 135 CCW, 225 CCW, 315 CW. That is exactly right for quadrants, with the top two reading inward and the bottom two outward, every label the right way up.

**Do not force CW here.** Hamilton Island did, because its labelled rings split LEFT and RIGHT (0-180, 180-360) where one orientation serves both. On quadrants, forcing CW renders the two bottom labels upside down. This was the first thing that broke when the wheel was rebuilt, and it is only visible by rendering it.

### Persona labels: arc, with the wrap width derived from the wedge

Persona titles wrap to at most 2 lines via `wrapText(title, maxCharsForSweep(sweep), 2)`. `describeLabelArc()` computes the arc path and `getOrderedLabelRadii()` decides which radius each line gets. Both accept `forceOrientation: 'CW' | 'CCW' | null`.

**The wrap width derives from the wedge's angular sweep rather than being hardcoded.** Hamilton could hardcode 10 characters because every persona wedge was 45 degrees. Lyka's are 45 or 90 depending on how many personas share a stage, so a fixed limit either overflows the narrow wedges or wastes the wide ones. `maxCharsForSweep` is roughly 0.24 characters per degree, floored at Hamilton's proven 10 and capped at 18.

There are currently **no per-persona orientation overrides**. The override site is retained in `PersonaCompositionChart.tsx` with a comment, because whether one is needed depends entirely on where a wedge's midAngle falls.

**If you change a persona `title`, or change how many personas a stage carries, check the wheel.** Both move the mid angles, and a label near the 90 or 270 degree flip boundary can end up reading the wrong way. Fix it with a per-persona override at that site; do not change the global flip rule.

Hamilton tried external labels with leader lines (commit `c1239e4`) and reverted (`0aa5722`). The preference is in-wedge labels with per-persona orientation patches.

## Persona detail panel

[components/personas/PersonaDetail.tsx](components/personas/PersonaDetail.tsx) renders the detail overlay when a persona is clicked. Two columns at the `xl:` breakpoint, unless the host passes `stacked`.

**Left: the persona media slot (`PersonaMediaSlot`). ALWAYS a 9:16 frame, whatever is in it.** Hamilton had a persona film here. This used to be an either/or, a video frame *or* a content-height identity card, and because `avatar` and `videoUrl` are empty on every record by design the frame never rendered at all, so the deck had no reserved place for persona film. The frame is now permanent and the identity content is its **empty state**: a dashed well with a play glyph, "Persona film", "9:16 vignette. Awaiting Lyka footage.", then the stage label, persona name and fit chip, with the two share figures across the foot.

**The film arrived on 2026-08-04 and nothing moved, which was the point.** Five Veo vignettes, one per persona, 1080x1920 h264, 8 seconds, 24fps: native 9:16, exactly the frame. All five personas now resolve a film through `personaVideo()`, so the empty state no longer renders for any current record. **Keep it anyway.** It is what a sixth persona gets, and building it before there was anything to put in it is why this slot was designed once rather than twice.

**The `transform: scale(1.08)` is gone, and that was a real decision, not tidying.** Hamilton Island's vignettes had baked in black side bars and the scale cropped them. `ffmpeg cropdetect` on all five Lyka films reports `crop=1080:1888:0:16`: full width content, no pillarboxing, just 16px of dark image top and bottom out of 1920. Leaving the scale in place would have thrown away roughly 4% of every edge of correctly framed portrait footage, which on a portrait shot is the top of the head. **If a future film does arrive pillarboxed, crop the file, not the container**, or the fix silently damages the other four.

**The empty state has to look like a reserved film slot, not a nice card.** The first attempt kept the monogram card and simply gave it a 9:16 ratio. That was a real container, but it read as a coloured persona card and the first question asked of it was "where is the video container?" A reserved space that does not announce itself is not reserved.

Populating `videoUrl` swaps the well for the film and nothing else on the page moves; `avatar` is handled the same way. Verified by temporarily wiring a real MP4 into all five records, then reverting. **Do not put Hamilton Island footage in it:** `public/personaVideos/` held 20 of their films and was deleted during the conversion.

**Right: the source document, section for section.** The snapshot pull-out, the rest of the snapshot, then Key Barriers, Key Triggers, Core Motivations, Media Consumption and Lyka Natural Fit. **The section headings match the source document's headings exactly**, so the deck and the research read as one artefact. Do not rename them to something more app-like.

The `<h2>` shows `persona.name`. The subtitle shows the stage label and both share figures, because that pairing is the point of the model.

Fit ratings drive the chip colour via `FIT_STYLES`. The four ratings are verbatim from the source (`Very High`, `High Growth Potential`, `Medium`, `Low`); an unrecognised rating falls back to mint rather than crashing.

## Segment detail panel

[components/personas/CategoryDetail.tsx](components/personas/CategoryDetail.tsx) renders the "Segment Deep Dive" panel when the centre disc or any stage wedge is clicked.

Structure: a **stage band coloured to match its wedge on the wheel** (so the panel and the chart are visibly the same object), the movement goal, then the two share figures side by side, then the snapshot and description.

**It also carries "Personas in this stage", and that is navigation, not decoration.** The wide views open their panel as a FULL OVERLAY, so the chart behind it is covered and cannot be clicked. A stage band is the biggest target in the Ladder and the largest circle in the Flow, so it is what gets clicked first, and without this row the only way on to a persona was to close the panel and hunt for a small chip. The reasonable conclusion from that dead end was "the new views have no persona detail". The row sits **above** the snapshot prose: it was first placed under the description, which put it below the fold of this scrolling pane, so it may as well not have existed.

`SEGMENT_IMAGES` was deliberately empty until **2026-08-04**, when four Lyka emblems landed, one per readiness stage. They render centred above the Snapshot label, which is **Hamilton Island's own placement** for the same asset, and they work unmodified for the same reason Hamilton's do: **the card behind them is white.** All four are 1024x1024 black line art on a WHITE background with no alpha, so on any other surface they would show as a white square. That constrains where else they can go without processing.

Keys must equal `categoryData[k].title` **byte for byte, parenthetical share included**, or the image silently never renders. That is why `(49%)` is in the key.

**The centre disc has no emblem, on purpose.** Four were supplied, one per stage; "Australian Dog Owners" is the whole market rather than a stage, so it would need either a stage's art reused, which would say something false, or art nobody briefed.

**All three views get this for free**, because the wheel, the ladder and the flow all open the same `CategoryDetail`. Verified from each of them, for all four stages.

`data/__integrity.ts` now checks the join **in both directions**, which it could not before: while the map was empty the reverse check would have warned on all five segments every load and trained people to ignore the output. With four stages carrying art, a stage without one is a signal, most likely a rename that broke a byte for byte key. The centre disc is exempted by name.

`data/__integrity.ts` asserts that join in one direction only: every declared `SEGMENT_IMAGES` key must match a real title. It does not warn about titles lacking an emblem, because with the map empty that would fire on all five segments every page load and train people to ignore the output.

## Consumer Journey page

[pages/CustomerJourney.tsx](pages/CustomerJourney.tsx) hosts:

- A mono eyebrow carrying the readiness stage and **both share figures**, then the persona name as `<h1>`.
- The **behaviour-change task** in that stage's colour: the one sentence that defines the journey.
- The **journey dynamic** prose beneath it.
- A tab strip of the **five personas**, ordered up the readiness ladder (Unaware to Ready) via `TAB_ORDER`. That is the reverse of the source deck's persona numbering, and it deliberately matches the sunburst's clockwise reading order so both pages tell the story the same way round.
- The [JourneyDetailTable](components/journey/JourneyDetailTable.tsx): a 6-column table (label column + 5 stages) with rows for `doingThinking`, `painPoints`, `influences`, `momentsToWin`, then a graph row, then `duration`.
- A source note stating that the scores are the study's own ratings, not derived.

**Journeys are per PERSONA, not per readiness stage**, because that is how the source models it. `JourneyType` therefore has five persona members and the tab strip is a persona selector.

**`journeyTopLevelDetails` no longer exists.** It was a hardcoded literal inside
the page component that hand-duplicated `marketShare`, `customerShare` and
`segmentKey` from `personasData` (`"22%"` / `"6%"` lived in both files with
nothing keeping them in sync). It is now [data/journeyMeta.ts](data/journeyMeta.ts)
and carries **one join, `personaId`**. Stage, colour and both share figures are
derived from that persona and never restated, so a journey can no longer disagree
with its own persona. The old `JOURNEY_SEGMENT_KEYS` mirror in `__integrity.ts` is
gone with it; the check is now that every `personaId` resolves.

**`renderStandardList` in the table splits on SEMICOLONS.** Author the bullet fields semicolon delimited or the whole cell renders as one long bullet. Hamilton's data used full stops only, which is exactly what all 120 of its cells did.

### The journey score graph

[components/journey/JourneyScoreGraph.tsx](components/journey/JourneyScoreGraph.tsx) is the interactive graph inside the journey table:

- Two smooth **Catmull-Rom curves**, Emotional (`#B8571C` warm) and Rational (`#0A7D68` teal), with gradient fills underneath. Those two hexes match the wheel's Ring 2 colours, so the graph reads as part of the same system.
- Hover any dot: it grows 4px to 7px and a tooltip appears with stage name, value and label.
- Hover a stage column: a dashed vertical guide appears and the stage label below bolds.
- Stage labels (Precontemplation / Contemplation / Preparation / Action / Maintenance) render below the x-axis.

**The parsers moved to [data/journeyModel.ts](data/journeyModel.ts).** Behaviour is
unchanged character for character, but more than one view needs the numbers now
and a parser inside a component is a duplication waiting to happen.

**Four optional, additive props.** Called with only `stages` the graph renders
exactly what it always did, which matters because the table is the baseline.
- `domain` fixes the y-axis. Pass `SHARED_SCORE_DOMAIN` (0 to 100) whenever more
  than one journey is on screen; the default auto domain rescales per journey and
  makes a peak of 65 look like a peak of 95.
- `columnWidth` (default 160) is the **aspect ratio control** and matters more
  than it looks. The SVG scales to its container width, so at the default a
  small-multiple card 230px wide renders the curve about 40px tall. Use ~44 for
  small multiples and ~300 for a wide single-row strip.
- `showStageLabels` off for small multiples: five cards times five stages is 25
  redundant labels that do not fit a narrow column.
- `activeStageIndex` + `onSelectStage` keep an external stepper and the curve in
  sync. Internal hover still wins, so the chart always responds to the pointer.

**Score strings are regex parsed and the format is load bearing.** `parseScoreData` matches `/(\d+)\s*[-–—]\s*(.*)/`:

- It accepts a hyphen, en dash or em dash but **not a colon**. A score written `Emotional 82: worry` parses the number and silently loses the label, so every tooltip on that curve loses its descriptor.
- With **no separator at all** it falls back to stripping non-digits, which concatenates every number in the string: `Emotional 82 worry at 3am` yields 823. The y domain clamps at 100, but the point plots far outside the viewBox and the curve visibly clips.
- Never lead a score string with a non-score number: the parser takes the first digit run.

A rarer `"55 > 70"` range syntax is also handled. The Lyka data does not use it.

The curve recomputes from these strings, so replacing stages or scores needs no code change.

## Ten Things The Data Says page

[pages/TenThings.tsx](pages/TenThings.tsx). Ported **2026-08-03** from `Lyka - Ten Things The Data Says.html`, one folder up, which is the source of truth for every string. Real Lyka: the acquisition file to 29 Jun 2026, the postcode file of 304,729 customers, the Mutinex GrowthOS MMM, ABS Census 2021 and Experian Mosaic.

A **one viewport 5 x 2 grid** of finding tiles, like Personas and Consumer Journey rather than the scrolling APEX page. Ten findings on one screen is the point of the page: you see the whole argument before opening any of it. Clicking a tile opens the shared Modal with the chart, the published numbers, an implication and a test, and a stepper walks all ten.

### The nine rebuilt charts

The source shipped **ten matplotlib PNGs in a green and gold palette**, 3.1MB of inline base64. Nine were rebuilt as Chart.js components in `components/tenthings/charts/`; the tenth, a five capital choropleth, stayed a PNG. Asset payload went 3.1MB to about 1.65MB of real files.

**Four of the nine were changed, not transcribed**, and three of those are corrections rather than styling:

- **10 `LapsedPool` is a correctness fix.** The source OVERLAID lapsed and active, which are DISJOINT groups, so at decile 1 it read as "689 of 1,810 are active" when the truth is 689 of 2,499. That misstatement ran across all ten columns. Stacked now, so a column is everyone who ever tried. Anyone comparing against the original PNG will see different bars: this is why.
- **09 `BrandedSearchGap` had a unit error.** The source plotted 10.5 (a percentage) and 100 (an index) on one axis captioned "index / %". Branded share was pinned to the floor and read as roughly zero, which is not what 10.5% means. Two axes now.
- **06 `SeasonalIndex` truncated its y axis at 70** to make a 39 point swing visible. It is an index with a defined baseline, so the bars anchor at `base: 100` instead. Bar length is the deviation from an average month, which is the meaningful quantity, and the truncation dissolves.
- **08 `MmmConfidence` is not a chart at all.** Three bars whose heights encode nothing, a y label reading "confidence in the claim", values that are words. Three HTML rows instead: selectable, reflows, no `aria-label` reciting the whole thing.

07 `TopRegionsRav` and 04 `RetentionCuts` were also reframed (a deviation chart from 1.00, and one chart instead of two truncated subplots), and 03 `FlatSharePenetration` **adds** the average income decile column that was already in the source's own published table, because the headline claims the driver is the postcode and a penetration only chart cannot show that.

### Three honesty items that must survive any edit

1. **Point 07's stat does not match its own chart.** The card says `1.60x`; the chart, the numbers table and the map legend all cap at `1.34x`. It may be a postcode level maximum against an SA4 maximum, or the value the map's 95th percentile clip removes, or stale. **Nobody picked one.** The `discrepancy` field on the record renders visibly under the chart. Points 02 and 04 carry smaller versions of the same thing. Never reconcile these by editing a number.
2. **The map ramp is off brand and stays off brand.** A PNG choropleth cannot be recoloured, and regenerating needs the original notebook and the ABS boundary data, neither of which is in this project folder. A visible caption says so. If the notebook ever surfaces, the Lyka palette already holds the right diverging pair: tangerine `#F68B1F` through cream to teal `#0A7D68`.
3. **Two source charts had errors** (points 09 and 10, above). Both are documented in the component headers, not just here.

### Why the copy and the numbers are two files

`tenThingsData.ts` holds the PUBLISHED table: pre formatted strings like `"49.3%"` and one empty cell where the source reports no figure. `tenThingsSeries.ts` holds the numbers a chart plots. Reading a series back out of the display strings means parsing `"49.3%"` into `49.3`, which is the exact anti pattern `audienceModel.ts` is quarantined for. `__integrity.ts` asserts the two agree, plus the three totals point 10's copy states out loud (101,091 active, 203,221 lapsed, 109,545 in deciles 8 to 10).

`emphasis` is a list of substrings to bold, so the data file carries no markup and nothing needs `dangerouslySetInnerHTML`. A typo silently no-ops, so that join is asserted too.

### `TEN_THINGS` in brand.ts is a THIRD colour band

`SEGMENT_COLORS` owns the dark range (the wheel) and `LAYER_COLORS` the light (the media plan). A third page gets its own band rather than borrowing either and inheriting a meaning it does not have.

**Every ratio is stated against the CREAM MAT `#FFFBED`, not white**, because that is what these fills sit on. The rule that matters: **3:1 against the mat is the floor for a STROKE.** `LYKA.accent` is 2.62:1 and `LYKA.tangerine` is 2.35:1, so both are **FILL ONLY**. The instinct to draw point 09's branded share line in `LYKA.accent` would produce a hairline that vanishes. `TEN_THINGS_STROKE_TOKENS` names the four that are safe and `__integrity.ts` asserts the floor, so a future edit cannot quietly promote a fill.

### Two Chart.js traps that pass `npm run typecheck`

Both are why `components/tenthings/charts/chartBase.ts` exists.

1. **react-chartjs-2's typed exports register the CONTROLLER ONLY.** `Bar` is `createTypedChart('bar', BarController)`. Points 02 and 03 carry a `type: 'line'` dataset, which throws `"line" is not a registered controller` at runtime and typechecks perfectly cleanly. Those two use the generic `<Chart type="bar">`, and `chartBase` registers `LineController` and `PointElement` once for all of them.
2. **`setOptions` is `Object.assign(chart.options, next)`, top level only.** A chart writing `plugins: { legend: {...} }` instead of `plugins: { ...BASE_PLUGINS, legend: {...} }` silently drops the whole tooltip theme. `BASE_OPTIONS` and `BASE_PLUGINS` are separate exports so the spread is visible at every call site.

A third, related: **react-chartjs-2 reads the `plugins` prop ONCE**, inside `renderChart()`, with no effect watching it. A plugin closing over React state is stale forever. Every plugin in `chartPlugins.ts` is built at module scope and reads from `chart.data` / `chart.scales` / `chart.getDatasetMeta()`.

**`chartBase.ts` mutates `ChartJS.defaults` on import**, which also restyles the three media plan charts. That is the intended outcome (it retires the duplicated `// Chart.js defaults legend text to #666` workaround) but it is import order dependent, so re-open the Budget header, the % header and any gantt bar after touching it.

### A benchmark caption belongs in the layout gutter, not at the plot edge

`benchmarkRule` used to pin its caption to the corner of the plot area: top right for a vertical rule, above the line at the right for a horizontal one. **The corner of a plot area is not empty space, it is the extreme of the data**, so on all three charts that use it the caption landed on the very bar it was meant to contextualise, and on that bar's value label.

- **07** put `national average 1.00` under the longest bar in the chart and across its `1.34x`.
- **01** did the same to Marketing's `1.15`.
- **06** was the clearest: Nov is exactly 100, so its bar has no height and its label sits ON the rule at the second last column. The page read `100average month = 100`.

The caption is drawn OUTSIDE the plot area now, anchored to the rule it names, which also fixes a second thing: at the far right it was nowhere near the line at 1.00 and did not read as its label at all.

- **Vertical rule:** into `layout.padding.top`, left aligned just right of the rule, flipping to its left when the label would overrun (point 01's rule sits at 71% of a narrow half width panel) and clamped so it cannot leave the canvas.
- **Horizontal rule:** into `layout.padding.right`, past the end of the line and vertically centred on it.

**The caller has to ask for the room.** `TopRegionsRav` sets `padding.top` 22 and `SeasonalIndex` sets `padding.right` 124 for exactly this. The plugin measures the gutter and falls back to the old inline placement when there is none, so a chart that has not asked still renders, it just renders the collision back.

### Layout rules for the tile, and they are content rules

A tile is about **171 x 277 at 1280, 203 x 295 at 1440 and 272 x 355 at 1920**, with the sidebar expanded. Four things keep ten tiles reading as one grid:

- **`cardHeadline` is a separate field from `headline`**, short for the tile, full for the modal h2. Same split as `Persona.title` against `Persona.name`. When a headline does not fit, shorten the copy; never drop below the 14px prose floor.
- **The headline is `flex-1` AND `items-center`.** Taking the slack is what lands the hairline level across a row; centring in that slack is what stops the leftover reading as a hole. Same fix and same reason as the market band heading in `ReadinessLadder`.
- **`statLabel` has a three line `min-h-[4.05em]` and `statValue` must fit ONE line.** The headline taking the slack only levels the top half: the block BELOW the rule also varies, and a taller label or a wrapped value lifts its rule out of line. Two labels and one value were shortened at 1280 for exactly this. `"About 12 months"` became `"~12 months"`, keeping the approximation the source had.

- **THE GRID IS CAPPED AND CENTRED, and the type STEPS WITH THE TILE.** Added 2026-08-04, and it is the fix for the page reading empty. See below.

Verified across twelve viewport shapes from 1920x1080 to 1280x720: rule spread at most 1px in both rows, **zero clipped tiles**, page overflow 0, nothing under 11px, and the only sub 14px prose is the 12px sources line, which `type.ts` sanctions as a footnote.

### Reducing the whitespace, 2026-08-04, and why type alone could not do it

The tiles read as mostly empty. Measured before touching anything, the slack in the headline box was **211 to 236px of a 429px tile at 1920** (55% of every card), 98 to 147px of 339px at 1440, and 10 to 59px at 1280. **One number would have been a font size problem. Three make it a layout problem**, and the fix is three coordinated changes.

1. **The grid was `h-full` with no ceiling**, so tiles absorbed every spare pixel of the viewport. A bigger tile is also a WIDER tile, which needs FEWER lines, so growing the viewport made cards emptier no matter what the type did. It now caps at `600x1180` (`720x1400` from 1536 up) and centres with `m-auto`. **Whitespace inside a card reads as a mistake; the same whitespace around a centred grid reads as margin.**
2. **The type steps with the tile**, headline `body` to `lead` to `title` to `figure`.
3. **A four line stat label was breaking a row.** Point 09's `acquisitions,` is a 13 character unbreakable token that took a fourth line in a 147px column at 1280, pushing its stat block 81px to 96px and its hairline **15px out of line**. Shortened to `signups`, this page's own word for the same event. The documented rule held: shorten the label, never raise the min height.

**`roomy:` (1400px) is a custom breakpoint and it exists because the stock scale is backwards here.** The sidebar takes 320px, so a **1280 viewport is the TIGHTEST layout this grid ever sees**, and Tailwind's `xl:` fires at exactly 1280. Stepping the type at `xl:` would have enlarged it precisely where there is no room. There is no stock step meaning "1440 and up".

**Three things this pass got wrong first, all found by measuring:**

- **The headline and the stat value cannot step at the same breakpoint.** The headline wraps, so it can grow as soon as there is height. The stat value cannot, so it can only grow once the tile is at its widest. Stepping it at `roomy:` broke a row: `Aggregate only` is the one non numeric value here and at 24px in a 203px tile it took a second line, moving that hairline 24px. It steps at `2xl:`, where the cap pins the tile at 228px.
- **Raising the type without raising the `min-h` floor introduced a clip** at 1440x700: the tallest card needed 268px and got 255. The floor is what makes a short viewport scroll instead of clip, so it steps with the type. They are one system.
- **1280x720 was already clipping before any of this**, tiles 01 and 06 by 11px, because the old 520px floor was below the content's own height. Raised to 556.

**Do not tune one of these in isolation.** The tile sizes quoted above, the `min-h` floors, the `max-h` caps and the card's breakpoints are a single system, and every one of the three regressions above came from moving one and not the others.

## Interactive Media Plan page

[pages/InteractiveMediaPlan.tsx](pages/InteractiveMediaPlan.tsx) is the FY26 macro block plan, modelled on the **Carnival FY26 Interactive Media Plan** (a vanilla HTML/JS + Chart.js reference at `1. Clients/Carnival/Interactive Media Plan/FY 26`). It is data-driven from [data/mediaPlanData.ts](data/mediaPlanData.ts) and holds a single modal state (`budget` | `pct` | `channel`) reusing [components/shared/Modal.tsx](components/shared/Modal.tsx). Components live in [components/mediaplan/](components/mediaplan/):

- **[MacroBlockPlan.tsx](components/mediaplan/MacroBlockPlan.tsx)** — the grid. A funnel rail (Active Consideration → teal, Research → gold, Book → coral), a Media column, 12 month columns (Nov→Oct), then Budget + %. Each channel row renders contiguous-spend **gantt bars** (clickable → channel pop-up). The gold **Budget** and **%** headers are buttons (with a hover underline-sweep animation) that open the stacked chart and the pie. Months order is **Nov→Oct** (the briefing's fiscal year).
- **[BudgetBreakdownChart.tsx](components/mediaplan/BudgetBreakdownChart.tsx)** — opened from the Budget header. A **stacked-by-media** monthly bar (one dataset per channel, layer-shaded), with column totals drawn by an inline `columnTotals` plugin (no datalabels package). This is the differentiator vs CCL's single-series totals.
- **[BudgetPieChart.tsx](components/mediaplan/BudgetPieChart.tsx)** — opened from the % header. Budget allocation by channel, layer-shaded; slices pop out on hover (`hoverOffset`), % drawn inside via an inline `sliceLabels` plugin.
- **[ChannelDetail.tsx](components/mediaplan/ChannelDetail.tsx)** — the gantt-bar pop-up. Stacked top to bottom: themed strip (layer + budget + % of media) → rationale + dark-label execution table (Strategy / Activation / Assets / Key metrics) → an **Examples** creative gallery → full-width **flighting area line chart** with per-point `$` labels (inline `pointLabels` plugin). **No average-spend line** (removed). The gallery uses a `CreativeCard` sub-component: a framed card on a `#f7f5f1` mat with an optional caption footer, a hover lift + layer-coloured underline sweep + a magnify badge, and click-to-enlarge. Clicking opens a **lightbox portalled to `document.body`** (so it escapes the modal's transformed/`overflow-hidden` box) showing the image large on a **white** background.

Creative layout is per-row via flags on `MediaRow`:
- **default** = a horizontal row of `CreativeCard`s, all shown at once (no thumbnail click-in). `items-stretch` + a uniform image-box height + a flex caption footer keep every card the same height regardless of caption length; `imageWeights` set each card's relative width (e.g. Screens `[1, 1, 1.4, 2.2]`). `captions` label each card.
- `extraImages` + `extraCaptions` = an optional **second** horizontal row below the main one (used by Screens for the `tv3.png` / `tv2.png` "THE UNLISTED" TV mock-ups, titled "BVOD: Water + Chef" / "SVOD / YouTube: Beach Walk").
- `pairedImages` = two ads side by side with the caption above each (Social, Research Social).
- `stackedImages` = images stacked vertically full-width (Book social); add `stackedFirstSmall` to render only the first image small (Property Platforms logo lockup above the realestate.com.au listing).

The **"Examples" header** (small accent tick + "tap to enlarge") sits above the gallery, per the client's "add the word Examples" request.

Chart.js colours must be hex/rgb (canvas can't read the CSS-var brand tokens), so the layer hexes are duplicated in the chart components.

**`provisional` flag:** renders a **PENDING** pill on the channel name + a "finalised" note in the pop-up. Currently not set on any row (removed once performance copy/numbers were confirmed); set it back to `true` on a row to flag it again.

**Source of truth:** the briefing workbook (the user's `Downloads/Interactive Media Plan Briefing Template for Hamilton Island.xlsx`). Only **visible** sheets/columns were used (`Budget Distribution $3.5` for numbers, `Media Description` for copy); hidden sheets (`Layer Description`, `Media Plan Overview`, `Budget Distribution`, `Peak Moments`) and hidden channel-tab columns were excluded per client direction. Client-supplied formatted creative lives in `public/images/`. Current per-channel set: Screens = `svod.png` (Disney/Stan/Netflix/Prime) + `bvod.png` (7+/10play/9Now/Kayo/SBS) + `youtube-logo.png` + `youtube.png` (ad-examples mock) + second row `tv3.png` + `tv2.png`; LG/Samsung = separate `lg.png` + `samsung.png` (side by side); Digital News & Print = individual mastheads `print-age.png` / `print-smh.png` / `print-couriermail.png` / `print-afr.png` (white backgrounds stripped to transparent via a PIL near-white→alpha pass); Cinema = `doomsday/dune/jumanji.jpg`; Property = `property.png` + `property-listing.png`; Social pairs = `ac-social1/2.png`, `r-social1/2.png`, `book-social1/2.png`. **Superseded / now-unused:** `lg&samsung.png` (combined), `print.png` (combined), `Screens.png` (old BVOD collage), `tv1.png`, `social.png` — safe to delete. The original `public/media-plan/` channel-tab extracts also remain but are mostly superseded. **Note: the Downloads workbook frequently lags the user's live Excel edits (it stays open with a `~$` lock file); if an extract returns byte-identical images, the file hasn't saved/synced yet — ask the user to close Excel or hand over the images directly.**

## Brand and typography

**Palette source of truth.** Lyka's brand is correctly implemented in exactly one place in this workspace: `RFI - Lyka/lyka-rfi/styles/globals.css`. That is where this app's palette came from.

> **Do not use `Showcase Accelerator - Lyka` as a colour reference.** Despite the name, it was never actually re-themed. Its hero overlay is still SPEED red `rgba(237,28,36,0.65)`, its Tailwind config only declares `brand.red #ed1c24`, and exactly two Lyka values exist in its entire source (a teal menu overlay and one teal icon hover). Its own `design-review.md` enforces a red-only palette and would flag Lyka teal as a violation.

### Two colour layers, and which to use

1. **[data/brand.ts](data/brand.ts)** is the single source of truth. Import from here in TS/TSX.
2. **`index.html` `:root`** mirrors it as `--lyka-*` custom properties, for inline `style={{ }}` (Tailwind CDN cannot reach custom properties as utilities).

`brand.ts` has two hard constraints, both load bearing:

- **No React and no DOM types.** [worker/index.ts](worker/index.ts) imports `LYKA` to build the login page, and `worker/tsconfig.json` runs with `lib: ["ES2022"]`, no DOM lib and no `@types/node`. A React import there breaks `npm run typecheck`.
- **Literal hex only, never `var(--token)`.** Chart.js draws to a canvas and cannot resolve custom properties.

It exports `LYKA` (the palette), `SEGMENT_COLORS` + `getSegmentColor()` (the wheel and journey tabs), `LayerKey` + `LAYER_COLORS` (the media plan), and the `CHART_*` chrome constants.

**This killed three duplications** that existed in the Hamilton build: segment colours in 2 places, media-plan layer colours in 4, and a third `:root` block inside the Worker. If you are about to paste a hex, you are probably about to reintroduce one.

**`LayerKey` is declared in `brand.ts`, not `mediaPlanData.ts`.** `mediaPlanData` re-exports it (`export type { LayerKey }`, required because `isolatedModules` is on) so its two existing importers keep working. Declaring it the other way round creates a circular import.

**`LAYER_COLORS[key].ink` is not decoration.** White on Lyka Tangerine is 2.43:1 and on Lyka Orange is 2.34:1, so any text drawn on a layer colour must use `ink`, never a hardcoded `text-white`. The funnel rail in [components/mediaplan/MacroBlockPlan.tsx](components/mediaplan/MacroBlockPlan.tsx) is the main consumer.

### Typography

**[data/type.ts](data/type.ts) is the single source of truth for SIZE**, exactly as
`brand.ts` is for colour, and it carries the same two constraints: no React or DOM
types, literal numbers only. Eight steps (`micro` 11 through `display` 30),
mirrored as `theme.extend.fontSize` in `index.html`. **If you are about to write
`text-[9.5px]`, use a token instead.** The reading floor is `body` 14; `micro` 11
is the only step below 12 and is reserved for uppercase mono eyebrows. For text
inside a scaled SVG use `svgFont()` with `useElementSize`, because a declared
`fontSize` attribute is not a rendered size. Full rationale in the type legibility
pass notes near the end of this file.

- **Poppins** for headlines / display (`.font-display` or any `<h*>`), **DM Sans** for body, **DM Mono** for eyebrows, labels and metadata (uppercase, `TRACKING.eyebrow` 0.08em, `micro` to `label`). All from Google Fonts in `index.html`.
- Poppins **replaced Bebas Neue** in the Lyka conversion, matching the Lyka RFI. Lyka's real corporate faces are Balgin and Lore by TYPEHEIST; neither is licensed, and Poppins is the agreed warm, rounded proxy.
- Poppins renders roughly **1.4 to 1.8 times wider** than Bebas at the same size. Every `.font-display` heading had `tracking-wide` dropped (it was compensating for Bebas's tightness) and most stepped down one size. Global `letter-spacing: -0.015em` on headings.
- **If you add a display heading, do not add `tracking-wide`.** And check it at 1280px as well as 1440px.
- The funnel rail label in `MacroBlockPlan` runs vertically inside a fixed 44px `RAIL_W`, so its available length is the rail **height**, which depends on row count. `nameSize` derives from `layer.rows.length` rather than a hardcoded layer name, so it survives a rename.
- **Fastest check that the font swap is live: do the headings have lowercase letters?** Bebas has no true lowercase.

### Logos

- The top-right client mark on every page is [public/images/lyka-logo.png](public/images/lyka-logo.png), a solid dark teal (approximately `#005A48`) transparent wordmark with a leaf motif, roughly 1.7:1. On the `#FFFBED` page it is about 8.5:1, so it needs **no filter**. It renders at `h-7 md:h-10`, smaller than the Hamilton logotype it replaced, because it is far wider at equal height and would collide with the page `h1`.
- Only one Lyka mark per page. Do not add a second to the sidebar.
- **The favicon stays SPEED, not Lyka.** `public/icons/tab_icon.png` is byte-identical across the Lyka RFI, the Lyka Showcase and the Hamilton Island decks, so it is the SPEED house tab icon rather than a client asset. It was briefly swapped for a Lyka wordmark during the shell pass, which was wrong on two counts: it discarded a shared SPEED asset, and the wordmark is 1.7:1 and illegible at 16px. Restored. Note the original markup declared `type="image/svg+xml"` on a `.png`; that is corrected.
- **The sidebar stays BLACK, not Lyka teal.** It is SPEED accelerator house chrome, and the client mark already sits top right on every page. Black also keeps the white `drop-shadow` glow on the SPEED Accelerator logo working as designed, since it was tuned against black.
- The **sidebar SPEED Accelerator logo** ([public/icons/accelerator_logo.png](public/icons/accelerator_logo.png)) renders at `w-44` in an `h-24` header with that inline glow. (An ACCELERATOR-only baked-in glow variant was trialled and reverted.)
- The active nav pill is `#0A7D68` (`--lyka-accent-ink`): 5.1:1 for its white label and clearly separated from black. **Do not use `#10B193` here**, which is only 2.7:1 for the label.
- **SPEED red `#E8151B` is reserved for the SPEED wordmark and the APEX logo.** It is not a UI colour here. Focus rings that used `ring-red-500` were moved to `#0A7D68`.

### Shape and motion

Lyka uses **mint hairline borders where other brands use shadows**, teal tinted shadows rather than black (`--lyka-shadow`), pill radii on tab buttons, and **one easing curve for everything**: `cubic-bezier(0.4, 0, 0.2, 1)`, applied globally via `--lyka-ease` in a `*` rule so the app's scattered `ease-in-out` utilities are overridden without touching them.

## File layout

```
lyka-accelerator/
├── App.tsx                       Router-less switch on Page enum. Lyka wordmark top-right.
├── index.html                    Tailwind CDN + inline lyka-* config, Google Fonts, :root tokens
├── index.tsx                     React entry. Loads data/__integrity.ts in DEV only.
├── metadata.json                 "Lyka | SPEED Standard Accelerator"
├── netlify.toml                  publish=dist, command=npm run build, SPA redirect
├── wrangler.jsonc                Worker speed-x-lyka-accelerator, run_worker_first: true
├── types.ts                      Page, JourneyType, JourneySubCategoryKey enums
├── vite.config.ts
├── worker/index.ts               Shared-password gate. Imports LYKA from data/brand.ts.
├── data/
│   ├── brand.ts                  SINGLE SOURCE OF TRUTH for colour. Start here.
│   ├── type.ts                   SINGLE SOURCE OF TRUTH for type size. 8 steps + svgFont().
│   ├── __integrity.ts            Dev-only assertions on the silent joins + palette pairs
│   ├── personasData.ts           5 Lyka personas. GENERATED from the research doc.
│   ├── personaMedia.ts           The 5 films, joined by id. OUTSIDE the generated file.
│   ├── categoryData.ts           Centre + 4 readiness stages. Real Lyka.
│   ├── audienceModel.ts          DERIVED. The only place a "22%" string is parsed.
│   ├── journeyDetailsData.ts     5 persona journeys × 5 stages. GENERATED. Real Lyka.
│   ├── journeyMeta.ts            Per-journey copy. One join: personaId.
│   ├── journeyModel.ts           DERIVED journey metrics + the score-string parsers.
│   ├── tenThingsData.ts          10 findings: copy, tables, chart join key. Real Lyka.
│   ├── tenThingsSeries.ts        Every number a Ten Things chart plots. Real Lyka.
│   ├── mediaPlanData.ts          FY26 media plan. Re-exports LayerKey.           [Hamilton content]
│   └── apexData.ts               APEX methodology + 2 audience tables            [Hamilton content]
├── hooks/
│   ├── useVariant.ts             Variant state: ?pv= / ?jv= then localStorage. Scaffolding.
│   └── useElementSize.ts         ResizeObserver. Feeds svgFont(), and the flow viewBox aspect.
├── pages/
│   ├── Personas.tsx              Sunburst landing (default)
│   ├── CustomerJourney.tsx       Segment journey selector + table. Tabs derive from segmentKey.
│   ├── BusinessDashboard.tsx     Designed empty state. Power BI iframe REMOVED (see header).
│   ├── TenThings.tsx             One viewport 5 x 2 finding grid + stepper modal. Real Lyka.
│   ├── InteractiveMediaPlan.tsx  Macro block plan. WIRED BUT NOT SHOWN (?show=all).
│   ├── ApexBySpeed.tsx           Channel scorecard. WIRED BUT NOT SHOWN (?show=all).
│   └── PendingSections.tsx       What opens instead: MediaPlanPending + ApexPending.
├── components/
│   ├── Sidebar.tsx               6-item nav. Black panel (SPEED chrome), active pill #0A7D68.
│   ├── personas/
│   │   ├── PersonaCompositionChart.tsx   561-line custom-SVG sunburst. BASELINE, untouched.
│   │   ├── PersonaDetail.tsx             Permanent 9:16 media slot + content panel. `stacked` forces 1 col.
│   │   ├── CategoryDetail.tsx            Segment panel + emblem. Exports SEGMENT_IMAGES.
│   │   └── variants/                     index.ts registry + types.ts contract
│   │       ├── WheelAdapter.tsx          Wraps the sunburst to the shared contract
│   │       ├── ReadinessLadder.tsx       Mirrored proportional bars, market vs customers
│   │       └── MindsetFlow.tsx           Stations, ribbons, the two named skip jumps
│   │                                     (ConversionSlope.tsx was cut 2026-08-04)
│   ├── journey/
│   │   ├── JourneyDetailTable.tsx        6-stage stage-by-row table. BASELINE, untouched.
│   │   ├── JourneyScoreGraph.tsx         Interactive smooth-curve graph. 4 additive props.
│   │   └── variants/                     index.ts registry + types.ts contract
│   │       ├── TableAdapter.tsx          Wraps the table to the shared contract
│   │       ├── JourneySpine.tsx          Curve leads, stepper, one stage of detail
│   │       ├── TensionMap.tsx            All five on a shared scale + the emotion/reason gap
│   │       └── FrictionStrip.tsx         All five stages, encoded, full text on click
│   ├── mediaplan/
│   │   ├── MacroBlockPlan.tsx            Grid: funnel rail, gantt bars, Budget/% header buttons
│   │   ├── BudgetBreakdownChart.tsx      Stacked-by-media monthly bar (Budget header)
│   │   ├── BudgetPieChart.tsx            Allocation pie, hover pop-out (% header)
│   │   └── ChannelDetail.tsx             Gantt-bar pop-up: rationale + table + creative + flighting
│   ├── tenthings/
│   │   ├── TenThingsCard.tsx             One tile. See the layout rules: they are CONTENT rules.
│   │   ├── TenThingsDetail.tsx           Modal body + the map hotspots
│   │   ├── TenThingsChart.tsx            Shared frame: mint hairline, cream mat, caption slots
│   │   └── charts/                       index.ts registry + types.ts contract
│   │       ├── chartBase.ts              ONE ChartJS.register + BASE_OPTIONS/BASE_PLUGINS. Read its header.
│   │       ├── chartPlugins.ts           benchmarkRule, barValueLabels, lineValueLabels, bubbleLabels
│   │       └── *.tsx                     9 charts. MmmConfidence is HTML, deliberately.
│   ├── apex/                             ApexChannelTable, ApexMethodology
│   ├── icons/                            18 custom SVG icon components (all referenced)
│   └── shared/
│       ├── Modal.tsx                     All pop-ups. Escape, focus trap, scroll lock, opt-in stepper.
│       ├── Lightbox.tsx                  Click to enlarge. CAPTURE phase Escape, so it nests inside Modal.
│       ├── PendingSection.tsx            Designed "awaiting Lyka data" shell. Follows BusinessDashboard.
│       └── VariantSwitcher.tsx           Segmented control on both pages. Scaffolding.
└── public/                               22 MB (was 120 MB as Hamilton)
    ├── images/
    │   ├── lyka-logo.png                        Top-right client mark
    │   ├── apex-by-speed-logo.png               SPEED asset
    │   └── (media-plan creative)                Platform logos are client agnostic and reusable.
    │                                            The *-social*, tv2/tv3 and property-listing
    │                                            files are Hamilton creative. [Hamilton content]
    ├── media-plan/                      3 podcast images (the rest were purged as superseded)
    ├── icons/
    │   ├── accelerator_logo.png         Sidebar badge
    │   ├── tab_icon.png                 SPEED house favicon. Shared across projects.
    │   └── mass-n12m.png, domestic-intent.png, international-intent.png,
    │       domestic-hnwt.png, international-hnwt.png   Segment avatar fallbacks
    ├── personaVideos/                   5 Lyka vignettes, 49 MB. Added 2026-08-04.
    │   ├── devoted-caterers.mp4                 Joined by persona id in
    │   ├── mindful-researchers.mp4              data/personaMedia.ts, NOT by
    │   ├── conflicted-troubleshooters.mp4       filename and NOT in personasData.
    │   ├── disciplined-outsourcers.mp4          All 1080x1920 h264, 8s, 24fps.
    │   └── secure-sleepwalkers.mp4
    └── snapshot_emblems/                4 Lyka stage emblems, 1 MB. Added 2026-08-04.
        ├── unaware.png                  Keyed by categoryData title, parenthetical
        ├── curious.png                  share included, in CategoryDetail's
        ├── considering.png              SEGMENT_IMAGES. 1024px line art on WHITE,
        └── ready.png                    no alpha. No emblem for the centre disc.

        Hamilton's 5 TRAVEL emblems and its 20 persona films (55 MB) were removed
        with the audience-model pass, when nothing referenced them. Both folders
        are now Lyka's own.
```

`public/` went 120 MB (Hamilton) to 78 MB (shell pass) to 22 MB (audience pass) to **72 MB** once the Lyka films and emblems landed: 47 MB `personaVideos/`, 23 MB `images/`, 1 MB each `icons/` and `snapshot_emblems/`, 192 KB `media-plan/`. **Two thirds is persona film and most of the rest is media-plan creative, which is still Hamilton's**, so the largest single saving available here is not compression, it is a Lyka media brief.

**The films are unoptimised source.** Roughly 13 Mbps for an 8 second clip, and the slot renders them at about 285x507 CSS px, so they are delivered at more than double the resolution they are shown at. Re-encoding to 720x1280 at a sane CRF would cut about 80% with no visible difference in that frame. Not done: it is lossy, the originals are the only copy in the project folder, and nobody asked. Do it before deploying if payload matters, and keep the originals.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # dist/
npm run preview
npm run typecheck  # tsc --noEmit && tsc -p worker --noEmit. The only gate.
```

No tests, no lint. **`npm run typecheck` runs both configs** and must be used rather than bare `tsc --noEmit`: the Worker has its own config and a `brand.ts` change can break it while the app still passes.

### Verification that typecheck cannot do

`tsc` cannot see the string-key joins, and `vite build` does not resolve `public/` paths. Two things cover that gap:

1. **[data/__integrity.ts](data/__integrity.ts)** runs on every dev page load. Open the console. A clean run logs exactly one line and nothing else:

   ```
   [data integrity] ok. 5 personas, 5 segments, 5 journeys, 3+4 variants, 10 findings, 15 assets queued for check, shares, budgets and published tables balance.
   ```

   **The counts in that line are derived, so they move.** `3+4` was `4+4` before the Index view was cut, and `15` was `6` before the persona films and the stage emblems landed. Treat a change in them as expected after adding or removing either; treat any OTHER output as a real problem.

   It asserts persona categories against `categoryData`, `categoryData` keys against `SEGMENT_COLORS`, `categoryData[k].title` against `SEGMENT_IMAGES` **in both directions**, every `journeyMeta.personaId`, every `PERSONA_VIDEOS` id, every asset path, the media-plan budget invariant, the palette floors (2.7:1 vs white for wedge fills, 4.5:1 pair based for `ink`/`tintInk`), that the derived stage shares sum to 100% and agree with `categoryData`, and that both variant registries have unique ids and a resolvable default.

   For Ten Things it also asserts every `chart` key against `TEN_THINGS_CHARTS`, that the ten ids run `'01'` to `'10'` in order, that every `emphasis` substring is present in its `learn` paragraph (a typo silently no-ops the bolding), the six map assets, **that every plotted series matches its published numbers table** and that point 10's three stated totals are the sums of its arrays, the 3:1 stroke floor on `TEN_THINGS` against the cream mat, and that each `CANVAS_FONT` string's px number equals its named `TYPE` token (`ctx.font` takes a literal string, so `type.ts` cannot be its source and the two would otherwise drift silently).
   **It checks Content-Type, not just `response.ok`.** Vite's dev server answers a missing `public/` path with the SPA fallback: HTTP 200 and `text/html`. A missing image therefore looks fine to `r.ok`, which is why the earlier naive version of this check reported nothing.
2. **Residue greps.** Use `git grep`, not `grep -r`: it searches tracked files only, so it skips `node_modules`, `dist`, and `.wrangler` (which holds stale bundles containing old `Hamilton` strings that otherwise pollute every result).

## Deploy

**Nothing is currently deployed, by decision.** Both configs are ready but neither is linked.

> ### Before you run any deploy command
>
> The `.netlify/` state directory was **deleted** during the Lyka conversion because this folder is a copy of the Hamilton Island app and inherited its site link: `state.json` held siteId `e201ae94-ca8c-409b-be9c-9fc52cdb028c`, the **same ID as the live Hamilton Island deck**, and the cached `netlify.toml` had an absolute `publish` path pointing at the *original* Hamilton folder's `dist`. A `netlify deploy --prod` from here would have overwritten a live client deck.
>
> **So: never run `netlify deploy` here without first running `netlify link` (or `netlify init`) and confirming the target site is a Lyka site.** Check `.netlify/state.json` after linking.

### Netlify

```bash
netlify link          # or netlify init. CONFIRM THE TARGET SITE FIRST.
npm run build
netlify deploy --prod --dir=dist
```

Netlify's site password is a paid feature. For a gated confidential deck, prefer the Cloudflare Worker below.

Live: not deployed. Run `netlify link` and confirm the target site first.

The site is linked to the SPEED Netlify team. There is no GitHub auto-deploy wired up yet, so pushing to `main` does not trigger a Netlify build. To enable: Netlify admin → Site configuration → Build & deploy → Continuous deployment → Link to GitHub. After that, plain `git push` deploys.

### Cloudflare Workers

```bash
npm run deploy:cf          # = vite build && wrangler deploy
```

Live: https://speed-x-lyka-accelerator.aaronzspeed.workers.dev

Config is [wrangler.jsonc](wrangler.jsonc). Points worth knowing:

- **Workers Static Assets, not Cloudflare Pages.**
- `not_found_handling: "single-page-application"` is the Cloudflare equivalent of the `netlify.toml` SPA redirect. Any unmatched path serves `index.html` with a 200 so the `Page` enum switch in `App.tsx` handles routing. `env.ASSETS.fetch()` applies this too, so authenticated deep links still work.
- The Cloudflare account is the **personal** `aaronzspeed@gmail.com` account, not a SPEED team account. Netlify is on the SPEED team. Move the Worker if this needs to sit under team billing or team access control.
- **Both hosts are gated.** Netlify uses its built in site password. Cloudflare uses the shared password gate in [worker/index.ts](worker/index.ts) described below.

### The shared password gate

[worker/index.ts](worker/index.ts) is a `main` Worker that sits in front of the deck and asks for one shared password, matching how Netlify's site password behaves: forwardable, no per person allow list, no email round trip.

**`run_worker_first: true` is load bearing.** Without it Cloudflare serves any request that matches a file straight from the asset layer and the Worker never runs, which would leave every image, video and script ungated while only unmatched paths were protected. Do not remove it.

**Cost consequence:** with `run_worker_first`, every request is a billed Worker invocation rather than a free static asset request. The free plan allows 100,000 per day and returns 429 beyond that. At roughly 107 assets per full deck view that is about 900 full views per day. This is the price of gating the videos and images rather than just the HTML.

How it works:

- Session cookie is `<expiry>.<hmac>`, signed with `SESSION_SECRET`. The signature covers the expiry, so a visitor cannot forge a cookie or extend their own session by editing it. TTL is 12 hours.
- The password is compared as an HMAC digest, not as a raw string, and via a constant time comparison, so neither length nor match position leaks through timing.
- Missing secrets **fail closed** with a 503. A misconfigured deploy can never mean an open site.
- Navigations get the branded login page. Non HTML requests (images, video, JS) get a bare 401, so the browser never receives HTML where it expects an asset.
- `/__auth/logout` clears the session.

**The Worker was renamed to `speed-x-lyka-accelerator`, so it is a NEW Worker.** Secrets are per Worker, so `SITE_PASSWORD` and `SESSION_SECRET` are **not** set on it and the gate will fail closed with a 503 until they are. Set (or later rotate) them with:

```bash
npx wrangler secret put SITE_PASSWORD     # the shared password given to viewers
npx wrangler secret put SESSION_SECRET    # HMAC key; rotating it invalidates all live sessions
```

Local development reads the same two values from `.dev.vars`, which is gitignored. Recreate it by hand if you clone fresh. Without it `wrangler dev` returns the 503 fail closed response.

Type checking is split: the app uses the root `tsconfig.json`, the Worker uses [worker/tsconfig.json](worker/tsconfig.json). They cannot share one config because the Worker must not pull in the DOM lib or `@types/node`, which collide with `@cloudflare/workers-types`. The root config excludes `worker/`. Run both with `npm run typecheck`.

### Cloudflare Access (superseded, kept for reference)

Access was enabled on this Worker on 2026-07-30 and then replaced by the password gate above, because Access requires every viewer's email to be listed in advance and a client deck needs a forwardable secret. **Access and the password gate must not both be on**, or viewers hit two challenges. Turn Access off in the dashboard when using the gate.

Cloudflare supports one click Access protection on a `workers.dev` URL, so no custom domain is needed. This account has no zones, and that is fine.

Dashboard → Workers & Pages → `speed-x-lyka-accelerator` → **Domains** tab → **Worker URL** section. Under each URL is a visibility dropdown that defaults to **Public**. Switch it off `Public` to require sign in, then set the authorised email addresses.

Do this on **both** rows. **Production** (`speed-x-lyka-accelerator.aaronzspeed.workers.dev`) and **Preview** (`*-speed-x-lyka-accelerator.aaronzspeed.workers.dev`) are gated separately, so protecting only Production leaves every deployed version publicly reachable via its preview URL.

First use prompts for a Zero Trust team name. Free for up to 50 users.

Note: the Cloudflare docs still describe an older UI with an **Enable Cloudflare Access** button on a Settings → Domains & Routes screen. As of 2026-07-30 the live dashboard uses the Domains tab and the Public dropdown described above.

This **cannot be done from wrangler or the API with the standard `wrangler login` OAuth token.** That token carries no Access scope and every `accounts/<id>/access/*` endpoint returns 403. It is a dashboard action, or it needs a purpose made API token with `Access: Apps and Policies Write`.

Note `previews_enabled` is `true` on this Worker, so per version preview URLs also exist. Confirm the Access policy covers them, or disable previews.

#### Sharing the deck: the One-time PIN trap

Access uses One-time PIN, so **only email addresses listed in the Access policy can get in**. Anyone else is refused no matter that they have the link.

**A rejected login looks identical to a successful one.** Cloudflare never sends an email to a non permitted address, but the login page still says "A code has been emailed to you" either way. This is deliberate, it stops attackers enumerating valid addresses.

So when a recipient reports "I never received the code", the cause is almost always that **their address is not in the policy**, not mail delivery. Check the policy before debugging spam filters. PINs also expire 10 minutes after being requested.

Add recipients under Manage Cloudflare Access → the application → Policies → an **Allow** policy. Include rules are OR'd. Prefer one **Emails ending in** `@thespeedagency.com.au` rule for the team over naming people individually, plus **Emails** entries for each client side contact.

This is stricter than the Netlify gate, where a single shared password can simply be forwarded. If a forwardable shared secret is preferable for a given client, gate the Worker with a `main` script checking a password against the `ASSETS` binding instead of using Access.

To take the public URL down entirely instead, set `"workers_dev": false` in [wrangler.jsonc](wrangler.jsonc) and redeploy.
- Asset payload is ~22 MB, nearly all of it media-plan creative in `public/images/`, which is still Hamilton's. The 55 MB of persona films is gone. Limits are 25 MiB per file and 20,000 files on the Workers free plan, so there is ample headroom, but keep the per-file cap in mind if Lyka persona vignettes are ever produced.
- A first deploy to a brand new `workers.dev` subdomain takes a minute or two to propagate. A 404 or Cloudflare error 1042 immediately after deploy is propagation, not a broken build. Re-check before debugging.

## Source control

**Repo: `The-Speed-Agency/speed-x-lyka-accelerator`, private.** Created 2026-08-04.
https://github.com/The-Speed-Agency/speed-x-lyka-accelerator

**The working branch is `lyka-main`, and it is the ONLY branch that exists on the remote.** It is an **orphan**: one commit, no parent, carrying the tree as it stood after pass 8. The Hamilton Island origin (`The-Speed-Agency/speed-x-hamilton-island-accelerator`) had been removed during the conversion precisely so a push from this copy could not reach a live client repo, and the orphan is how that protection was kept while still getting a remote.

### THREE LOCAL BRANCHES, AND ONLY ONE MAY BE PUSHED

```
* lyka-main    1 commit    -> origin/lyka-main    THE branch. Push this.
  lyka-shell   35 commits  NO upstream            9 Lyka + 26 Hamilton Island
  main         Hamilton    NO upstream            pre conversion
```

`lyka-shell` and `main` still hold **26 commits of another client's development**, kept on disk deliberately rather than destroyed, because the conversion history is occasionally worth reading. They have no upstream and must not get one.

- **Never run `git push --all`, `git push --mirror`, or `git push origin lyka-shell`.** Any of those puts Hamilton Island's full build history, including its Power BI and media plan commits, into a Lyka named repo.
- Plain `git push` is safe: git's default `push.default = simple` pushes only the current branch to its own upstream, and the other two have none.
- If you no longer want them on disk, the destructive cleanup is `git branch -D lyka-shell main && git reflog expire --expire=now --all && git gc --prune=now --aggressive`. **That is irreversible from this folder.** The canonical Hamilton Island deck has its own folder and its own repo, so nothing is lost to the agency, but nothing is recoverable here either.

**Verified at creation:** the remote carries one branch and one commit; no `.env`, `.dev.vars`, `.netlify/state.json` or `.wrangler` is tracked or anywhere in history; and a fresh clone installs, typechecks and builds, so the repo is self contained.

**The repo does contain Hamilton Island content**, and that is not an oversight: `data/mediaPlanData.ts`, `data/apexData.ts` and the media plan creative in `public/images/` are still theirs. Both pages render a placeholder rather than that data (see the top of this file). It is agency internal and the repo is private, but do not make this repo public while that is true.

The uncommitted Cloudflare Worker gate that existed in this folder before the conversion was captured to `../worker-gate-and-tooling.patch` (141 KB) so it can be landed on the canonical Hamilton Island repo separately, without ever pushing from here.

There is **no GitHub auto deploy**. Pushing does not build anything. See "Deploy".

## Wiring in the Lyka content model

The **personas and segments pass is done**. What follows covers the three pages that are still Hamilton's.

### Consumer Journey: DONE

Ported 2026-07-31 from the source deck. Kept here as the record of how, because the same method applies to any future revision.

`data/journeyDetailsData.ts` is **generated** by a cell-level parse of the deck's tables (`scratchpad/parse_journeys.py` then `gen_journeys.py` in the session directory). Two things make a naive extraction useless:

- **Parse table CELLS, not text runs.** Each cell holds several bullet paragraphs, and a flat `<a:t>` walk loses the cell boundaries, so there is no way to tell which bullets belong to which stage. Walk `<a:tbl>` / `<a:tr>` / `<a:tc>` instead: rows are fields, columns are stages.
- **Bullets are an inline U+2022 inside one paragraph**, not separate paragraphs. Split on the glyph.
- **Narrative text outside the table needs the table paragraphs excluded.** `root.iter()` returns both. On one slide the table precedes the narrative and a naive scan works; on the others it follows, so "Critical conversion moment" swallowed the entire table.

Field mapping, all verbatim:

| Source | Field |
|---|---|
| Doing + Thinking / Feeling | `doingThinking` (Doing split to sentences, then the quote) |
| Barriers | `painPoints` |
| Touchpoints | `influences` |
| Opportunities for Lyka | `momentsToWin` |
| `Emotional NN/100` + text | `emotionalScore` as `Emotional NN – text` |
| `Rational NN/100` + text | `rationalScore` |
| Likely pace | `duration` |
| Typical position | `definition` |
| Critical conversion moment | `coreQuestion`, on the **Action** stage only |

**Use the PPTX, not the PDF.** Both are the same version (all 50 scores match) but PDF text extraction breaks words mid-token, e.g. `Em otional`, which quietly defeats any regex over the labels.

If the study is revised, regenerate rather than hand-editing, and remember the two format rules: semicolon delimited bullets, en dash before score descriptions.

### Interactive Media Plan and APEX

Both need inputs that do not exist yet, so **since 2026-08-04 neither opens.** Each nav item renders a placeholder from [pages/PendingSections.tsx](pages/PendingSections.tsx) naming the one input that unblocks it, and the built pages sit behind `?show=all`. When the input lands, delete that export and its ternary in `App.tsx`: the page underneath has not been touched.

- **Media plan**: a Lyka brief. The `MediaRow` / `PlanLayer` model and the gantt derivation are fully reusable; `MONTHS` is a hardcoded Nov to Oct fiscal year and `LayerKey` is baked into five places. The `provisional` flag renders a PENDING pill if you want to ship illustrative numbers honestly.
- **APEX**: one Roy Morgan Single Source pull, 13 channels x 2 Lyka audience definitions, giving 26 `heavyPct` and 26 `rmIndex` values. **Everything else recomputes**: `methodB` is rebase(rmIndex x knfScore, mean 100) and `methodC` is rebase(rmIndex x knfScore x ttdMultiplier, mean 100). `knfScore`, `ttdMultiplier` and `ttdStars` are channel constants and carry over untouched. The derived columns must be recomputed, never hand edited, and must be recomputed if the row set changes at all, because the rebase is over the rows present.

### If the segment model itself is ever revised

The ten strings that matter are five segment keys and five `title` values. They join across five places, and two failures are silent (an unmatched `SEGMENT_COLORS` key renders the fallback colour; an unmatched `SEGMENT_IMAGES` key renders nothing). Change them in this order, then run `npm run dev` and read the console: `data/__integrity.ts` reports every broken join before you start authoring.

1. `data/brand.ts` `SEGMENT_COLORS`
2. `data/categoryData.ts` keys and `title` values
3. `components/personas/CategoryDetail.tsx` `SEGMENT_IMAGES` (4 of 5 stages carry an emblem; the keys include the parenthetical share, so a stage rename breaks them)
4. `data/personasData.ts` every `persona.category`
5. `components/personas/PersonaCompositionChart.tsx` `CENTRE_KEY` and `STAGE_LAYOUT`
6. `data/audienceModel.ts` `STAGE_ORDER` and `CENTRE_KEY`

`pages/CustomerJourney.tsx` is **no longer** on that list. Journeys reach their
stage through `journeyMeta.personaId`, so renaming a stage cannot orphan a tab.

Geometry notes for that last one, learned the hard way:

- **Do not force a single arc orientation across quadrants.** The default flip rule (`90 < mid < 300` gives CCW) is correct: top quadrants read inward, bottom read outward, everything is the right way up. Hamilton forced CW because its two halves were left and right; on quadrants that renders the bottom two labels upside down.
- **Long stage titles must split.** `splitTitleWithCount(title, 13, 2)` puts the share on its own line. On one line, a 27 character title clips at both ends of a 90 degree arc.
- **Persona label width derives from the wedge sweep** via `maxCharsForSweep`, because a stage with two personas gives 45 degree wedges and a stage with one gives 90. Do not reintroduce a hardcoded character limit.
- Adding or removing a persona within a stage is free: `anglePerPersona = sweep / childPersonas.length`. Adding a ring means one more `attachLabelPaths` call, not another copy-pasted three-way branch.

## House writing-style rules

These come from the workspace-level CLAUDE.md and the user routinely corrects violations:

- **No em dashes.** Use a full stop, comma, colon, or `|`.
- **No hyphenated compound modifiers.** Write "platform native", not "platform-native". (Exception: persona names from the Roy Morgan PDF, which are hyphenated.)
- Use `|` for UI separators, `:` for labels and headings, "to" for ranges.

## Known quirks and history

- **External labels were tried and rolled back.** Commit `c1239e4` moved persona labels outside the old 20-persona wheel with leader lines and reverted in `0aa5722`. The current in-wedge approach with per-persona orientation overrides is the user's preference and has carried over to the 8-persona refactor.
- **The sunburst has been rebuilt twice.** Xero's 3-ring 20-persona wheel became Hamilton's 4-layer 8-persona wheel in commit `87ce3e1` (which also removed the `sunburstFocus` zoom mode, `RADIUS_CONFIG_ZOOMED`, `getCategorySpan()`, the prefix-strip lookup and the back button). That in turn became Lyka's 3-layer 4-quadrant ladder on 2026-07-31. The geometry lessons from the third rebuild are in "Wiring in the Lyka content model"; the short version is that arc orientation and label width both have to follow the wedge, not a constant.
- **Persona titles are abbreviations of PDF names**, not the PDF names themselves. `name` carries the canonical "The X" name; `title` is the short wheel label. If you change a `title`, also update the per-persona orientation override map if the persona's wheel angle is near 90° or 270°.
- **Tailwind is CDN-based.** Arbitrary values like `bg-[#0A7D68]` work. A `tailwind.config.js` file does not exist, but an **inline `tailwind.config`** in `index.html` adds the `lyka-*` colour scale, so `bg-lyka-cream` and `text-lyka-ink` are available. It must stay **after** the CDN script and must use `theme.extend.colors`: `theme.colors` would replace the default palette and break every `text-gray-*` still in the app. Do not add `fontFamily.display` there, it would generate a `.font-display` utility that races the hand-written rule in the `<style>` block.
- **Persona videos USED TO have baked-in black side-bars**, and `transform: scale(1.08)` on the `<video>` element in `PersonaDetail.tsx` cropped them. That was Hamilton Island's footage. The Lyka films are native 1080x1920 with full width content, so the scale was removed when they landed on 2026-08-04. See "Persona detail panel".
- **The graph emotional/rational lines are smooth, not piecewise linear.** A Catmull-Rom-to-Bezier conversion in `buildSmoothPath()` produces the curve. Tension is 0.5. If you replace stages or scores, the curve recomputes automatically.
- The `personas-backup/` folder from the Xero source was deleted in the initial commit.
- **`SEGMENT_IMAGES` in `CategoryDetail.tsx` used to be Xero leftovers.** The original keys were `"Traditional Passive Operators (835k)"`, `"Tech-led Passive Operators (835k)"`, `"Engaged Evaluators (184K)"`, `"Regional Operators (178K)"`, `"Accountants / Bookkeepers = 372k"`, none of which match any Hamilton category, so the snapshot panel silently fell back to the teal `i` icon for **every** segment. Replaced in commit `9ed2d67`. `data/__integrity.ts` now asserts this join so it cannot happen quietly again.

### From the Lyka conversion, 2026-07-31

- **The Lyka Showcase Accelerator is not a colour reference.** It was never re-themed. See "Brand and typography".
- **Two footguns were removed, both verified before deletion.** The inherited `.netlify/` state pointed at the **live Hamilton Island site** (identical siteId), and `pages/BusinessDashboard.tsx` embedded a live Power BI report containing Hamilton Island's commercial data. See the "Deploy" warning and the comment at the top of `BusinessDashboard.tsx`.
- **`import.meta.env` needs `vite/client` in `tsconfig.json` `types`.** It was not there; adding the DEV-gated integrity import broke `npm run typecheck` (but not `vite build`, which is why a build-only check would have missed it).
- **Vite's dev server returns HTTP 200 with `text/html` for a missing `public/` path** (SPA fallback). Any asset existence check must compare Content-Type, not just `response.ok`.
- **`Personas.tsx` orphan cleanup**: `PersonaCard.tsx` was deleted. The older CLAUDE.md claimed `CategoryDetail` used it; it did not.
- **Two shell-pass changes were reverted on request**: the favicon (SPEED, not Lyka) and the sidebar (black, not Lyka teal). Both are SPEED house chrome rather than client surfaces. The lesson generalises: re-theming a client deck does not mean re-theming the agency's own furniture. `public/icons/tab_icon.png` had been deleted as "the HI favicon" when it was in fact shared across every project in the workspace; check for byte-identical copies elsewhere before classing an asset as client specific.
- **`__integrity` is now completely silent on a clean load.** It previously warned twice about `mass-intenders.png` and `hnwt-travellers.png`, declared in `SEGMENT_IMAGES` for unreachable legacy buckets. `SEGMENT_IMAGES` is empty and those warnings are gone, so **any** console output from `[data integrity]` other than the single `ok.` line is now a real problem.
### From the visualisation-variants pass, 2026-07-31

Four things here were only findable by rendering, and all four will bite again.

- **`xl:` is a VIEWPORT query, but panel width is the real constraint.** Tailwind
  is CDN only here, so there are no container queries. `PersonaDetail` switches to
  side-by-side at `xl:`, and at 1440 the wide persona views gave the panel about
  480px: `xl:` still matched, the identity card took 300px, and the prose wrapped
  to two words a line. Fixed with an explicit `stacked` prop the host passes. The
  same trap applies anywhere a component is dropped into a narrow panel.
  **`stacked` IS NO LONGER PASSED BY ANYTHING** (see the type pass below). The
  wide views get a full width overlay, about 1048px, and the wheel's `md:w-3/5`
  panel is about 605px; two columns is right for both, and below `xl:` the layout
  stacks on its own. The prop is kept because the trap it solves is real and the
  next narrow host will need it. It was briefly flipped to stack the wheel, which
  was wrong: the wheel's panel is inherited from Hamilton Island, media left and
  content right, and it is the A/B baseline.
- **Percentage-width flex children plus a flex `gap` overflow the row.** The
  ladder's shares sum to exactly 100%, so three 3px gutters put a horizontal
  scrollbar on the page. Each band gives back its share via
  `calc(X% - ((n-1)*gap/n)px)`. See `bandWidth()` in `ReadinessLadder`.
- **Chasing one-viewport fit by trimming padding does not converge.** 25
  persona-by-stage combinations each have a different tallest column. The compact
  journey views are a **fixed frame**: header, tabs and footnote are
  `flex-shrink-0`, the view gets `flex-1 min-h-0`, and overflow scrolls INSIDE the
  detail pane. Page overflow is 0 at both 1440x900 and 1280x800; the pane scrolls
  at most 79px.
- **`animate-fadeIn` inflates any height measured mid-animation.** It uses
  `translateY(10px)` over 500ms, so a `scrollHeight` read at 110ms can be 10 to
  30px too big and the numbers look random. Wait 600ms+ before measuring layout.

Also moved in this pass: the `@keyframes fadeIn` block, which two page modules
were each injecting via `document.createElement` at module scope, and
`.custom-scrollbar`, which was applied in two panels and had never been defined.
Both now live in `index.html`, along with a `prefers-reduced-motion` block and,
since 2026-08-04, `.persona-chip` / `.persona-chip-svg` (see the next section).

### Persona chip hover, 2026-08-04, and the specificity trap in it

The persona chips in the Ladder and the Flow had **no hover state at all**. In the
Ladder that was actively misleading rather than merely missing: the stage band
behind them already highlights with a 2px outline in its own `base` colour, so
hovering a chip lit up the BAND and the chip read as part of it rather than as its
own target. Both now use that same language: wash the fill toward white, ring it
2px in the segment's `base`. A selected chip is already dark, so it lifts to the
`hover` token and takes a light `tint` ring instead.

**No new hexes.** Every value is an existing `SegmentColorSet` token or a change
of alpha on white, and the unselected hover washes LIGHTER, so contrast with the
dark `tintInk` can only improve. Nothing needed a new contrast assertion.

**The behaviour is CSS in `index.html`, not React state**, for a specific reason:
a `hoveredId` in state re-renders on every mouseover, and `MindsetFlow` is a large
SVG that recomputes its viewBox from a measured container. Hover has no business
in the render path. The per segment colours cannot be Tailwind utilities either,
so they arrive as inline custom properties and only the rule is shared.

**THE TRAP, and it half worked in a way that would pass a casual check.** The
Ladder's chip set `backgroundColor` inline. **Inline style outranks any stylesheet
rule**, so `.persona-chip:hover { background-color: ... }` never applied, while
the ring did, because nothing sets `box-shadow` inline. Hover visibly "worked".
The fix is to hand the RESTING fill to the stylesheet as well, via `--chip-bg`,
which removes the specificity fight rather than winning it with `!important`.
**The flow's chips were never affected**: an SVG `fill` presentation attribute
loses to CSS, which an inline style does not. If you add a third view, know which
of the two you are writing.

**Two ways I mismeasured this before believing it**, both worth knowing because
they make a working focus ring look broken:

- **A CDP driven `Tab` does not set `:focus-visible` unless the page has already
  had a real pointer gesture.** `el.matches(':focus-visible')` returned true while
  the style engine had not applied the rule. Click neutral chrome first.
- **A 100ms sample of a 150ms transition reads as an intermediate value**, so the
  ring came back as `1.39512px` of a 70% alpha colour. This is the same error the
  type pass recorded for `animate-fadeIn`: wait past the animation before
  measuring. `CSS.forcePseudoState` over CDP is the way to read the settled value
  without depending on either.

The Tailwind `focus-visible:ring-2` that was on the Ladder's button is gone: it
drew the default blue. `:focus-visible` shares the hover rule, so a keyboard user
now gets the identical segment coloured highlight. Verified at 1440x900 and
1280x800.

**Not verified, because it is unreachable:** the selected chip's hover branch.
Closing the persona overlay clears `selectedPersonaId`, and while the overlay is
open it covers the chart, so a chip is never both selected and hoverable. The
branch matches the resting `isSelected` styling that was already there and costs
nothing, but do not read it as tested.

### From the type legibility pass, 2026-08-03

> **`ConversionSlope.tsx` (the Index view) was deleted on 2026-08-04.** The
> paragraphs below still name it, deliberately: it is where three of the pass's
> reusable lessons were found (a declared SVG `fontSize` is not a rendered size,
> SVG `<text>` cannot wrap so honesty notes belong in DOM, and a constant
> calibrated to a font size must be derived). Read them as the record, not as a
> map of the current files.

The six new views shipped with text down to **8.5px**. Not an oversight: each view
is a fixed one viewport frame, and every time a box did not fit, the type was
stepped down locally. That produced roughly **18 distinct sizes between 8.5 and
16px** (8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 16).
Half point steps are invisible as hierarchy but real as inconsistency.

**[data/type.ts](data/type.ts) is now the single source of truth for size**, the
sibling of `brand.ts` and under the same two constraints (no React or DOM types,
literal numbers only). Eight steps, mirrored as `theme.extend.fontSize` in
`index.html` so `text-micro` through `text-display` exist as utilities:

| Token | px | Role |
|---|---|---|
| `micro` | 11 | **Uppercase mono eyebrows ONLY.** Caps have no descenders, so 11px uppercase reads about like 12.5px lowercase. Never lowercase, never prose. |
| `meta` | 12 | Figures beside a label, counts, durations, axis labels, footnotes |
| `label` | 13 | Chip and stage names in dense grids |
| `body` | 14 | Bullets and prose in the dense views. **The reading floor.** |
| `lead` | 16 | Prose in panels and modals, card titles |
| `title` | 18 | Pane and card headings |
| `figure` | 24 | Hero data figures |
| `display` | 30 | Page h1 |

`TRACKING` went with it. Uppercase labels ran 0.14em to 0.22em, which was
compensating for Bebas; Poppins and DM Mono replaced it in the conversion and do
not need it. Now 0.08em, which also buys back horizontal room.

**Verified**: nothing under 11px and nothing under 12px that is prose, across all
eight `?pv=` / `?jv=` states at 1440x900 and 1280x800, measured as RENDERED px
(see the SVG note below), page overflow 0 everywhere, `[data integrity]` silent.

#### Five things that were only findable by rendering

1. **A declared SVG `fontSize` is not a size.** The SVG scales to its container,
   so the attribute is relative to the drawing, not the page. `fontSize={10}` was
   rendering at **15.0px** in the journey Table and **6.8px** in the Strip, purely
   because callers pass a different `columnWidth` and therefore a different
   viewBox. `svgFont(token, measuredPx, viewBoxWidth)` in `type.ts` plus
   [hooks/useElementSize.ts](hooks/useElementSize.ts) converts a token into
   the user units that render at its real CSS px. Used by `MindsetFlow`,
   `ConversionSlope` and `JourneyScoreGraph` (the last gated on `compact`, so the
   Table baseline is untouched). **Trade-off, on purpose:** text now holds a fixed
   apparent size while the geometry scales, so on a narrow container it grows
   relative to the drawing and eventually collides. Each caller pairs it with a
   `MIN_COMPENSATED_WIDTH` below which it reverts.
1b. **A full overlay makes the chart behind it inert, and that broke a path that
   used to work.** The old squeezed panel left the visualisation live, so you
   could click straight from a stage to a persona. Under the overlay, that click
   lands on the panel card and nothing happens. Since a stage band is the biggest
   target in the Ladder and the Flow, the common path became: click a stage, get
   the Segment Deep Dive, which has no media slot, try to click a persona, get
   nothing. That reads exactly like "the new views have no persona detail", and it
   was reported three times before it was found, because a single scripted click
   on a persona chip always passed. **Test the SEQUENCE, not the click.** Fixed by
   putting a "Personas in this stage" row in `CategoryDetail`. If any view ever
   goes back to a non-overlay panel, that row is still correct; do not remove it.

2. **The wide Personas panel was halving the type it sat next to.**
   `Personas.tsx` squeezed the view to 53% with `md:pr-[47%]`. Free for the
   percentage based Ladder, ruinous for the two SVG views: Flow's fit rating
   rendered at about **4.3px** and its legend at 5.2px. You were not seeing the
   chart and the detail together, you were seeing an unreadable chart beside the
   detail. **The wide panel is a full overlay now**, with a scrim (without one the
   dimmed view bleeds through the gutter and reads as a rendering fault) and
   Escape to close. This is also what gives `PersonaDetail` the ~1048px its two
   column layout was written for.
3. **SVG `<text>` cannot wrap, so long copy silently runs off the viewBox.**
   Adding one clause to the `ConversionSlope` footnote truncated it mid word at
   the right edge with no error. Both that footnote and the `MindsetFlow` legend
   are **DOM now, not SVG**, which also let the boxes shrink: `ConversionSlope`
   went 576 to a fixed `VB_H = 496`, and `MindsetFlow` went 530 to 494, which then
   became its `VB_H_MIN` when the flow was made to fill (see below). This matters
   most because those two strings are the honesty notes, which are exactly the
   copy most likely to be edited.
4. **`overflow-hidden` on a fixed frame destroys content at 200% zoom.** The
   compact journey frame lost 102px off the bottom, footnote included, with no way
   to reach it: a WCAG 1.4.4 failure. It is `overflow-y-auto` now. Page overflow
   is still 0 at 1440x900 and 1280x800, so the one viewport design is intact; it
   just degrades to a scrollbar instead of deleting things. **A fixed frame is a
   design intent, not a licence to clip.**
5. **Constants calibrated to a font size break silently when the font changes.**
   `ConversionSlope`'s `MIN_LABEL_GAP = 30` was tied to a 12px over 10px pair and
   is now **derived** by `labelGapFor()`. Same for its second line offset,
   `JourneyScoreGraph`'s label gutter, and `MindsetFlow`'s chip box and baselines.
   If you hardcode an offset against a size, derive it or it will rot.

#### Filling the box: `fills` on the variant registry

The ladder's three bars were `clamp(a, Nvh, b)` with a fixed ceiling, so past
about a 900px viewport the whole view stopped growing and floated in the middle
of an empty page. `vh` is a viewport query, and the real constraint is the
visualisation area.

- **`fills: true`** on a `PersonaVariantDef` tells the host to hand the view the
  full height of the box. **The ladder and the flow set it, by different means.**
- **Ladder:** flexbox all the way down, so `h-full` is enough. Chrome is
  `flex-shrink-0` and the three bars are flex shares with px floors, so a 768px
  screen still gets a usable ladder. Unused height is 16px (the wrapper padding)
  from 1366x768 to 1920x1080.
- **Flow: you cannot make an SVG fill by stretching it.** `preserveAspectRatio`
  either letterboxes it (`meet`) or turns the circles into ellipses (`none`), so
  the viewBox itself has to change shape. It measures the box and computes
  `VB_H = VB_W * containerH / containerW`, clamped to 494 to 700.
  **VB_W stays 1160**, so the horizontal scale never moves and every type size and
  chip box renders at exactly the same px as before; only vertical user units are
  added. The vertical layout then solves BOTTOM UP, because everything under the
  nodes is a type-sized stack that must not scale: node centre = VB_H minus the
  lower stack minus the radius, and whatever is left above is the skip-route band,
  whose two lanes sit at fixed fractions of it (reproducing the old 58 / 122 at
  the old VB_H). Node radius grows 74 to 125 with the box; **125 is a hard
  horizontal limit, not taste** (stations are 290 apart and the two largest
  neighbours are R and 0.71R, so they touch above about 134). Ribbon widths scale
  by the same `R_MAX / 74` factor, which leaves relative widths untouched: the
  honesty constraint forbids implying a rate, not a consistent visual scale.
  Result at 1440: 1048x446 became 1048x632.
- **Index deliberately did not set `fills`**, and the rule outlives it: a view
  whose plot is a fixed area with decluttered label gutters gains nothing from
  extra height, it just spreads its labels apart. That reasoning now lives on
  `fills` in `variants/types.ts`, since the view itself is gone.
- `hooks/useElementSize.ts` (was `useContainerWidth`) now returns width AND
  height, because the flow needs the aspect. Two call sites since Index went.
- **The two bars are capped, the ribbon is not.** A band's height encodes nothing
  (width carries the share), so past a point extra height is pure padding. The
  slack flows to the ribbon, which is the one element that reads better tall,
  because the twist between market and customers is the argument of the view.
- **The market band's heading is `justify-center`.** Pinned to the top it left a
  visible hole above the chips once the band grew. Centred, the same slack reads
  as generous spacing.
- **`2xl:` is the only place type is viewport responsive**, and it is confined to
  the ladder's two largest roles (stage figure, stage and chip names). On a 1920
  boardroom screen those bands are 1500px of canvas and the fixed scale looked
  lost in them. **The reading floor never moves**, and nothing else in the app
  scales with the viewport. Do not generalise this without a reason as concrete.

#### Where the space came from

Mostly not from new room. Three moves:

- **Compress the top of the scale.** The Ladder's hero figures went 30 and 28 to
  `figure` 24. At 30 against a 9.5px label the range inside one band was 3.2:1,
  which is one shout and one whisper, not hierarchy. 24 against `meta` is 2:1, and
  the 6px per band paid for the chips.
- **Delete rather than enlarge.** The 9px "View" eyebrow on the switcher (about
  1.9:1 contrast, labelling four already labelled pills) is gone. So is the
  Ladder's third chip line and the Flow chip's fit rating, both of which were also
  in the detail panel and in a title tooltip, and the second resolved a documented
  overlap. Enlarging decorative text makes it loud AND still hard to read.
- **Let two views reflow.** `TensionMap` went `lg:grid-cols-5` to `-3` (five 203px
  cards could not hold a `lead` title), which needed `columnWidth` 44 to 75
  because that prop is the chart's aspect ratio control. The finding and the
  derived metrics note moved INTO the empty sixth grid cell: under the grid they
  fell below the internal scroll fold, and that note is load bearing.

#### Also fixed on the way past

- **`className="font-sans"` on three SVGs was off brand.** It resolves to
  Tailwind's `ui-sans-serif` stack and overrode the DM Sans on `body`, so
  `MindsetFlow`, `ConversionSlope` and `JourneyScoreGraph` rendered in the OS UI
  font while the page around them did not. Removed.
- **`PersonaDetail`'s bullets were `text-sm` next to prose with no size class**,
  which inherits 16px, so the panel stepped 18 / 16 / 14 / 16 as you scrolled.
  Both are `lead` now; the pane scrolls internally so it costs nothing.

#### Known and accepted

- **The wheel baseline still renders persona labels at 9.6px at 1280x800.** It is
  the A/B control and deliberately untouched. Fixing it means the `svgFont`
  treatment plus recalibrating `maxCharsForSweep` and the halo stroke widths, all
  of which are tuned to the current 7.5 / 8.5 / 9.5. Do it when the wheel wins or
  when the comparison ends, not while it is live.
- **`Mindful Resear…` and `Devoted …` truncate in the Ladder's market chips at
  1280.** Those bands are 15% and 11% of the width by data. Full names are in the
  title tooltip, in Flow and in the panel. **One of those routes has already been
  removed once:** Index was a fourth, and it went with the view on 2026-08-04.
  Check this line before cutting another view.
- **The Strip's `line-clamp` cells clip more at `label` than they did at 11.5px.**
  Accepted trade: every one is inside a button that opens the full text in a
  modal, so nothing is unreachable, and an unreadable full quote is worth less
  than a readable partial one.

### From the audience-model pass, 2026-07-31

- **The wheel geometry rebuild surfaced three bugs that only rendering finds**, all now documented in "Wiring in the Lyka content model": forced arc orientation flips bottom-quadrant labels upside down, a 27 character stage title clips at both ends of a 90 degree arc, and a hardcoded label width cannot serve wedges that are 45 degrees in one stage and 90 in another.
- **`personasData.ts` is generated, not hand written.** The generator parses the source document and emits the file, so the prose cannot drift from the research. If the source is revised, regenerate.
- **The five travel keys in `SEGMENT_COLORS` are load bearing** while the Consumer Journey page is still Hamilton's. `data/__integrity.ts` asserts that join specifically, because deleting them fails silently.
- **`dispatchEvent` does not reach React's delegated handlers in headless Chromium.** Automated wedge-click verification has to drive the real mouse (`page.mouse.click`) at computed coordinates. Playwright's own `.click()` also fails on annulus wedges, because it targets the bounding-box centre, which for a ring segment is the middle of the wheel.
- Purged in the conversion: 19 orphaned source files (the Xero `competitors/` trio and its page, `StrategicPrioritiesTable`, two 0-byte stubs, `PersonaCard`, 9 unused icons), the dead `isAccountant` branch, the vestigial `importmap`, a `<link>` to a nonexistent `/index.css`, the dead Gemini `define` block with `.env.local` and its typo'd duplicate `,env-1.local`, and 42 MB of dead assets (24 MB of Xero icon PNGs including four duplicate pairs, 12.5 MB of superseded `images/`, 4 MB of superseded `media-plan/`).
