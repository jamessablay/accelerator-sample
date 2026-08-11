# CLAUDE.md — Lyka Audience Accelerator

This file gives Claude Code the architecture, data model and known quirks for this app. The workspace-level `CLAUDE.md` two folders up has the cross-project map.

> ## STATE AS OF 2026-08-11, LATEST (Business Dashboard was removed)
>
> **The deck is SEVEN pages.** On client direction, Business Dashboard is gone:
> the page, its icon, the `Page` enum member, the nav entry and the `App.tsx`
> switch case. Anything below this block that counts eight pages, or that
> explains how to wire a Power BI URL into it, is superseded.
>
> **It was the only page that never carried Lyka data.** `REPORT_URL` was
> `null` because the inherited Power BI embed belonged to **another client** and
> was deleted at conversion, so the page only ever rendered an "awaiting data
> connection" empty state. Removing it does not lose a Lyka asset.
>
> **The removal was cheap for a reason worth knowing before adding a page: this
> app has NO URL routing.** `activePage` is `useState`, never read from
> `location`, so a `Page` member is reachable only through the nav array.
> Deleting one therefore cannot break a deep link, a bookmark or a shared URL,
> which is exactly the audit a router based deck would have needed. The flip
> side is that nothing in this deck is linkable, which is why the two variant
> switchers had to invent their own `?pv=` / `?jv=` params.
>
> Restoring it is a page add, the eight places listed under "Routing", from git
> history at `7d3233b~1`.
>
> Gates: typecheck (both configs), the production build, `[data integrity] ok`
> in a browser, and the seven nav items verified rendered at 1920x1080 with the
> deck landing on Personas as before.
>
> ### ⚠ NETLIFY AUTO DEPLOYS FROM GITHUB. The "structural drift" note was wrong
>
> Three files claimed **no auto deploy exists on either host**, so every round
> had to be pushed to Cloudflare and Netlify separately or one retired. **Half
> of that is false and it was proved by accident here.** `git push` alone put
> the new bundle on Netlify: minutes later both hosts served `index-XGKiujCI.js`
> **byte identical** (`cmp` on both downloads, 718,606 bytes), with distinct
> `Server: Netlify` and `Server: cloudflare` headers, and that hash did not
> exist before this commit. So Netlify builds from `origin/lyka-main` on push.
>
> **Cloudflare is the one that needs the manual step** (`npm run deploy:cf`).
> The practical rule inverts: push, then deploy Cloudflare, and the two are
> level. Forget the second step and **Cloudflare is the stale one**, which is
> the opposite of what the old note would have you check.
>
> This also explains the standing "both hosts are behind the branch" item: the
> nav reorder sat undeployed from 2026-08-10 because **nothing had been pushed
> since**, not because two manual deploys were being missed. It is resolved now.
>
> **One caveat that is not a defect.** Immediately after deploying, a browser
> read Cloudflare's edge cache and still rendered eight nav items while `curl`
> proved the origin correct. Both serve `Cache-Control: max-age=0,
> must-revalidate`, so it clears on revalidation, but **verify a deploy with a
> cache bypass or you can measure your own stale copy** and conclude the deploy
> failed. That is exactly the wrong conclusion to reach at a client's desk.
>
> ## STATE AS OF 2026-08-11 (the project folder was reorganised)
>
> **No code changed. Comments and docs only**, across eight files. Typecheck (both
> configs) and the production build are clean. But two things a code reader must
> know, and one real factual correction landed inside the app.
>
> **1. EVERY `// Source of truth:` HEADER NOW POINTS INTO A SUBFOLDER.** The
> project folder one level up was flat and is now four numbered folders. The
> sources this app was generated and transcribed from are in
> `Accelerator - Lyka/01 Sources/`, and the two client review decks are in
> `02 Client Feedback/`. The headers in `ecosystemData.ts`, `mediaPlanData.ts`,
> `tenThingsData.ts`, `tenThingsSeries.ts` and this file were updated. Anything
> still saying only "in the project folder" is still TRUE, since a subfolder is
> in the project folder, and was left alone.
>
> **2. `../worker-gate-and-tooling.patch` IS THE ONLY TRUE RELATIVE PATH OUT OF
> THIS APP**, which is why the patch was deliberately left at the wrapper's top
> level while everything else moved. Every other mention of an outside file in
> this repo is prose location, not a path, so **a link checker would have called
> that reorganisation safe when it was not.** If the patch ever has to move,
> that reference is the thing to fix.
>
> ### The correction: `personaMedia.ts` described a file it no longer ships
>
> Its header said "Five Veo generated vignettes ... Each is 1080x1920 h264, 8
> seconds, 24fps". **Four of the five.** Conflicted Troubleshooters was replaced
> on 2026-08-10 (commit `2a06e7f`) with a grok vignette at **720x1280, 8.04s**,
> and the comment was wrong from that day until ffprobing the five shipped files
> caught it here. The wrapper's own inventory had the same defect and no row for
> the replacement file at all.
>
> **The reusable point is why nothing caught it.** The replacement reused the
> path, so the `PERSONA_VIDEOS` join still resolves, the file still exists, and
> `__integrity.ts`'s `video/*` Content-Type check still passes. **Every guard here
> asks whether a declared path resolves, and a swapped file passes all of them.**
> Only measuring the file finds it, and "is this the right footage" is not a
> property code can hold, so for a replacement the comment IS the check.
>
> ### Also
>
> `hamilton-island-media-plan/`, the Hamilton Island variant that used to sit
> beside this app, was **deleted** after a full recursive diff including `dist/`
> proved the copy at `RFI - Hamilton Island - Full Response/Standard Accelerator/`
> identical (and a strict superset, holding a `.netlify/` folder this one lacked).
> Nothing here imported from it. ⚠ Neither copy had a `.netlify/state.json`, so
> that live site needs `netlify link` from the canonical folder before a deploy.
>
> ## STATE AS OF 2026-08-10, LATEST (Steph's review round: five pages)
>
> A client review round from Steph landed as one commit, `f5968ec`, pushed;
> `origin/lyka-main` is at **40** (verify with `git rev-list --count lyka-main`).
> Ten files, all verified in the browser after edit.
>
> | | |
> |---|---|
> | Business Dashboard | Everything under "Lyka's commercial picture, in one place" removed: the paragraph and the eight metric list. The empty state is icon, eyebrow, heading. `PENDING_METRICS` deleted with it |
> | Journey: Mindful Researchers | The dynamic drops "Their journey is not about creating category interest" and now reads positively. `journeyMeta.ts`, hand maintained, safe |
> | Journey: Devoted Caterers / Action | The "cut off in the source deck" note is GONE from all three renderers, by trimming the descriptor to its last complete item ("...portions and transition progress.") so `isTruncatedDescriptor` no longer fires. **The trim is in GENERATED `journeyDetailsData.ts` and a regeneration reverts it**, at which point the note comes back on its own, which is why the detector and the three note sites are kept. Nothing was invented; the dangling fragment was dropped |
> | APEX: BVOD row | "Boxes cut off on my large monitor" was the top row's hover tooltips clipping 66px against the table card's `overflow-hidden`. All three tooltip types (score pill, tier pill, star cell) now PORTAL to `document.body` with fixed positioning and an above/below flip, the Lightbox pattern. Verified at 1920x1080 and 2560x1440, both directions |
> | Ten Things 04 | "inner ring professional" is "inner city professional". (Point 07's map ALT TEXT still says "inner ring along the river" about Perth; that is geography, screen reader only, deliberately left) |
> | Ten Things 05 + 06 | Both charts lose their second in card heading; `TenThingsChart.title` is **optional** now and the h3 is skipped when unset. 06 is retitled "Two months of the year are dependable. The rest are not" (tile + modal h2, per Steph's wording) |
> | Ten Things 07 | What we found leads with "The strongest regions are Sydney Central and Sydney Northern" instead of "On the true base", which needed explaining |
> | Notion | Setup headline is "Your Claude, plugged into a shared space"; "our" read as SPEED owning it |
>
> Gates: typecheck (both configs), production build, `[data integrity] ok`
> (19 media rows, 28 apex rows), and the Ten Things tile grid re-measured
> unchanged at 242.1px after the 06 retitle.
>
> **The concurrent session's eighth page (Plugging Into The Ecosystem) landed
> as `530659b`** while this round was being deployed, so both rounds are on the
> branch. The round first went to Cloudflare from the COMMITTED state `f5968ec`
> via a throwaway worktree (version `30cb8f65`), which excluded the then
> uncommitted Ecosystem page; **Cloudflare was then re-deployed at the branch
> tip (version `743a52b8`) once the page had landed**. That session also put
> the deck on **Netlify at https://speed-x-lyka-accelerator.netlify.app**, so
> the deck is now live on TWO public hosts; both were verified serving BYTE
> IDENTICAL bundles (`index-D_TAyPJ9.js`, compared with `cmp`, not by eye).
> Keep them level: `npm run deploy:cf` only updates Cloudflare, and there is
> still no auto deploy on either, so every round needs both pushed manually or
> one of the two retired.
>
> **⚠ That last sentence is WRONG and was corrected on 2026-08-11. Netlify auto
> deploys from GitHub; Cloudflare is the only manual one.** See the top block.
>
> ## STATE AS OF 2026-08-10 (media plan round 2 + first public deploy)
>
> Two things a code reader must know before trusting the sections below, both of
> which several inline notes predate:
>
> **1. THE DECK IS DEPLOYED AND FULLY PUBLIC.** First ever deploy, to Cloudflare
> Workers on client direction:
> https://speed-x-lyka-accelerator.aaronzspeed.workers.dev (version `d0c19798`).
> A `PUBLIC_ACCESS` flag at the top of `worker/index.ts` **BYPASSES the password
> gate**, so anyone with the link sees the confidential deck. The gate code is
> intact below the flag; flip it to `false` and redeploy to re-gate.
> `SITE_PASSWORD` / `SESSION_SECRET` are set on the Worker but unused while
> public. This reverses every "not deployed, local only" line in the Deploy and
> Source control sections below. `origin/lyka-main` is at **39 commits** (`2a06e7f`
> video swap, `3ed6ac2` public access, `7faf486` media plan round).
>
> **2. A SECOND MEDIA PLAN ROUND LANDED (Marah, 2026-08-10), so parts of the
> "Interactive Media Plan page" section below are now stale:**
> - **20 channels is now 19** (10 SPEED, 9 in house). Radio Segment was removed
>   and its $50,000 folded into Nova Ear Worm (Rosella Boy) with Wippa, now
>   $400,000 (the extra $50,000 on November). SHOW IT 4,255,000 to **4,205,000**,
>   CHECK IT 5,650,000 to **5,700,000**; MEDIA_TOTAL still $11,000,000, January
>   still $3,295,000. A $0 "Package" row fails integrity 5b-iii, so `budgetLabel`
>   is now UNUSED (kept for reuse) and `nova-studio.jpg` is unreferenced.
> - **`FLIGHTING_PCT` is now DERIVED** from the plan's monthly grand totals (at
>   the FOOT of `mediaPlanData.ts`, after `PLAN_LAYERS`), so the "UNRESOLVED /
>   awaiting a call" flighting note is resolved: the dashed overlay matches the
>   bars. NB Marah did not confirm this method (she wanted a Teams chat); it is
>   Aaron's call.
> - **Paramount+ is removed from the BVOD copy.** The "still named / flagged"
>   note is resolved. NB Marah's email wanted it KEPT (she restored the logo);
>   Aaron chose removal, so flag the drop when it goes back to her.
> - **Premium Linear News & Sport TV** carries the client's blended rationale
>   (Strategy kept, both directives). **BBL & Cricket** still has both rationales
>   back to back, awaiting Marah's blend. Her `metrics` repeats "message
>   take-out" (verbatim, flagged).
>
> Full detail in `Accelerator - Lyka/CLAUDE.md`.
>
> ## READ THIS FIRST: what is Lyka and what is not
>
> Converted from the **Hamilton Island** Standard Accelerator on **2026-07-31** (shell), then given the real Lyka audience model the same day (personas and segments), the real Lyka media plan on **2026-08-05**, and the real Lyka APEX pull on **2026-08-07**. **Every page now carries Lyka content.**
>
> | Real Lyka | Still Hamilton Island |
> |---|---|
> | Brand palette, typography, client logo, page chrome, every page heading | (nothing) |
> | All colour, centralised in [data/brand.ts](data/brand.ts) | |
> | **[data/personasData.ts](data/personasData.ts)** 5 personas | |
> | **[data/categoryData.ts](data/categoryData.ts)** the 4-stage readiness ladder | |
> | **[data/journeyDetailsData.ts](data/journeyDetailsData.ts)** 5 journeys × 5 stages | |
> | **[data/tenThingsData.ts](data/tenThingsData.ts)** + **[data/tenThingsSeries.ts](data/tenThingsSeries.ts)** 10 findings, on the dog owner basis since 2026-08-10 | |
> | **[data/mediaPlanData.ts](data/mediaPlanData.ts)** the Oct→Sep plan: 5 stages, 20 channels, $11.0M | |
> | **[data/apexData.ts](data/apexData.ts)** 2 audiences × 14 channels, from the APEX tool's Lyka Roy Morgan pull (2026-08-07) | |
> | The Personas sunburst, the Consumer Journey, Ten Things, the Interactive Media Plan, APEX, and every detail panel | |
> | Hamilton Island Power BI embed **removed** | |
>
> ### APEX opened on 2026-08-07 (pass 19)
>
> Two APEX tool export decks landed in the project folder (one per audience:
> Conflicted Troubleshooters and Mindful Researchers) and the page was rebuilt
> from them and opened the same day: the `SHOW_ALL` / `?show=all` gate in
> [App.tsx](App.tsx) was deleted along with `pages/PendingSections.tsx` and
> `components/shared/PendingSection.tsx` (both recoverable from git history if a
> section ever needs holding back again). The page is now the tool's report
> shell in miniature: view tabs **About | True Net Worth Index | Growth
> Quadrant**, with a persona tab strip inside the two data views. See "The APEX
> page" below for the architecture and the editing rules.
>
> The Business Dashboard still awaits a Lyka Power BI URL, but it has always
> rendered its own designed empty state rather than another client's data.
>
> ### The audience model
>
> A four-stage readiness ladder with five personas. The stage names are not an agency framework: they are the descriptions on four **Roy Morgan Single Source profile exports** (`Unaware / Curious / Considering / Ready Owner.prwx`). Sources live in `.../The Speed Agency - Documents/New Business/Lyka/Roy Morgan/`.
>
> | Stage | Persona | Market | Lyka customers | Fit |
> |---|---|---|---|---|
> | Unaware / Unconvinced | Secure Sleepwalkers | 27% | 3% | Low |
> | Curious | Conflicted Troubleshooters | 25% | 9% | High Growth Potential |
> | Curious | Disciplined Outsourcers | 22% | 6% | Medium |
> | Considering | Mindful Researchers | 15% | 55% | Very High |
> | Ready | Devoted Caterers | 11% | 27% | Very High |
>
> Stage totals: Unaware 27% / 3%, **Curious 47% / 15%**, Considering 15% / 55%, Ready 11% / 27%. Both columns sum to 100%. **The inversion between them is the deck's argument**: 82% of Lyka's customers come from the two smallest, warmest stages, which are only 26% of the market. Every panel leads with both figures for that reason.
>
> ### ⚠ CONFLICTED TROUBLESHOOTERS CARRIES CLIENT COPY (2026-08-10)
>
> Lyka replaced the bold pull-out (`snapshot`) outright and the **first sentence
> only** of `description`, supplied on a marked up screenshot. The rest of that
> paragraph is still the research's own, verbatim, including the percentages.
>
> **It is a REVERSAL, not a rewording.** The source read "More likely to live
> alone, with parents or in shared households, although the segment also
> includes busy young families navigating competing responsibilities." The
> client's version says family led rather than singles or share house, which is
> the opposite claim, and it introduces two figures the source document does not
> contain (index 130 and index 117), so neither can be cross checked. The two
> indices later in the same paragraph are still the study's.
>
> **This is the failure mode worth knowing: it reverts SILENTLY.** Unlike the
> 401 move below, nothing asserts it. Regenerating restores prose that is still
> valid prose, every join still resolves, no check fires, and the deck quietly
> goes back to telling the client a household finding they have corrected. The
> only defences are this note and the block in `personasData.ts` itself.
>
> Checked at the time: the old household claim appeared in exactly one place in
> the whole app, and the old snapshot was quoted nowhere else, so both edits are
> self contained.
>
> ### ⚠ ONE PLACEMENT IS THE CLIENT'S, NOT THE RESEARCH'S (2026-08-07)
>
> **Disciplined Outsourcers sit in Curious because Lyka asked for them there.** The
> source document places them in Unaware / Unconvinced. The move is exactly two
> fields on id 401 in `data/personasData.ts`, `category` and `stageLabel`, and
> **every other string on that record is still the research's own, verbatim**.
>
> Two of those strings now read against the new stage and were deliberately left
> alone, per the client's own instruction to keep the research copy intact:
> `movement` still says "Unconvinced → Considering or Ready", and `barriers[0]` is
> still "No immediate evidence that their current routine is failing". Both are
> copy the client reads as theirs. **Flag them, do not smooth them.**
>
> **REGENERATING `personasData.ts` SILENTLY REVERTS THE MOVE**, which is the trap
> worth knowing: 401 goes back to Unaware, the shares go back to 49/25, and
> integrity check 7b then fails against `categoryData` until that is reconciled
> too. Re-apply the two fields after any regeneration.
>
> Everything else re-derived on its own, because `stageMetrics` sums from the
> personas. What did NOT, and had to be edited by hand, is the list worth checking
> against if a persona ever moves again:
>
> | What | Why it does not follow |
> |---|---|
> | `categoryData` titles and shares | `(49%)` / `(25%)` are hand written; check 7b asserts them against the sums |
> | `SEGMENT_IMAGES` keys | Keyed on the title **byte for byte**, share included, so both emblems silently vanished |
> | The two stage narratives, and the centre disc's | Named the wrong personas and the wrong origin for the Outsourcers jump |
> | `MindsetFlow` `SKIP_EDGES` | The dashed route left node 0; it leaves node 1 now, and BOTH routes now leave the same node |
> | `TensionMap`'s finding | Said "the two **Unaware** personas". Now derived, see below |
> | `TAB_ORDER` | Documented as running up the ladder |
> | `ReadinessLadder` customer bar | Unaware's band went 9% to 3% and all three of its labels clipped |
>
> `data/personasData.ts` was **generated** from the parsed source document, not retyped, so the prose cannot drift from the research. The generator is in the session scratchpad; if the source is revised, regenerate rather than hand-edit, then re-apply the two fields above.
>
> #### The reusable lesson: a finding can go stale without its data changing
>
> `TensionMap` stated, in hardcoded prose, that "the two **Unaware** personas are
> the only ones where reason runs ahead of feeling at the start". Not one of the
> 50 scores moved on 2026-08-07, so the finding stayed TRUE and its wording became
> FALSE, because it named the ladder rather than the scores it was measuring.
>
> It is `findOpeningLeadSplit` in `journeyModel.ts` now, alongside
> `findUniversalStageShift` and `findLevelCells`. **The rule this generalises to:
> derive a finding from the axis it is actually about.** A sentence about scores
> that names a stage is coupled to a second dataset nobody thinks of as an input.
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
> **`data/apexData.ts` became real Lyka on 2026-08-07** (pass 19), from the APEX
> tool's own Lyka presets, cross checked against the two export decks in the
> project folder. The rule that held it back for three days, never present
> another client's figures under Lyka labels, is now enforced the other way
> round by `__integrity.ts` check 15: the derived True Net Worth Index values
> must reproduce the deck's published numbers, so a drifted input cannot ship
> quietly. See "The APEX page" below before editing it.

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
| Consumer Journey | [components/journey/variants/index.ts](components/journey/variants/index.ts) | `table` (baseline), `spine`, `tension`, `matrix`, `strip` | `spine` |

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

**`JourneyDetailTable` took one change on 2026-08-07 and the shape of it is the
precedent.** The client asked for the media focus wash, which the baseline has to
carry like every other view. It gained a single `focusStages` prop that is
**optional and defaults to empty**, so called without it the table renders exactly
what it rendered before, and the comparison is still against the same thing. The
DECISION lives in `TableAdapter`, which resolves which stages this journey marks;
the table only checks membership and imports nothing from `mediaFocus`. **A
client requirement goes into a baseline as an additive defaulted prop, never as an
edit to its default behaviour.**

### The media focus emphasis (2026-08-07), and why one view does it differently

Lyka asked for **Contemplation and Preparation to be highlighted on
Troubleshooters, Mindful Researchers and Devoted Caterers**, "so they're easier
to locate as I present them ... they are the key stages we are addressing through
media". It is declared once in [data/mediaFocus.ts](data/mediaFocus.ts) and
consumed by **all five views**, with `FOCUS` in `brand.ts` as a fifth colour band.

**The three journeys are as much the point as the two stages.** Two journeys are
deliberately unmarked, and that contrast is the finding: these are the ones media
addresses, and those are not. Marking all five would leave only decoration, which
is why `__integrity` check 7c *warns* if the list ever grows to cover everything.

**Matched by stage TITLE, never by column index**, the same rule the gap matrix's
axis follows. And the failure this guards is unusual enough to name: **a broken
join here produces the ABSENCE of something.** No error, no fallback colour, no
broken layout, just a deck that renders without the emphasis and looks entirely
finished. Nobody notices a highlight that is not there, so check 7c asserts both
halves of the join. Note check 3c would not catch the realistic trigger, since
renaming a stage consistently across all five journeys keeps the shared axis
valid.

**The gap matrix marks its cells with a dashed outline, not the wash, for two
independent reasons.** Its fills are a diverging ramp where the fill IS the
datum, so a green overlay would not add emphasis, it would change six of the 25
readings. And separately, `FOCUS.edge` is **byte for byte `GAP_NEGATIVE_HUE`**
(both `#0A7D68`, arrived at independently in their own files), so an outline in
it would wrap a cell in the ramp's own "reason ahead" colour, possibly a cell at
the opposite end of that ramp. The cells take a dashed outline in `GAP_INK`,
which prints the number in all 25 anyway and so introduces no hue at all. Only
the column HEADERS, which carry no value, take the wash. `__integrity` warns if
those two hexes ever diverge, because half that reasoning would stop applying.

`MEDIA_FOCUS_NOTE` names the colour green, so the gap matrix deliberately does
not import it and writes its own sentence. **A shared string describing an
encoding is only shareable between views that share the encoding.**

Two contrast facts, both asserted in check 6d:

- The wash carries real body copy in the Table and the Strip, inked in
  `LYKA.muted`, which is already the palest legal ink in the palette (check 6c).
  There is no headroom on the ink side: if the wash is ever deepened, the wash is
  what has to move.
- **`FOCUS.washHover` is LIGHTER than `wash`, not darker**, which is the opposite
  of every unwashed cell in the Strip. Darkening one step lands at 4.48:1, under
  AA, so a well meant "make the hover more obvious" edit would make a cell
  fractionally illegal exactly while a reader points at it.

One trap the Strip hit and the ladder's persona chips hit before it: **an inline
`background-color` outranks a stylesheet rule**, so a washed cell keeping its
`hover:bg-[#F9F6F1]` utility shows its resting green and never responds to the
pointer, while every cell around it does. Those cells drive hover from the
`hoverIndex` state the component already tracked.

### The growth labels, and why they are keyed by persona (2026-08-10)

Lyka asked for "clearer labels on the growth segment opportunities" on a marked
up Flow screenshot, supplying three: **PRIMARY HVA** / Grow & shift belief in
simple steps (Conflicted Troubleshooters), and **CONVERT** against Mindful
Researchers (Address price with evidence) and Devoted Caterers (Reassure through
social proof). Declared once in [data/growthLabels.ts](data/growthLabels.ts) and
consumed by all three persona views, the same one-declaration pattern
`mediaFocus.ts` established.

**THE CLIENT'S OWN CLARIFICATION SETS THE KEY**, and it is worth reading twice:
"The Primary HVA is only referring to Conflicted Troubleshooters, not including
the Disciplined Outsourcers." **Curious carries two personas**, so a stage keyed
label would have swept in Outsourcers, which is the one thing they ruled out.
Stage is the obvious key for a four stage ladder and it is the wrong one here.
The map is keyed by persona id, and `__integrity` check 7d asserts both halves,
because a number key is worse than a title: a drifted title is legible in a diff
and `301` is not, and the ids are sparse (101 / 201 / 301 / 401 / 402) so a
plausible typo lands on nothing.

**Two personas are unlabelled and that is the statement**, exactly as with the
media focus journeys. 7d warns if the map ever covers all five.

**Each view carries as much as its geometry allows, which is not the same
amount**, and the reason is worth recording because it looks like an
inconsistency:

| View | Carries | Why |
|---|---|---|
| Flow | tag + tactic, two chip lines | 250 unit chips, uniform width |
| Ladder | **tag only**, tactic in the tooltip | a chip's width IS its market share |
| Detail panel | tag + tactic, white pill | opened by all three views |

The Ladder is the interesting one. Devoted Caterers sits in an 11% band, about
90px at 1048, and "Reassure through social proof" needs roughly 170px at the
12px floor, so the tactic would truncate to noise **on the very persona it
labels**. That chip already dropped its fit rating and conversion index to the
tooltip for the same reason, so the tag goes on the chip and the tactic joins
them. "CONVERT" is seven characters and clears even the 90px chip.

**The Flow's chip grew by two lines, and the geometry was solved rather than
nudged.** `CHIP_H` 48 to 80 and `CHIP_ROW_GAP` 54 to 86 add 64 units to
`LOWER_STACK`, so `VB_H_MIN` and `VB_H_MAX` were each raised by **exactly that
64**. That is not a round number, it is the number that holds the invariant: at
both clamp ends `CY` and the skip band are unchanged (220 / 146 at the floor,
375 / 250 at the ceiling), so `SKIP_LANE_FRACTIONS` still reproduces 58 / 122 as
its comment claims. What cannot be preserved is the middle: at a fixed container
the viewBox height comes from the container's aspect, so a bigger lower stack is
paid for out of the nodes, and at VB_H 632 the radius goes 112.6 to 94.7. The
collision cap gains headroom rather than losing it.

### The Flow's ribbons are filled from their DESTINATION (2026-08-10)

Client note: "weird shading in this area", pointing at the left of the diagram.
Filling from the source stage put `Unaware` on the first connector, and that
stage is `#5B6E64`, a deliberately desaturated grey-green. At the 0.3 alpha the
ribbons carry it renders `#CED1C4`, so **the first arrow read grey while the two
after it read warm**, which looks like a disabled state rather than a step in a
ramp. Destination filling gives `#DDC2B1`, `#EACAAE`, `#B6D5C5`: the run warms up
and resolves on the brand teal, which is the ladder's own story.

**The palette was NOT touched, and that was the constraint.** The muted `Unaware`
is a documented decision ("the audience that perceives no problem") and still
owns its wheel wedge, its ladder band and this view's first node. Only what fills
the connectors moved.

**Width still comes from the SOURCE and must**, so colour and width now describe
different stages and the legend says so out loud ("Ribbon colour = the stage it
leads into"). Interaction stays on the source too, because the ribbon IS that
stage's movement. If that split ever feels like too much for one mark, the fix is
to drop the colour encoding, never to make width follow colour: width is the
honesty constraint at the top of `MindsetFlow.tsx`.

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
   research finding. **The gap matrix is the most exposed consumer:** Compare
   shows study curves plus one derived bar, the matrix shows 25 derived numbers
   and ZERO study numbers. Its note is therefore element two in the DOM, above
   the internal scroll fold by construction, and every cell pop-up shows both
   study values beside the gap so the arithmetic is inspectable, not asserted.
3. **A source cell WAS truncated, and the client had the disclosure removed
   (2026-08-10).** Devoted Caterers / Action `rationalScore` ends mid-sentence in
   the PPTX itself at `"...transition progress and ease of"`. It carried an on
   screen "shown as supplied, not completed" note until Steph flagged the note as
   a weird reference, and the resolution was to TRIM the cell to its last
   complete item ("...portions and transition progress."), not to invent an
   ending: nothing the study did not say is on screen, and the incomplete
   fragment is dropped. **The trim lives in the GENERATED file, so a
   regeneration reverts it**, at which point `isTruncatedDescriptor()` fires
   again and the note self restores in the spine, the strip and the gap matrix.
   That is why the detector and its three note sites are kept even though
   nothing currently trips them. The no invented endings rule is unchanged.

### Modal: focus never actually moved into the dialog until 2026-08-04

Found while verifying the gap matrix, but it was **never specific to it**. Every
consumer was affected: the Ten Things tile, the friction strip cell and the matrix
cell all left focus sitting on the OPENER, outside the dialog. So Tab walked the
page behind the modal and the focus trap had nothing to trap. Three consumers
measured before the fix, three after.

**The cause is an effect ordering bug, and it is worth recognising again.** The
render is gated on `isMounted`, which one effect sets when `isOpen` flips. The
focus effect ran in the SAME commit, while that guard was still false, so the card
was not in the DOM and `closeRef.current` was null. One frame later its
`requestAnimationFrame` fired against the same null ref and did nothing. The
original comment, "after the portal has painted, otherwise there is nothing to
focus yet", names the exact hazard it then failed to avoid: **one rAF defers past
a paint, not past a state driven remount.**

The fix splits the effect. Capturing the opener and locking the body stay on
`[isOpen]`; moving focus in is its own effect on `[isOpen, isMounted]`, so it runs
after the commit that actually rendered the card.

**One consequence to know:** focus RESTORE on close used to look like it worked
and was a no-op, because focus had never left the opener. It is real now.

### The gap matrix, 2026-08-04, and why it is not another Compare

**The five raw curves are the SAME SHAPE.** Every journey rises into
Contemplation, dips at Preparation, peaks at Action and falls at Maintenance, and
rational climbs monotonically to Preparation in all five. So five small multiples
of the raw curves is five copies of one curve at different heights, which is what
`tension` already shows. **"The trajectories differ" is not a finding this data
supports**, and that is the thing to know before anyone builds a sixth
comparison view.

What differs is the **gap**, whose five trajectories are genuinely distinct:
whipsaw, deep and flat, spike then settle, shallow and tight, high with one dip.
`scores[].gap` had been computed for all 25 cells since `journeyModel` was
written and plotted by nothing. The matrix plots it: read ACROSS a row for one
journey's arc, read DOWN a column for how the five differ at the same moment. The
second read is the one no other view offers.

**The wash is CAPPED at `GAP_WASH_MAX` 0.50 and that is load bearing.** A
diverging ramp with a number in every cell normally forces the ink to flip, light
steps taking dark text and dark steps taking white, and two adjacent cells then
disagree. Capping the wash inside the light band means **one ink serves all 25
cells**: `#003D33` measures 5.99:1 at the terracotta end and 5.85:1 at the teal
end, and the real data never reaches the ceiling. `data/__integrity.ts` asserts
both ends, because raising that number is a one character edit that looks like a
contrast improvement and is the opposite. The saturation is spent on the bar
instead, which also carries the sign **without hue**.

**`gap === 0` is a third state, not a ramp point.** A zero wash is
indistinguishable from an empty cell, and two of the 25 are exactly zero, so they
get cream and a centre tick. Both facts about them are derived at runtime by
`findLevelCells`, including which side closed the gap, because the two cells mean
OPPOSITE things and without the direction the finding reads as one fact twice.

**Two structural rules, and they are not stylistic:**

- **One `<div>` per row, never one flat 25 child grid.** In a flat grid a journey
  with four stages does not leave a hole: every later cell slides up one and the
  whole grid is off by one, fully populated with real numbers under the wrong
  headers, with nothing on screen saying so.
- **The axis is INDEXED, not mapped.** The view walks `JOURNEY_STAGE_NAMES` and
  looks each stage up by title, so a renamed stage renders an explicit empty cell
  in the RIGHT column. `__integrity` check 3c catches the cause; this stops the
  symptom being a silently shifted grid.

**Iterate the `journeys` prop unmodified.** It is already `TAB_ORDER.map(...)`.
Not `Object.values(journeys)` from `journeyDetailsData` and not
`Object.values(JourneyType)`, both of which are declaration order, warm first,
and therefore inverted. Not `Object.entries(journeyMeta)` either, which is correct
only by coincidence. The two orders are **not a strict array reverse**: the two
Unaware personas keep their relative order in both, so `[...].reverse()` silently
swaps the top two rows. **The canary is one cell: top left must read -40.** If it
reads +25 the rows are inverted, every number is still individually correct, and
the deck's central argument has flipped.

**Both findings are derived at runtime**, by `findUniversalStageShift` and
`findLevelCells` in `journeyModel.ts`. Every noun in the rendered copy comes out
of the return value, and the 3px marker under the Preparation column header reads
the same value, so it moves with the finding. Change a score and the copy changes
or disappears; it can never state something the data no longer supports.

**DOM, not SVG**, deliberately. An SVG would inherit the whole `svgFont` plus
`useElementSize` plus `MIN_COMPENSATED_WIDTH` apparatus that exists because a
declared SVG `fontSize` is not a rendered size. A CSS grid gets real CSS px for
free, which is also why the minimum font size check passes by construction.

`GapBar` moved out of `TensionMap` to [components/journey/GapBar.tsx](components/journey/GapBar.tsx)
so both views share one bar. Every prop it gained is optional and defaulted to
what `TensionMap` rendered before, verified pixel identical: same two hues, same
cream track, and the widths still compute to 44.4% at -40 and 22.2% at +20.

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

A SPEED Standard Accelerator for **Lyka** (fresh, human grade dog food, direct to consumer subscription, lyka.com.au). Eight pages:

- **Personas**: a custom 3-layer SVG sunburst. Five Lyka personas across a four-stage readiness ladder. Default landing page.
- **Consumer Journey**: 5 segment-specific six-stage journeys, each with an emotional + rational score line over time.
- **Interactive Media Plan**: the real Lyka plan since 2026-08-05. A 5-stage macro block grid (SHOW IT to SHARE IT), 20 channels over Oct→Sep, every bar owned by SPEED (red) or Lyka in house (green) with a legend at the foot, Chart.js pop-ups. See "Interactive Media Plan page".
- **APEX by SPEED**: the channel scorecard, real Lyka since 2026-08-07. View tabs (About | True Net Worth Index | Growth Quadrant) over two Roy Morgan audiences (Conflicted Troubleshooters, Mindful Researchers), 14 channels each.
- **Ten Things The Data Says**: ten findings in a one viewport 5 x 2 grid, each opening a modal with a Chart.js chart, five labelled blocks and the published numbers. Real Lyka. Ported 2026-08-03, then moved onto the **dog owner basis** on 2026-08-10, which is why it now cites TWO sources: five points divide by a population and were redrawn against Roy Morgan's dog owner counts, five do not and are unchanged.
- **Notion Coworking Setup**: added 2026-08-10. A scrolling presentation page proposing a shared Lyka × SPEED Notion workspace both teams and both Claudes keep current. Six sections (the problem, the shared-space hub, four content pillars, how it works, why it compounds + privacy, scattered → shared + a dark closing band). Pure DOM/CSS visuals, static + hover, one IntersectionObserver reveal. Reuses `OWNER_COLORS` (green Lyka / red SPEED) for the two-party split. Second to last in the nav. See "Notion Coworking Setup page".
- **Plugging Into The Ecosystem**: added 2026-08-10. A scrolling presentation page recasting the standalone `Plugging Into The Existing Ecosystem.html` deliverable: SPEED's operating role, to plug into Lyka's existing team, data and measurement tools rather than replace them. Header hero, a hub diagram (four cards fanning into a central `Lyka's ecosystem` hub with measured curved SVG connector ties, `lg` only), four numbered pillars, a light principle band and a dark outcome band. DOM cards + a decorative SVG tie overlay, static + hover. Last in the nav. See "Plugging Into The Ecosystem page".

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

Seven pages (Business Dashboard was removed on 2026-08-11):

```ts
// types.ts
export enum Page {
  TEN_THINGS = 'Ten Things The Data Says',
  PERSONAS = 'Personas',
  CUSTOMER_JOURNEY = 'Consumer Journey',
  INTERACTIVE_MEDIA_PLAN = 'Interactive Media Plan',
  APEX_BY_SPEED = 'APEX by SPEED',
  NOTION_COWORKING = 'Notion Coworking Setup',
  ECOSYSTEM = 'Plugging Into The Ecosystem',
}
```

**Adding a page touches exactly eight places**, and nothing else in the app needs to know: `types.ts` (the enum), a new `components/icons/*Icon.tsx` (the sidebar renders `{item.icon}` unconditionally, so a missing icon is a blank cell), the page component, two edits in `App.tsx` (import and switch case), two in `Sidebar.tsx` (import and `navItems`), then `metadata.json`.

- **Personas** is the default landing page.
- **All seven nav items open their pages.** APEX was the last one held back (a placeholder behind `?show=all`); it opened on 2026-08-07. The hold-back pattern (`SHOW_ALL` const + `PendingSection` shell) is in git history at `4bba5cf` if a future section needs it. Notion Coworking Setup was added 2026-08-10 and opened directly.
- **Sidebar order differs from the enum order.** The visible nav order is set by the `navItems` array in [components/Sidebar.tsx](components/Sidebar.tsx), where **APEX by SPEED sits above Interactive Media Plan** (the two were swapped). The `Page` enum order above is just the enum definition, not the rendered order.
- **Ten Things sits FIRST in the nav** (on request 2026-08-10). It has now held every slot this deck has tried: it shipped second (the findings set up the audience model), moved below the media plan on 2026-08-04 (lead with the audience, close on the evidence), and leads the deck since 2026-08-10. The rendered order is the `navItems` array, so moving it is a one line change and nothing else needs to know. **The default landing page is still Personas**: nav order and landing page are independent decisions, and moving the button did not change what the deck opens on.
- **Notion Coworking Setup sits second to last** (added 2026-08-10). It is a ways of working proposal, not an audience or media page.
- **Plugging Into The Ecosystem sits last** (added 2026-08-10). SPEED's operating role, a positioning page, so it closes the deck after the ways of working page.
- **Business Dashboard was REMOVED on 2026-08-11**, on client direction, and with it `pages/BusinessDashboard.tsx`, `components/icons/BusinessDashboardIcon.tsx`, the enum member, the nav entry and the switch case. It was the only page that never carried Lyka data: its Power BI slot was `REPORT_URL = null` because the inherited embed was **another client's** report and was deleted at conversion, so it only ever rendered an "awaiting data connection" empty state. **Restoring it is a page add** (the eight places listed above) using git history at `7d3233b~1`. Nothing else referenced it: there is no URL routing in this app, so removing a `Page` member broke no deep link, and `__integrity.ts` never asserted on the enum.
- **Interactive Media Plan** is the Lyka Oct→Sep macro block plan. A funnel-stage grid of five stages (SHOW IT | CHECK IT | PROVE IT | TRY IT | SHARE IT) and 20 channels with monthly gantt flighting bars and Budget + % columns, fed by [data/mediaPlanData.ts](data/mediaPlanData.ts). **Bars are OWNER coloured** (green = Lyka in house, red = SPEED managed, keyed by the legend at the foot of the grid); rails and both budget charts stay stage coloured. In-house rows are flighting only: no dollars anywhere, "In house" in the Budget column. Clicking a gantt bar opens a channel pop-up (ownership strip, rationale + dark-label execution table, an **Examples** creative gallery, then a flighting chart for SPEED rows or an active-months strip for in-house rows). The gold **Budget** header opens a stacked-by-media monthly bar chart **with the workbook's planned flighting weight as a dashed overlay**, the **%** header opens a budget-allocation pie; both filter to funded rows. A bottom line states the $11.0M SPEED managed total. Uses Chart.js via `react-chartjs-2`. Components live in [components/mediaplan/](components/mediaplan/). With 23 rows the grid is taller than one viewport at 1440; the page scrolls rather than clips.
- **APEX by SPEED** is the channel scorecard. Real Lyka since 2026-08-07; see "The APEX page".

## Data model

All data lives in flat TypeScript files under `data/`. There is no database, no fetch, no JSON file. Editing data = editing TS source.

| File | What it holds |
|---|---|
| [data/personasData.ts](data/personasData.ts) | **Real Lyka.** 5 personas in a single `PersonaType.LYKA_AUDIENCE` bucket, grouped by 4 readiness-stage strings. Generated from the source research document, not hand typed. Exports `personaCategories`. |
| [data/personaMedia.ts](data/personaMedia.ts) | **The persona films, joined by persona id.** Deliberately NOT in `personasData.ts`, which is generated. `PERSONA_VIDEOS` plus `personaVideo()`. Both directions of the join are asserted in dev. |
| [data/audienceModel.ts](data/audienceModel.ts) | **Derived, no new facts.** THE ONLY PLACE THAT PARSES A `"22%"` STRING. `stageMetrics`, `personaMetrics`, `conversionIndex`, `GAPS`, `TOTAL_DOG_OWNERS`. See "The derived model" below. |
| [data/journeyMeta.ts](data/journeyMeta.ts) | Top-level copy per journey, moved out of the page component. Joins to a persona by `personaId` and restates nothing else. |
| [data/journeyModel.ts](data/journeyModel.ts) | Derived journey metrics plus the canonical score-string parsers, moved out of `JourneyScoreGraph`. Also `GAP_DOMAIN` and the two cross-journey findings the gap matrix states on screen, `findUniversalStageShift` and `findLevelCells`, **derived at runtime so a revised study cannot leave a false sentence up**. |
| [data/categoryData.ts](data/categoryData.ts) | **Real Lyka.** 5 entries: the centre disc plus the 4 readiness stages. Each `title` carries its market share, e.g. `"Considering (15%)"`. Adds `marketShare`, `customerShare` and `movement`; the 7 legacy list fields render nowhere and are empty. |
| [data/journeyDetailsData.ts](data/journeyDetailsData.ts) | **Real Lyka.** 5 personas × 1 `MACRO_JOURNEY` × 5 Transtheoretical stages. Generated from the source deck by a cell-level table parse. Per-stage: `doingThinking`, `painPoints`, `influences`, `momentsToWin`, `emotionalScore`, `rationalScore`, `duration`, `definition`, and `coreQuestion` on Action only. Bullet fields are semicolon delimited; scores carry an en dash. **Not pure data:** imports React and five icon components. |
| [data/tenThingsData.ts](data/tenThingsData.ts) | **Real Lyka, on the DOG OWNER BASIS since 2026-08-10.** The ten findings: copy, published numbers tables, the `chart` join key, and **`basis` + `basisNote` on every point**. Also `TEN_THINGS_ABOUT` (the About dialog), `TEN_THINGS_ESTIMATE_NOTE` (short and full) and `TEN_THINGS_SOURCES`. **Two sources govern it**, one per half of the ten; read the file header before editing. No React. |
| [data/tenThingsSeries.ts](data/tenThingsSeries.ts) | **Real Lyka.** Every number a Ten Things chart plots. Separate from the copy on purpose; see below. Five series are on the dog owner basis and five are unchanged, and **point 02's `stillActive` is DERIVED at module load** from a base invariant retention rate rather than published. `TOP_REGIONS_RAV` is kept and still rendered as point 07's second table. |
| [data/brand.ts](data/brand.ts) | **The single source of truth for colour.** The `LYKA` palette, `SEGMENT_COLORS` + `getSegmentColor()`, `LayerKey` + `LAYER_COLORS`, `TEN_THINGS`, the **gap ramp** (`gapWash()`, `GAP_SCALE_MAX`, the capped wash bounds and `GAP_RAMP`), **`FOCUS`** (the media focus wash, its deliberately-lighter hover, rule and tag), and the `CHART_*` chrome constants. No React, no DOM types, literal hex only. See "Brand and typography". |
| [data/__integrity.ts](data/__integrity.ts) | Dev-only assertions on the data joins `tsc` cannot see. Imported from `index.tsx` behind `import.meta.env.DEV`, so it is tree shaken out of production. |
| [data/apexData.ts](data/apexData.ts) | **Real Lyka since 2026-08-07.** The channel knowledge base (14 channels: label, tier, `knf`, `ttd`, mirroring the APEX tool's `constants.ts`), two audiences' raw Roy Morgan inputs (`heavyPct`, `rmIndex`, `addressableReach`), and the methodology + About copy. **`tnwIndex`, `ttdStars` and `quadrant` are DERIVED at module load**, never typed; `__integrity.ts` check 15 asserts the derivation reproduces the export decks' published values. Also the quadrant meta + thresholds and `QUAD_STYLES`. Read the file header before editing. |
| [data/mediaFocus.ts](data/mediaFocus.ts) | **A client declaration, not a derivation.** Which Consumer Journey cells carry the media focus emphasis: two stage titles, three journeys, the label and the note. Consumed by all five journey views so the emphasis cannot drift between them. Matched by stage TITLE; both halves of the join asserted. No React. |
| [data/mediaPlanData.ts](data/mediaPlanData.ts) | **Real Lyka since 2026-08-05.** The Oct→Sep plan: `MONTHS` (Oct→Sep), `PLAN_LAYERS` (SHOW IT / CHECK IT / PROVE IT / TRY IT / SHARE IT, each with a `blurb`), `MEDIA_TOTAL = TOTAL_BUDGET = 11,000,000` (SPEED managed; no production line), `FLIGHTING_PCT` (the dashed overlay). Each `MediaRow` has **`owner: 'speed' \| 'lyka'`** (drives bar colour, the In house cells and the pop-up), `monthly` (12 values; all zeros on lyka rows), `budget` (0 on lyka rows), **`activeMonths`** (in-house flighting), optional `detail` (role/strategyLink/comesToLife/metrics), `images`, `captions`, `imageWeights`, `extraImages` + `extraCaptions`, and layout flags `provisional`, `pairedImages`, `stackedImages`, `stackedFirstSmall`. Sourced from the Lyka briefing workbook's **visible** `Budget Distribution $ Lyka SPEE` sheet + the three visible `Media Description` sheets; hidden content excluded per client direction (the `$ Lyka` sheet with the in-house dollars, the TRY IT / SHARE IT description sheets, the Australian Open row). **The workbook's own monthly grand-total row omits PROVE IT**, so monthly totals are derived from rows and never copied: January derives to $2,635,863.36 as at 2026-08-11, against the sheet's stated 3,200,000. It was $3,295,000 until the client re-phased the Cricket row that day. **Read the header's monthly list rather than quoting a figure from here**, since re-phasing any row moves it. **Since the 2026-08-06 review round it ALSO carries client copy and three creatives from `Changes to the intereactive media plan.pptx`, and since 2026-08-07 two more creatives from `Accelerator Feedback - For Aaron.pptx` that REPLACED workbook images in place, so it is no longer a pure transcription of the workbook and must not be "restored" to it.** Read the file header before editing. |
| [data/notionCoworkingData.ts](data/notionCoworkingData.ts) | **Real Lyka, added 2026-08-10.** All copy for the Notion Coworking Setup page, house-styled once here from the 10-slide `Lyka Notion Coworking Setup.pptx`. `CoworkActor` union (`lyka`/`speed`/`both`, tsc-enforced), plus `PILLARS`, `SETUP_STEPS`, `PRACTICE_STEPS`, `COMPOUNDING`, `PRIVACY_POINTS`, `CONTRASTS`, `CLOSING_STEPS` and the section headings. **Pure TS: no React, no DOM types.** No `__integrity` additions: no silent string-key joins, no asset paths, no new colour pairs. |
| [data/ecosystemData.ts](data/ecosystemData.ts) | **Real Lyka, added 2026-08-10.** All copy for the Plugging Into The Ecosystem page, house-styled once here from `Plugging Into The Existing Ecosystem.html`: the hero, the hub and its four connections, the four numbered pillars, the principle phrases and the outcome list. **Pure TS: no React, no DOM types.** No `__integrity` additions: no silent string-key joins, no asset paths, no new colour pairs. |

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
├── Unaware / Unconvinced (27%)   Secure Sleepwalkers (27%)
├── Curious (47%)                 Conflicted Troubleshooters (25%) | Disciplined Outsourcers (22%)
├── Considering (15%)             Mindful Researchers
└── Ready (11%)                   Devoted Caterers
```

Percentages are share of the dog-owner market. Each persona also carries its share of Lyka's current customer base (3 / 9 / 6 / 55 / 27), and the inversion between the two columns is the deck's central argument.

**Curious is the only stage with two personas**, so its quadrant splits into two 45 degree wedges while the other three personas each get a full 90 degrees. That was Unaware until 2026-08-07; see the ⚠ note at the top of this file.

**The wheel needed no title changes for that swap, and it is worth knowing why**, because the instinct is to shorten them. `title` is documented as abbreviated to fit the arc, and "Conflicted Troubleshooters" moving from a 90 degree wedge to a 45 degree one looks like it must overflow. It does not: measured in the browser, its longest line fills **48.5% of its arc**, which is no worse than "Considering" at 49.8% and it has always been fine. `maxCharsForSweep`'s floor of 10 is conservative, and the persona ring's radius is large enough that a 15 character word fits a 45 degree wedge comfortably. **Measure the rendered `getComputedTextLength()` against `getTotalLength()` on the label path before abbreviating anything.**

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

**Six optional, additive props, in five groups.** Called with only `stages` the
graph renders exactly what it always did, which matters because the table is the
baseline. (The doc said four for a while and omitted `compact`, which is the one
that gates the `svgFont` treatment, so it was the worst one to leave out.)
- `compact` shortens the frame, drops the legend and the numeric axis labels, and
  is what switches on the `svgFont` type compensation. `!compact` is the Table
  baseline and is deliberately left alone.
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

[pages/TenThings.tsx](pages/TenThings.tsx). Ported **2026-08-03**, then moved onto the **DOG OWNER BASIS on 2026-08-10**. There are now TWO sources, both one folder up in `01 Sources/`, and which one governs depends on the point. See the next section before editing anything here.

A **one viewport 5 x 2 grid** of finding tiles, like Personas and Consumer Journey rather than the scrolling APEX page. Ten findings on one screen is the point of the page: you see the whole argument before opening any of it. Clicking a tile opens the shared Modal with the chart, five labelled blocks, the published numbers, and a stepper walks all ten.

### THE DOG OWNER BASIS (2026-08-10), and why the split is exactly 5 and 5

`Lyka - Ten Things (Dog-Owner Basis).html` re-measures the findings against Roy
Morgan's count of dog owners rather than households, on the argument that
households include the roughly half of homes with no dog and so could never buy.

**Five points were redrawn** (02, 03, 05, 07, 10) and **five are byte identical**
(01, 04, 06, 08, 09). That is not an editorial judgement about what was worth
revisiting: **hashing every embedded PNG in both source files proves it**, and
the five unchanged ones are exactly those measured as a rate, a count or a time
series, where no population figure enters. Their copy and their chart components
were not touched.

`headline`, `cardHeadline`, `implication` and `test` are **carried over unchanged
on all ten**, which is the useful headline finding: the argument and the
recommendation did not move when the base did. What moved is `statValue`,
`statLabel`, `learn`, `worthKnowing` and `numbers` on the five, plus their charts.

**Every point now declares `basis` and `basisNote`**, both required. The basis
shows up in three places, and the placement of each was a decision:

- **The tile's left rail**, permanently coloured. It was a hover only accent, and
  it is the source page's own encoding. **This costs ZERO height**, which is the
  whole reason it is not a pill in the badge row: the grid has no `max-h` and no
  `min-h`, rows size from max content contribution, so anything added to the card
  grows all ten tiles. Measured after the change, a tile is 272x242.1 at 1920 and
  169.1x259.5 at 1280, both matching the pre change numbers exactly.
- **A legend beside the lede**, because colour alone is not a label.
- **A pill and a labelled block in the modal**, where there is room for words.

**Colour comes from `BASIS_COLORS` in brand.ts and both marks are EXISTING tokens
under a new name** (`LYKA.accentInk` and `LYKA.muted`). The source's own
`#2E8B64` and `#8A9199` are not Lyka. ⚠ **The obvious Lyka match for that soft
grey is `mintMuted` at 1.88:1**, which check 6c separately asserts must keep
FAILING: reaching for it would put an invisible rail on five tiles. Check 13c
asserts the pairs from the other side.

### The five labelled blocks, and the two fields that were hiding

The modal is now **What we found | Why it matters | [the basis] | What to do |
What we still need to test**, with the chart above them and the numbers table as
a disclosure below. Two of those were not labelled blocks before, and the reason
is the media plan's Role of Channel lesson verbatim: **a populated field with no
label is a missing field.** `learn` rendered as a bare paragraph under the stat,
and `worthKnowing` was collapsed inside a `<details>` headed "Worth knowing",
which on five of the ten points is where the caveat lives.

**The numbers table stays a disclosure and that is not an inconsistency.** It is
a table of source figures rather than a finding, and it is the one thing on the
page a reader looks up rather than reads.

### The nine rebuilt charts

The source shipped **ten matplotlib PNGs in a green and gold palette**, 3.1MB of inline base64. Nine were rebuilt as Chart.js components in `components/tenthings/charts/`; the tenth, a five capital choropleth, stayed a PNG. Asset payload went 3.1MB to about 1.65MB of real files.

**Four of the nine were changed, not transcribed**, and three of those are corrections rather than styling:

- **10 `LapsedPool` is a correctness fix.** The source OVERLAID lapsed and active, which are DISJOINT groups, so at decile 1 it read as "689 of 1,810 are active" when the truth is 689 of 2,499. That misstatement ran across all ten columns. Stacked now, so a column is everyone who ever tried. Anyone comparing against the original PNG will see different bars: this is why.
- **09 `BrandedSearchGap` had a unit error.** The source plotted 10.5 (a percentage) and 100 (an index) on one axis captioned "index / %". Branded share was pinned to the floor and read as roughly zero, which is not what 10.5% means. Two axes now.
- **06 `SeasonalIndex` truncated its y axis at 70** to make a 39 point swing visible. It is an index with a defined baseline, so the bars anchor at `base: 100` instead. Bar length is the deviation from an average month, which is the meaningful quantity, and the truncation dissolves.
- **08 `MmmConfidence` is not a chart at all.** Three bars whose heights encode nothing, a y label reading "confidence in the claim", values that are words. Three HTML rows instead: selectable, reflows, no `aria-label` reciting the whole thing.

07 `TopRegionsRav` and 04 `RetentionCuts` were also reframed (a deviation chart from 1.00, and one chart instead of two truncated subplots), and 03 `FlatSharePenetration` **adds** the average income decile column that was already in the source's own published table, because the headline claims the driver is the postcode and a penetration only chart cannot show that.

#### What the dog owner redraw did to five of them (2026-08-10)

`CityLifecycle`, `TopRegionsRav` and `LapsedPool` are **gone**, replaced by
`CityReach`, `TopRegionsReach` and `LapsedVsActive`. **The join keys were renamed
with them**, because each named a measure its chart no longer plots, and a key
naming the wrong measure is how a reader ends up trusting the name over the
chart. Check 9 catches a stale key on the next dev load, so the rename is one
pass across the union, the registry and each point's `chart` field.

| Point | Was | Is |
|---|---|---|
| 02 `IncomeLadder` | Grouped bars + a retention line on `y1` | Stacked, total = ever tried |
| 03 `FlatSharePenetration` | Bars + an income decile line on `y1` | Bars only, two line x labels carrying the flats % |
| 05 `CityReach` | A **bubble** chart, penetration against tenure, area = active | Horizontal bars, **six** rows (the ACT is new) |
| 07 `TopRegionsReach` | 10 SA4s by RAV, anchored at 1.00 | 18 of 58 regions by reach, plus a **match quality** grade |
| 10 `LapsedVsActive` | 10 income deciles, stacked | 12 regions, stacked |

**Two of the five can now drop the generic `<Chart>` for the typed `<Bar>`**,
because their `type: 'line'` dataset is gone. That is the one direction the
documented react-chartjs-2 trap is safe to move in.

**Point 05 losing the bubble took three things with it**, and they were removed
rather than left as dead weight: the `bubbleLabels` plugin and its collision
halo, `BubbleController` in `chartBase`, and `TEN_THINGS.bubbleFill`. It also
drops `useElementSize` and the `MIN_CHART_WIDTH` fallback, which existed only
because a bubble radius has to be derived from a measured container.

**⚠ POINT 10 REPEATS THE EXACT ERROR THE HOUSEHOLD VERSION WAS FIXED FOR.** The
new source draws each bar's total length as the **lapsed** figure with active
overlaid inside it, so Sydney Central reads as "2.09 of 3.71 are active" when the
true reading is 2.09 of 5.80. It is stacked here for the same reason it was in
2026-08-03, and the arithmetic corroborates the fix: 2.09 of 5.80 is 36% still
active, which is the "two thirds now inactive" the copy states. On the source's
geometry it would be 56%, contradicting the same sentence.

**⚠ POINT 07's MATCH GRADE IS DELIBERATELY NOT IN THE BAR FILL.** The source
draws A dark green, B light green, C grey, which is the same green-against-grey
pairing the basis pill uses, **in the same modal**: a light green bar could be
read as "dog owner basis". Every bar keeps one fill and the grade rides on a
`warmInk` annotation beside the value, on the B and C rows only. Same reasoning
as the gap matrix outlining its focus cells rather than washing them, because
there the fill IS the datum. Grades were read by **pixel sampling the source
PNG**, not guessed.

### Three honesty items that must survive any edit

1. **Point 07's stat does not match its own chart.** The card says `1.60x`; the chart, the numbers table and the map legend all cap at `1.34x`. It may be a postcode level maximum against an SA4 maximum, or the value the map's 95th percentile clip removes, or stale. **Nobody picked one.** Points 02 and 04 carry smaller versions of the same thing: an index of 179 that is in the copy and in neither the table nor the chart, and a headline range of 34.1 to 36.2% measured on an inner metro cut against a table running 32.7 to 35.0% across all dwelling quartiles.

   **All three ON SCREEN notes were removed on client direction 2026-08-10** ("delete the check before presenting boxes"), so the deck no longer says any of this to a reader. **The conflicts are untouched and the copy still quotes all three figures.** The `discrepancy` field, its plumbing through every chart and the boxed renderer in `TenThingsChart.tsx` are all deliberately kept, unset, so restoring a note is one property on a record.

   **The rule this item exists for is unchanged and is now the whole of it: NEVER reconcile one of these by editing a number.** Removing the note removed the disclosure, not the discrepancy, and it makes the rule matter more rather than less, because the conflict is now invisible to anyone reading the page. If a figure has to be settled, get the client's answer and change the source of truth, or put the note back.
2. **The map ramp is off brand and stays off brand.** A PNG choropleth cannot be recoloured, and regenerating needs the original notebook and the ABS boundary data, neither of which is in this project folder. A visible caption says so. If the notebook ever surfaces, the Lyka palette already holds the right diverging pair: tangerine `#F68B1F` through cream to teal `#0A7D68`.
3. **Two source charts had errors** (points 09 and 10, above). Both are documented in the component headers, not just here.

**A FOURTH ARRIVED WITH THE DOG OWNER SOURCE, on point 06.** Its own basis note
says the ex kiosk figures of **125 and 84** from the seasonality report supersede
the **123 and 84** the chart plots and the copy quotes. On 125 the peak to trough
swing is **41 points**, not the 39 the stat says. **That report is not in the
project folder.** The note is carried verbatim rather than acted on, because the
alternative is editing a client facing figure to agree with a document nobody
here has read. `discrepancy` is still wired and unset, so a visible note is one
property if the client wants one.

**AND POINT 02's OLD CONFLICT IS CLOSED BY THE REWRITE**, which is worth knowing
so nobody goes looking for it: the index of 179 that was in the copy and in
neither the table nor the chart is simply not in the rewritten copy. Point 04's
34.1 to 36.2% and point 07's 1.60x are still open.

**Point 07's 1.60x is now supported by a SECOND numbers table rather than the
chart.** The redraw moved that point onto reach, so RAV no longer has a chart;
`numbersSecondary` carries the ten SA4 rows and the map still plots them. RAV is
an average across customers, so no population divides it and the change of base
leaves it alone, which the new source says in as many words. That is why the map
survived a source that dropped it.

**One more the source states and its own prose does not: the region point 07's
copy leads with, Sydney Central, is a boundary match B, and the third is a C.**
Carried into the caption, the table and the tooltip rather than dropped.

### Why the copy and the numbers are two files

`tenThingsData.ts` holds the PUBLISHED table: pre formatted strings like `"49.3%"` and one empty cell where the source reports no figure. `tenThingsSeries.ts` holds the numbers a chart plots. Reading a series back out of the display strings means parsing `"49.3%"` into `49.3`, which is the exact anti pattern `audienceModel.ts` is quarantined for. `__integrity.ts` asserts the two agree.

Point 10's three household era totals (101,091 active, 203,221 lapsed, 109,545 in
deciles 8 to 10) went with check 12b on 2026-08-10: that cut no longer exists.
**Four checks replaced them**, and three are new shapes:

- **12b** asserts point 07's SECOND table, the RAV figures, which nothing plots
  any more and which nothing else would notice drifting.
- **12c** asserts the DERIVED half of point 02 (see below) reproduces the two
  figures the source publishes, plus that still active is a subset of ever tried
  on every decile, since a stack whose base exceeds its total draws a negative band.
- **12d** cross checks points 07 and 10, which share twelve regions and both
  publish an active figure for each. Two independent transcriptions agreeing is a
  real check rather than a tautology.
- **13b** asserts every point declares a resolvable `basis` and a non empty
  `basisNote`, **and that the split is exactly 5 and 5**. The About copy says
  "five of the ten" and "the other five" out loud, so it is derived rather than
  trusted: a sixth point moving basis would leave a confident sentence on screen
  that its own data no longer supports, which is the `TensionMap` lesson.

**12d and 13b were negative tested**, seen to fire with the right messages, and
reverted.

### ⚠ ONE SERIES IS DERIVED, NOT PUBLISHED, AND IT IS AN OPEN ASK

**Point 02's `stillActive` appears nowhere in the new source.** The redrawn chart
labels only the stacked totals and no underlying table was supplied. It is
recoverable exactly, because **retention is BASE INVARIANT**: it is a rate among
customers, so both sides of the sum are customers and the denominator cancels.
`retentionPct` is therefore unchanged from the household version and is the only
figure needed to move `everTried` onto the active base.

Two independent confirmations that this is right rather than merely plausible:
decile 10 comes out at 4.86 x 0.384 = 1.866, which rounds to the **1.87 the copy
publishes**; and pixel measuring the source PNG's bar geometry agrees to within
0.03 everywhere, inside what a 1dp `everTried` can carry.

**It is still not a published figure.** The numbers table labels the column as
derived and says so. **Ask the analyst for the underlying table** rather than
letting the deck quote it as research.

`emphasis` is a list of substrings to bold, so the data file carries no markup and nothing needs `dangerouslySetInnerHTML`. A typo silently no-ops, so that join is asserted too.

### `TEN_THINGS` in brand.ts is a THIRD colour band, and there are now FOUR

`SEGMENT_COLORS` owns the dark range (the wheel) and `LAYER_COLORS` the light (the media plan). A third page gets its own band rather than borrowing either and inheriting a meaning it does not have.

**The fourth arrived with the gap matrix on 2026-08-04, and it is a different kind of thing: a SCALE, not a set.** `GAP_POSITIVE_HUE` / `GAP_NEGATIVE_HUE` plus `gapWash()` produce a diverging ramp that fills 25 cells. Its two hues are deliberately **not new**: they are the emotional and rational curve colours every journey view already uses, so a reader has already learned the pairing. Its floor is not a stroke rule but a **capped alpha**, for the reason in the gap matrix section: cap the wash and one ink serves every step, rather than flipping ink between adjacent cells.

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

**The caller has to ask for the room.** `TopRegionsReach` and `CityReach` set `padding.top` 22, and `SeasonalIndex` and `FlatSharePenetration` set a `padding.right` (124 and 96) for exactly this. The plugin measures the gutter and falls back to the old inline placement when there is none, so a chart that has not asked still renders, it just renders the collision back.

**The dog owner redraw took the rule from two charts to four**, which is worth knowing before touching this plugin: 03, 05 and 07 all now carry the same national 1.03 benchmark, and all three read it from one `NATIONAL_PER_100_DOG_OWNERS` const rather than three literals, so a revision cannot move one chart's rule and leave the other two behind.

### Layout rules for the tile, and they are content rules

A tile is about **171 x 259 at 1280, 203 x 252 at 1440, 222 x 267 at 1536 and 272 x 242 at 1920**, with the sidebar expanded. **That range is not monotonic**: a tile gets SHORTER as the viewport grows, because its height is its content's and a wider tile needs fewer headline lines. Four things keep ten tiles reading as one grid:

- **`cardHeadline` is a separate field from `headline`**, short for the tile, full for the modal h2. Same split as `Persona.title` against `Persona.name`. When a headline does not fit, shorten the copy; never drop below the 14px prose floor.
- **The headline is `flex-1` AND `items-center`.** Taking the slack is what lands the hairline level across a row; centring in that slack is what stops the leftover reading as a hole. Same fix and same reason as the market band heading in `ReadinessLadder`.
- **`statLabel` has a `min-h` of the tallest label and `statValue` must fit ONE line.** The headline taking the slack only levels the top half: the block BELOW the rule also varies, and a taller label or a wrapped value lifts its rule out of line. Two labels and one value were shortened at 1280 for exactly this. `"About 12 months"` became `"~12 months"`, keeping the approximation the source had. The floor is `4.05em` (three lines) stepping to `2xl:min-h-[2.7em]` (two), because the tallest label is a function of the column width; measured, three labels need the third line at 1440 and none do at 1536.

- **THE GRID IS CONTENT SIZED AND CENTRED, and the type STEPS WITH THE TILE.** Added 2026-08-04 as a cap, finished the same day as content sizing. It is the fix for the page reading empty. See below.

Verified across twelve viewport shapes from 1920x1080 to 1280x720: rule spread at most 1px in both rows, **zero clipped tiles**, page overflow 0, nothing under 11px, and the only sub 14px prose is the 12px sources line, which `type.ts` sanctions as a footnote.

### Reducing the whitespace, 2026-08-04, and why type alone could not do it

The tiles read as mostly empty. Measured before touching anything, the slack in the headline box was **211 to 236px of a 429px tile at 1920** (55% of every card), 98 to 147px of 339px at 1440, and 10 to 59px at 1280. **One number would have been a font size problem. Three make it a layout problem**, and the fix is three coordinated changes.

1. **The grid was `h-full` with no ceiling**, so tiles absorbed every spare pixel of the viewport. A bigger tile is also a WIDER tile, which needs FEWER lines, so growing the viewport made cards emptier no matter what the type did. It capped at `600x1180` (`720x1400` from 1536 up) and centred with `m-auto`. **Whitespace inside a card reads as a mistake; the same whitespace around a centred grid reads as margin.** **The cap was then itself the residual problem and is gone; see the next section.**
2. **The type steps with the tile**, headline `body` to `lead` to `title` to `figure`.
3. **A four line stat label was breaking a row.** Point 09's `acquisitions,` is a 13 character unbreakable token that took a fourth line in a 147px column at 1280, pushing its stat block 81px to 96px and its hairline **15px out of line**. Shortened to `signups`, this page's own word for the same event. The documented rule held: shorten the label, never raise the min height.

**`roomy:` (1400px) is a custom breakpoint and it exists because the stock scale is backwards here.** The sidebar takes 320px, so a **1280 viewport is the TIGHTEST layout this grid ever sees**, and Tailwind's `xl:` fires at exactly 1280. Stepping the type at `xl:` would have enlarged it precisely where there is no room. There is no stock step meaning "1440 and up".

**Three things this pass got wrong first, all found by measuring:**

- **The headline and the stat value cannot step at the same breakpoint.** The headline wraps, so it can grow as soon as there is height. The stat value cannot, so it can only grow once the tile is at its widest. Stepping it at `roomy:` broke a row: `Aggregate only` is the one non numeric value here and at 24px in a 203px tile it took a second line, moving that hairline 24px. It steps at `2xl:`, where the cap pins the tile at 228px.
- **Raising the type without raising the `min-h` floor introduced a clip** at 1440x700: the tallest card needed 268px and got 255. The floor is what makes a short viewport scroll instead of clip, so it steps with the type. They are one system.
- **1280x720 was already clipping before any of this**, tiles 01 and 06 by 11px, because the old 520px floor was below the content's own height. Raised to 556.

**Do not tune one of these in isolation.** The tile sizes quoted above, the `min-h` floors, the `max-h` caps and the card's breakpoints were a single system, and every one of the three regressions above came from moving one and not the others. **That system is what the next section deletes.**

### Finishing it: the grid is CONTENT SIZED, and six numbers went with the cap

Same day, after the cap above was reported as still reading empty. **Measured before touching anything: the cap was set 179px above what the content needed.** At 1920 it pinned a tile at 272x355 holding 266px, and because the headline is `flex-1 items-center` that 89px showed up as **two 45px holes, one either side of the headline**. Two holes in the middle of a card is the worst available place to put slack.

The fix is to delete the ceiling rather than lower it. `h-full`, both `max-h` caps and all three `min-h` floors are gone; `m-auto`, the two `max-w` caps, the `grid-cols` / `grid-rows` pairs and `gap-2.5` stay.

**Why the rows stay equal without a height.** `grid-rows-N` is `repeat(N, minmax(0, 1fr))`, and in a grid with an indefinite height an `fr` track resolves from **the max content contribution of the items crossing it**, taking the maximum across all flexible tracks (CSS Grid 12.7.1). Columns are sized first and are definite, so the wrapped headline height is known by the time rows are sized. Both rows therefore land on the tallest card in the WHOLE grid, not their own row's tallest, which is what keeps the 5 x 2 block a rectangle: point 01 takes five headline lines and point 08 four, so independently sized rows would leave row 2 sitting 24px short.

**It also cannot clip, which is the real prize.** The floors existed to stop a short viewport squeezing a tile, and three times failed to. A content sized row grows to what it needs and the frame, already `overflow-y-auto`, scrolls instead. At 1280x720 it scrolls 45px where the old 556 floor scrolled 72, and clips nothing.

Interior spacing came down with it, `-24.85px` a card: `p-3` to `p-2.5`, `mb-2` to `mb-1.5`, `mt-2`/`pt-2` to `mt-1.5`/`pt-1.5`, and the stat label floor stepping to `2xl:min-h-[2.7em]`.

**Net at 1920: a tile goes 272x355 to 272x242, and the tallest cards carry zero interior air.** Grid 1400x720 to 1400x494. No font size, no `type.ts` and no `brand.ts` change.

#### The one regression it caused, and why only ink measurement found it

Removing the slack exposed that **a line box here is SHORTER THAN ITS OWN FONT METRICS.** `figure` sets `line-height: 1` and DM Sans wants about 1.29em, so the first line's inline box starts ~4px above the headline block and the last line's ends ~3px below it, **whatever the line count**. With 89px of slack that overflow had somewhere to go. Once the box fit its line boxes exactly, the headline's `overflow-hidden` started clipping it, and on the tallest card the last line's descender lost **2px**.

**A Range rect could not settle this and nearly gave the wrong answer.** `range.getClientRects()` returns the font metric box, so it reported 127.2px of "text" in a 120px box on a card whose glyphs were mostly fine. The question is whether INK is clipped, and the answer came from `TextMetrics.actualBoundingBoxAscent` / `actualBoundingBoxDescent` on a canvas set to the element's computed font, compared against the baseline derived from `fontBoundingBoxAscent`. Top cleared by 2px, bottom failed by 2px.

The fix is that **the headline no longer sets `overflow-hidden`**: the 3 to 4px lands in the 6px of empty margin already above and below it, the amount is a font constant rather than a function of the copy, and the CARD still clips, which is what `rounded-xl` and the absolute accent rail actually need.

**Two things worth carrying forward.** A tight `line-height` is free until you remove the slack around it, so **any layout change that makes a text box fit exactly should re-check ink, not boxes.** And `leading-snug` on that headline has never done anything: in this Tailwind CDN build the `fontSize` utilities' baked line-height beats a `leading-*` utility, so all four breakpoint steps override it. Left alone deliberately, because giving it real leading makes the tallest card taller and therefore every card taller, which is backwards for this brief.

**Verified across ten viewport and sidebar combinations** (1280x720, 1280x800, 1440x900, 1536x864, 1920x1080, sidebar expanded and collapsed): rows equal at every one, **hairline spread 0.8px at worst** against the 1px invariant, **zero clipped tiles and zero clipped ink**, page overflow 0, min rendered font 11px, `[data integrity]` silent. Modal path re-checked end to end: opens with focus inside the dialog, stepper walks all ten, Escape returns focus to the tile and releases the scroll lock.

**Residual, and it is honest content variance:** points 03, 07 and 10 have short headlines, so they still carry up to ~72px, centred. `items-center` is kept rather than `items-start` because collecting it into one hole above the hairline reads worse. **Do not fix it by lengthening a `cardHeadline`**, which is content serving layout.

## Interactive Media Plan page

[pages/InteractiveMediaPlan.tsx](pages/InteractiveMediaPlan.tsx) is the **Lyka Oct→Sep macro block plan**, rebuilt 2026-08-05 from the client briefing workbook (the grid architecture is the Carnival FY26 lineage, via Hamilton Island). It is data-driven from [data/mediaPlanData.ts](data/mediaPlanData.ts) and holds a single modal state (`budget` | `pct` | `channel`) reusing [components/shared/Modal.tsx](components/shared/Modal.tsx). Components live in [components/mediaplan/](components/mediaplan/):

- **[MacroBlockPlan.tsx](components/mediaplan/MacroBlockPlan.tsx)**: the grid. A funnel rail of the five stages (SHOW IT teal, CHECK IT tangerine, PROVE IT orange, TRY IT peach, SHARE IT muted mint), a Media column, 12 month columns (Oct→Sep), then Budget + %. Each channel row renders contiguous-run **gantt bars** (clickable → channel pop-up). **Bars are OWNER coloured, not stage coloured**: `OWNER_COLORS[row.owner].base`, green `#0A7D68` = Lyka in house, red `#E8151B` = SPEED managed, and the `OwnerLegend` row at the foot of the card is the key (a client requirement). Runs derive from `row.activeMonths ?? monthly > 0`, so in-house rows with zero dollars still draw their flighting. In-house rows read "In house" in the Budget column (the non-colour encoding of the split) and blank in %. A rail whose stage total is $0 (TRY IT, SHARE IT) shows the stage name without the `| 0.0%` suffix, which would neither fit its 1-row rail nor read as intended.
- **[BudgetBreakdownChart.tsx](components/mediaplan/BudgetBreakdownChart.tsx)**: opened from the Budget header. A **stacked-by-media** monthly bar (one dataset per FUNDED channel, stage-shaded via the shared `lighten()` in brand.ts), plus the **dashed "Planned flighting weight" line** from `FLIGHTING_PCT`. Three traps live here, all documented in the file: it must use the generic `<Chart type='bar'>` with `BarController` AND `LineController`/`LineElement`/`PointElement` registered (the typed `<Bar>` registers BarController only, passes tsc, throws at runtime); the `columnTotals` plugin and the tooltip `footer` sum **only `stack === 'spend'` datasets** or the overlay silently inflates every printed total; and in-house rows are filtered out with the shade index running over the filtered array, or 10 zero-datasets clutter the legend and the ramp gets gaps.
- **[BudgetPieChart.tsx](components/mediaplan/BudgetPieChart.tsx)**: opened from the % header. Budget allocation by funded channel, stage-shaded; slices pop out on hover (`hoverOffset`), % drawn inside via an inline `sliceLabels` plugin. Same `budget > 0` filter.
- **[ChannelDetail.tsx](components/mediaplan/ChannelDetail.tsx)**: the gantt-bar pop-up. Stacked top to bottom: ownership strip → rationale + dark-label execution table (**Strategy / Role of Channel / Implementation / Assets / Key metrics**, the client's order since 2026-08-06, and **not** the workbook's column order) → an **Examples** creative gallery → flighting. **The accent is owner-aware** (`accentFor(layerKey, owner)`): SPEED rows keep their stage accent for continuity with the rail and charts; in-house rows take the owner green, matching the bar that was clicked and avoiding the quiet TRY/SHARE fills that cannot carry text on white. The strip text uses the paired `ink` token (the old hardcoded `text-white` was 2.43:1 on tangerine) and carries an owner pill ("SPEED managed" red / "Lyka in house" white-on-green). SPEED rows show budget + % of media and the **flighting area chart** (stroke = `accent.text`, the stroke-safe dark tone, because the stage `line` hues are fill-only at ~2.6:1); in-house rows show "Managed and funded by Lyka's in house team", no dollars, and an **active-months strip** of 12 chips instead of the chart. TRY IT and SHARE IT rows have no `detail` at all (their description sheets are hidden in the workbook), so the whole rationale block is guarded out. The gallery uses `CreativeCard` with a **lightbox portalled to `document.body`**; capture-phase Escape closes the lightbox without the modal.

**The KPI strip is tokenised, and it was the one card in the app that was not
(2026-08-05).** All three of its sizes came from outside `data/type.ts`: the
title and sub line were `text-[11px]` arbitrary values and the figure was
Tailwind's own `text-2xl md:text-3xl`. Reported as hard to read, and measuring
found three separate causes rather than one:

- **The sub line was `mintMuted` at 1.88:1**, the real failure. See the
  FILL ONLY section under "Brand and typography": it was a seven-instance pattern.
- **The title was 11px `micro`**, which is legal for an uppercase mono eyebrow but
  is the smallest step in the scale. It is `label` 13 now, **+18% and the largest
  step that still reads as an eyebrow**: `body` 14 is the prose floor, above which
  it competes with the figure. Tracking moved with it, `tracking-wide` 0.025em to
  `TRACKING.caps` 0.06em, because `TRACKING.eyebrow` 0.08em is calibrated for
  `micro`. The sub line went to `meta` 12, since it is sentence case prose and
  `micro` is uppercase mono only.
- **Two weights were not real faces.** `font-bold` asked for DM Mono 700, which
  `index.html` does not load (400 and 500 only), so the browser synthesised it;
  the figure carried no weight class at all and rendered in Poppins Regular 400.
  They are `font-medium` 500 and `font-semibold` 600 now, both loaded. The figure
  also gained `tabular-nums`, so the figures align across the cards.

Verified at 1440 and 1280: every line clears AA (**minimum 5.44:1, was 1.88:1**),
all cards equal at 103px, no title or sub wraps or clips, page overflow 0.
**The figure is unchanged at 24/30px**, since `display` 30 is the top of the scale.

**THE STRIP IS THREE CARDS SINCE 2026-08-06, not four.** The Channels card
(`23`, `10 Lyka in house`) came out on client direction, and its two derived
counts came out with it because nothing else read them. The measurements above
still hold; only the count changed. **The grid track had to change with it**:
three cards left in `md:grid-cols-4` sit two thirds across with a dead fourth
column, which reads as a card that failed to load rather than one that was
removed. It is `grid-cols-1 sm:grid-cols-3` now.

**Known, and NOT fixed here: `font-mono` does not resolve to DM Mono anywhere in
this app.** Tailwind ships `.font-mono` as a default utility and its generated CSS
loads AFTER the hand-written `.font-mono, code, pre { font-family: 'DM Mono' }`
rule in `index.html`, so at equal specificity Tailwind wins and all **72**
`font-mono` elements render in the OS monospace stack (`ui-monospace`, i.e.
Consolas on Windows). This is the mirror image of the documented `.font-display`
warning: `display` has no Tailwind default so the hand-written rule survives,
`mono` does. The fix is one line, `fontFamily: { mono: [...] }` in the inline
`theme.extend`, but it restyles 72 elements across six pages including the
painstakingly measured Ten Things tiles and the Ladder's truncating chips, and
Consolas is arguably the more legible of the two at 11px. **It is a brand
consistency bug, not a legibility one**, so it is recorded rather than bundled
into a legibility fix. Do it as its own pass, with the Ten Things and Ladder
measurements re-run after.

### The bars carry TWO dimensions: owner by hue, presence by lightness (2026-08-06)

The workbook shades every bar cell at **three intensities per owner**, and the
first build flattened that to one flat colour per owner. It is back, and the
important part is what the shading is NOT.

**It is an editorial presence weighting, not a function of spend.** That was
tested before building anything: the darkest red spans **$10,000 to $2,000,000**
and the mid red spans **$5,000 to $1,000,000**, so the ranges overlap almost
entirely. Cinema settles it on its own, with December at $70,000 shaded medium
and February at the same $70,000 shaded heavy. And the in-house rows carry all
three shades while having **no dollars at all**. So it cannot be derived, and
`MediaRow.weight` is a 12-slot array read cell by cell from the fills.

Reading it required resolving Excel theme colours: the reds are `theme4`/`theme5`
with tints, which have to be composited through **HLS luminance**, not RGB, or
they come out wrong. Four distinct reds collapse to three rungs (`#B80F15` and
`#C00000` are the same "heavy" to the eye, 0.106 against 0.112 luminance) and
three greens map one to one. The arrays were **generated** from the workbook and
then round-tripped back out of the TS and compared, all 23 rows matching (20 rows since the 2026-08-10 consolidation), because
133 hand-typed cells is exactly where a transcription slip hides.

**Seven always-on rows share one signature, `H H M H H M M M M M M L`**: heavy at
launch, medium in December, heavy again for the Jan and Feb peak, medium through
the sustain, light in the September tail. That pattern is also what settled the
BVOD & SVOD February gap: every sibling row is heavy there, so the empty cell was
a slip and the level is heavy.

**`OWNER_COLORS[owner].weight` is a three rung ramp, and the 3:1 floor sets its
range.** A gantt bar is a data mark, so every rung has to clear 3:1 against white
on its own. The obvious approach of lightening the base by a fixed HLS step fails
that: it lands the light green at **1.77:1** and the light red at **2.84:1**. The
rungs are solved for target contrast with hue and saturation held instead, giving
green 8.66 / 5.06 / **3.07** and red 8.03 / 4.61 / **3.07**. The two families are
luminance matched rung for rung, so **heavy green and heavy red are only 1.08:1
apart and hue is doing all the owner work**, which is what lets a reader take in
both dimensions at once.

#### The light rung is ON the floor, and "lighter" is spent (2026-08-06)

Asked to make the light shade lighter, both light rungs were solved down to
**3.07:1**, which is as light as anything on this grid can legally be. Green
moved usefully (`#0E9C82` 3.44:1 to `#0FA68B` 3.07:1, widening the medium to
light step from 1.47:1 to **1.65:1**). **Red barely moved** (`#F16266` 3.14:1 to
`#F1666A` 3.07:1, a step of 1.47:1 to 1.50:1), because red was already sitting on
the floor before anyone asked, and red is most of what a viewer sees.

**The reason there is no headroom is a tautology worth writing down: "looks
lighter" IS "closer to white", so a rung cannot look lighter than 3:1 against
white while still clearing 3:1 against white.** Any further lightening is a
decision to breach the floor, not a tuning exercise. This is the ceiling on the
"widen the spread" advice the open item box below gives, so read the two together.

**Three levers are already spent**, and the token comment in `brand.ts` lists
them so nobody rediscovers them: lightening `light` again fails `__integrity`;
darkening `medium` moves THE BRAND COLOUR, since `medium` is `accentInk` /
`speedRed` and equals `base`, which draws the legend swatch and the owner pill,
so it would take SPEED red off SPEED red; and desaturating instead of lightening
does nothing, because contrast is luminance. If the tail still does not read as
tailing off, the options are to accept it, to breach the floor deliberately
(2.50:1 is `#11B99A` and `#F48386`, a clearly visible lift), or to stop encoding
the third level with lightness at all.

One thing improved on the way: both light rungs landed on the same target, so
they are luminance matched at **1.00:1**, tighter than the 1.08:1 and 1.10:1 of
the rungs above, and hue carries even more of the owner work than before.

**One property was lost and it is recorded rather than glossed:** the greens are
no longer all existing tokens. Heavy and medium are still `tealDark` and
`accentInk`, but `#0FA68B` replaces what was `SEGMENT_COLORS.Ready.lighter`.
**That token is unchanged and still owns its wheel wedge**; this is a fourth
green, deliberately.

**A flight stays ONE bar.** `GanttTrack` renders a contiguous run as a single
rounded, shadowed container and fills it with per-month segments that butt
together with no gaps, so the shading reads as a gradient across one flight
rather than as separate bursts. Always On Radio is the clearest case: two runs,
and the second is one Jan to Sep bar grading heavy, heavy, medium six times, then
light. The pop-up's in-house month strip uses the same ramp, so the grid and the
detail agree.

`__integrity.ts` asserts the join both ways (a month that runs must have a weight,
a weight on a month that does not run is a value rendering nowhere), plus the 3:1
floor per rung and a 1.25:1 minimum between adjacent rungs, because three levels
nobody can tell apart encode nothing.

The legend now teaches two dimensions without becoming six unlabelled swatches:
each owner is one graded ramp, and "darker to lighter: heavy, medium, light
presence" is said **once** underneath rather than repeated per owner.

### The rationale table: A POPULATED FIELD WITH NO LABEL IS A MISSING FIELD (2026-08-06)

Client feedback was that **Role of Channel was missing from all of the
rationales**, and the interesting part is that it was not. `detail.role` carries
the workbook's own "Role of the Channel" column (D) on **all 21** funded rows,
verified cell for cell against the three visible Media Description sheets. It
rendered as an **unlabelled paragraph** between the `{channel} rationale`
heading and the table.

**Unlabelled, it read as a preamble to the channel rather than as one of the five
rationale fields**, so against a table that visibly listed four labels it was
missing in the only sense that matters. It is a labelled table row now, second,
and the paragraph is gone. Nothing was written, moved between files, or sourced
anywhere new: this was a labelling defect start to finish.

**No data assertion could have caught it**, which is the reusable point. Every
join was intact and every string was present and correct. `__integrity` check 5e
now covers the OTHER direction, which is real and was uncovered: a genuinely
empty `role` would drop its row and the pop-up would render four and look
finished. Only rendering catches the first failure; only an assertion catches the
second, so both are needed.

Two further changes came with it, both client direction:

- **"Activation" is "Implementation".** Same field (`comesToLife`, the workbook's
  "How It Comes to Life"), new label.
- **The order is the CLIENT'S, not the sheet's.** Strategy, Role of Channel,
  Implementation, Assets, Key metrics. The workbook runs Consumer Journey,
  Assets, Role of the Channel, How It Comes to Life, so Assets moves down two
  places. Do not "restore" the sheet order thinking it is the source of truth for
  presentation: it is the source of truth for COPY only. The field to column to
  label to position mapping is now a table in the `ChannelDetailCopy` doc comment
  in `mediaPlanData.ts`, because **not one of the five field names matches either
  its column heading or its rendered label.**

**The label column went 110px to 150px, and the number is measured rather than
chosen.** `IMPLEMENTATION` is a single unbreakable token, so unlike
`KEY METRICS` it cannot wrap out of an undersized cell, it can only overflow it.
At 11px bold uppercase with 0.025em tracking it needs 102.8px in Arial Bold and
118.3px in the widest bold sans on this machine; DM Sans is CDN loaded so there
is no local file to measure, and both of those are wider than DM Sans Bold, which
brackets it. 150px leaves 126px after `px-3` and clears even the upper bound. The
old 110px left 86px and would have clipped it with no warning from anything.
**Adding the longest label in a set to a fixed width column is a measurement, not
a rename.**

**Cinema's missing Strategy is CLOSED, and how it closed is the argument for
flagging rather than filling.** Its "The Consumer Journey" cell is blank on the
SHOW IT sheet, so the row rendered four fields and opened on Role of Channel.
That was left visible and reported rather than written around, and on 2026-08-06
**the client supplied the line** ("MAKE THRIVING UNMISSABLE: Bring Poo, Pep and
Polish to life with the scale, attention and emotional impact of the big
screen."). Had it been invented to make the table look square, the deck would now
carry agency copy in a field the client reads as theirs.

**So every row with rationale copy carries all five fields, and check 5e's
`KNOWN_BLANK` is empty.** Keep it empty: add an entry only for a gap the client
has confirmed stays open, never to quieten output.

That was **21 rows** until 2026-08-10 and is **18** now, because one row was
deleted and two pairs were merged. The count is worth knowing only so a smaller
number does not read as lost copy: TRY IT and SHARE IT are still the only stages
with no description sheet, and nothing else lost a field. Re-verified after the
merges.

Creative layout is per-row via flags on `MediaRow`:
- **default** = a horizontal row of `CreativeCard`s; `imageWeights` set relative widths (the pattern here: a 16:9 mockup at ~2.6 beside partner logos at 1). `captions` label each card.
- `extraImages` + `extraCaptions` = an optional **second** horizontal row (BVOD logos over SVOD logos; the Cinema poster strip; Outdoor's partner logos under the shelter mockup).
- `stackedImages` + `stackedFirstSmall` = a small logo lockup above a full-width creative (realestate.com.au, Uber Pet).
- `pairedImages` is currently unused but still supported.

**`provisional` flag:** renders a **PENDING** pill on the channel name + a "finalised" note in the pop-up. Not set on any row.

**A DROPPED LOGO IS SILENT, and two were dropped on the first pass (found 2026-08-05).**
The gallery just renders one card fewer and looks deliberate, so nothing flags it:
not `tsc`, not `__integrity` (which checks that a declared path RESOLVES, never
that a workbook image was declared at all), and not a visual check unless you
already know what should be there. **QMS** was missing from Local OOH, reported by
the user, and re-auditing the workbook then turned up **10play and Kayo** missing
from BVOD & SVOD as well.

Both had the same cause: **I reconciled against the description copy instead of
against the tab.** The Activation cell for BVOD & SVOD names four BVOD platforms,
so I shipped four logos, but the Screens tab is headed **"Visuals to be included"**
and groups its images under labels in **column G** ("LINEAR TV" at G1, **"BVOD" at
G9**, "YouTube" at G12). The BVOD label spans rows 9 to 10, which hold **six**
logos. The tab governs the gallery; the description column is the strategy note.
Local OOH was simpler: the Local Messaging Outdoor tab carries JCDecaux, oOh! AND
QMS, exactly as the Trilogy Outdoor tab does, and I copied only the first two.

**`data/mediaPlanData.ts` now carries the full tab to row manifest in its header**,
so the next audit is a diff rather than a hunt: extract each visible tab's drawing
rels, list its images, confirm each appears against the row named there. Two facts
that audit needs: the oOh! logo exists twice in the workbook as near identical
files (568x262 and 570x262, different bytes) and both map to one `ooh.png`; and the
visible `LYKA LOGO` tab's three files are brand assets, not channel creative.

**A logo has since come off DELIBERATELY, which is the mirror image of this bug
and needs the same manifest note.** Paramount+ was removed from BVOD & SVOD on
client direction 2026-08-06 (its card was crossed out on a review screenshot), so
the Screens tab now offers six BVOD logos where the row wires **five**. The next
audit will therefore flag a missing logo correctly and reach the wrong
conclusion, so both the row and the header manifest say so explicitly. The file
stays in `public/images/`, unreferenced, so reversing it is one entry per array
rather than a re-extraction. **Two footnotes worth keeping:** the row's
Implementation copy still names Paramount+ and is flagged to the client rather
than quietly edited, because dropping a platform from copy is a different
decision from dropping its logo; and **captions join images BY INDEX**, so
removing index 2 from one array and not the other shifts every later label onto
the wrong logo while every card still looks deliberate. `__integrity` check
5d-ii asserts those lengths now.

**SCA came off the BBL row the same way, and it taught a layout rule.** Its card
was crossed out on a review screenshot, which also settled the open question from
the title change: SCA is off that ROW, title and creative, but **not off the
plan** (`sca.png` is still wired to Always On Radio, and the MMM Sports row still
reads "across Seven and SCA", SCA being represented there by Triple M). **Pulling
one of two cards out of `extraImages` leaves the survivor stretched across the
whole gallery**, because those cards are `flexGrow: 1, flexBasis: 0`, so Seven
would have been one logo floating in roughly 900px of empty mat under a full row,
reading as a broken layout rather than as one partner. Seven moved up into
`images` at weight 1 instead, which lands the row on Linear TV News's exact shape and
the documented house pattern: a 16:9 mockup at 2.6 beside partner logos at 1.
**So when a second row drops to one card, merge it up rather than leaving it.**

Verified after the fix: **42 wired images** (18 JPEG mockups and posters, 24 PNG
logos), **41 since 2026-08-10**, none missing from `public/`, and the six BVOD
cards render at exactly
276px each with **zero bottom spread** despite two captions wrapping to two lines,
because `CreativeCard`'s `items-stretch` plus its flex caption footer absorbs the
difference. When counting these, strip comments first: the manifest above names
`lyka-logo.png` in prose, and a naive grep for `/images/` scores it as wired.

### Stripping a logo's white background: FLOOD FILL, never a global replace (2026-08-05)

Six of the 25 partner logos arrived as opaque files (`paramount`, `val-morgan`,
`jcdecaux`, `qms`, `triple-m`, `uber-pet`), so each rendered as a **white rectangle
on the card's `LYKA.ivory` mat** while the other nineteen sat flush. Fixed with a
PIL plus numpy pass, which is the same technique Hamilton used on its mastheads.

**The method matters. "All near white pixels become transparent" is the obvious
approach and it is wrong**: it also deletes white that is INSIDE the artwork.
Concretely, it would have destroyed the counter in QMS's **Q**, the ring of
**stars** and the snow on Paramount's mountain, and the bowl of the **b** in
UberPET. Instead: threshold near white, label connected components
(`scipy.ndimage.label`), and clear alpha **only on components touching the image
border**. Enclosed white is unreachable from the border, so it survives by
construction. The run preserved 2,697 interior pixels on Paramount and 10,143 on
QMS, which is the number that proves it worked.

**Verified by compositing all 25 on magenta**, not by eyeballing them on the app's
near white card. `#F9F6F1` against `#FFFFFF` hides exactly the defect being fixed
and would hide a punched-out counter too. A hostile background is the only
readable test.

Anti-aliasing was left alone deliberately: the glyph edges are blended against
white, and every surface they land on here (the ivory mat, the white lightbox) is
near white, so the residual fringe is invisible and unmixing it would shift the
colours of the coloured marks. If one of these is ever placed on a dark fill, that
fringe becomes visible and the file needs a real matte, not a threshold.

Originals were NOT kept beside the stripped files. A backup folder inside
`public/` ships to `dist/`, and the workbook one folder up in `01 Sources/` is the source of truth,
so re-extraction is a few lines against `xl/media/`.

**Source of truth:** `Interactive Media Plan Briefing Template for Lyka.xlsx`, one folder above the app in `01 Sources/`. Only **visible** content was used, per the same client direction the Hamilton build followed: sheet `Budget Distribution $ Lyka SPEE` for the numbers and legend, the three visible `Media Description` sheets (SHOW IT, CHECK IT, PROVE IT) for the pop-up copy, and the visible channel tabs for the embedded creative (the tabs' TEXT is stale Hamilton template; only their images are Lyka). Excluded as hidden: the `$ Lyka` budget sheet (the superseded first pass, and the only place the in-house channels carry dollars, which is why green rows are flighting only), the TRY IT and SHARE IT description sheets, and the Australian Open Integration row. The **41** extracted images live in `public/images/` as kebab-case names, 16 JPEG and 25 PNG, and the 2-3MB photographic PNG mockups were re-encoded to ≤1920w JPEG q85. All Hamilton media plan creative and `public/media-plan/` were deleted with the rebuild.

**SECOND SOURCE, and the workbook is no longer the whole story (2026-08-06).** The client review round arrived as `Changes to the intereactive media plan.pptx` and added **three images that are not in the workbook at all**, plus copy that departs from it in a dozen places. Media plan creative now stands at **44 files on disk, 42 WIRED**:

| | |
|---|---|
| `nova-earworm.jpg` | Nova Ear Worm. Re-cut from the deck's slide 10 embed at 1306x629, header cropped. |
| `social-creators.jpg` | Paid & Organic Social. From the loose `picture.png`, 1333x584, which beat the embed. |
| `we-mean-well.jpg` | Podcaster Performance. From the deck's slide 12 embed, full frame 1672x941. |
| `paramount.png` | **UNWIRED**, removed on client direction. Still on disk. |
| `toni-and-ryan.jpg` | **UNWIRED**, removed on client direction. Still on disk. |

**A re-audit against the workbook alone will produce false positives in both directions**: it will find no source for the three new images and will find two workbook logos the rows no longer wire. All five are recorded in the manifest in `mediaPlanData.ts`'s header for exactly that reason. The two unwired files are photos of talent and a platform no longer on the plan, so remove them together in a cleanup pass, which also trims them from `dist/`.

### THIRD SOURCE, and the failure mode changes (2026-08-07)

`Accelerator Feedback - For Aaron.pptx` replaced **two more creatives, both in
place**, so the file count did not move and neither did a single string in
`mediaPlanData.ts`:

| | |
|---|---|
| `thriving-index.jpg` | realestate.com.au. Was a 1536x1024 workbook mockup; now the client's property listing laptop mock, 1499x929 cropped from a 1672x941 slide 2 embed. |
| `nova-studio.jpg` | Radio Segment. **Was a 738x738 WORKBOOK image**, so that row no longer matches its Radio Partnership tab either. Now the 16:9 studio frame, 1672x941 from the slide 3 embed, uncropped. |

**A REPLACED ASSET IS INVISIBLE TO A PATH AUDIT in a way an added or removed one
is not.** Every guard here asks whether a declared path RESOLVES: check 5d fetches
it and inspects the Content-Type, check 5d-ii counts it against the captions. A
swapped file passes all of them, because the path never changed. There is nothing
to assert against either, since "is this the right picture" is not a property code
can hold. **So the manifest note IS the check**, which is why both are written
into `mediaPlanData.ts`'s header rather than left to a binary diff that reads as
`Bin 92k -> 241k`.

**The loose export lost to the deck embed for the third and fourth time.** The
client supplied `laptop.png` (971x642) and `landscape.png` (1013x570) beside the
deck; both are the same mock at the same framing as the embed (`landscape.png`
rescales to a mean absolute difference of **1.8/255**), just smaller, by 1.72x and
1.65x linear. Running total across two decks: **three of four loose exports had
lost resolution.** The rule is now general enough to state plainly: **treat the
loose file as the INSTRUCTION and the deck embed as the ASSET**, and keep the
loose one as the record of the framing the client chose.

Neither embed needed the measured crop pass 17's did: **checked for slide chrome
and letterboxing before cutting, rather than assumed.** The REA embed was cropped
to its content plus a margin matched to the file it replaced, with the crop
verified by confirming no ink touches any edge; the Nova embed is full bleed and
shipped as is.

**`imageWeights` did not need retuning for the aspect change, and the reason
generalises.** Radio Segment stayed `[1.4, 1]` through a 1:1 to 16:9 swap because
`CreativeCard`'s mat is a **fixed height box with `object-contain`**, so height
binds and a WIDER image renders LARGER: the square drew 194x194 in a card with
room for 470, and the 16:9 frame draws 470x194. The instinct to widen the weight
would have been backwards.

### A channel rename is ONE field, and it widens the tab-name gap (2026-08-07)

**Linear TV is `Linear TV News`**, on client direction ("can we actually say
Linear TV News"). The whole edit is `channel` on that row, because the grid
label, the pop-up heading, the `{channel} rationale` heading and the flighting
chart title all derive from it. Verified all four in the browser rather than
assumed, which is cheap and is the only thing that catches a heading built from
a different string.

**What it costs is another row whose name no longer matches its workbook tab.**
The Screens tab's column G label still reads `LINEAR TV`, so this joins Radio
Partnership → Radio Segment in the manifest's `[tab name != row name]` list.
That list is load bearing for one specific reason: the creative audit
reconciles images **by tab**, so a re-audit that matches tab names to row names
would report this row as missing its source and reach the wrong conclusion.
Same class as the deliberate-removal note pass 17 recorded, and the same fix:
write it into the manifest so the next audit is a diff rather than a hunt.

**The five renames pass 17 landed were the same shape** and none needed anything
beyond the one field, so this is now a documented pattern rather than a one off:
in this data model a channel's display name has exactly one home.

**Confirmed again 2026-08-10**, when `Outdoor Stature` became `Outdoor Impact`:
still one field, and it widened the tab-name gap for the third time (the Trilogy
Outdoor tab feeds it). One thing to check that the pattern does not cover: the
row's own `role` copy still reads "fame, **stature** and repeated visibility",
which is the client's word in their own rationale rather than an echo of the row
name. **Left verbatim and flagged, not swapped.** A rename is one field; a
rationale is theirs.

### Consolidating rows, and the one thing a merge cannot derive (2026-08-10)

The client merged two pairs of channels and deleted a third row. Row count went
23 to **20** (11 SPEED, 9 in house).

| | |
|---|---|
| `Linear TV News` + `AFL Season Spot Plan` | → `Premium Linear News & Sport TV`, $2,150,000 |
| `BBL Cricket Integration Seven` + `MMM Sports Commentary Integration` | → `BBL & Cricket Integration Seven & TripleM`, $3,100,000 |
| `Acast Podcasts` | deleted (in house, so no dollars moved) |

**Everything numeric was derivable and nothing needed reconciling**, because the
client supplied both merged budgets and both are exactly the sum of the parts.
Monthly cells add index by index, and in the Linear case the two flights do not
overlap, so the combined array is a union with December still dark. **The check
that proves a merge was clean is the STAGE TOTAL**: SHOW IT 4,255,000, CHECK IT
5,650,000 and PROVE IT 1,095,000 all still match the workbook's own stage rows,
and January is still $3,295,000, so no dollar was lost or double counted.

**What a merge cannot derive is the copy**, and that is the reusable part. Each
pair had a full five field rationale, and merging two lines does not produce a
merged rationale. Both rows' copy is carried **verbatim and back to back** rather
than blended, on the same rule that got Cinema its real Strategy line: flag the
gap, do not fill it. The cost is visible and accepted (the trilogy is named twice
in one `assets` cell, and `strategyLink` now carries two uppercase directives),
and it is flagged to the client so they can send one merged rationale. `metrics`
is the only field touched at all, and only because it is a semicolon list: terms
appearing identically in both rows are listed once. **Nothing was reworded and
nothing was dropped.**

**No creative was lost either, but only because it was checked.** AFL's single
image was `seven.png`, which the Linear row already wired, so the merged gallery
is three cards rather than four with a duplicate: unique wired images went 42 to
41, and the one that left is `acast.png`, with its row. The BBL pair is the
opposite case, five cards across two rows, which would have squeezed two 16:9
mockups to a third of the gallery each in a single row. They regroup into the
house pattern this deck already uses on Outdoor Impact: mockups in `images`,
partner logos in `extraImages`. That also retires the pass 17 note about Seven
having to sit in the main row, since the lower row now carries three cards and
cannot strand a lone survivor.

One knock on resolved itself: SCA came off the BBL title in pass 17 while the
MMM row's copy still read "across Seven and SCA", on the reading that SCA is
represented by Triple M. **Triple M is now in the row name**, so the title and
the copy agree for the first time.

### `budgetLabel`: hiding a figure without moving the money (2026-08-10)

The client asked to replace Radio Segment's `$50,000` with the word `Package`,
and **the decision that actually matters is not the label, it is whether the
money leaves the plan.** It does not: the spend is real and bought inside a
package, so `budget` and `monthly` are untouched, MEDIA_TOTAL is still
$11,000,000 and no other row's % moved. `MediaRow.budgetLabel` changes DISPLAY
only.

**Three places print that figure, and hiding one of them is worse than hiding
none**, because a deck that half discloses reads as an error rather than a
decision:

1. The grid's Budget cell shows the label. **Its % cell blanks with it**, since
   "Package" beside "0.5%" hands the figure straight back off the grand total
   printed at the foot of the grid.
2. The pop-up's ownership strip shows the label instead of the money **and its
   "% of media" line**, for the same reason.
3. The pop-up's flighting chart is the one that nearly shipped wrong. It prints
   its values above each point, tooltips them as `Cost: $50,000` and scales its
   y axis in thousands, so it would have restated the number a few inches under
   the label hiding it. A labelled row now gets the **dollar free month strip**
   that in-house rows use, made owner aware so it still matches the red bar that
   was clicked.

**KNOWN AND DELIBERATE: the two chart pop-ups still show this row's dollars.**
The Budget header's stacked chart and the % header's pie both sum to $11.0M, and
excluding a row whose money is still in the total would make the columns stop
adding up. **That is the cost of keeping the money in**, and the alternative is
not a better hiding place, it is the other decision: take the $50,000 out and let
the total become $10,950,000.

`__integrity` check 5b-iii asserts the field is only ever on a SPEED row with a
real budget, because both ways of misplacing it are silent: on an in-house row
the label renders nowhere (that branch is tested first), and on a $0 row it
implies money that is not there.

### Condensing a flight: compress the money or remove it (2026-08-10)

The sixth instruction in the same round was to condense realestate.com.au to
February and March only. **The instruction was about flighting and the decision
was about money**, which is the thing to notice: the row spent $10,000 in each
of Feb and Mar then $5,000 a month from April to September, so dropping eight
months strands **$30,000** and there is no reading of "condense" that places it
for you.

The two honest answers give different grand totals, $11,000,000 if the tail
compresses into the two surviving months and $10,970,000 if it leaves, and the
call was **hold the total**: Feb and Mar carry $25,000 each. The client had
offered to supply budgets, so if theirs arrive, use them. **The even split is a
neutral choice rather than a researched one**, even because the two months it
replaces were even.

**The `weight` array was deliberately not re-levelled.** February stays `heavy`
and March `medium`, the workbook's own values, although both months now carry
the same $25,000. That looks like an inconsistency and is not one: the shading
is an editorial presence weighting and is provably **not** a function of spend,
which the Cinema row settles on its own by shading two identical $70,000 months
differently. Re-levelling would invent an editorial call nobody made. What did
have to change is Apr to Sep nulling out, or check 5b-ii warns that a weight is
rendering nowhere.

**Only the monthly totals moved** (Feb 1,175k to 1,190k, Mar 555k to 570k, Apr
to Sep down $5,000 each). No budget, no stage total and no % did, and January
was untouched at $3,295,000 **at the time of this edit**. It is $2,635,863.36
since the Cricket row was re-phased on 2026-08-11, which is what the file header
asserts now; that later change did not touch this row.

## The APEX page

[pages/ApexBySpeed.tsx](pages/ApexBySpeed.tsx). **Real Lyka since 2026-08-07**
(pass 19): two Roy Morgan Single Source audiences, Conflicted Troubleshooters
(4.36M) and Mindful Researchers (1.39M), exported from the APEX by SPEED Tool
as the two decks in the project folder. The design spec is
`docs/superpowers/specs/2026-08-07-apex-lyka-design.md`.

The page mirrors the tool's report shell: top level **view tabs** (About | True
Net Worth Index | Growth Quadrant, About is the default), then a **persona tab
strip** inside the two data views. The audience selection survives a view
switch on purpose. The two data views are the export decks' slide 4 and
slide 5; slides 2 and 3 (Addressable reach bars, Reach x Attention table) are
deliberately not carried.

- **About**: the tool's client supplied positioning copy (`APEX_ABOUT`,
  verbatim, do not edit without a client instruction) plus
  [ApexMethodology](components/apex/ApexMethodology.tsx). The formula bar reads
  RM INDEX x KNF SCORE x TTD/PAC PREMIUM = TRUE NET WORTH INDEX; the old
  intermediate "TABLE 1" pill was the Method B step, whose table this page does
  not carry. **The pill labels print in `lighten(accent, 0.35)` on the dark
  bar**, because the raw accents cannot carry text there (#1d8a6b is 2.85:1 on
  tealDeepest) and filling the pill with the accent put white on #10B193 at
  2.2:1. That was invisible for the three days the page sat behind the
  placeholder; `__integrity` check 15 asserts the lightened value now.
- **True Net Worth Index**: [ApexChannelTable](components/apex/ApexChannelTable.tsx),
  columns matched to slide 4 (Channel | Tier | Heavy % | RM | KNF | TTD/PA
  Consulting | True Net Worth + bar). The bar's fill scales inside an inset
  that stops short of the value label, so the longest bar (202) cannot run
  under its own number. Filled stars are `#B8571C`, not canonical Tangerine
  (2.35:1, under the 3:1 mark floor); the printed multiplier below them is the
  accessible carrier. Star scale: 5 = 1.30x+, 3 = neutral 1.00x, 1 = penalty.
- **Growth Quadrant**: [ApexGrowthQuadrant](components/apex/ApexGrowthQuadrant.tsx),
  a plain SVG ported from the tool with its label placement pass
  ([labelPlacement.ts](components/apex/labelPlacement.ts), verbatim port, unit
  tested upstream). X = addressable reach % (divider 40), Y = TNW Index
  (divider 100). **Text sizes go through `svgFont()`** against the measured
  container, and the label boxes fed to the placement pass derive from the SAME
  compensated fonts, so the collision maths hold at every width. The corner
  action copy wraps at 30 characters, not the tool's 38: the compensated font
  makes a line LONGER in user units as the container narrows, and at 1280 a 38
  character line ran into the BVOD dot.

**Editing rules for [data/apexData.ts](data/apexData.ts):**

- `tnwIndex`, `ttdStars` and `quadrant` are **derived at module load** from the
  raw inputs and the channel constants. Never type them. The rebase is over the
  rows present, so adding or removing a channel changes every `tnwIndex`.
- `__integrity.ts` check 15 holds an independent transcription of the decks'
  published slide 4 values and asserts the derivation reproduces all 28. If a
  channel constant is revised (as Cinema's KNF was, 61.4 to 110.0 on
  2026-08-06), re-export from the tool and re-transcribe; never edit the
  expected table to match the code.
- The other two personas (Devoted Caterers, Secure Sleepwalkers) exist as
  presets in the tool. Adding one is an input block + an `apexTables` entry +
  an `EXPECTED_TNWI` block, from a reviewed export only.

## Notion Coworking Setup page

[pages/NotionCoworkingSetup.tsx](pages/NotionCoworkingSetup.tsx). Added 2026-08-10
from the 10-slide `Lyka Notion Coworking Setup.pptx`. A **scrolling** presentation
page (root `animate-fadeIn` + `pb-16 md:pb-24`, like APEX), NOT a one-viewport
frame: ten slides of narrative read top to bottom. It proposes a shared
Lyka × SPEED Notion workspace both teams and both Claudes keep current.

**This is not a slide transcription.** The deck's content is recast into six
interactive sections, consistent with the rest of the app (LYKA palette, type
tokens, mint hairlines, mono eyebrows, pill radii, the one easing curve):

- **A. The problem** (slide 2): four scattered source chips at skewed CSS
  rotations converge into one shared-space card. Hover straightens and lifts a
  chip. Inline in the page.
- **B. The shared space** ([SharedSpaceDiagram.tsx](components/notion/SharedSpaceDiagram.tsx),
  slide 3): a DOM hub, Lyka side | Shared Space | SPEED side, sides coloured via
  `OWNER_COLORS`. Hovering a side dims the other (the ApexMethodology focus/dim
  pattern). Stacks vertically below `md`.
- **C. Four places** ([PillarCards.tsx](components/notion/PillarCards.tsx), slide
  4): four pillar cards styled like ApexMethodology's source cards. Bullets
  always visible (no expand, no modal), hover is emphasis only.
- **D. How it works** (slides 5 + 6): three setup steps as a numbered strip
  (inline) + [PracticeWalkthrough.tsx](components/notion/PracticeWalkthrough.tsx),
  four step cards each with an actor tag (Lyka / SPEED / Both). Hovering a step
  highlights its actor consistently across the strip.
- **E. Compounds + Private** (slides 7 + 8): [CompoundingVisual.tsx](components/notion/CompoundingVisual.tsx),
  Month 1/3/6 growing block stacks with a one-shot IntersectionObserver reveal
  (`prefers-reduced-motion` renders the final state immediately), beside a static
  privacy panel (owners inside a dashed boundary, other clients outside marked no
  access).
- **F. Scattered → shared + close** ([BeforeAfter.tsx](components/notion/BeforeAfter.tsx),
  slides 9 + 10): five before → after paired rows (hover emphasis), then a dark
  closing band on `LYKA.tealDeepest` (like ApexMethodology's formula bar) so the
  page ends deck-like.

**All copy is in [data/notionCoworkingData.ts](data/notionCoworkingData.ts)**,
house-styled there once (no em dashes, no hyphenated compound modifiers, the real
`×`). Every string traces to a slide; never invent a claim.

**`OWNER_COLORS` reuse is the one sanctioned borrow here** (green Lyka / red
SPEED), decided with the client, and recorded in `brand.ts`'s `speedRed` and
`OWNER_COLORS` comments. Only `base` and `ink` are used; the `weight` rungs are
gantt-specific. Do NOT borrow the other page-owned bands (`SEGMENT_COLORS`,
`LAYER_COLORS`, `TEN_THINGS`, the gap ramp, `FOCUS`).

**All visuals are DOM/CSS, no SVG** (the gap-matrix precedent), so none of the
`svgFont` / `useElementSize` apparatus is pulled in. Static + hover throughout;
no Modal, no new `__integrity` checks, no new assets. The `[data integrity] ok`
line's counts are unchanged.

## Plugging Into The Ecosystem page

[pages/EcosystemFit.tsx](pages/EcosystemFit.tsx). Added 2026-08-10, recast from
the standalone `Plugging Into The Existing Ecosystem.html` deliverable one folder
up in `01 Sources/`. A **scrolling** presentation page (`animate-fadeIn` + `pb-16 md:pb-24`), like
Notion Coworking Setup and on the same inline `Section` shell. It states SPEED's
operating role: not to replace Lyka's existing team, data and measurement tools,
but to plug into them and make the whole ecosystem work harder.

Structure, mapping the source blocks:

- **Header**: the hero. Eyebrow `Lyka × SPEED | Our role`, the three clause h1,
  then the negative framing (muted) and the positive clause (emphasised).
- **A. How it fits together** ([EcosystemDiagram.tsx](components/ecosystem/EcosystemDiagram.tsx)):
  a central dark `tealDeepest` hub ("Lyka's ecosystem" and its three in place
  capabilities) with the four connection cards around it. A 3-column grid on `lg`
  (two cards | hub | two cards), hub full width on `md`, stacked on mobile.
- **B. What we would actually do**: four numbered pillar cards, the `PillarCards`
  idiom (white card, mint hairline, `accentInk` top rule that thickens on hover).
- **The principle**: a light band of three pills.
- **The outcome**: a dark `tealDeepest` closing band, deck-like, carrying the
  five outcome points.

**The four CURVED SVG connector ties are the one piece of real machinery here.**
The cards and hub are DOM; the ties are a DECORATIVE SVG overlay (no text, so none
of the `svgFont` / `useElementSize` type apparatus applies, and `aria-hidden`).
Their endpoints are **measured** from the real card and hub rects, the pattern
MindsetFlow uses via [useElementSize](hooks/useElementSize.ts), so they stay
aligned across sidebar collapse, resize and font load reflow. The page's
`animate-fadeIn` is a transform on a shared ancestor, so it shifts the wrapper,
hub and cards together and **relative** coordinates are unaffected: no timing wait
is needed. Each tie leaves its card's vertical centre and fans into the hub at
0.3 / 0.7 of its height; hovering a card brightens its tie and dims the other
three (the focus/dim pattern). **Ties render on `lg` only**, gated on
`matchMedia('(min-width: 1024px)')`, the same breakpoint that makes the grid
3-column: below it the corner geometry does not exist, so no ties are drawn.

**All copy is in [data/ecosystemData.ts](data/ecosystemData.ts)**, house-styled
there once (no hyphenated compound modifiers, no em dashes; the source had several
of each). Every string traces to the source HTML; never invent a claim.

**Colours from `LYKA` only** (`accentInk` for the ties and accents, `tealDeepest`
for the hub and closing band). No new `brand.ts` tokens, no new assets and no new
`__integrity` checks, so the `[data integrity] ok` counts are unchanged. The
design spec is at
[docs/superpowers/specs/2026-08-10-ecosystem-page-design.md](docs/superpowers/specs/2026-08-10-ecosystem-page-design.md).

## Brand and typography

**Palette source of truth.** Lyka's brand is correctly implemented in exactly one place in this workspace: `RFI - Lyka/lyka-rfi/styles/globals.css`. That is where this app's palette came from.

> **Do not use `Showcase Accelerator - Lyka` as a colour reference.** Despite the name, it was never actually re-themed. Its hero overlay is still SPEED red `rgba(237,28,36,0.65)`, its Tailwind config only declares `brand.red #ed1c24`, and exactly two Lyka values exist in its entire source (a teal menu overlay and one teal icon hover). Its own `design-review.md` enforces a red-only palette and would flag Lyka teal as a violation.

### Two colour layers, and which to use

1. **[data/brand.ts](data/brand.ts)** is the single source of truth. Import from here in TS/TSX.
2. **`index.html` `:root`** mirrors it as `--lyka-*` custom properties, for inline `style={{ }}` (Tailwind CDN cannot reach custom properties as utilities).

`brand.ts` has two hard constraints, both load bearing:

- **No React and no DOM types.** [worker/index.ts](worker/index.ts) imports `LYKA` to build the login page, and `worker/tsconfig.json` runs with `lib: ["ES2022"]`, no DOM lib and no `@types/node`. A React import there breaks `npm run typecheck`.
- **Literal hex only, never `var(--token)`.** Chart.js draws to a canvas and cannot resolve custom properties.

It exports `LYKA` (the palette), `SEGMENT_COLORS` + `getSegmentColor()` (the wheel and journey tabs), `LayerKey` + `LAYER_COLORS` (the media plan's five stages, all paired with the one ink `#003D33`), **`OwnerKey` + `OWNER_COLORS`** (the media plan's green/red bar split: `lyka #0A7D68`, `speed #E8151B`, the one sanctioned data use of SPEED red because the colour denotes SPEED itself), the shared `lighten()` helper both budget charts shade with, and the `CHART_*` chrome constants.

**This killed three duplications** that existed in the Hamilton build: segment colours in 2 places, media-plan layer colours in 4, and a third `:root` block inside the Worker. If you are about to paste a hex, you are probably about to reintroduce one.

**`LayerKey` is declared in `brand.ts`, not `mediaPlanData.ts`.** `mediaPlanData` re-exports it (`export type { LayerKey }`, required because `isolatedModules` is on) so its two existing importers keep working. Declaring it the other way round creates a circular import.

**`LAYER_COLORS[key].ink` is not decoration.** White on Lyka Tangerine is 2.43:1 and on Lyka Orange is 2.34:1, so any text drawn on a layer colour must use `ink`, never a hardcoded `text-white`. The funnel rail and the pop-up strip in [components/mediaplan/](components/mediaplan/) are the consumers, and since 2026-08-05 the pairing is asserted by `__integrity.ts` (check 6a) for both `LAYER_COLORS` and `OWNER_COLORS`, because the old 'Active Consideration' set had shipped a 2.62:1 pair.

### `LYKA.mintMuted` is FILL ONLY, and seven places had to learn that (2026-08-05)

Its comment used to read "Muted mint for faint labels", and **seven places took it
at its word.** `#A9C3B4` is **1.88:1 on white and 1.75:1 on ivory**: it misses AA
4.5:1 for text and it also misses the **3:1 non-text floor**, which is the one
that covers an icon or a control. So it was not a quiet label, it was an
invisible one. Found when the media plan KPI strip was reported as hard to read;
the strip was one instance of a pattern.

All seven are `LYKA.muted` `#5B6E64` now: the KPI sub lines and the pop-up's
inactive month chips and "tap to enlarge" hint (media plan), **every modal's
close button** (`Modal.tsx`, so this one was on every pop-up in the app), the
journey table's definition `InfoIcon`, the score graph's y axis numbers, and the
gap matrix's "no data". The two journey files are the documented untouched A/B
baseline; these are **colour only**, which cannot invalidate a layout comparison.

**`muted` is the palest ink in this palette that clears AA** (5.44:1 on white,
5.26:1 on the cream page, 5.06:1 on ivory, 4.82:1 on the cream panel). There is
nothing legal below it: `accent` is 2.72:1 and `mint` is about 1.24:1. **So
"make it fainter" is never available. Quiet has to come from a smaller size or a
lighter weight.**

Two things now keep it true. The token's comment says FILL, BORDER AND STROKE
ONLY with the ratios in it, and **`__integrity.ts` check 6c asserts the dividing
line from both sides**: that `mintMuted` still fails the 3:1 non-text floor (so
nobody reads the comment as advisory) and that `muted` still clears AA on all
four surfaces (so the replacement stays safe everywhere, not just on the white
card the complaint came from). `VariantSwitcher.tsx` had already recorded the
lesson in a comment, having deleted a 9px eyebrow in this token as "the worst
size-and-contrast pairing on either page"; the comment was there and the other
seven instances still shipped, which is why this is an assertion now.

Also removed: a dead `--mint: ${LYKA.mintMuted}` in [worker/index.ts](worker/index.ts).
Nothing referenced it, and the NAME invited the next person to make the same
mistake on the login page. **No backticks in that file's CSS**, incidentally: the
whole page is one template literal, so a backtick in a comment terminates it.

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
│   ├── mediaPlanData.ts          The Oct→Sep Lyka plan: 5 stages, 20 rows, owner split. Real Lyka.
│   ├── apexData.ts               APEX: channel constants + 2 Lyka audiences. DERIVED indices. Real Lyka.
│   ├── notionCoworkingData.ts    Notion Coworking Setup page copy. Pure TS, house-styled. Real Lyka.
│   └── ecosystemData.ts          Plugging Into The Ecosystem page copy. Pure TS, house-styled. Real Lyka.
├── hooks/
│   ├── useVariant.ts             Variant state: ?pv= / ?jv= then localStorage. Scaffolding.
│   └── useElementSize.ts         ResizeObserver. Feeds svgFont(), and the flow viewBox aspect.
├── pages/
│   ├── Personas.tsx              Sunburst landing (default)
│   ├── CustomerJourney.tsx       Segment journey selector + table. Tabs derive from segmentKey.
│   ├── BusinessDashboard.tsx     Designed empty state. Power BI iframe REMOVED (see header).
│   ├── TenThings.tsx             One viewport 5 x 2 finding grid + stepper modal. Real Lyka.
│   ├── InteractiveMediaPlan.tsx  The Lyka macro block plan. OPEN since 2026-08-05.
│   ├── ApexBySpeed.tsx           Channel scorecard. View tabs + persona strip. Real Lyka.
│   │                             (PendingSections.tsx was deleted 2026-08-07 when APEX opened.)
│   ├── NotionCoworkingSetup.tsx  Scrolling Lyka × SPEED shared-workspace pitch. 6 sections. 2026-08-10.
│   └── EcosystemFit.tsx          Scrolling "plug into the ecosystem" pitch: hub diagram + pillars. 2026-08-10.
├── components/
│   ├── Sidebar.tsx               8-item nav. Black panel (SPEED chrome), active pill #0A7D68.
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
│   │   ├── JourneyScoreGraph.tsx         Interactive smooth-curve graph. 6 additive props.
│   │   ├── GapBar.tsx                    Diverging bar for one gap. Compare + matrix.
│   │   └── variants/                     index.ts registry + types.ts contract
│   │       ├── TableAdapter.tsx          Wraps the table to the shared contract
│   │       ├── JourneySpine.tsx          Curve leads, stepper, one stage of detail
│   │       ├── TensionMap.tsx            All five on a shared scale + the emotion/reason gap
│   │       ├── GapMatrix.tsx             All 25 cells at once. Read DOWN a column.
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
│   │       ├── chartPlugins.ts           benchmarkRule, barValueLabels, lineValueLabels
│   │       │                             (bubbleLabels went with point 05's bubble, 2026-08-10)
│   │       └── *.tsx                     9 charts. MmmConfidence is HTML, deliberately.
│   │                                     CityReach, TopRegionsReach and LapsedVsActive
│   │                                     replaced CityLifecycle, TopRegionsRav and
│   │                                     LapsedPool with the dog owner redraw.
│   ├── apex/                             ApexChannelTable (slide 4), ApexGrowthQuadrant (slide 5),
│   │                                     ApexMethodology, labelPlacement.ts (ported from the tool)
│   ├── notion/                           SharedSpaceDiagram, PillarCards, PracticeWalkthrough,
│   │                                     CompoundingVisual, BeforeAfter (all DOM/CSS, no SVG apparatus)
│   ├── ecosystem/                        EcosystemDiagram (DOM cards + a measured curved tie SVG overlay)
│   ├── icons/                            20 custom SVG icon components (all referenced)
│   └── shared/
│       ├── Modal.tsx                     All pop-ups. Escape, focus trap, scroll lock, opt-in stepper.
│       │                                 Focus MOVE IN fixed 2026-08-04, see below.
│       ├── Lightbox.tsx                  Click to enlarge. CAPTURE phase Escape, so it nests inside Modal.
│       │                                 (PendingSection.tsx deleted 2026-08-07; recover from git if needed.)
│       └── VariantSwitcher.tsx           Segmented control on both pages. Scaffolding.
└── public/
    ├── images/
    │   ├── lyka-logo.png                        Top-right client mark
    │   ├── apex-by-speed-logo.png               SPEED asset
    │   └── (media-plan creative)                41 Lyka files from the briefing workbook,
    │                                            2026-08-05: 16 JPEG mockups and posters
    │                                            (re-encoded ≤1920w) + 25 PNG partner logos,
    │                                            all 25 alpha (6 had their white background
    │                                            flood filled off). All the Hamilton creative
    │                                            and media-plan/ were deleted.
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

`public/` went 120 MB (Hamilton) to 78 MB (shell pass) to 22 MB (audience pass) to 72 MB (films and emblems) to **55 MB** with the media plan pass, measured: 47 MB `personaVideos/`, 5.7 MB `images/`, 1 MB each `icons/` and `snapshot_emblems/`. The ~23 MB of Hamilton creative came out and 5.7 MB of re-encoded Lyka creative went in. **86% of it is persona film**, so the largest single saving available here is re-encoding the five vignettes before a deploy, not touching the creative.

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
   [data integrity] ok. 5 personas, 5 segments, 5 journeys, 3+5 variants, 10 findings, 20 media plan rows, 28 apex rows, 56 assets queued for check, shares, budgets and published tables balance.
   ```

   **The counts in that line are derived, so they move.** `3+5` was `3+4` before the gap matrix and `4+4` before the Index view was cut; `56` was `15` before the media plan creative joined the asset check and `54` before that. Treat a change in them as expected after adding or removing either; treat any OTHER output as a real problem. (Verified against a real dev load on 2026-08-10, which is the only way to keep this line honest: it is quoted prose, so nothing asserts it.)

   It asserts persona categories against `categoryData`, `categoryData` keys against `SEGMENT_COLORS`, `categoryData[k].title` against `SEGMENT_IMAGES` **in both directions**, every `journeyMeta.personaId`, every `PERSONA_VIDEOS` id, every asset path, the media-plan budget invariant, the palette floors (2.7:1 vs white for wedge fills, 4.5:1 pair based for `ink`/`tintInk`, and for the `LAYER_COLORS`/`OWNER_COLORS` pairs), that the derived stage shares sum to 100% and agree with `categoryData`, and that both variant registries have unique ids and a resolvable default.

   **Five media plan checks came in with the Lyka rebuild (2026-08-05)**: every `monthly` has 12 entries (the gantt and the flighting chart are index joined to `MONTHS`); every `owner: 'lyka'` row has zero dollars and a 12-entry `activeMonths` with at least one true (an in-house row with dollars silently changes every total, one without `activeMonths` renders no bar at all); `FLIGHTING_PCT` sums to 100 with 12 entries; the media plan creative joins the Content-Type asset check (it was the one uncovered image group); and the `LAYER_COLORS` / `OWNER_COLORS` ink pairs clear AA.

   **Check 6c came the same day** and is a different shape from the rest: it asserts a token is UNUSABLE. `mintMuted` must keep failing the 3:1 non-text floor and `muted` must keep clearing AA on all four surfaces, which pins the fill-versus-ink boundary from both sides. See the FILL ONLY section under "Brand and typography".

   **Four checks came in with the gap matrix (2026-08-04)**, all of them promoting something that was merely expected into something enforced: that **all five journeys carry the same five stage titles in the same order** (`JOURNEY_STAGE_NAMES` is derived from `TAB_ORDER[0]` alone, so a renamed stage put real numbers under the wrong column headers); that **all 50 score strings parse, descriptor included** (a colon instead of a dash parses the number and silently drops the text, which on the matrix is an empty pop-up); that there are **25 cells and they fall inside `GAP_DOMAIN`** (outside it the ramp clamps, so two different gaps render as one colour); and that **every `GAP_RAMP` step clears AA as a fill and ink pair**, which is what stops a future edit raising the wash ceiling. **Both of the first two were negative tested and seen to fire, then reverted.**

   For Ten Things it also asserts every `chart` key against `TEN_THINGS_CHARTS`, that the ten ids run `'01'` to `'10'` in order, that every `emphasis` substring is present in its `learn` paragraph (a typo silently no-ops the bolding), the six map assets, **that every plotted series matches its published numbers table**, the 3:1 stroke floor on `TEN_THINGS` against the cream mat, and that each `CANVAS_FONT` string's px number equals its named `TYPE` token (`ctx.font` takes a literal string, so `type.ts` cannot be its source and the two would otherwise drift silently).

   **Four checks came in with the dog owner redraw (2026-08-10)**, replacing the three household era totals point 10's copy used to state out loud. **12b** asserts point 07's SECOND numbers table, the RAV figures, which no chart plots any more and which nothing else would notice drifting. **12c** asserts that the DERIVED half of point 02 reproduces the two figures the source publishes, and that still active is a subset of ever tried on every decile, since a stack whose base exceeds its total draws a negative band. **12d** cross checks points 07 and 10, which share twelve regions and both publish an active figure for each: two independent transcriptions agreeing is a real check rather than a tautology. **13b and 13c** cover the basis join, whose failure mode is that a tile rail simply is not there, and its colour pairs. **13b also asserts the split is exactly 5 and 5**, because the About copy says "five of the ten" and "the other five" out loud, so a sixth point changing basis would leave a confident sentence on screen that its own data no longer supports. **12d and 13b were negative tested and seen to fire, then reverted.**
   **It checks Content-Type, not just `response.ok`.** Vite's dev server answers a missing `public/` path with the SPA fallback: HTTP 200 and `text/html`. A missing image therefore looks fine to `r.ok`, which is why the earlier naive version of this check reported nothing.
2. **Residue greps.** Use `git grep`, not `grep -r`: it searches tracked files only, so it skips `node_modules`, `dist`, and `.wrangler` (which holds stale bundles containing old `Hamilton` strings that otherwise pollute every result).

## Deploy

**The deck is LIVE AND PUBLIC on two hosts.** This section used to open
"nothing is currently deployed, by decision", which has been false since
2026-08-10.

| Host | URL | How it updates |
|---|---|---|
| **Netlify** | https://speed-x-lyka-accelerator.netlify.app | **Automatic.** Builds from `origin/lyka-main` on push |
| **Cloudflare Workers** | https://speed-x-lyka-accelerator.aaronzspeed.workers.dev | **Manual.** `npm run deploy:cf` |

**So the routine is: `git push`, then `npm run deploy:cf`.** Skip the second and
**Cloudflare** is the stale host. That is the opposite of what this file said
until 2026-08-11, when a plain push was observed putting a new bundle on Netlify
and both hosts were confirmed serving byte identical bundles under distinct
`Server:` headers.

**Verify a deploy with a cache bypass**, not a normal browser load. Right after
a deploy, an edge cached copy rendered the PREVIOUS build while `curl` showed
the origin correct. Both hosts send `Cache-Control: max-age=0,
must-revalidate`, so it resolves on revalidation, but measuring your own stale
copy looks exactly like a failed deploy.

### ⚠ THE TWO HOSTS ARE GATED DIFFERENTLY. Only one is protected

As at 2026-08-11:

| Host | Gate | Status |
|---|---|---|
| Netlify | Netlify's own **site password** | **GATED.** Returns HTTP 401 |
| Cloudflare | the Worker gate, **bypassed** | **FULLY OPEN.** Returns HTTP 200 |

`PUBLIC_ACCESS` is still `true` at `worker/index.ts:298`, so the Worker serves
every request without a login. **Putting a password on Netlify therefore does
not protect the deck**, because the Cloudflare URL is the same content with no
gate at all, and it is the link that has been shared.

To close it: set `PUBLIC_ACCESS = false`, confirm `SITE_PASSWORD` is set on the
Worker (`npx wrangler secret list`), and redeploy. Do not assume the two
passwords are the same; they are separate systems.

**And do not read a Netlify check as a content check while it is gated.** A
scripted verify against a 401 page finds no old copy and reports clean, which
is a FALSE PASS: it proved only that the gate page lacks the string.

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

**You almost certainly do not need those commands.** Live at
https://speed-x-lyka-accelerator.netlify.app and **deploying automatically from
GitHub**: a plain `git push` triggers the build, verified 2026-08-11. This
folder has **no `.netlify/state.json`**, so it is not linked from disk and the
CLI route is not the path being used. The warning above still stands if you ever
do link it.

(This paragraph previously said the opposite, that no auto deploy was wired up
and pushing did not trigger a build. It does.)

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
- Asset payload is **54.8 MB**, measured 2026-08-07, and **86% of it is the five persona films** (`personaVideos/` 46.7 MB, `images/` 6.1 MB, `icons/` and `snapshot_emblems/` 1.0 MB each). All of it is Lyka's. Limits are 25 MiB per file and 20,000 files on the Workers free plan, so there is ample headroom, but the largest saving available before any deploy is re-encoding those films, not touching the creative: they ship as delivered at roughly 13 Mbps into a slot that renders at about 285x507 CSS px. (This bullet claimed ~22 MB "still Hamilton's" until 2026-08-07; it had been stale since the pass 14 media plan rebuild and the pass 9 films.)
- A first deploy to a brand new `workers.dev` subdomain takes a minute or two to propagate. A 404 or Cloudflare error 1042 immediately after deploy is propagation, not a broken build. Re-check before debugging.

## Source control

> ### Pass 20 is committed and pushed (2026-08-10)
>
> **`origin/lyka-main` is at 36 commits.** Verify with
> `git rev-list --count lyka-main` rather than trusting this number: the block
> below explains why a docs commit can never state its own hash, and the same
> argument makes any count here stale the moment it is written.
>
> | | |
> |---|---|
> | `dcbfba3` | Ten Things onto the dog owner basis: the data, five rebuilt charts, three renamed join keys, `BASIS_COLORS`, the tile rail, the five labelled blocks, the About dialog, four integrity checks |
> | `bce22df` | Its docs, plus the staleness the refactor exposed and three README claims that predated it |
>
> **The split is code then docs, and that is the only split that was physically
> available.** Splitting WITHIN the refactor was considered and rejected: the
> chart components and their series are one change, so any intermediate commit
> fails `npm run typecheck`. Same conclusion as pass 18 reached, and the same
> rule: check whether a split is available before promising one.
>
> **THIS PASS REBASED ONTO WORK FROM ANOTHER SESSION**, which had merged the
> Notion Coworking Setup page (`9ce495c`) while this one was in progress. One
> conflict, in the `## What this is` page list, where both passes had edited
> the same bullet block and each claimed "last in the nav". Resolved by keeping
> both bullets and dropping the nav position from the older one.
>
> **The gate was re-run AFTER the rebase, not just before it.** A rebase can
> merge cleanly and still be semantically broken: `data/brand.ts` auto merged
> two independent additions (`BASIS_COLORS` and a Notion note on `speedRed`),
> and only a typecheck and a dev load prove both survived. Typecheck (both
> configs), the production build and the integrity console were all clean after.
>
> **Verified after pushing**, because the safety rule here is about what reached
> the remote rather than what was intended: neither `lyka-shell` nor `main` is
> an ancestor of `origin/lyka-main`, and both still have no upstream. Plain
> `git push` throughout.
>
> **Not in this repo:** the folder level and workspace level `CLAUDE.md` files
> also changed with this pass. They live in the OneDrive tree above the app and
> are not under version control, so they are saved on disk only.

> ### Everything through pass 19 is committed and pushed (2026-08-07)
>
> **`origin/lyka-main` carries 26 commits** and the working tree is clean. Pass
> 19 added four:
>
> | | |
> |---|---|
> | `84395ee` | APEX converted to real Lyka: the data, both views, the routing, the integrity block |
> | `ea6767c` | APEX docs |
> | `cf7bd3c` | Linear TV renamed to Linear TV News on client direction |
> | (this one) | these corrections. **A docs commit cannot state its own hash**, which is the whole reason the count below is given instead of a tip |
>
> **THE COUNT IS THE BRANCH TOTAL, and it is given because the tip hash cannot
> be.** Every earlier block here quoted a tip, and each one went stale the
> moment the docs commit recording it was pushed: `0535da8` is literally titled
> "Docs: tip 4bba5cf", which is a commit whose entire content is a hash that its
> own existence invalidated. **Verify with `git rev-list --count lyka-main`, not
> by trusting a number in prose.**
>
> The earlier blocks' counts were also wrong in a second way: they counted their
> own PUSH BATCH while reading as a branch total. Pass 17's "eight commits" was
> eight commits in that batch against 18 on the branch, and pass 18's "ten" was
> 21 on the branch. Left as written below rather than restated, because they are
> historical and the batch is what those blocks are about.
>
> **The conversion and its docs are split, and the rename is its own commit**
> because it is a separate client instruction that arrived after the first two
> were pushed. Same reasoning as pass 18's creative commit below.
>
> ### Pass 18 (2026-08-07)
>
> `origin/lyka-main` reached **`7ad776a`**. Pass 18 added two:
>
> | | |
> |---|---|
> | `1d53606` | Outsourcers to Curious, its seven downstream fixes, and the media focus emphasis |
> | `7ad776a` | the two replaced media plan creatives |
>
> **Pass 18 is ONE commit for the audience round, not the two it was planned as.**
> The intent was to split the persona move from the highlight, and it did not
> survive contact: `brand.ts`, `TensionMap.tsx` and `__integrity.ts` each carry
> both changes, so splitting needed hunk surgery and would have produced an
> intermediate commit whose stale sentence is precisely what the other half fixes.
> Same reasoning as the pass 14/15 build three below. **Check whether a split is
> physically available before promising one.**
>
> The creative commit is separate because it genuinely is: different files,
> different instruction, and it landed after the first was already pushed.
>
> ### Everything through pass 17 was committed and pushed (2026-08-06)
>
> `origin/lyka-main` was at **`4bba5cf`** and the working tree clean. Eight
> commits, four from the build and three from the client review round:
>
> | | |
> |---|---|
> | `74c1f84` | the media plan rebuilt from the briefing workbook (73 files) |
> | `dd8291e` | `mintMuted` is fill only: the four ink uses outside the media plan |
> | `cfe4377` | docs for both of the above |
> | `f320b2c` | the workbook's three level presence shading on the bars |
> | `d4598ff` | pass 17 content and creative: renames, copy, three new images |
> | `cf19072` | pass 17 presentation: five rationale rows, 3 KPI cards, light rung |
> | `5769db2` | pass 17 docs |
> | `4bba5cf` | pass 17 docs follow up: the push itself, and the second source |
>
> The build three were split by **scope, not by pass**, because `brand.ts`,
> `__integrity.ts`, `ChannelDetail.tsx` and `InteractiveMediaPlan.tsx` each carry
> changes from passes 14 and 15, so a strict per-pass split needed hunk surgery
> and risked an intermediate commit that did not build.
>
> **The pass 17 pair is split DATA BEFORE PRESENTATION for a specific reason.**
> Emptying `KNOWN_BLANK` in `__integrity` is only valid once Cinema has the
> Strategy line the client supplied, so committing the code first would have left
> an intermediate commit whose dev assertions warned. Content first, the code that
> renders it second, and neither commit is in a state that complains.
>
> **Before any future push, read the branch warning below.** Plain `git push` is
> the only safe form: `--all` or `--mirror` would put Hamilton Island's 26 commits
> into a Lyka named repo. The gate is `npm run typecheck` (both configs) plus
> `npm run dev` with the console open, confirming the single `[data integrity] ok`
> line. Pushing **builds and deploys nothing**: no GitHub auto deploy, and the app
> is not deployed anywhere. See "Deploy".

> ### ⚠ THE "NO BROWSER TOOLING" ASSUMPTION IS OBSOLETE (2026-08-07)
>
> Several notes in this file, including the one directly below, were written when
> the Playwright MCP server was unavailable and record things as verified
> "logically, not visually". **A working browser is available again**: pass 18 ran
> the dev server and drove it through Playwright.
>
> That is worth knowing before accepting any such note at face value, because in
> pass 18 rendering was decisive three times and static reasoning would have been
> wrong twice and wasteful once:
>
> - The Ladder's Unaware customer band fell to 3% and clipped all three of its
>   labels. No assertion could see it.
> - Two dashed routes ended up leaving the same node, and the crossing one's white
>   casing ate a hole through the other's label.
> - "Conflicted Troubleshooters" on a halved wedge looked certain to overflow.
>   Measured, it fills 48.5% of its arc. **The measurement prevented a change**,
>   which is the underrated half of having the tool.
>
> The useful probes, since a screenshot is not always the answer:
> `getComputedTextLength()` against the label path's `getTotalLength()` for SVG
> arcs, and `getComputedStyle` sweeps for verifying which cells actually carry a
> fill. Both give numbers rather than impressions.

> ### THE ONE OPEN ITEM ON THE MEDIA PLAN: nobody has looked at the shading
>
> The three level bar shading (pass 16) was verified **logically, not visually.**
> The Playwright MCP server dropped before it could be opened in a browser, so
> what is actually confirmed is: the 23 weight arrays round-trip against the
> workbook cell for cell, all 133 segments resolve to a real shade, every contrast
> number was recomputed by hand, and typecheck and build are clean.
>
> **What is NOT confirmed is whether the gradient across a flight reads well at
> size.** That is a judgement only rendering answers, and the places to look are
> the seven always-on rows and Always On Radio, where a single Jan to Sep bar
> grades heavy, heavy, medium six times, then light.
>
> **UPDATE 2026-08-06: the client looked, and asked for the light shade to be
> lighter. That advice has now been taken as far as it goes.** Both light rungs
> are solved to 3.07:1, hard against the floor `__integrity` asserts. Green
> gained a real step (medium to light 1.47:1 to 1.65:1); red gained almost
> nothing, because it started at 3.14:1. **So "widen the spread" is no longer an
> available fix**: see "The light rung is ON the floor" in the media plan
> section for why, and for the three levers that are spent. Going further is a
> decision to breach the floor, and it needs to be taken explicitly.

**Repo: `The-Speed-Agency/speed-x-lyka-accelerator`, private.** Created 2026-08-04.
https://github.com/The-Speed-Agency/speed-x-lyka-accelerator

**The working branch is `lyka-main`.** It is an **orphan**: its root commit has no parent and carries the tree as it stood after pass 8. The Hamilton Island origin (`The-Speed-Agency/speed-x-hamilton-island-accelerator`) had been removed during the conversion precisely so a push from this copy could not reach a live client repo, and the orphan is how that protection was kept while still getting a remote.

**⚠ "THE ONLY BRANCH ON THE REMOTE" IS NO LONGER TRUE, since 2026-08-10.** A
second branch, **`lyka-notion`**, appeared on the remote and was merged into
`lyka-main` the same day (`9ce495c`, both parents intact). It is fully contained
now and can be deleted whenever someone wants to.

**That line mattered for a specific reason, so check the reason rather than the
count.** It was never about the number of branches: it was about **no Hamilton
Island history reaching a Lyka named repo**. `lyka-notion` was checked against
exactly that before the merge and is clean. It branched off `7505b80`, one of
this repo's own commits, and **neither `lyka-shell` nor `main` is an ancestor of
it**. The test is two commands, and it is the one to run on any future branch
that appears here:

```bash
git merge-base --is-ancestor lyka-shell origin/<branch> && echo PROBLEM
git merge-base --is-ancestor main       origin/<branch> && echo PROBLEM
```

**The push rules below are UNCHANGED and still absolute.** A second legitimate
branch existing does not soften `--all` or `--mirror`, it makes them slightly
more tempting.

### THREE LOCAL BRANCHES, AND ONLY ONE MAY BE PUSHED

```
* lyka-main    36 commits  -> origin/lyka-main    THE branch. Push this.
  lyka-shell   35 commits  NO upstream            9 Lyka + 26 Hamilton Island
  main         Hamilton    NO upstream            pre conversion
```

`lyka-main` said "1 commit" here until 2026-08-10, which was true at creation and
had been wrong for 35 commits. **Two counts on this page mean different things
and only one of them moves:** `lyka-main`'s is the branch total and goes stale
every push, so derive it (`git rev-list --count lyka-main`); `lyka-shell`'s 26
Hamilton Island commits is a fixed historical fact about a branch nobody commits
to, and it is the number the push rules below are actually about.

`lyka-shell` and `main` still hold **26 commits of another client's development**, kept on disk deliberately rather than destroyed, because the conversion history is occasionally worth reading. They have no upstream and must not get one.

- **Never run `git push --all`, `git push --mirror`, or `git push origin lyka-shell`.** Any of those puts Hamilton Island's full build history, including its Power BI and media plan commits, into a Lyka named repo.
- Plain `git push` is safe: git's default `push.default = simple` pushes only the current branch to its own upstream, and the other two have none.
- If you no longer want them on disk, the destructive cleanup is `git branch -D lyka-shell main && git reflog expire --expire=now --all && git gc --prune=now --aggressive`. **That is irreversible from this folder.** The canonical Hamilton Island deck has its own folder and its own repo, so nothing is lost to the agency, but nothing is recoverable here either.

### Merging while another session holds the working tree (2026-08-10)

`lyka-notion` was merged in while a **concurrent session had 19 files
uncommitted** in this folder, including two the merge needed to touch
(`CLAUDE.md` and `data/brand.ts`). Two things came out of it that will apply
again, because this folder is shared.

**Do the merge in a throwaway worktree, not here.** `git merge` in a tree with
those two files dirty either refuses or puts someone else's unsaved work at
risk. `git worktree add --detach <tmp> lyka-main`, merge there, verify there,
push the resulting sha with `git push origin <sha>:lyka-main`, then remove the
worktree. Nothing in the live tree is touched at any point. Junction
`node_modules` into the worktree (`New-Item -ItemType Junction`) and it will
typecheck and build too, which is the only way to verify a merge you are not
allowed to check out.

**THE LOCAL BRANCH WAS LEFT BEHIND THE REMOTE ON PURPOSE, and that is not an
oversight to tidy up.** Fast forwarding the local ref would have left the other
session's uncommitted `CLAUDE.md` and `brand.ts` reading as though they DELETE
the notion content, and committing them would then have reverted it **with no
conflict marker anywhere**. Leaving `lyka-main` where it is means git does the
reconciliation instead: the next person gets a normal "behind, needs pull", and
the pull merges both sets of edits properly. A branch pointer that is behind is
a visible, standard state; a silent revert is not.

**Verified at creation:** the remote carried one branch and one commit; no `.env`, `.dev.vars`, `.netlify/state.json` or `.wrangler` is tracked or anywhere in history; and a fresh clone installs, typechecks and builds, so the repo is self contained.

**The repo no longer carries another client's data.** `data/apexData.ts` was the last Hamilton Island content and became Lyka's on 2026-08-07 (the media plan and its creative turned on 2026-08-05). The Hamilton figures survive only in git history, which is one more reason the local `lyka-shell` and `main` branches must never be pushed.

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

### Interactive Media Plan: DONE (2026-08-05)

The Lyka briefing workbook landed and the page was rebuilt and re-enabled the same day: 5 stages, 23 rows (20 since the 2026-08-10 consolidation), the green/red owner split, the dashed flighting overlay. `MediaPlanPending` was deleted from `PendingSections.tsx` and its ternary from `App.tsx`. Method notes worth keeping: only VISIBLE workbook content was used (the hidden `$ Lyka` sheet, the hidden TRY IT / SHARE IT description sheets and the hidden Australian Open row were excluded per client direction, matching the Hamilton precedent); the workbook's own monthly grand-total row omits PROVE IT, so monthly totals are derived from rows; and the channel tabs' text is stale Hamilton template while their embedded images are the Lyka creative, so text and images came from different sheets.

### APEX: DONE (2026-08-07)

The pull arrived as two APEX tool export decks (`APEX_lyka_conflicted-troubleshooters.pptx`, `APEX_lyka_mindful-researchers (1).pptx`, in the project folder), and the page was rebuilt and opened the same day. The prediction above held with one correction: the tool's channel set had grown to **14** channels (Pay TV, Online video / YouTube and Online display joined; the two print channels left), Cinema's KNF was revised 61.4 to **110.0**, and a new **Digital** tier arrived. Everything else recomputed exactly as documented: the derivation was verified to reproduce all 56 published deck values before any code was written. See "The APEX page" below for the architecture that replaced the single-table page.

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

- **@types/react IS NOT INSTALLED, so `React.FC<Props>` annotations are
  decorative.** 'react' resolves as an untyped module (React 19 ships no types
  of its own), `React.FC` is `any`, and with `noImplicitAny` off every
  component body's props are silently `any`. Found 2026-08-07 building
  `ApexGrowthQuadrant`: passing TYPE ARGUMENTS to anything derived from an
  FC-annotated param trips TS2347 ("Untyped function calls may not accept type
  arguments"), and `[...new Set(propsDerived)]` infers `unknown[]`. **The
  workaround is to annotate the destructured parameter directly**
  (`({ table }: Props)`), which restores real typing for the whole body; the
  apex components do this. Installing @types/react is the real fix but would
  retype every component in the app at once, so it is its own pass, like the
  `font-mono` item above.
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
(the gap matrix took this to NINE on 2026-08-04. It was measured on the same
terms at four viewports rather than renumbered: min font 11px, no sub 12px
prose)
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
