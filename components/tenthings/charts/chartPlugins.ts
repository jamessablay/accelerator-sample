// -----------------------------------------------------------------------------
// Ten Things: the inline plugins that replace the matplotlib annotations.
//
// Same shape as the three already in components/mediaplan/ (`columnTotals`,
// `sliceLabels`, `pointLabels`): afterDatasetsDraw, ctx.save(), a literal font
// shorthand, ctx.restore(). No chartjs-plugin-datalabels and no annotation
// plugin; this app deliberately carries neither.
//
// -----------------------------------------------------------------------------
// BUILD EVERY PLUGIN AT MODULE SCOPE.
//
// react-chartjs-2 reads the `plugins` prop ONCE, inside renderChart(), and has
// no effect watching it. A plugin that closes over React state or a measured
// width is therefore stale forever. Every function below reads live from
// chart.data, chart.scales and chart.getDatasetMeta(), exactly as columnTotals
// does, so a re-render cannot leave it behind.
// -----------------------------------------------------------------------------
//
// WHAT IS DELIBERATELY NOT HERE: the matplotlib arrow callouts. Two of the
// source charts draw a text block with a curved leader arrow into a specific
// bar. Reproducing that on canvas means measuring the element, drawing a bezier
// and two arrowhead strokes, then re-solving collision at every breakpoint. Both
// callouts are HTML in the frame's caption slot instead, where they are
// selectable, screen readable, and cannot collide.

import type { Plugin } from 'chart.js';
import { TEN_THINGS } from '../../../data/brand';
import { CANVAS_FONT } from './chartBase';

/**
 * A dashed reference rule plus its caption. Replaces matplotlib's axhline/axvline.
 *
 * The id embeds the axis and the value because Chart.js dedupes per chart
 * plugins by id, so two rules on one chart need two ids.
 */
export const benchmarkRule = (o: {
  axis: 'x' | 'y';
  value: number;
  label?: string;
  /** Override when the chart has two value axes, e.g. 'y1'. */
  scaleId?: string;
}): Plugin => ({
  id: `benchmark-${o.axis}-${o.value}`,
  afterDatasetsDraw(chart) {
    const scale = chart.scales[o.scaleId ?? o.axis];
    if (!scale) return;
    const { ctx, chartArea: area } = chart;
    const p = scale.getPixelForValue(o.value);
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = TEN_THINGS.benchmark;
    ctx.beginPath();
    if (o.axis === 'x') {
      ctx.moveTo(p, area.top);
      ctx.lineTo(p, area.bottom);
    } else {
      ctx.moveTo(area.left, p);
      ctx.lineTo(area.right, p);
    }
    ctx.stroke();
    if (o.label) {
      ctx.setLineDash([]);
      ctx.font = CANVAS_FONT.micro;
      ctx.fillStyle = TEN_THINGS.benchmark;
      ctx.textBaseline = 'bottom';
      if (o.axis === 'x') {
        // A VERTICAL rule's caption goes ABOVE the plot area, anchored to the
        // rule it names, in the layout.padding.top gutter.
        //
        // It used to sit INSIDE the plot, right aligned to area.right, which on
        // a horizontal bar chart is the top bar's row: the caption landed under
        // the longest bar and on top of its value label, so neither could be
        // read. Both charts using this were affected (07 Sydney: Northern
        // Beaches 1.34x, 01 Marketing 1.15). Pinning it to the far right also
        // detached it from the line at 1.00, which is the thing it labels.
        //
        // Right of the rule when there is room, left of it when there is not
        // (point 01's rule sits at 71% of a narrow half width panel), clamped
        // so a narrow panel cannot push it off the canvas.
        ctx.textAlign = 'left';
        const w = ctx.measureText(o.label).width;
        const x = p + 4 + w <= area.right ? p + 4 : Math.max(2, p - 4 - w);
        ctx.fillText(o.label, x, area.top - 4);
      } else {
        // A HORIZONTAL rule escapes sideways instead: past the end of the line,
        // into layout.padding.right, vertically centred on it.
        //
        // Inline above the right edge collided the same way. Point 06's Nov is
        // exactly 100, so its bar has no height and its value label sits on the
        // line at the second last column, directly under the caption: the page
        // read "100average month = 100". A caller wanting this placement has to
        // ASK FOR THE ROOM (SeasonalIndex sets padding.right), and the inline
        // fallback below keeps a chart that has not done so rendering.
        const w = ctx.measureText(o.label).width;
        ctx.textAlign = 'left';
        if (chart.width - area.right >= w + 8) {
          ctx.textBaseline = 'middle';
          ctx.fillText(o.label, area.right + 6, p);
        } else {
          ctx.textAlign = 'right';
          ctx.fillText(o.label, area.right - 2, p - 4);
        }
      }
    }
    ctx.restore();
  },
});

