# Plan: "Notion Coworking Setup" page

**Status: planned, not implemented.** This document is the complete handoff for an AI
implementer. It contains the source deck's full content (the implementer does not need
to open the PPTX), the page architecture, every file to create and edit, the design
system contracts to follow, and the verification pass. Read the repo's `CLAUDE.md`
before starting; where this plan restates it, the restatement is for convenience and
`CLAUDE.md` remains authoritative.

## 1. Context and goal

SPEED is switching this pitch from PPT presentation to webpage presentation. The
10-slide deck `Lyka Notion Coworking Setup.pptx` (in
`...\The Speed Agency - Documents\New Business\Lyka\`) proposes a shared Lyka × SPEED
Notion workspace that both teams and both Claudes keep current.

The task: add a **seventh page** to this app carrying that content. This is NOT a
slide transcription. The content transitions into an interactive, visual webpage,
consistent in design and style with the existing pages (LYKA palette, type tokens,
mint hairline borders, mono eyebrows, pill radii, the one easing curve).

> **PPTX access note:** the source file is a OneDrive cloud placeholder and direct
> reads fail with `PermissionError`. If it ever needs re-reading, `Copy-Item` it to a
> local temp path first (the copy hydrates it). It should not need re-reading: the
> full text content is transcribed in section 3 below.

## 2. User decisions (already made, do not re-ask)

| Decision | Answer |
|---|---|
| Sidebar label | `Notion Coworking Setup` (house-styled, not "CoWorking") |
| Sidebar position | **Last**, below Ten Things The Data Says |
| Styling | Follow the webpage's design system, not the PPTX's look |
| Two-party colours | Reuse the app's existing `OWNER_COLORS` (lyka green `#0A7D68`, speed red `#E8151B`) for the Lyka/SPEED split; amend the `brand.ts` doc comments (see 6.5) |
| Pillar cards | Bullets always visible; no expand, no modal |
| Before/after | Static paired rows, hover emphasis only |
| Compounding visual | Minimal one-shot animation, `prefers-reduced-motion` respected, degrades to static |

## 3. Source deck content (source of truth for copy)

Ten slides. The `×` below is a real multiplication sign (U+00D7); keep it. The deck
uses em dashes throughout; these MUST be rewritten per the house style pass (section 7).

1. **Cover**: "lyka × SPEED".
2. **Knowledge shouldn't live in inboxes**. "Context can be scattered across emails,
   decks, calls and files. It ages fast, and gets lost. Both our teams have powerful
   AI. But it only knows what it's told. What if we shared one living space that both
   teams, and both AIs, kept current?" Visual: four scattered chips (Emails, Decks,
   Call notes, Files) converging into "One shared space".
3. **One shared space for Lyka × SPEED**. "A single Notion workspace we both work in,
   always current." Diagram: Lyka team + Lyka's Claude ↔ Shared Space ↔ SPEED team +
   SPEED's Claude. Caption: "Both teams read and contribute, and both AIs use it to
   find, draft, and add knowledge."
4. **Everything about our work, in four places**:
   - *Shared Strategy & Context*: positioning, dog parent audiences, growth
     priorities, media strategy, ways of working
   - *Meeting Notes & Decisions*: chemistry & planning notes, key decisions, open
     questions, actions
   - *Data & Measurement Context*: GA4 notes, subscription & retention metrics, media
     spend, assumptions
   - *Working Documents*: draft briefs, strategy territories, hypotheses, reporting
     commentary
5. **Your Claude, plugged into our shared space**. Three steps:
   1. *Connect*: "Connect your Claude to your space, once. Lyka already has
      Notion + Claude."
   2. *Ask & draft*: "Ask questions and get answers from what's really in the space.
      Draft briefs and notes with it."
   3. *Contribute*: "Add what you create for us to see. The space stays current, on
      both sides."
   Footnote: "We work the same way on our side, so the space always reflects the
   latest thinking."
6. **How it feels in practice**. Four steps:
   1. *We meet*: "Planning session on an upcoming Lyka campaign; notes land in the
      space." (actor: both)
   2. *Lyka adds context*: "A new recipe launch or subscription change; Lyka's Claude
      helps write it up." (actor: lyka)
   3. *SPEED drafts*: "SPEED's Claude picks it up and drafts strategy territories."
      (actor: speed)
   4. *We refine together*: "Decisions and next steps captured live." (actor: both)
7. **The context compounds**. "Every decision, brief, and insight lives in one place,
   and stays. New team members (or a fresh AI session) are instantly up to speed on
   Lyka. Less re-explaining. More building on what we already know." Visual: Month 1 /
   Month 3 / Month 6 growing stacks, caption "Knowledge accumulates the longer we work
   together".
