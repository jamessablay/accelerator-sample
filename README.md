# Lyka Audience Accelerator

A SPEED Standard Accelerator for Lyka (fresh, human grade dog food, direct to consumer subscription).

React 19 + TypeScript 5.8 on Vite 6. Tailwind via CDN. Custom SVG sunburst (no chart library) plus Chart.js for the media plan and Ten Things. No router: a `Page` enum in `types.ts` drives a switch in `App.tsx`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # dist/
npm run preview
npm run typecheck  # app + worker. The only gate: no tests, no lint.
```

## Six pages

| Page | Content | State |
|---|---|---|
| Business Dashboard | — | Designed empty state, awaiting a Lyka Power BI report |
| **Ten Things The Data Says** | **Real Lyka** | Ten findings in a one viewport 5 x 2 grid, on the **dog owner basis** since 2026-08-10. Each opens a stepper modal with a Chart.js chart, five labelled blocks and the published numbers. |
| **Personas** | **Real Lyka** | 3-layer SVG sunburst. 5 personas across a 4-stage readiness ladder. Default landing page. |
| **Consumer Journey** | **Real Lyka** | 5 journeys (one per persona) x 5 Transtheoretical stages, with the study's own emotional and rational scores. |
| **Interactive Media Plan** | **Real Lyka** | Macro block grid with Chart.js pop-ups, from the client briefing workbook. 5 stages, 20 channels, $11.0M SPEED managed. |
| **APEX by SPEED** | **Real Lyka** | Channel scorecard. View tabs over 2 Roy Morgan audiences, 14 channels each. |

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

Nothing is deployed. `netlify.toml` and `wrangler.jsonc` are configured but unlinked, and there is no git remote.

**Do not run `netlify deploy` without running `netlify link` first and confirming the target site.** This folder is a copy of the Hamilton Island app and its inherited site link pointed at the live Hamilton Island deck. It was deleted during the conversion. See the Deploy section of CLAUDE.md.
