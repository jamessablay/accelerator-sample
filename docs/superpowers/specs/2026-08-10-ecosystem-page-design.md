# Plugging Into The Ecosystem: page design

**Date:** 2026-08-10
**Source:** `Plugging Into The Existing Ecosystem.html` (one folder up, in `Accelerator - Lyka/01 Sources/` since the 2026-08-11 reorganisation)
**Status:** approved, ready to build

## What and why

Add an eighth page to the Lyka Audience Accelerator that recasts the standalone
`Plugging Into The Existing Ecosystem.html` deliverable into the app's house
system. It states SPEED's operating role: not to replace Lyka's existing team,
data and measurement tools, but to plug in and make the whole ecosystem work
harder.

It sits **last in the nav, below Notion Coworking Setup**, because like the Notion
page it is a ways of working / positioning page rather than an audience or media
page, so it closes the deck.

## Precedent

This follows the **Notion Coworking Setup** page (`pages/NotionCoworkingSetup.tsx`,
added 2026-08-10) one for one, which is itself the reference for "port a standalone
HTML deliverable into the app":

- A **scrolling** presentation page (`animate-fadeIn` + `pb-16 md:pb-24`), not a
  one viewport frame.
- An inline `Section` shell: mono eyebrow (`micro`, `TRACKING.eyebrow`,
  `accentInk`) + Poppins display heading.
- **All copy in a pure TS data file** (`data/ecosystemData.ts`), house styled
  once there. No React, no DOM types in the data file.
- **DOM/CSS visuals, no SVG** (the gap matrix precedent), so none of the
  `svgFont` / `useElementSize` apparatus is pulled in.
- Static + hover only. No Modal, no new assets, no new `__integrity` checks
  (no silent string key joins, no asset paths, no new colour pairs).
- Palette from `data/brand.ts` `LYKA`, sizes from `data/type.ts` tokens.

## The source, and how it maps

The source has five blocks. Each maps onto a `Section`:

| Source block | App section |
|---|---|
| Header + hero ("Our role" / "Plug in. Strengthen what works…") | Page header (eyebrow + h1 + subtitle) |
| "Four connections into what already exists" + SVG hub diagram | Section A: `EcosystemDiagram` (DOM/CSS) |
| "What we would actually do" + 4 pillar cards (01 to 04) | Section B: numbered pillar cards |
| "The principle" dark band (3 phrases) | Principle band (three pills, `\|` separators) |
| "The outcome" + 5 bullet list | Section C + dark closing band |

### Header
- Eyebrow: `Lyka × SPEED | Our role` (real U+00D7).
- h1 (Poppins): `Plug in. Strengthen what works. Make the whole thing work harder.`
- Subtitle: the negative framing ("Lyka already has a sophisticated internal team,
  strong data capabilities and best in class measurement tools in place. Our role
  is not to replace or disrupt that infrastructure.") then the positive clause
  ("It is to plug in, strengthen what already works, and make the whole ecosystem
  work harder.") with the positive verbs emphasised in `accentInk`.

### Section A: EcosystemDiagram (DOM/CSS)
`components/ecosystem/EcosystemDiagram.tsx`. A central dark `tealDeepest` hub card
labelled "Lyka's ecosystem / Already in place" listing the three in place
capabilities (a sophisticated internal team, strong data capabilities, best in
class measurement tools), ringed by the four connection cards:

1. Measurement partnerships: operationalise the incrementality and mix modelling
   tools already there
2. Alongside the analysts: compare notes, share use cases, add perspective, not
   headcount
3. Measurement by design: testing and variation built into campaigns from the
   outset
4. Complementary data: new data, technology and partners, integrated safely

Responsive: on `md+`, a 2 x 2 grid of connection cards around the hub (hub centred
or spanning); below `md`, hub on top then the four cards stacked. Hovering a
connection card lifts it and highlights its tie to the hub (the
`SharedSpaceDiagram` focus/dim pattern: hovered card gains the `accentInk` border
and a connector accent; others dim slightly). Caption below, centred, `muted`:
`Nothing replaced. Everything additive.`

### Section B: What we would actually do
Four numbered cards reusing the `PillarCards` visual language exactly: white card,
mint hairline, `accentInk` top rule that thickens 4px to 8px on hover, big Poppins
number, `tealDeepest` title, italic `muted` lede, then body paragraph(s) in `ink`.
Each card carries the source's lede line plus its two body paragraphs.

### Principle band
A single band between B and C. Eyebrow "The principle", then three phrases as pills
("No duplication", "No unnecessary complexity", "Everything additive"). Light
treatment (cream/ivory card with `accentInk` pills), distinct from the dark closing
band so the page has one dark endpoint, not two adjacent.

### Section C + closing band
Eyebrow "The outcome", heading "A connected measurement and data ecosystem that:",
then the five outcome points as an accent dot list, ending on a dark `tealDeepest`
band (like the Notion `ClosingBand`) carrying the same five as the deck's closing
statement, or a one line restatement of the thesis. Ends the page deck like.

## Branding conversion

| Source | Lyka |
|---|---|
| green `#2E8B64` / `#236B4D` | `LYKA.accentInk #0A7D68`, `tealDark`, `tealDeepest` |
| accsoft wash `#EAF3EE` | `LYKA.cream` / a light accent wash |
| dark band `#1B2227 -> #0E1418` | `LYKA.tealDeepest #003D33` |
| Montserrat / Roboto / DM Mono | Poppins / DM Sans / DM Mono |
| SPEED red logo lockup | dropped (chrome carries the Lyka logo top right) |

## Copy: verbatim + a house style pass

Every string traces to the source HTML. House style fixes applied in the data file:

- **Hyphenated compound modifiers:** `best-in-class` to `best in class`,
  `test-and-learn` to `test and learn`, `decision-making` to `decision making`,
  `mix-modelling` to `mix modelling`, `day to day` already clean.
- **No em dashes** (source has none in body; keep it that way).
- `|` for UI separators, `:` for labels, "to" for ranges, real `×`.

Never invent a claim or figure not in the source.

## Files touched (the documented 8 wiring points + a data file)

1. `types.ts`: `ECOSYSTEM = 'Plugging Into The Ecosystem'` on the `Page` enum.
2. `data/ecosystemData.ts`: **new**, all copy, pure TS, house styled.
3. `pages/EcosystemFit.tsx`: **new**, the page with an inline `Section` shell.
4. `components/ecosystem/EcosystemDiagram.tsx`: **new**, the DOM/CSS hub diagram.
5. `components/icons/EcosystemIcon.tsx`: **new**, house icon contract (no props,
   h-6 w-6, `fill="currentColor"`, `React.memo`).
6. `App.tsx`: import + `case Page.ECOSYSTEM`.
7. `Sidebar.tsx`: import icon + `navItems` entry, last.
8. `metadata.json`: append to the description.

No `brand.ts` change (reuses `LYKA`). No new assets. No `__integrity` additions.

## Verification

- `npm run typecheck` (both app and worker configs).
- `npm run build`.
- Playwright at 1440x900 and 1280x800: the nav item appears last and opens the
  page; header, diagram, pillars, principle band and closing band all render;
  hover states work; page overflow 0; min rendered font >= 11px; the
  `[data integrity]` console line is still the single `ok` line (unchanged counts,
  since this page adds no data joins).

## Out of scope

- No deploy (the deck's deploy state is handled separately; another session has
  uncommitted work in this OneDrive synced folder).
- No commit as part of this task unless asked (concurrent session in flight).
- No changes to any of the eight files another session is currently editing.
