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
| **Ten Things The Data Says** | **Real Lyka** | Ten findings in a one viewport 5 x 2 grid. Each opens a stepper modal with a Chart.js chart, the published numbers, an implication and a test. |
| **Personas** | **Real Lyka** | 3-layer SVG sunburst. 5 personas across a 4-stage readiness ladder. Default landing page. |
| **Consumer Journey** | **Real Lyka** | 5 journeys (one per persona) x 5 Transtheoretical stages, with the study's own emotional and rational scores. |
| Interactive Media Plan | Hamilton | Macro block grid with Chart.js pop-ups. Needs a Lyka brief. |
| APEX by SPEED | Hamilton | Channel scorecard. Needs one Roy Morgan pull. |

## What is Lyka and what is not

Converted from the Hamilton Island Standard Accelerator on 2026-07-31: the shell first, then the real audience model. Ten Things was ported on 2026-08-03.

**Lyka:** the brand system, the colour architecture in `data/brand.ts`, both audience pages, and Ten Things. The four-stage ladder (Unaware, Curious, Considering, Ready) comes from Roy Morgan Single Source profile exports. Every persona bullet and every journey cell is transcribed verbatim from the research, and all 50 journey scores are the study's own ratings. `personasData.ts` and `journeyDetailsData.ts` are both **generated** from the source documents rather than hand typed, so they cannot drift. Ten Things comes from `Lyka - Ten Things The Data Says.html` one folder up, built on the Lyka acquisition and postcode files, the Mutinex GrowthOS MMM, ABS Census 2021 and Experian Mosaic.

**Still Hamilton Island:** the media plan and APEX data. Both need inputs that do not exist yet: a Lyka brief, and one Roy Morgan pull.

**Read [CLAUDE.md](CLAUDE.md) first**, in particular the header and "Wiring in the Lyka content model".

Six rules there are load bearing rather than advisory:

- **`data/brand.ts` is the single source of truth for colour.** It must stay free of React and DOM types (the Worker imports it) and use literal hex (Chart.js reads it off a canvas).
- **Journey bullet fields are semicolon delimited.** `renderStandardList` splits on `;`. Full stops only and the whole table cell renders as one long bullet.
- **Journey score strings need a dash before the description.** The graph's regex accepts `-`, en dash and em dash but not a colon, and with no separator it concatenates every digit in the string.
- **Never relabel `data/apexData.ts` figures as Lyka.** They are affluent traveller Roy Morgan data. `pages/ApexBySpeed.tsx` carries a visible placeholder notice for that reason.
- **Ten Things keeps its copy and its numbers in two files.** `tenThingsData.ts` holds the published tables as formatted strings, `tenThingsSeries.ts` holds what the charts plot. A chart must never parse its own labels. `__integrity.ts` asserts they agree.
- **A stat that disagrees with its own chart never gets a quietly edited number.** Point 07's headline 1.60x against a chart topping out at 1.34x is unresolved, as are point 02's index of 179 and point 04's 34.1 to 36.2%. Each said so on screen in a `discrepancy` note until the client had all three deleted on 2026-08-10. The field and its renderer are kept, unset: restoring a note is one property, and the conflicts are still open.

## Verification

`npm run typecheck` cannot see the string-key joins between the data files, and `vite build` does not resolve `public/` paths. `data/__integrity.ts` covers both, in dev only. Run `npm run dev`, open the console, and expect a single `[data integrity] ok.` line. Anything else is a real problem.

## Deploy

Nothing is deployed. `netlify.toml` and `wrangler.jsonc` are configured but unlinked, and there is no git remote.

**Do not run `netlify deploy` without running `netlify link` first and confirming the target site.** This folder is a copy of the Hamilton Island app and its inherited site link pointed at the live Hamilton Island deck. It was deleted during the conversion. See the Deploy section of CLAUDE.md.
