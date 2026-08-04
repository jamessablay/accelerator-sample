import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { LAPSED_POOL } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, CANVAS_FONT, catAxis, valAxis } from './chartBase';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 10. SIMPLIFIED, and this one is a CORRECTNESS FIX, not a styling change.
//
// The source OVERLAYS the two series: a full height gold "Lapsed" bar with a
// shorter green "Still active" bar drawn in front of it. Lapsed and active are
// DISJOINT groups, so the overlay reads as a part to whole. At decile 1 a reader
// sees "689 of 1,810 are active" when the true reading is 689 of 2,499. That
// misstatement runs across all ten columns.
//
// Stacking makes the column total a real quantity (everyone who ever tried) and
// the argument gets stronger: the gold band is visibly two thirds of every
// column. Anyone comparing against the original PNG will see different bars, so
// this comment is the reason.
//
// Totals verified against the source's own copy: active 101,091, lapsed 203,221,
// lapsed in deciles 8 to 10 is 109,545. data/__integrity.ts asserts all three.
//
// NO LABELS INSIDE THE SEGMENTS. The gold band needs seriesDeep ink and the teal
// band needs a light ink, which is two different inks in one column, and at ten
// columns across neither fits. The total sits above the stack; the tooltip
// carries the split.
// -----------------------------------------------------------------------------

/**
 * The stacked column total, above each stack.
 *
 * Same shape as `columnTotals` in components/mediaplan/BudgetBreakdownChart.tsx.
 * Reads live from chart.data so it cannot go stale: react-chartjs-2 reads the
 * plugins prop once and never again.
 */
const stackTotals: Plugin<'bar'> = {
  id: 'lapsedPoolStackTotals',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const totals = LAPSED_POOL.labels.map((_, i) =>
      chart.data.datasets.reduce((sum, ds) => sum + (Number((ds.data as number[])[i]) || 0), 0),
    );
    let topMeta = null as ReturnType<typeof chart.getDatasetMeta> | null;
    for (let d = chart.data.datasets.length - 1; d >= 0; d--) {
      if (chart.isDatasetVisible(d)) {
        topMeta = chart.getDatasetMeta(d);
        break;
      }
    }
    if (!topMeta) return;
    ctx.save();
    ctx.font = CANVAS_FONT.metaBold;
    ctx.fillStyle = TEN_THINGS.seriesDeep;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    topMeta.data.forEach((bar, i) => {
      if (!totals[i]) return;
      ctx.fillText(`${Math.round(totals[i] / 1000)}k`, bar.x, bar.y - 6);
    });
    ctx.restore();
  },
};

const LapsedPool: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: [...LAPSED_POOL.labels],
      datasets: [
        {
          label: 'Still active',
          stack: 'ever',
          data: [...LAPSED_POOL.active],
          backgroundColor: TEN_THINGS.seriesDeep,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
        },
        {
          label: 'Lapsed',
          stack: 'ever',
          data: [...LAPSED_POOL.lapsed],
          backgroundColor: TEN_THINGS.warnFill,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      scales: {
        x: { stacked: true, ...catAxis('Household income decile: 1 lowest to 10 highest') },
        y: {
          stacked: true,
          ...valAxis({
            beginAtZero: true,
            max: 65000,
            title: 'Customers who have ever tried',
            tick: (v) => `${v / 1000}k`,
          }),
        },
      },
      plugins: {
        ...BASE_PLUGINS,
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            title: (items) => `Income decile ${items[0]?.label}`,
            label: (c) => `${c.dataset.label}: ${Number(c.parsed.y).toLocaleString('en-AU')}`,
            footer: (items) => {
              const total = items.reduce((s, it) => s + Number(it.parsed.y || 0), 0);
              return `Ever tried: ${total.toLocaleString('en-AU')}`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Retention"
      title="Two thirds of everyone who ever tried Lyka is now inactive"
      subtitle="Each column is everyone who has ever tried, split into still active and lapsed"
      height={340}
      discrepancy={discrepancy}
      caption={
        <>
          <b>109,545 lapsed in deciles 8 to 10</b>, against 101,091 active in the whole business.
          The source chart overlaid these two series, which read as a part to whole. They are
          disjoint groups, so they are stacked here and the column total is everyone who ever tried.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[stackTotals]}
        aria-label="Stacked column chart across ten household income deciles. Each column is everyone who has ever tried Lyka, split into still active at the base and lapsed above. Both grow with income, from 689 active and 1,810 lapsed at decile 1 to 22,509 active and 36,086 lapsed at decile 10. Across all ten, 101,091 are active and 203,221 have lapsed. In deciles 8 to 10 alone, 109,545 have lapsed, more than the entire active business."
      />
    </TenThingsChart>
  );
};

export default LapsedPool;
