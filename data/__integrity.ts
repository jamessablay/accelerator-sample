// -----------------------------------------------------------------------------
// Dev-only data integrity assertions.
//
// WHY THIS EXISTS
// There is no test runner and no linter here, and `tsc` cannot see any of the
// joins below because categoryData and SEGMENT_IMAGES are both
// `Record<string, T>`. Every one of these five joins fails SILENTLY AND
// PLAUSIBLY at runtime:
//
//   - A bad SEGMENT_IMAGES key renders the teal InfoIcon circle, which looks
//     intentional. This has shipped broken before (commit 9ed2d67).
//   - A bad segment key in SEGMENT_COLORS falls through to the fallback set and
//     renders the wrong wedge colour with no error at all.
//   - A persona.category that matches no categoryData key opens an empty panel.
//   - A missing video or avatar file shows a broken-image glyph.
//   - A monthly-spend edit that no longer sums to MEDIA_TOTAL makes the KPI
//     strip silently disagree with the Gantt total.
//
// This matters most when the segment model changes. Renaming a stage means
// renaming it across five files, and these checks turn what would be a silent
// visual bug into a console error.
//
// Imported from index.tsx behind `if (import.meta.env.DEV)`, so it is tree
// shaken out of the production bundle entirely. Zero prod cost.
// -----------------------------------------------------------------------------

import { categoryData } from './categoryData';
import { personaCategories } from './personasData';
import { PERSONA_VIDEOS, personaVideo } from './personaMedia';
import { PLAN_LAYERS, MEDIA_TOTAL, FLIGHTING_PCT, MONTHS } from './mediaPlanData';
import { SEGMENT_COLORS, LAYER_COLORS, OWNER_COLORS, TEN_THINGS, TEN_THINGS_STROKE_TOKENS, LYKA, GAP_RAMP, FOCUS, GAP_NEGATIVE_HUE } from './brand';
import { MEDIA_FOCUS_STAGES, MEDIA_FOCUS_JOURNEYS } from './mediaFocus';
import { SEGMENT_IMAGES } from '../components/personas/CategoryDetail';
import { TEN_THINGS_POINTS } from './tenThingsData';
import {
  INCOME_LADDER,
  FLAT_SHARE,
  RETENTION_CUTS,
  SEASONAL_INDEX,
  TOP_REGIONS_RAV,
  LAPSED_POOL,
} from './tenThingsSeries';
import { TEN_THINGS_CHARTS } from '../components/tenthings/charts';
import { CANVAS_FONT, CANVAS_FONT_TOKENS } from '../components/tenthings/charts/chartBase';
import { stageMetrics, personaMetrics, pct, STAGE_ORDER } from './audienceModel';
import { journeyMeta } from './journeyMeta';
import {
  journeyMetrics,
  JOURNEY_STAGE_NAMES,
  GAP_DOMAIN,
  parseScoreData,
} from './journeyModel';
import { PERSONA_VARIANTS, DEFAULT_PERSONA_VARIANT } from '../components/personas/variants';
import { JOURNEY_VARIANTS, DEFAULT_JOURNEY_VARIANT } from '../components/journey/variants';

const TAG = '[data integrity]';

/** Relative luminance per WCAG 2.x. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const srgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/** Contrast ratio between any two hex colours. */
function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Contrast ratio of `hex` against pure white. */
function contrastVsWhite(hex: string): number {
  return contrast(hex, '#FFFFFF');
}

