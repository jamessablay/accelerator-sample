# Lyka Audience Accelerator

A SPEED Standard Accelerator for Lyka (fresh, human grade dog food, direct to consumer subscription).

React 19 + TypeScript 5.8 on Vite 6, Tailwind 3 compiled at build time. Custom SVG sunburst (no chart library) plus Chart.js for the media plan and Ten Things. No router: a `Page` enum in `types.ts` drives a switch in `App.tsx`, with the seven pages lazily imported.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # dist/
npm run preview
npm run typecheck  # app + worker
npm run verify:css # every utility used in source exists in the compiled CSS
npm run verify     # all three. The gate: no tests, no lint.
```

## The design system lives in `theme/`

Re-skinning this deck for a new client is **one file plus one line**: add
`theme/clients/<name>.ts` satisfying the `ClientTheme` contract, then point
`theme/index.ts` at it.

```
theme/
├── types.ts            the ClientTheme contract
├── house.ts            SPEED constants every deck inherits: the 8 step type
│                       scale, motion, elevation, radii, the roomy breakpoint
├── contrast.ts         WCAG maths + lighten(), shared with __integrity.ts
├── clients/lyka.ts     palette, typefaces, identity
├── index.ts            the active theme  <- the line a re-skin changes
├── cssVars.ts          derives the :root custom properties
└── tailwindPreset.ts   derives the Tailwind scale
```

`index.html` carries **no brand values**: its title, font links and `:root` block
are injected from the theme by a Vite plugin, in dev and build alike. The palette
therefore has exactly one source. It previously had three (a palette module, a
`:root` mirror and an unused Tailwind colour namespace) kept in step by a comment
saying "change both together".

Token names are **semantic**, not hue names, because `tealDeepest: '#8B0000'` is
what hue names produce the moment a client's brand is red. `data/brand.ts` maps
them back to the old names so every existing importer kept working unchanged.

Constraint inherited by everything in `theme/`: **no React, no DOM types,
literal values only.** That is what lets the browser, the Cloudflare Worker
(ES2022, no DOM lib), Tailwind's config loader and the Vite config all read the
same file.

**What did NOT move:** `SEGMENT_COLORS`, `LAYER_COLORS`, `OWNER_COLORS`,
`TEN_THINGS`, the gap ramp and `FOCUS` are still in `data/brand.ts`. They encode
meaning rather than brand, and their keys are the client's own audience stages.

## Seven pages

Every page carries real Lyka content. Business Dashboard was removed on
2026-08-11 on client direction: it was the one page that never held Lyka data,
rendering only an "awaiting data connection" empty state.

| Page | Content | State |
|---|---|---|
| **Ten Things The Data Says** | **Real Lyka** | Ten findings in a one viewport 5 x 2 grid, on the **dog owner basis** since 2026-08-10. Each opens a stepper modal with a Chart.js chart, five labelled blocks and the published numbers. |
| **Personas** | **Real Lyka** | 3-layer SVG sunburst. 5 personas across a 4-stage readiness ladder. Default landing page. |
| **Consumer Journey** | **Real Lyka** | 5 journeys (one per persona) x 5 Transtheoretical stages, with the study's own emotional and rational scores. |
| **Interactive Media Plan** | **Real Lyka** | Macro block grid with Chart.js pop-ups, from the client briefing workbook. 5 stages, 19 channels, $11.0M SPEED managed. |
| **APEX by SPEED** | **Real Lyka** | Channel scorecard. View tabs over 2 Roy Morgan audiences, 14 channels each. |
| **Notion Coworking Setup** | **Real Lyka** | Scrolling page proposing a shared Lyka x SPEED Notion workspace. Six sections, pure DOM/CSS visuals. |
| **Plugging Into The Ecosystem** | **Real Lyka** | Scrolling page on SPEED's operating role: plug into Lyka's existing team, data and tools rather than replace them. |

## What is Lyka and what is not

Converted from the Hamilton Island Standard Accelerator on 2026-07-31: the shell first, then the real audience model. Ten Things was ported on 2026-08-03 and moved onto the dog owner basis on 2026-08-10.

**Lyka:** all of it. The brand system, the colour architecture in `data/brand.ts`, both audience pages, Ten Things, the media plan (from the client briefing workbook, 2026-08-05) and APEX (from the APEX tool's Lyka Roy Morgan pull, 2026-08-07). The four-stage ladder (Unaware, Curious, Considering, Ready) comes from Roy Morgan Single Source profile exports. Every persona bullet and every journey cell is transcribed verbatim from the research, and all 50 journey scores are the study's own ratings. `personasData.ts` and `journeyDetailsData.ts` are both **generated** from the source documents rather than hand typed, so they cannot drift.

**Ten Things has TWO sources and which governs depends on the point.** `Lyka - Ten Things (Dog-Owner Basis).html` governs points 02, 03, 05, 07 and 10, which divide by a population and were redrawn against Roy Morgan's dog owner counts. `Lyka - Ten Things The Data Says.html` still governs 01, 04, 06, 08 and 09, whose charts are byte identical across both files. Both are one folder up, in `01 Sources/`.

**Still Hamilton Island:** nothing.

**Read [CLAUDE.md](CLAUDE.md) first**, in particular the header and "Wiring in the Lyka content model".

Six rules there are load bearing rather than advisory:

- **`data/brand.ts` is the single source of truth for colour.** It must stay free of React and DOM types (the Worker imports it) and use literal hex (Chart.js reads it off a canvas).
- **Journey bullet fields are semicolon delimited.** `renderStandardList` splits on `;`. Full stops only and the whole table cell renders as one long bullet.
- **Journey score strings need a dash before the description.** The graph's regex accepts `-`, en dash and em dash but not a colon, and with no separator it concatenates every digit in the string.
- **Never present one client's figures under another's labels.** This held APEX back for three days, because `data/apexData.ts` looked client agnostic while its indices were affluent traveller data. It is Lyka's since 2026-08-07, and `__integrity.ts` check 15 now enforces the rule from the other side by asserting the derived indices reproduce the export decks' published values.
- **Ten Things keeps its copy and its numbers in two files.** `tenThingsData.ts` holds the published tables as formatted strings, `tenThingsSeries.ts` holds what the charts plot. A chart must never parse its own labels. `__integrity.ts` asserts they agree.
- **One Ten Things series is DERIVED, not published.** Point 02's active figures are nowhere in the source: the redrawn chart labels only its totals. They recover exactly because retention is a rate among customers and so is invariant to the base, and the derivation reproduces the figure the source does publish for the top decile. It is labelled derived on screen and asserted in dev. **Ask the analyst for the underlying table.**
- **A stat that disagrees with its own chart never gets a quietly edited number.** Point 07's headline 1.60x against a chart topping out at 1.34x is unresolved, as is point 04's 34.1 to 36.2%; point 02's index of 179 is closed by the dog owner rewrite, which no longer quotes it. Each said so on screen in a `discrepancy` note until the client had all three deleted on 2026-08-10. **A fourth arrived with the new source:** point 06's own basis note says the ex kiosk figures of 125 and 84 supersede the 123 and 84 the chart plots, which would make the swing 41 points rather than 39, and the report it cites is not in the folder. The field and its renderer are kept, unset: restoring a note is one property, and the conflicts are still open.

## Verification

`npm run typecheck` cannot see the string-key joins between the data files, and `vite build` does not resolve `public/` paths. `data/__integrity.ts` covers both, in dev only. Run `npm run dev`, open the console, and expect a single `[data integrity] ok.` line. Anything else is a real problem.

## Deploy

⚠ **This section was stale and said "nothing is deployed... there is no git
remote".** Both halves were wrong. Read the Deploy section of CLAUDE.md, which is
maintained, rather than trusting a summary here.

The short version as at 2026-08-17: the deck has been deployed and public since
2026-08-10 on **two** hosts. **Netlify builds automatically from a push;
Cloudflare needs `npm run deploy:cf` and is the one that goes stale if you forget
it.** The two are gated differently, and `PUBLIC_ACCESS` in `worker/index.ts`
currently **bypasses the Cloudflare password gate entirely**.

Verify a deploy with a cache bypass. Immediately after one, an edge cached copy
served the previous build while the origin was correct, which looks exactly like
a failed deploy.

**Do not run `netlify deploy` without running `netlify link` first and confirming the target site.** This folder is a copy of the Hamilton Island app and its inherited site link pointed at the live Hamilton Island deck. It was deleted during the conversion.
