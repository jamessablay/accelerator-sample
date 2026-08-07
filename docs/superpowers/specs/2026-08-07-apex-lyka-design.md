# APEX by SPEED: the Lyka conversion (pass 19)

Date: 2026-08-07. Approved by Aaron the same day (view tabs + persona tabs,
slides 4 + 5, the two exported personas only, page opens for real).

## What arrived

Two APEX tool exports landed in the project folder, one per persona:

- `APEX_lyka_conflicted-troubleshooters.pptx`
- `APEX_lyka_mindful-researchers (1).pptx`

Each is the tool's six slide deck: title, Addressable reach, Reach x Attention,
**Reach x Attention x Premium (slide 4)**, **Growth Quadrant (slide 5)**,
methodology. This is the Lyka Roy Morgan pull the APEX page has been waiting
for since 2026-08-04.

The upstream source is the APEX by SPEED Tool at
`RFI - Hamilton Island - Full Response/APEX by SPEED Tool/apex-by-speed/`:

- `data/lykaPresets.ts`: the exact raw inputs behind the exports (heavy reach %,
  RM index, addressable reach per channel), for four Lyka personas.
- `data/constants.ts`: the revised channel knowledge base. 14 channels, a new
  `digital` tier, Cinema KNF revised 61.4 to 110.0, TTD/PAC naming.
- `lib/apexEngine.ts`: the derivation. TNW Index = rebase(rm x knf x ttd) to
  channel mean = 100; stars from the recalibrated scale (>=1.30 five, >=1.10
  four, >=1.00 three neutral, >=0.85 two, else one).
- `lib/quadrant.ts`: quadrant thresholds (reach > 40%, index >= 100) and the
  four quadrant labels with action lines.
- `components/apex/AboutView.tsx`: the client supplied positioning copy.

**Verified before building**: recomputing both methods from the presets and the
constants reproduces all 56 published PPTX values (14 channels x methods B and
C x 2 personas) exactly.

## The page

`pages/ApexBySpeed.tsx` gets top level view tabs modelled on the tool's report
shell, then a persona tab strip inside the two data views:

- **About** (default): positioning card ("Plan for attention, not just reach." /
  "Not all reach is created equal." + paragraph) then the `ApexMethodology`
  formula bar and three source cards, copy updated to the tool's current
  knowledge base. Formula simplifies to RM INDEX x KNF SCORE x TTD/PAC PREMIUM
  = TRUE NET WORTH INDEX (the old intermediate "TABLE 1" pill goes; nothing
  renders Method B any more).
- **True Net Worth Index** (slide 4): persona strip (Conflicted Troubleshooters
  4.36M | Mindful Researchers 1.39M) over `ApexChannelTable`, columns matched
  to the slide: Channel | Tier | Heavy % | RM | KNF | TTD/PA Consulting (stars)
  | True Net Worth Index + scaled bar. Method B column removed.
- **Growth Quadrant** (slide 5): persona strip over a new
  `ApexGrowthQuadrant` SVG ported from the tool (thresholds, quadrant meta,
  label placement pass), restyled to Lyka tokens and using the
  `useElementSize` + `svgFont` compensation so label sizes are real CSS px.

The header tagline becomes slide 1's: "True Net Worth Index | Media Channel
Effectiveness". The "Placeholder audience" notice is deleted.

## The data

`data/apexData.ts` is rewritten as real Lyka:

- Channel constants (label, tier, knf, ttd) and per persona raw inputs
  (heavyPct, rmIndex, addressableReach) transcribed from the tool.
- **Derived columns are computed at module load, never hand typed**: tnwIndex,
  ttdStars, quadrant. The doc rule "derived columns must be recomputed" becomes
  literally true in code.
- New `DIGITAL` tier (pill `#2C5F73`, 7.02:1 with white ink).
- Quadrant meta + thresholds live here (data), the geometry lives in the
  component; `labelPlacement.ts` is a pure port.

`data/__integrity.ts` gains APEX checks: the 28 recomputed TNW Index values
must equal the PPTX slide 4 published numbers (transcribed independently), 14
rows per persona, addressable reach present and in range, tier and quadrant
ink pairs clear AA.

## Routing

The `SHOW_ALL` const and ternary in `App.tsx` are deleted; APEX opens for
everyone. `pages/PendingSections.tsx` and `components/shared/PendingSection.tsx`
are deleted (recoverable from git history; the hold back pattern itself is
documented in CLAUDE.md).

## Out of scope

- The other two personas (Devoted Caterers, Secure Sleepwalkers): presets exist
  in the tool, no deck export has been reviewed. Add later by appending a
  persona input block; everything re-derives.
- Slides 2 and 3 (Addressable reach bars, Reach x Attention table) as views.
- The tool's per rating star colours (the multiplier is printed beneath the
  stars and the tooltip explains the scale).

## Verification

`npm run typecheck`, dev console `[data integrity]` single ok line, Playwright
over all three tabs x both personas at 1440x900 and 1280x800.