8. **Private, and yours alone**. "Your space is shared only between Lyka and SPEED; no
   other client can see it. You access it with your own login, nothing to hand over.
   Every entry shows who added it, and nothing is treated as final until it's
   confirmed." Visual: Lyka + SPEED chips inside a boundary; three "Other client"
   boxes outside marked "No access".
9. **From scattered to shared**. Five before → after pairs:
   | Before | With our shared space |
   |---|---|
   | Scattered emails & attachments | One living source of truth |
   | Re-briefing every time | Both teams contribute, always current |
   | Context stuck with one person | Everyone shares the same context |
   | AI guessing without context | AI grounded in real context |
   | Momentum lost between meetings | Momentum carried between meetings |
10. **You're already set up**. "Notion + Claude already set up; that's all it takes."
    Three steps: *We create your space* ("We set up your shared Notion space, nothing
    for you to build") / *You connect Claude* ("You link your own Claude to the space,
    once") / *We start co-building* ("Beginning with our very next session together").
    Closing note: "Light touch: no new tools, no migration."

Copy may be tightened for the web, but every string must trace to a slide. Never
invent claims or figures.

## 4. Page architecture: header + six sections, scrolling page

A **scrolling page** like `pages/ApexBySpeed.tsx` (root `animate-fadeIn` +
`pb-16 md:pb-24`), NOT a one-viewport frame. Ten slides of narrative read top to bottom.

**Header** follows `pages/TenThings.tsx` exactly:
- mono uppercase eyebrow: `text-micro font-bold uppercase font-mono`,
  `letterSpacing: TRACKING.eyebrow`, `color: LYKA.accentInk`. Suggested copy:
  `Lyka × SPEED | Ways of working`.
- `h1` in `font-display`, `color: var(--lyka-teal-deep)`. Suggested: "One shared
  space for Lyka × SPEED" (the page name stays "Notion Coworking Setup" in the nav).
- subtitle in `LYKA.muted`, carrying slide 2's thesis.
- **`md:mr-[92px]` on the header** to clear the Lyka logo that `App.tsx` pins
  absolutely top-right on every page.

| Section | Slides | Treatment |
|---|---|---|
| **A. The problem** | 2 | Four scattered chips (Emails, Decks, Call notes, Files) at small skewed CSS rotations/offsets on the left, an arrow, one clean "One shared space" card on the right. Hovering a chip straightens and lifts it. Pure DOM/CSS transforms, no SVG. |
| **B. The shared space** | 3 | Hub diagram in DOM (flex + connector bars, not SVG paths): Lyka team + Lyka's Claude \| Shared Space card \| SPEED team + SPEED's Claude. Sides coloured via `OWNER_COLORS`. Hovering either side dims the other (the focus/dim pattern in `components/apex/ApexMethodology.tsx`). Stacks vertically below `md`. |
| **C. Four places** | 4 | Four pillar cards in `md:grid-cols-2 xl:grid-cols-4`, styled like ApexMethodology's source cards: white card, mint hairline, accent top rule, big `font-display` number, title, blurb, bullet list with accent dots. Bullets always visible. |
| **D. How it works** | 5 + 6 | Top: the three setup steps as a numbered horizontal strip, footnote line beneath. Bottom: "How it feels in practice", four step cards each carrying an actor tag (Lyka / SPEED / Both) in the two-party colours; hovering a step highlights its actor tag consistently across the strip. |
| **E. Compounds + Private** | 7 + 8 | Side by side at `lg`, stacked below. Left: Month 1/3/6 as three growing stacks of small rounded DOM bars; one-shot height animation via IntersectionObserver, `prefers-reduced-motion` renders the final state immediately. Right: privacy boundary: Lyka + SPEED chips inside a mint-bordered rounded well; three muted "Other client" chips outside with "No access" tags. Static. |
| **F. Scattered → shared + close** | 9 + 10 | Five before→after paired rows: before styled muted, an arrow, after styled teal; hover emphasises the row. Then a closing band on `LYKA.tealDeepest` (like ApexMethodology's dark formula bar): "You're already set up", the three closing steps as pills, and "Light touch: no new tools, no migration." Ending dark gives the page a deck-like close. |

## 5. Files to create

```
data/notionCoworkingData.ts               all copy; pure TS, no React, no DOM types
components/icons/NotionCoworkingIcon.tsx  sidebar icon
components/notion/SharedSpaceDiagram.tsx  section B
components/notion/PillarCards.tsx         section C
components/notion/PracticeWalkthrough.tsx section D bottom
components/notion/CompoundingVisual.tsx   section E left
components/notion/BeforeAfter.tsx         section F pairs
pages/NotionCoworkingSetup.tsx            the page host
```

Sections A, D-top, E-right (privacy) and the closing band are simple enough to live
inline in the page component. Extract later only if they grow.

### 5.1 `data/notionCoworkingData.ts`

Header comment names the source PPTX and documents the house-style pass (mirroring how
`data/tenThingsData.ts` documents its own). Shape:

```ts
export type CoworkActor = 'lyka' | 'speed' | 'both';  // typed union: tsc enforces it,
                                                       // so no __integrity check needed

export interface CoworkPillar {
  id: string; number: string; title: string; blurb: string; items: readonly string[];
}
export interface CoworkStep { number: string; title: string; body: string; }
export interface CoworkPracticeStep extends CoworkStep { actor: CoworkActor; }
export interface CoworkContrast { before: string; after: string; }
export interface CoworkMonth { label: string; level: number; }  // stack height 1..3

export const SCATTERED_SOURCES: readonly string[];        // 4: Emails, Decks, Call notes, Files
export const PILLARS: readonly CoworkPillar[];            // 4
export const SETUP_STEPS: readonly CoworkStep[];          // 3
export const SETUP_FOOTNOTE: string;
export const PRACTICE_STEPS: readonly CoworkPracticeStep[]; // 4
export const COMPOUNDING: readonly CoworkMonth[];         // Month 1 / 3 / 6
export const PRIVACY_POINTS: readonly string[];           // 3
export const CONTRASTS: readonly CoworkContrast[];        // 5
export const CLOSING_STEPS: readonly CoworkStep[];        // 3
export const CLOSING_NOTE: string;
```

No `data/__integrity.ts` additions are needed: there are no silent string-key joins,
no asset paths, no new colour pairs (`OWNER_COLORS` ink pairs are already asserted by
check 6a). The integrity `ok` line's counts do not change.

### 5.2 `components/icons/NotionCoworkingIcon.tsx`

House icon contract, verbatim from the existing 18 icons: no props,
`className="h-6 w-6"`, `viewBox="0 0 24 24"`, `fill="currentColor"` (no stroke),
wrapped in `React.memo`, default export, doc comment saying what the glyph depicts.

Glyph: **two overlapping rounded squares** (two workspaces meeting in one shared
space), drawn as filled paths with even-odd cutouts like the existing icons. Do NOT
draw the actual Notion logo: trademark, and it reads as an external link rather than
a page. Must read at 24px in the sidebar. (The sidebar renders `{item.icon}`
unconditionally, so a missing icon is a silent blank cell.)

## 6. Files to edit (the documented eight-place wiring, plus two)

Per `CLAUDE.md`, adding a page touches exactly eight places:

1. **`types.ts`**: add `NOTION_COWORKING = 'Notion Coworking Setup'` to the `Page`
   enum (the string value IS the visible label).
2. **`components/icons/NotionCoworkingIcon.tsx`** (created above).
3. **`pages/NotionCoworkingSetup.tsx`** (created above).
4. **`App.tsx`**: import + `case Page.NOTION_COWORKING: return <NotionCoworkingSetup />;`
5. **`components/Sidebar.tsx`**: import + append to `navItems`:
   `{ page: Page.NOTION_COWORKING, icon: <NotionCoworkingIcon />, label: 'Notion Coworking Setup' }`.
   Array order = rendered order; append **last** (below Ten Things).
6. **`metadata.json`**: extend the description with the new page. While there, fix the
   stale trailing clause ("Media plan and APEX content still pending..."): both opened
   in August 2026.

Plus two this task adds:

7. **`data/brand.ts`**: amend the `speedRed` doc comment and the `OWNER_COLORS` header
   to name the Notion Coworking page as a second sanctioned consumer of the two-party
   colours (they currently sanction the media plan only, and the comments must stay
   true). Use only `base` and `ink` from the owner sets on this page: the `weight`
   rungs are gantt-specific.
8. **`CLAUDE.md`**: "six pages" → "seven pages" (it appears in "What this is" and
   "Routing model", and "All six nav items" in the routing section), add the page
   bullet to the page list, add `data/notionCoworkingData.ts` to the data-model table,
   add the new files to the file-layout tree, and record the OWNER_COLORS reuse
   decision.

## 7. House style pass on the copy (apply in the data file, once)

These are standing workspace rules the user actively corrects:

- **No em dashes.** The deck is full of them. Rewrite with a colon, comma or full
  stop, whichever the sentence wants. Example: "Both teams have powerful AI, but it
  only knows what it's told."
- **No hyphenated compound modifiers**: "dog parent audiences", not "dog-parent".
- **`|` for UI separators** (eyebrows, tab subs), `:` for labels, "to" for ranges.
- Keep the real `×` in "Lyka × SPEED".

## 8. Design system contracts (restated from CLAUDE.md for convenience)

- **Colour** comes from `data/brand.ts` (TS/TSX imports) or the `--lyka-*` CSS custom
  properties in `index.html` (inline `style={{}}`). Never paste a new hex. Key
  tokens: `tealDeepest #003D33`, `tealDark #005648`, `ink #143C33`,
  `accentInk #0A7D68`, `accent #10B193` (FILL ONLY, ~2.7:1), `orange` / `tangerine`
  (fill only), `peach #FEE9DA`, `pageBg #FFFBED`, `ivory #F9F6F1`, `cream #F0F2E9`,
  `mint #DBE6DC` (hairline borders), `mintMuted #A9C3B4` (**fill/border only, never
  ink**, asserted by integrity 6c), `muted #5B6E64` (the palest legal ink),
  `speedRed #E8151B` (SPEED itself only).
- **Do not borrow the page-owned bands**: `SEGMENT_COLORS`, `LAYER_COLORS`,
  `TEN_THINGS`, the `GAP_*` ramp, `FOCUS`. `OWNER_COLORS` is the one sanctioned
  borrow here (decision in section 2).
- **Contrast floors**: ink on any fill ≥ 4.5:1 AA; non-text marks ≥ 3:1. Text on an
  `OWNER_COLORS` base uses that set's paired `ink` token, never hardcoded
  `text-white`.
- **Type** comes from `data/type.ts` / the Tailwind utilities `text-micro` through
  `text-display` (micro 11 is uppercase mono eyebrows ONLY; body 14 is the prose
  floor; never write `text-[9.5px]`). `TRACKING.eyebrow` = 0.08em.
- **Display headings**: `font-display` (Poppins), no `tracking-wide`, check at 1280
  as well as 1440.
- **Shape and motion**: mint hairline borders instead of shadows, pill radii on
  buttons, the global easing `var(--lyka-ease)` applies automatically.
- **DOM over SVG** for layout visuals (the gap-matrix precedent): CSS grid/flex gets
  real CSS px for free; SVG drags in the whole `svgFont` + `useElementSize`
  compensation apparatus.
- **Prefer static + hover** over stateful interactions; this is a presentation page,
  not a data-viz page. The Modal is not needed under the decided scope.
- `React.FC<Props>` annotations are decorative (@types/react is NOT installed).
  Annotate the destructured parameter directly: `({ steps }: Props)`, as the apex
  components do.

## 9. Implementation order

1. `data/notionCoworkingData.ts` first (forces all copy and style decisions before
   any layout exists).
2. `components/icons/NotionCoworkingIcon.tsx`.
3. The five `components/notion/` components, in section order (B, C, D, E, F).
4. `pages/NotionCoworkingSetup.tsx` (header, sections A to F, inline pieces).
5. Wiring: `types.ts`, `App.tsx`, `Sidebar.tsx`, `metadata.json`, `brand.ts` comments.
6. Docs: `CLAUDE.md` updates.

## 10. Verification

1. `npm run typecheck`: runs BOTH configs (app + worker). The data file must stay
   React-free and DOM-type-free or the worker config breaks.
2. `npm run dev` with the browser console open: exactly one `[data integrity] ok`
   line and nothing else. Its counts should NOT change (no new checks, no new assets
   registered).
3. **Render verification** (Playwright MCP is available and is the house norm; static
   reasoning has been wrong here before). At 1440×900 and 1280×800:
   - header clears the top-right Lyka logo (the `md:mr-[92px]`);
   - hub diagram stacks below `md`; nothing overflows horizontally (page overflow 0);
   - the closing dark band's text contrast (white/light ink on `tealDeepest`);
   - hover/dim behaviour on the diagram and the practice walkthrough;
   - compounding animation fires once on scroll-in and respects
     `prefers-reduced-motion`;
   - nothing renders under 11px and no prose under 14px (measure rendered px);
   - keyboard focus is visible on any interactive element.
4. Click through the other six pages to confirm no regression (the Sidebar edit is an
   array append only).
5. **Source control**: do not commit or push unless asked. If asked: plain `git push`
   only; NEVER `git push --all` / `--mirror` (two local branches carry another
   client's history and must never reach the remote).
