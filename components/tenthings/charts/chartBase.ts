// -----------------------------------------------------------------------------
// Ten Things: one registration point, one set of chart chrome.
//
// Every chart in this folder imports from here and nothing registers Chart.js
// pieces on its own.
//
// -----------------------------------------------------------------------------
// TWO TRAPS THIS FILE EXISTS TO PREVENT. Both pass `npm run typecheck`, which is
// this project's only gate, so neither is catchable without opening the page.
//
// 1. react-chartjs-2's typed exports register the CONTROLLER ONLY.
//    `export const Bar = createTypedChart('bar', BarController)`. Points 02, 03
//    and 09 carry a dataset with `type: 'line'`, which throws
//    '"line" is not a registered controller' at runtime while typechecking
//    perfectly cleanly. Those charts use the generic <Chart type="bar"> and
//    LineController is registered below.
//
// 2. react-chartjs-2's setOptions is `Object.assign(chart.options, next)`, which
//    is TOP LEVEL ONLY. A chart writing `plugins: { legend: {...} }` instead of
//    `plugins: { ...BASE_PLUGINS, legend: {...} }` silently drops the entire
//    tooltip theme and nothing warns. BASE_PLUGINS is exported separately from
//    BASE_OPTIONS specifically so the spread is visible at every call site.
// -----------------------------------------------------------------------------

import {
  Chart as ChartJS,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { LYKA, TEN_THINGS, CHART_INK, CHART_MUTED, CHART_GRID } from '../../../data/brand';
import { TYPE } from '../../../data/type';
import { theme } from '../../../theme';

// BubbleController came out on 2026-08-10 with point 05, its only consumer: the
// dog owner redraw turned that chart from a bubble into bars. Register it again
// if a bubble chart ever returns, and remember trap 1 above applies to it too.
ChartJS.register(
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
);

// DOCUMENTED GLOBAL SIDE EFFECT, on import.
//
// Chart.js defaults to Helvetica and #666, both off brand on cream. Setting them
// here retires the `color: CHART_INK` workaround that BudgetBreakdownChart and
// BudgetPieChart each carry with an identical comment.
//
// It also restyles those three media plan charts. That is the correct outcome,
// but it IS an outcome: re-open the Budget header, the % header and any gantt
// bar pop-up after touching this file.
/**
 * The body stack as a canvas ready string.
 *
 * Derived from the theme rather than written out, which is what stops a chart
 * canvas rendering in the PREVIOUS client's typeface after a re-skin. Nothing
 * would flag that: a canvas has no cascade to inherit from and no fallback
 * warning, so it simply draws in whatever family the string names.
 */
const BODY_STACK = theme.typefaces.body
  .map((f) => (/\s/.test(f) ? `"${f}"` : f))
  .join(', ');

ChartJS.defaults.font.family = BODY_STACK;
ChartJS.defaults.font.size = TYPE.meta;
ChartJS.defaults.color = CHART_INK;

/**
 * Canvas font shorthands.
 *
 * `ctx.font` needs a literal CSS string, which is why these used to be typed out
 * with the px number and the family baked in, with `data/__integrity.ts` check
 * 14 asserting the number still matched its token.
 *
 * They are BUILT from the token now. A literal string is still what reaches the
 * canvas, it is just composed at module load instead of by hand, so the drift
 * check 14 existed to catch can no longer happen. The check is kept: it costs
 * nothing and it now also proves the composition itself is right.
 */
export const CANVAS_FONT = {
  /** TYPE.micro. Benchmark captions and axis furniture. */
  micro: `${TYPE.micro}px ${BODY_STACK}`,
  /** TYPE.meta. Value labels. */
  metaBold: `bold ${TYPE.meta}px ${BODY_STACK}`,
} as const;

/** The px size each CANVAS_FONT entry claims. Asserted against TYPE in dev. */
export const CANVAS_FONT_TOKENS = {
  micro: TYPE.micro,
  metaBold: TYPE.meta,
} as const;

/**
 * Chrome shared by every chart.
 *
 * `layout.padding.top` is headroom for the value labels, which are drawn
 * OUTSIDE the bar end. Without it the top label clips.
 */
export const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 26, right: 14 } },
  interaction: { mode: 'index' as const, intersect: false },
  animation: { duration: 400 },
};

export const BASE_PLUGINS = {
  legend: {
    position: 'bottom' as const,
    labels: {
      boxWidth: 12,
      boxHeight: 12,
      padding: 10,
      usePointStyle: true,
      pointStyle: 'rectRounded' as const,
      font: { size: TYPE.meta },
      color: CHART_INK,
    },
  },
  tooltip: {
    backgroundColor: LYKA.tealDeepest,
    titleColor: LYKA.pageBg,
    bodyColor: LYKA.pageBg,
    borderColor: TEN_THINGS.seriesInk,
    borderWidth: 1,
    cornerRadius: 8,
    padding: 10,
    displayColors: true,
    titleFont: { size: TYPE.meta, weight: 'bold' as const },
    bodyFont: { size: TYPE.meta },
  },
};

/** Category axis: no grid, muted ticks. Matches the media plan's x scale. */
export const catAxis = (title?: string) => ({
  grid: { display: false },
  ticks: { font: { size: TYPE.meta }, color: CHART_MUTED, autoSkip: false },
  ...(title
    ? { title: { display: true, text: title, color: CHART_MUTED, font: { size: TYPE.meta } } }
    : {}),
});

/** Value axis: CHART_GRID lines, muted ticks. Matches the media plan's y scale. */
export const valAxis = (o: {
  title?: string;
  min?: number;
  max?: number;
  beginAtZero?: boolean;
  position?: 'left' | 'right';
  /** Hide the grid on a second axis so two sets of lines do not overlay. */
  noGrid?: boolean;
  tick?: (v: number) => string;
}) => ({
  ...(o.beginAtZero !== undefined ? { beginAtZero: o.beginAtZero } : {}),
  ...(o.min !== undefined ? { min: o.min } : {}),
  ...(o.max !== undefined ? { max: o.max } : {}),
  ...(o.position ? { position: o.position } : {}),
  grid: o.noGrid ? { display: false } : { color: CHART_GRID },
  border: { display: false },
  ticks: {
    font: { size: TYPE.meta },
    color: CHART_MUTED,
    ...(o.tick ? { callback: (v: string | number) => o.tick!(Number(v)) } : {}),
  },
  ...(o.title
    ? { title: { display: true, text: o.title, color: CHART_MUTED, font: { size: TYPE.meta } } }
    : {}),
});
