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
import { PLAN_LAYERS, MEDIA_TOTAL } from './mediaPlanData';
import { SEGMENT_COLORS, TEN_THINGS, TEN_THINGS_STROKE_TOKENS, LYKA } from './brand';
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
import { journeyMetrics } from './journeyModel';
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
  const rowSum = PLAN_LAYERS.flatMap((l) => l.rows).reduce((s, r) => s + r.budget, 0);
  if (rowSum !== MEDIA_TOTAL) {
    fail(`media plan row budgets sum to ${rowSum.toLocaleString('en-AU')} but MEDIA_TOTAL is ${MEDIA_TOTAL.toLocaleString('en-AU')}. The KPI strip and the Gantt total now disagree.`);
  }
  for (const row of PLAN_LAYERS.flatMap((l) => l.rows)) {
    const monthlySum = row.monthly.reduce((s, v) => s + v, 0);
    if (monthlySum !== row.budget) {
      warn(`"${row.channel}" monthly values sum to ${monthlySum.toLocaleString('en-AU')} but its budget is ${row.budget.toLocaleString('en-AU')}.`);
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
        `${assets.size + tenThingsAssets.size} assets queued for check, ` +
        `shares, budgets and published tables balance.`,
    );
  }
}