export function runIntegrityChecks(): void {
  const categoryKeys = new Set(Object.keys(categoryData));
  const colourKeys = new Set(Object.keys(SEGMENT_COLORS));
  const imageKeys = new Set(Object.keys(SEGMENT_IMAGES));
  let problems = 0;
  const fail = (...args: unknown[]) => { problems++; console.error(TAG, ...args); };
  const warn = (...args: unknown[]) => { problems++; console.warn(TAG, ...args); };

  // 1. Every persona's category must resolve to a categoryData entry.
  const personas = personaCategories.flatMap((c) => c.personas);
  for (const p of personas) {
    if (!categoryKeys.has(p.category)) {
      fail(`persona "${p.name}" has category "${p.category}" which is not a categoryData key.`);
    }
  }

  // 2. Every categoryData key must have a colour, or the wedge renders the
  //    fallback colour with no error.
  for (const key of categoryKeys) {
    if (!colourKeys.has(key)) {
      fail(`categoryData key "${key}" has no SEGMENT_COLORS entry. Its wedge will render the fallback colour.`);
    }
  }

  // 3. Any emblem declared in SEGMENT_IMAGES must match a real categoryData
  //    title byte for byte, or it silently never renders.
  const categoryTitles = new Set(Object.values(categoryData).map(c => c.title));
  for (const title of imageKeys) {
    if (!categoryTitles.has(title)) {
      fail(`SEGMENT_IMAGES key "${title}" matches no categoryData title. That emblem will silently never render. Titles must match byte for byte, parenthetical share included.`);
    }
  }

  //    THE REVERSE DIRECTION IS NOW WORTH CHECKING, and was not before. While the
  //    map was empty it would have fired on all five segments every page load,
  //    which trains people to ignore this output. Four stages now carry an
  //    emblem, so a stage WITHOUT one is a signal rather than noise: most likely
  //    a rename that broke the byte for byte key, which otherwise looks identical
  //    to "no art was supplied".
  //
  //    The centre disc is excluded by name. It is the whole market, not a stage,
  //    and it has no emblem on purpose.
  const EMBLEM_EXEMPT = new Set(['Australian Dog Owners']);
  for (const title of categoryTitles) {
    if (!EMBLEM_EXEMPT.has(title) && !imageKeys.has(title)) {
      warn(`categoryData title "${title}" has no SEGMENT_IMAGES emblem. If art exists for it, the key has drifted; keys must match byte for byte.`);
    }
  }

  // 3b. Every journey now reaches its stage THROUGH a persona id rather than
  //     restating a segmentKey, so the old hand-mirrored copy of the stage list
  //     is gone. What has to hold instead is that the id resolves at all: an
  //     unmatched id leaves the journey with no shares and the fallback colour.
  const personaIds = new Set(personas.map((p) => p.id));
  for (const [type, meta] of Object.entries(journeyMeta)) {
    if (!personaIds.has(meta.personaId)) {
      fail(`journeyMeta["${type}"].personaId ${meta.personaId} matches no persona. That journey loses its stage, colour and both share figures.`);
    }
  }
  for (const j of journeyMetrics) {
    if (!j.segmentKey || !colourKeys.has(j.segmentKey)) {
      fail(`journey "${j.meta.title}" resolves to segment "${j.segmentKey}", which has no SEGMENT_COLORS entry. Its tab will render the fallback colour.`);
    }
    if (j.stages.length === 0) {
      fail(`journey "${j.meta.title}" has no stages. Check the JourneyType key in journeyDetailsData.`);
    }
  }

  // 3c. THE SHARED X AXIS. All five journeys must carry the same five stage
  //     titles in the same order.
  //
  //     JOURNEY_STAGE_NAMES is derived from journeyMetrics[0] ALONE, which is
  //     whatever TAB_ORDER happens to list first. Nothing made the other four
  //     agree. A journey whose stages were renamed, reordered or truncated does
  //     not fail: the gap matrix renders its real numbers UNDER THE WRONG COLUMN
  //     HEADERS, and every cell still looks plausible. Exactly the silent join
  //     this file exists for. Reordering TAB_ORDER also re-sources the axis.
  const axis = JOURNEY_STAGE_NAMES.join(' | ');
  if (JOURNEY_STAGE_NAMES.length !== 5) {
    fail(`JOURNEY_STAGE_NAMES has ${JOURNEY_STAGE_NAMES.length} entries, not 5. The gap matrix is a fixed 5 x 5 grid.`);
  }
  for (const j of journeyMetrics) {
    const titles = j.stages.map((st) => st.title).join(' | ');
    if (titles !== axis) {
      fail(`journey "${j.meta.title}" has stages [${titles}] but the shared x axis is [${axis}]. Any matrix or small-multiple view puts its cells under the wrong column headers.`);
    }
  }

  // 3d. ALL 50 SCORE STRINGS MUST PARSE, VALUE AND DESCRIPTOR.
  //
  //     parseScoreData matches /(\d+)\s*[-–—]\s*(.*)/. A COLON instead of a dash
  //     still parses the number and returns an EMPTY LABEL, so the point plots
  //     and only the text vanishes. On the table and the spine that is a missing
  //     tooltip; on the gap matrix the two descriptors ARE the cell pop-up, so it
  //     is an empty modal that reads as a rendering fault. No separator at all is
  //     worse: the fallback strips non-digits and concatenates, so
  //     "Emotional 82 worry at 3am" yields 823.
  //
  //     ASSERTED ON THE PARSE RESULT, not on the raw string. One legitimate
  //     descriptor contains a colon AFTER its dash (Mindful Researchers /
  //     Preparation, "Rational 95 – Peak evidence requirement: ..."), so a naive
  //     "no colons" test would flag it and train people to ignore this output.
  for (const j of journeyMetrics) {
    for (const st of j.stages) {
      for (const [field, raw] of [
        ['emotionalScore', st.emotionalScore],
        ['rationalScore', st.rationalScore],
      ] as const) {
        const { value, label } = parseScoreData(raw);
        if (!Number.isFinite(value) || value < 0 || value > 100) {
          fail(`"${j.meta.title}" / ${st.title} ${field} parsed ${value} from "${raw}". Scores are 0 to 100; a missing separator concatenates every digit in the string.`);
        }
        if (!label) {
          fail(`"${j.meta.title}" / ${st.title} ${field} parsed no descriptor from "${raw}". The separator must be a hyphen, en dash or em dash. A colon parses the number and silently drops the text.`);
        }
      }
    }
  }

  // 3e. Twenty five cells, and the ramp is calibrated to the observed range. A
  //     revised study pushing a gap past GAP_DOMAIN does not error, it CLAMPS,
  //     and two different gaps then render as the same colour.
  const gaps = journeyMetrics.flatMap((j) => j.scores.map((sc) => sc.gap));
  if (gaps.length !== 25) {
    fail(`expected 25 journey by stage gaps for the matrix, found ${gaps.length}.`);
  }
  if (gaps.length) {
    const gLo = Math.min(...gaps);
    const gHi = Math.max(...gaps);
    if (gLo < GAP_DOMAIN[0] || gHi > GAP_DOMAIN[1]) {
      warn(`journey gaps run ${gLo} to ${gHi}, outside GAP_DOMAIN [${GAP_DOMAIN[0]}, ${GAP_DOMAIN[1]}]. Cells beyond the domain clamp, so two different gaps render as one colour.`);
    }
  }

  // 4. Every referenced asset must actually resolve. Vite copies public/
  //    verbatim without checking paths, so the build never catches this.
  //
  //    Checking `response.ok` is NOT enough. Vite's dev server answers an
  //    unmatched path with the SPA fallback: HTTP 200 and Content-Type
  //    text/html. A missing image therefore looks fine to `r.ok`. Verify the
  //    content type actually matches the kind of asset requested.
  const checkAsset = (url: string, report: (msg: string) => void) => {
    fetch(url, { method: 'HEAD' })
      .then((r) => {
        if (!r.ok) {
          report(`asset ${url} returned ${r.status}.`);
          return;
        }
        const ctype = (r.headers.get('content-type') ?? '').toLowerCase();
        const expected = /\.(png|jpe?g|webp|gif|svg)$/i.test(url) ? 'image'
          : /\.(mp4|webm|mov)$/i.test(url) ? 'video'
          : null;
        if (expected && !ctype.startsWith(expected)) {
          report(`asset ${url} resolved to "${ctype}", not ${expected}. It is missing from public/ and the dev server served the SPA fallback instead.`);
        }
      })
      .catch(() => report(`asset ${url} could not be fetched.`));
  };

  // Emblems: warn rather than error. Four now exist, one per readiness stage,
  // and a missing file degrades to the panel without an image rather than to a
  // broken layout, so this stays a warning.
  const emblems = new Set(Object.values(SEGMENT_IMAGES).filter(Boolean));
  for (const url of emblems) checkAsset(url, warn);

  // Persona media: error. These always render, so a miss is a visible break.
  //
  // Read through personaVideo(), NOT off p.videoUrl. The films are joined by
  // persona id in data/personaMedia.ts rather than typed into the generated
  // personasData.ts, so checking the record's own field would test nothing.
  const personaMedia = new Set(
    [...personas.map(personaVideo), ...personas.map((p) => p.avatar)]
      .filter((s): s is string => typeof s === 'string' && s.length > 0),
  );
  for (const url of personaMedia) checkAsset(url, fail);

  // The id join itself, both directions. A PERSONA_VIDEOS key that matches no
  // persona renders nothing and reports nothing: the film is simply absent, and
  // the slot falls back to its "awaiting footage" empty state as though that
  // were intended. That is the exact silent failure this file exists for.
  // `personaIds` is the set built for the journeyMeta check above. Same question,
  // different map: does this id resolve to a persona at all.
  for (const key of Object.keys(PERSONA_VIDEOS)) {
    if (!personaIds.has(Number(key))) {
      fail(`PERSONA_VIDEOS has id ${key}, which matches no persona. That film will never render.`);
    }
  }
  const withoutFilm = personas.filter((p) => !personaVideo(p)).map((p) => p.name);
  if (withoutFilm.length) {
    warn(`persona(s) with no film, showing the empty slot: ${withoutFilm.join(', ')}.`);
  }
  const assets = new Set([...emblems, ...personaMedia]);

  // 5. The media plan budget invariant is hand maintained: change one monthly
  //    cell and the KPI strip silently disagrees with the Gantt total.
  const planRows = PLAN_LAYERS.flatMap((l) => l.rows);
  const rowSum = planRows.reduce((s, r) => s + r.budget, 0);
  if (rowSum !== MEDIA_TOTAL) {
    fail(`media plan row budgets sum to ${rowSum.toLocaleString('en-AU')} but MEDIA_TOTAL is ${MEDIA_TOTAL.toLocaleString('en-AU')}. The KPI strip and the Gantt total now disagree.`);
  }
  for (const row of planRows) {
    const monthlySum = row.monthly.reduce((s, v) => s + v, 0);
    if (monthlySum !== row.budget) {
      warn(`"${row.channel}" monthly values sum to ${monthlySum.toLocaleString('en-AU')} but its budget is ${row.budget.toLocaleString('en-AU')}.`);
    }
    if (row.monthly.length !== MONTHS.length) {
      fail(`"${row.channel}" has ${row.monthly.length} monthly values, not ${MONTHS.length}. The gantt bars and the flighting chart are index-joined to MONTHS, so every bar after the gap lands under the wrong month.`);
    }
  }

  // 5b. The ownership split. An in-house row with dollars would silently change
  //     every total (the client chose flighting only for the green rows), and an
  //     in-house row without `activeMonths` renders NO bar at all, which reads as
  //     a channel that was never planned.
  for (const row of planRows) {
    if (row.owner === 'lyka') {
      if (row.budget !== 0 || row.monthly.some((v) => v > 0)) {
        fail(`"${row.channel}" is Lyka in house but carries dollars. In-house rows are flighting only; their spend lives with Lyka, not in MEDIA_TOTAL.`);
      }
      if (!row.activeMonths) {
        fail(`"${row.channel}" is Lyka in house but has no activeMonths, so its gantt track renders no bar at all.`);
      } else {
        if (row.activeMonths.length !== MONTHS.length) {
          fail(`"${row.channel}" activeMonths has ${row.activeMonths.length} entries, not ${MONTHS.length}.`);
        }
        if (!row.activeMonths.some(Boolean)) {
          fail(`"${row.channel}" activeMonths is all false: the row renders an empty track.`);
        }
      }
    } else if (row.activeMonths) {
      warn(`"${row.channel}" is SPEED managed but declares activeMonths, which the gantt ignores in favour of its monthly dollars.`);
    }
  }

  // 5b-ii. THE PRESENCE WEIGHTS MUST LINE UP WITH THE FLIGHTING.
  //
  //     `weight` is a second 12-slot array beside `monthly` / `activeMonths`, and
  //     the two can drift apart silently in both directions: a null where the
  //     channel IS running renders the mid rung as a guess, and a weight where it
  //     is NOT running renders nothing at all, so the value is simply lost with no
  //     sign on screen. The shading is hand read from the workbook's cell fills
  //     and cannot be derived from spend (see `Weight` in brand.ts), so nothing
  //     else can catch a transcription slip.
  for (const row of planRows) {
    const active = row.activeMonths ?? row.monthly.map((v) => (v || 0) > 0);
    if (row.weight.length !== MONTHS.length) {
      fail(`"${row.channel}" weight has ${row.weight.length} entries, not ${MONTHS.length}.`);
      continue;
    }
    active.forEach((on, i) => {
      if (on && !row.weight[i]) {
        fail(`"${row.channel}" runs in ${MONTHS[i]} but has no presence weight, so its bar segment falls back to medium.`);
      }
      if (!on && row.weight[i]) {
        warn(`"${row.channel}" has a "${row.weight[i]}" weight in ${MONTHS[i]} but is not running then, so that value renders nowhere.`);
      }
    });
  }

  // 5c. The flighting overlay is percentages that must describe the whole
  //     budget: off by one entry and every point lands under the wrong month,
  //     summing wrong and the dashed line quietly stops meaning "100% of $11M".
  const flightingSum = FLIGHTING_PCT.reduce((s, v) => s + v, 0);
  if (Math.abs(flightingSum - 100) > 0.01) {
    fail(`FLIGHTING_PCT sums to ${flightingSum}, not 100. The dashed overlay no longer distributes the full media total.`);
  }
  if (FLIGHTING_PCT.length !== MONTHS.length) {
    fail(`FLIGHTING_PCT has ${FLIGHTING_PCT.length} entries, not ${MONTHS.length}.`);
  }

  // 5d. Media plan creative. Same Content-Type rule as check 4: a missing
  //     public/ image gets the SPA fallback from Vite, HTTP 200 and text/html,
  //     and the gallery renders a broken frame that reads like a layout bug.
  const mediaPlanAssets = new Set(
    planRows.flatMap((r) => [...(r.images ?? []), ...(r.extraImages ?? [])]),
  );
  for (const url of mediaPlanAssets) checkAsset(url, fail);

  // 5d-ii. CAPTIONS ARE JOINED TO IMAGES BY INDEX, so their lengths must match.
  //
  //     `CreativeCard` takes `row.captions?.[i]` for image `i`. Removing an
  //     image from the MIDDLE of the array without removing its caption
  //     therefore does not drop a label, it SHIFTS every later one onto the
  //     wrong logo, and every card still renders looking entirely deliberate.
  //     Paramount+ came out of the BVOD & SVOD row at index 2 on 2026-08-06,
  //     which is exactly the edit this guards.
  for (const row of planRows) {
    if (row.captions && row.images && row.captions.length !== row.images.length) {
      fail(
        `"${row.channel}" has ${row.images.length} images but ${row.captions.length} captions. ` +
          `They are joined by index, so the labels after the shortest array are on the wrong cards.`,
      );
    }
    if (row.extraCaptions && row.extraImages && row.extraCaptions.length !== row.extraImages.length) {
      fail(
        `"${row.channel}" has ${row.extraImages.length} extraImages but ${row.extraCaptions.length} extraCaptions. ` +
          `Same index join, same silent mislabelling.`,
      );
    }
    if (row.imageWeights && row.images && row.imageWeights.length !== row.images.length) {
      warn(`"${row.channel}" has ${row.images.length} images but ${row.imageWeights.length} imageWeights; the unmatched cards fall back to equal width.`);
    }
  }

  // 5e. THE FIVE RATIONALE FIELDS, because a missing one is invisible: the
  //     pop-up renders four rows instead of five and reads as complete.
  //
  //     This is the check the media plan port did not have, and the defect it
  //     would NOT have caught is instructive. `role` (the workbook's "Role of
  //     the Channel", column D) was populated on all 21 funded rows the whole
  //     time and still came back reported as missing from every rationale,
  //     because it rendered as an UNLABELLED paragraph above the table rather
  //     than as a row in it. **A populated field with no label is a field nobody
  //     can find**, and no data assertion can see that: only rendering can.
  //
  //     Labelling it fixed that instance. What this check adds is the other
  //     direction: nothing yet stopped a genuinely EMPTY `role` shipping and
  //     looking equally deliberate, since the table just drops absent rows.
  //
  //     `KNOWN_BLANK` IS DELIBERATELY EMPTY AS OF 2026-08-06, and it is worth
  //     knowing why it exists at all. Cinema was the one entry: its "The
  //     Consumer Journey" cell is blank on the SHOW IT sheet, so it rendered
  //     four rows. Flagging that gap got the client to SUPPLY the line, which is
  //     the outcome an exemption list should be aiming at. **So all 21 funded
  //     rows now carry all five fields, and any warning here is real.** Add an
  //     entry only for a gap the client has confirmed stays open, never to
  //     quieten output.
  //
  //     Non `role` fields warn rather than fail, so a genuine workbook blank
  //     does not get mistaken for a code bug.
  const RATIONALE_FIELDS = ['strategyLink', 'role', 'comesToLife', 'assets', 'metrics'] as const;
  const KNOWN_BLANK: Record<string, readonly string[]> = {};
  for (const row of planRows) {
    // No detail at all = TRY IT and SHARE IT, whose description sheets are
    // hidden in the workbook and excluded per client direction. Not a gap.
    if (!row.detail) continue;
    for (const field of RATIONALE_FIELDS) {
      // `assets` falls back to the row's own format descriptor, so it counts as
      // present when either source has copy.
      const value = field === 'assets' ? row.detail.assets ?? row.assets : row.detail[field];
      if (value && value.trim().length > 0) continue;
      if (KNOWN_BLANK[row.channel]?.includes(field)) continue;
      if (field === 'role') {
        fail(
          `"${row.channel}" has a rationale but no Role of Channel copy, so its pop-up renders one row fewer and still reads as complete. ` +
            `The source is the "Role of the Channel" column (D) on the visible Media Description sheet.`,
        );
      } else {
        warn(`"${row.channel}" rationale has no ${field}, so that row is absent from the pop-up table.`);
      }
    }
  }

  // 6. Palette floors.
  //
  //    Two checks, not one. The original tested every fill against white, which
  //    was right while the sunburst was the only view and every label was white.
  //    The wide views fill LIGHT, so contrast is now PAIR based: each fill is
  //    checked against the ink token that is actually drawn on it.
  const WEDGE_FLOOR = 2.7; // sunburst fills, white labels, halo assisted
  const TEXT_FLOOR = 4.5; // WCAG AA for normal text
  for (const [key, set] of Object.entries(SEGMENT_COLORS)) {
    for (const shade of ['base', 'hover', 'lighter', 'lighterHover'] as const) {
      const ratio = contrastVsWhite(set[shade]);
      if (ratio < WEDGE_FLOOR) {
        warn(`SEGMENT_COLORS["${key}"].${shade} = ${set[shade]} is ${ratio.toFixed(2)}:1 against white, below the ${WEDGE_FLOOR}:1 floor. White wedge labels will be hard to read.`);
      }
    }
    const inkOnBase = contrast(set.ink, set.base);
    if (inkOnBase < TEXT_FLOOR) {
      fail(`SEGMENT_COLORS["${key}"]: ink ${set.ink} on base ${set.base} is ${inkOnBase.toFixed(2)}:1, below AA (${TEXT_FLOOR}:1).`);
    }
    const inkOnTint = contrast(set.tintInk, set.tint);
    if (inkOnTint < TEXT_FLOOR) {
      fail(`SEGMENT_COLORS["${key}"]: tintInk ${set.tintInk} on tint ${set.tint} is ${inkOnTint.toFixed(2)}:1, below AA (${TEXT_FLOOR}:1). Never put white on a tint.`);
    }
  }

  // 6a. The media plan bands are ink pairs too. LAYER_COLORS.ink carries the
  //     funnel rail labels and the pop-up strip text; OWNER_COLORS.ink is drawn
  //     on the gantt-green month chips and the owner pills. The old
  //     'Active Consideration' set shipped a 2.62:1 pair, which is exactly the
  //     drift this stops recurring.
  for (const [key, set] of Object.entries(LAYER_COLORS)) {
    const ratio = contrast(set.ink, set.base);
    if (ratio < TEXT_FLOOR) {
      fail(`LAYER_COLORS["${key}"]: ink ${set.ink} on base ${set.base} is ${ratio.toFixed(2)}:1, below AA (${TEXT_FLOOR}:1). The rail label is unreadable.`);
    }
  }
  for (const [key, set] of Object.entries(OWNER_COLORS)) {
    const ratio = contrast(set.ink, set.base);
    if (ratio < TEXT_FLOOR) {
      fail(`OWNER_COLORS["${key}"]: ink ${set.ink} on base ${set.base} is ${ratio.toFixed(2)}:1, below AA (${TEXT_FLOOR}:1).`);
    }
    // Every WEIGHT rung is a data mark on the white gantt track, so each one has
    // to clear the 3:1 non-text floor on its own. This is the constraint that
    // sets the palette's range: lightening the base by a plain HLS step lands
    // the light rungs at 1.77:1 and 2.84:1, which is why they are solved for
    // contrast instead. And each pair of rungs must stay TELLABLE APART, or the
    // three levels collapse into one and the encoding says nothing.
    const rungs = ['heavy', 'medium', 'light'] as const;
    for (const w of rungs) {
      const r = contrastVsWhite(set.weight[w]);
      if (r < 3.0) {
        fail(`OWNER_COLORS["${key}"].weight.${w} = ${set.weight[w]} is ${r.toFixed(2)}:1 against white, below the 3:1 non-text floor. A gantt bar is a data mark, not decoration.`);
      }
    }
    for (const [a, b] of [['heavy', 'medium'], ['medium', 'light']] as const) {
      const sep = contrast(set.weight[a], set.weight[b]);
      if (sep < 1.25) {
        fail(`OWNER_COLORS["${key}"]: the ${a} and ${b} rungs are only ${sep.toFixed(2)}:1 apart, so adjacent months in one flight read as the same weight.`);
      }
    }
  }

  // 6c. THE PALE TOKENS ARE FILL ONLY, and this states the boundary in numbers
  //     rather than in a comment.
  //
  //     `mintMuted` said "for faint labels" until 2026-08-05 and seven places had
  //     taken it literally, every one of them between 1.67:1 and 1.88:1 against
  //     the surface it sat on: under AA, and under the 3:1 non-text floor that
  //     covers an icon or a control. `muted` is the palest ink here that clears
  //     AA, so there is no lighter legal option and "make it fainter" is never
  //     the answer.
  //
  //     This asserts the DIVIDING LINE holds: mintMuted below the non-text
  //     floor (so nobody reads the comment as advisory) and muted above AA on
  //     all four surfaces it is used on (so the replacement is safe everywhere,
  //     not just on the white card the complaint came from).
  const NON_TEXT_FLOOR = 3.0;
  const SURFACES: [string, string][] = [
    ['white', '#FFFFFF'],
    ['cream page', LYKA.pageBg],
    ['ivory', LYKA.ivory],
    ['cream panel', LYKA.cream],
  ];
  if (contrastVsWhite(LYKA.mintMuted) >= NON_TEXT_FLOOR) {
    fail(`LYKA.mintMuted ${LYKA.mintMuted} now clears ${NON_TEXT_FLOOR}:1 on white. If it was darkened deliberately, update its FILL ONLY comment in brand.ts and delete this check; if a paler ink is wanted, there is not one.`);
  }
  for (const [name, surface] of SURFACES) {
    const ratio = contrast(LYKA.muted, surface);
    if (ratio < TEXT_FLOOR) {
      fail(`LYKA.muted ${LYKA.muted} is ${ratio.toFixed(2)}:1 on ${name} ${surface}, below AA (${TEXT_FLOOR}:1). It is the palest ink in the palette and the replacement for every faint label, so this failing means there is no legal muted ink left.`);
    }
  }

  // 6d. THE MEDIA FOCUS WASH IS A FILL AND INK PAIR TOO.
  //
  //     The wash lands UNDER real body copy in four views: whole table cells in
  //     the Table and the Strip, and behind the curves in the Spine and Compare.
  //     `LYKA.muted` is the ink on most of it and is already the palest legal
  //     ink in the palette (check 6c), so there is no headroom on that side: if
  //     the wash is ever deepened, the fix has to be the wash.
  //
  //     `washHover` is checked as well, and it is the one people get wrong. The
  //     instinct on a clickable cell is to DARKEN on hover, which is what every
  //     unwashed cell in the Strip does. On this wash that lands at 4.48:1,
  //     under AA, so `washHover` deliberately goes the other way, toward white.
  //     A future "make the hover more obvious" edit is a one character change
  //     that breaks it, which is exactly what this check is for.
  const focusSurfaces: [string, string][] = [
    ['wash', FOCUS.wash],
    ['washHover', FOCUS.washHover],
  ];
  for (const [name, surface] of focusSurfaces) {
    for (const [inkName, ink] of [
      ['LYKA.muted', LYKA.muted],
      ['LYKA.ink', LYKA.ink],
      ['LYKA.tealDeepest', LYKA.tealDeepest],
    ] as const) {
      const ratio = contrast(ink, surface);
      if (ratio < TEXT_FLOOR) {
        fail(`FOCUS.${name} ${surface}: ${inkName} on it is ${ratio.toFixed(2)}:1, below AA (${TEXT_FLOOR}:1). This wash sits under real body copy in the Table and the Strip.`);
      }
    }
  }
  //     The rule and the tag. The rule is a 3px non-text mark that has to hold
  //     on BOTH surfaces it is drawn against: the wash, on a marked column, and
  //     white, on the Spine's stepper.
  for (const [name, surface] of [...focusSurfaces, ['white', '#FFFFFF'] as [string, string]]) {
    const ratio = contrast(FOCUS.edge, surface);
    if (ratio < NON_TEXT_FLOOR) {
      fail(`FOCUS.edge ${FOCUS.edge} is ${ratio.toFixed(2)}:1 on ${name} ${surface}, below the ${NON_TEXT_FLOOR}:1 non-text floor. The focus rule is a mark, not decoration.`);
    }
  }
  const tagRatio = contrast(FOCUS.tagInk, FOCUS.tagBg);
  if (tagRatio < TEXT_FLOOR) {
    fail(`FOCUS.tagInk ${FOCUS.tagInk} on FOCUS.tagBg ${FOCUS.tagBg} is ${tagRatio.toFixed(2)}:1, below AA (${TEXT_FLOOR}:1).`);
  }
  //     And the collision the gap matrix works around. If these ever differ,
  //     that view's comment about why it uses a dashed GAP_INK outline instead
  //     of FOCUS.edge stops being true, and someone should re-read the other
  //     reason it gives (the fill is the datum), which still holds.
  if (FOCUS.edge !== GAP_NEGATIVE_HUE) {
    warn(`FOCUS.edge ${FOCUS.edge} no longer equals GAP_NEGATIVE_HUE ${GAP_NEGATIVE_HUE}. GapMatrix.tsx documents them as identical, which is half its reason for not outlining cells in FOCUS.edge. Re-read that note.`);
  }

  // 6b. THE GAP RAMP IS A FILL AND INK PAIR, at every step.
  //
  //     The matrix prints a number in all 25 cells, so each ramp step is exactly
  //     the case check 6 exists for. A diverging ramp normally forces the ink to
  //     FLIP, light steps taking dark text and dark steps taking white, and two
  //     adjacent cells then disagree. brand.ts avoids that by CAPPING the wash at
  //     GAP_WASH_MAX so one ink clears AA at both ends.
  //
  //     THIS IS THE CHECK THAT KEEPS IT TRUE. Raising GAP_WASH_MAX is a one
  //     character edit that looks like a contrast improvement and is the opposite.
  //     The midtones are checked too: a step chosen to look right against white is
  //     the one nobody inspects.
  for (const step of GAP_RAMP) {
    const ratio = contrast(step.ink, step.fill);
    if (ratio < TEXT_FLOOR) {
      fail(`GAP_RAMP step ${step.label}: ink ${step.ink} on fill ${step.fill} is ${ratio.toFixed(2)}:1, below AA (${TEXT_FLOOR}:1). The gap matrix prints a number in every cell.`);
    }
  }

  // 7. The derived audience model. Every wide persona view reads these numbers,
  //    and all of them are arithmetic on strings, so a bad parse is silent.
  const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
  const marketTotal = sum(stageMetrics.map((s) => s.marketPct));
  const customerTotal = sum(stageMetrics.map((s) => s.customerPct));
  if (Math.abs(marketTotal - 100) > 0.01) {
    fail(`audienceModel market shares sum to ${marketTotal}%, not 100%. Every proportional view is now mis-scaled.`);
  }
  if (Math.abs(customerTotal - 100) > 0.01) {
    fail(`audienceModel customer shares sum to ${customerTotal}%, not 100%.`);
  }
  if (stageMetrics.length !== STAGE_ORDER.length) {
    fail(`STAGE_ORDER declares ${STAGE_ORDER.length} stages but only ${stageMetrics.length} resolved.`);
  }
  for (const m of personaMetrics) {
    if (m.marketPct <= 0) {
      fail(`persona "${m.persona.name}" parsed a market share of ${m.marketPct} from "${m.persona.marketShare}". Check the % string.`);
    }
  }

  // 7b. The derived stage totals must agree with the hand-written ones in
  //     categoryData. stageMetrics SUMS its personas; categoryData states the
  //     total independently. Keeping both is deliberate: this check is the only
  //     thing that would catch a persona share edited in one place and not the
  //     other, and it would otherwise be invisible on every screen.
  for (const s of stageMetrics) {
    const declared = categoryData[s.key];
    if (!declared) continue;
    if (declared.marketShare !== undefined && Math.abs(pct(declared.marketShare) - s.marketPct) > 0.01) {
      fail(`stage "${s.key}": personas sum to ${s.marketPct}% of market but categoryData declares ${declared.marketShare}.`);
    }
    if (declared.customerShare !== undefined && Math.abs(pct(declared.customerShare) - s.customerPct) > 0.01) {
      fail(`stage "${s.key}": personas sum to ${s.customerPct}% of customers but categoryData declares ${declared.customerShare}.`);
    }
  }

  // 7c. THE MEDIA FOCUS JOIN, both halves.
  //
  //     This is the purest example of what this file is for, because its failure
  //     mode is the absence of something. A stage title that matches nothing
  //     marks nothing: no error, no fallback colour, no broken layout. The deck
  //     simply renders without the emphasis the client asked for, across all
  //     five views at once, and looks entirely finished. Nobody notices a
  //     highlight that is not there, which is why prose in mediaFocus.ts saying
  //     "match by title" is not enough on its own.
  //
  //     A rename of "Contemplation" or "Preparation" in the source deck is the
  //     realistic trigger, and check 3c would not catch it: renaming a stage
  //     consistently across all five journeys keeps the shared axis valid.
  for (const title of MEDIA_FOCUS_STAGES) {
    if (!JOURNEY_STAGE_NAMES.includes(title)) {
      fail(`MEDIA_FOCUS_STAGES has "${title}", which is not a journey stage. The axis is [${JOURNEY_STAGE_NAMES.join(' | ')}]. That stage will be highlighted nowhere, in all five views, silently.`);
    }
  }
  for (const type of MEDIA_FOCUS_JOURNEYS) {
    if (!journeyMetrics.some((j) => j.type === type)) {
      fail(`MEDIA_FOCUS_JOURNEYS has "${type}", which resolves to no journey. Its emphasis will never render.`);
    }
  }
  //     And the count, because the emphasis is an ARGUMENT, not decoration: the
  //     three marked journeys read against two unmarked ones. Marking all five
  //     deletes the contrast and leaves only colour, so a well meant "make it
  //     consistent" edit is worth a warning even though nothing breaks.
  if (MEDIA_FOCUS_JOURNEYS.length >= journeyMetrics.length) {
    warn(`MEDIA_FOCUS_JOURNEYS covers all ${journeyMetrics.length} journeys, so nothing is unmarked. The client's point was that these are the journeys media addresses AND the others are not.`);
  }
  if (MEDIA_FOCUS_STAGES.length >= JOURNEY_STAGE_NAMES.length) {
    warn(`MEDIA_FOCUS_STAGES covers every stage, so the wash marks the whole table and distinguishes nothing.`);
  }

  // 8. Variant registries. A duplicate id makes the switcher unclickable for one
  //    of the pair, and a default that is not in its own list silently falls back
  //    to the first entry, which is the baseline in both registries.
  const checkRegistry = (name: string, ids: string[], fallback: string) => {
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length) fail(`${name} has duplicate variant ids: ${[...new Set(dupes)].join(', ')}.`);
    if (!ids.includes(fallback)) {
      fail(`${name} default "${fallback}" is not in the registry. The page will silently show the baseline instead.`);
    }
  };
  checkRegistry('PERSONA_VARIANTS', PERSONA_VARIANTS.map((v) => v.id), DEFAULT_PERSONA_VARIANT);
  checkRegistry('JOURNEY_VARIANTS', JOURNEY_VARIANTS.map((v) => v.id), DEFAULT_JOURNEY_VARIANT);

  // ---------------------------------------------------------------------------
  // 9 to 14. Ten Things.
  //
  // Six joins, all of which fail silently and plausibly at runtime, which is the
  // bar for being in this file at all.
  // ---------------------------------------------------------------------------

  // 9. The chart key join. A key with no entry in TEN_THINGS_CHARTS renders an
  //    empty frame with no error, exactly like a bad SEGMENT_COLORS key.
  const chartKeys = new Set(Object.keys(TEN_THINGS_CHARTS));
  for (const p of TEN_THINGS_POINTS) {
    if (!chartKeys.has(p.chart)) {
      fail(`Ten Things point ${p.id} declares chart "${p.chart}", which is not in TEN_THINGS_CHARTS. The modal will render an empty frame.`);
    }
  }

  // 9b. Ids are '01' to '10', unique and in order. The stepper indexes the array
  //     and prints the id, so a gap makes the position counter lie.
  const expectedIds = Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, '0'));
  const actualIds = TEN_THINGS_POINTS.map((p) => p.id);
  if (actualIds.join(',') !== expectedIds.join(',')) {
    fail(`Ten Things ids are [${actualIds.join(', ')}], expected [${expectedIds.join(', ')}]. The stepper position will not match the numbered chips.`);
  }

  // 10. Every `emphasis` substring must be present in its `learn` paragraph. A
  //     typo silently no-ops: the bold never appears and nothing warns.
  for (const p of TEN_THINGS_POINTS) {
    for (const phrase of p.emphasis ?? []) {
      if (!p.learn.includes(phrase)) {
        fail(`Ten Things point ${p.id}: emphasis "${phrase}" is not in its learn paragraph, so it will silently not be bolded.`);
      }
    }
  }

  // 11. Map assets. Same Content-Type rule as check 4: Vite's dev server answers
  //     a missing public/ path with the SPA fallback, HTTP 200 and text/html.
  const tenThingsAssets = new Set(
    TEN_THINGS_POINTS.flatMap((p) =>
      p.mapImage ? [p.mapImage.src, ...Object.values(p.mapImage.cities ?? {})] : [],
    ),
  );
  for (const url of tenThingsAssets) checkAsset(url, fail);

  // 12. The chart series must agree with the published numbers table. The two are
  //     maintained separately on purpose (tenThingsSeries.ts holds numbers,
  //     tenThingsData.ts holds the formatted strings), because parsing "49.3%"
  //     back into 49.3 is the anti pattern audienceModel.ts is quarantined for.
  //     Nothing but this check keeps them honest.
  const tableNum = (s: string): number | null => {
    const m = s.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return m ? Number(m[0]) : null;
  };
  const agrees = (label: string, series: readonly number[], column: readonly string[]) => {
    if (series.length !== column.length) {
      fail(`Ten Things ${label}: the series has ${series.length} values but the table column has ${column.length}.`);
      return;
    }
    series.forEach((v, i) => {
      const t = tableNum(column[i]);
      if (t === null || Math.abs(t - v) > 0.005) {
        fail(`Ten Things ${label}: row ${i + 1} plots ${v} but the table says "${column[i]}".`);
      }
    });
  };
  const col = (id: string, index: number): string[] => {
    const p = TEN_THINGS_POINTS.find((x) => x.id === id);
    return p ? p.numbers.rows.map((r) => r[index] ?? '') : [];
  };
  agrees('02 ever tried', INCOME_LADDER.everTried, col('02', 1));
  agrees('02 still active', INCOME_LADDER.stillActive, col('02', 2));
  agrees('02 retention', INCOME_LADDER.retentionPct, col('02', 3));
  agrees('03 penetration', FLAT_SHARE.penetration, col('03', 1));
  agrees('03 income decile', FLAT_SHARE.avgIncomeDecile, col('03', 2));
  agrees('04 retention', [...RETENTION_CUTS.dwelling.values, ...RETENTION_CUTS.income.values], col('04', 1));
  agrees('06 index', SEASONAL_INDEX.values, col('06', 1));
  agrees('07 RAV', TOP_REGIONS_RAV.map((r) => r.rav), col('07', 1));
  agrees('10 lapsed', LAPSED_POOL.lapsed, col('10', 1));
  agrees('10 active', LAPSED_POOL.active, col('10', 2));

  // 12b. The three totals point 10's copy states out loud.
  const total = (a: readonly number[]) => a.reduce((s, v) => s + v, 0);
  const activeSum = total(LAPSED_POOL.active);
  const lapsedSum = total(LAPSED_POOL.lapsed);
  const topThree = total(LAPSED_POOL.lapsed.slice(7));
  if (activeSum !== LAPSED_POOL.totals.active) {
    fail(`Ten Things 10: active sums to ${activeSum.toLocaleString('en-AU')} but the copy says ${LAPSED_POOL.totals.active.toLocaleString('en-AU')}.`);
  }
  if (lapsedSum !== LAPSED_POOL.totals.lapsed) {
    fail(`Ten Things 10: lapsed sums to ${lapsedSum.toLocaleString('en-AU')} but the copy says ${LAPSED_POOL.totals.lapsed.toLocaleString('en-AU')}.`);
  }
  if (topThree !== LAPSED_POOL.totals.lapsedTopThreeDeciles) {
    fail(`Ten Things 10: deciles 8 to 10 lapsed sums to ${topThree.toLocaleString('en-AU')} but the stat says ${LAPSED_POOL.totals.lapsedTopThreeDeciles.toLocaleString('en-AU')}.`);
  }

  // 13. The stroke floor on the Ten Things palette.
  //
  //     Check 6 tests fills against WHITE. These sit on the CREAM MAT, and the
  //     rule is different: 3:1 against the mat is the floor for a line, a dashed
  //     rule or a small marker. TEN_THINGS.seriesFill is 2.62:1 and warnFill is
  //     2.35:1, which is exactly why they are documented FILL ONLY. This check
  //     stops a future edit quietly promoting one of them to a line colour.
  const STROKE_FLOOR = 3.0;
  for (const token of TEN_THINGS_STROKE_TOKENS) {
    const hex = TEN_THINGS[token];
    const ratio = contrast(hex, LYKA.pageBg);
    if (ratio < STROKE_FLOOR) {
      fail(`TEN_THINGS.${token} = ${hex} is ${ratio.toFixed(2)}:1 against the cream mat ${LYKA.pageBg}, below the ${STROKE_FLOOR}:1 stroke floor. Either darken it or move it out of TEN_THINGS_STROKE_TOKENS.`);
    }
  }

  // 14. Canvas font drift. ctx.font takes a literal CSS string, so data/type.ts
  //     cannot be its source and the two diverge silently. The token is named in
  //     each key so this check can compare them.
  for (const [key, px] of Object.entries(CANVAS_FONT_TOKENS)) {
    const declared = CANVAS_FONT[key as keyof typeof CANVAS_FONT];
    const found = declared.match(/(\d+(?:\.\d+)?)px/);
    if (!found || Number(found[1]) !== px) {
      fail(`CANVAS_FONT.${key} is "${declared}" but its TYPE token is ${px}px. The canvas labels no longer match the type scale.`);
    }
  }

  if (problems === 0) {
    console.info(
      `${TAG} ok. ${personas.length} personas, ${categoryKeys.size} segments, ${journeyMetrics.length} journeys, ` +
        `${PERSONA_VARIANTS.length}+${JOURNEY_VARIANTS.length} variants, ${TEN_THINGS_POINTS.length} findings, ` +
        `${planRows.length} media plan rows, ` +
        `${assets.size + tenThingsAssets.size + mediaPlanAssets.size} assets queued for check, ` +
        `shares, budgets and published tables balance.`,
    );
  }
}