/**
 * Value labels at the bar end.
 *
 * OUTSIDE THE BAR, always. Every label therefore lands on the cream mat and can
 * be seriesDeep, so the "white on tangerine is 2.43:1" trap never arises here.
 * If a future edit moves a label inside a warm fill, it must still be seriesDeep.
 *
 * Position comes from the SCALE, not from the element's own x/y, because a chart
 * with a non-zero dataset `base` (point 06 anchors at 100) has below-base bars
 * whose element geometry inverts.
 */
export const barValueLabels = (o: {
  datasetIndex?: number;
  fmt: (v: number) => string;
  /** 'y' for vertical bars (label above or below), 'x' for horizontal (label right). */
  orient: 'x' | 'y';
  /** Values below this draw on the far side of the bar. Defaults to -Infinity. */
  base?: number;
  color?: string;
}): Plugin<'bar'> => ({
  id: `barValueLabels-${o.datasetIndex ?? 0}-${o.orient}`,
  afterDatasetsDraw(chart) {
    const di = o.datasetIndex ?? 0;
    if (!chart.isDatasetVisible(di)) return;
    const meta = chart.getDatasetMeta(di);
    const values = chart.data.datasets[di]?.data as (number | null)[] | undefined;
    if (!values) return;
    const scale = chart.scales[o.orient === 'y' ? 'y' : 'x'];
    if (!scale) return;
    const base = o.base ?? -Infinity;
    const { ctx } = chart;
    ctx.save();
    ctx.font = CANVAS_FONT.metaBold;
    ctx.fillStyle = o.color ?? TEN_THINGS.seriesDeep;
    meta.data.forEach((el, i) => {
      const v = values[i];
      if (v === null || v === undefined) return;
      const p = scale.getPixelForValue(v);
      if (o.orient === 'y') {
        ctx.textAlign = 'center';
        ctx.textBaseline = v >= base ? 'bottom' : 'top';
        ctx.fillText(o.fmt(v), el.x, v >= base ? p - 6 : p + 6);
      } else {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(o.fmt(v), p + 7, el.y);
      }
    });
    ctx.restore();
  },
});

/** Value labels above (or below) each point of a line dataset. */
export const lineValueLabels = (o: {
  datasetIndex: number;
  fmt: (v: number) => string;
  /** Pixel offset from the point. Negative is above. Default -11. */
  dy?: number;
  color?: string;
}): Plugin => ({
  id: `lineValueLabels-${o.datasetIndex}`,
  afterDatasetsDraw(chart) {
    if (!chart.isDatasetVisible(o.datasetIndex)) return;
    const meta = chart.getDatasetMeta(o.datasetIndex);
    const values = chart.data.datasets[o.datasetIndex]?.data as (number | null)[] | undefined;
    if (!values) return;
    const { ctx } = chart;
    ctx.save();
    ctx.font = CANVAS_FONT.metaBold;
    ctx.fillStyle = o.color ?? TEN_THINGS.seriesDeep;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    meta.data.forEach((pt, i) => {
      const v = values[i];
      if (v === null || v === undefined) return;
      ctx.fillText(o.fmt(v), pt.x, pt.y + (o.dy ?? -11));
    });
    ctx.restore();
  },
});

// `bubbleLabels` LIVED HERE AND WENT WITH POINT 05 (2026-08-10). It drew city
// names beside each bubble with a mat coloured halo, because bubbles overlap by
// design and two capitals always collided. The dog owner redraw made point 05 a
// bar chart, which was its only consumer, so the plugin, `BubbleController` in
// chartBase, `TEN_THINGS.bubbleFill` and `CANVAS_FONT.labelBold` all came out
// together rather than being left as dead weight. It is in git history if a
// bubble chart ever returns; the halo technique is worth reading first.
