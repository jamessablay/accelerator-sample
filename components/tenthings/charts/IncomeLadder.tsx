import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { INCOME_LADDER } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, CANVAS_FONT, catAxis, valAxis } from './chartBase';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 02. REDRAWN per 100 dog owners, 2026-08-10.
//
// STACKED NOW, AND THE STACK IS HONEST HERE. Point 10's comment warns that
// overlaying two DISJOINT groups reads as a part to whole. This is the opposite
// case: still active is a genuine SUBSET of ever tried, so a bar whose total is
// ever tried and whose dark base is the survivors states a real quantity, and
// the light band above it is exactly the people who left. The household version
// drew these grouped, on the argument that a stack would draw a total that does
// not exist. On a subset that argument does not apply, and the source's own
// redraw stacks them.
//
// <Bar>, NOT <Chart type="bar">. The household version needed the generic
// wrapper because it carried a `type: 'line'` retention dataset on a second
// axis, and react-chartjs-2's typed <Bar> registers BarController only. The
// redrawn chart has no line, so the typed export is correct again. Retention is
// still in the numbers table; it is just not plotted.
//
// THE LEGEND SAYS "EVER TRIED" FOR THE LIGHT BAND AND THAT WOULD BE WRONG.
// In a stack the light segment alone is ever tried MINUS still active, so it is
// labelled "Lapsed" and the stack total is captioned as ever tried. The source's
// own legend has this defect; it is not carried over.
// -----------------------------------------------------------------------------

/** The stack total, above each column. Ever tried, which is the published figure. */
const everTriedTotals: Plugin<'bar'> = {
  id: 'incomeLadderTotals',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
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
      const total = chart.data.datasets.reduce(
        (sum, ds) => sum + (Number((ds.data as number[])[i]) || 0),
        0,
      );
      if (!total) return;
      ctx.fillText(total.toFixed(2), bar.x, bar.y - 6);
    });
    ctx.restore();
  },
};

const IncomeLadder = ({ discrepancy }: TenThingChartProps) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: [...INCOME_LADDER.labels],
      datasets: [
        {
          label: 'Still active',
          stack: 'ever',
          data: [...INCOME_LADDER.stillActive],
          backgroundColor: TEN_THINGS.seriesDeep,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
        },
        {
          label: 'Lapsed',
          stack: 'ever',
          data: INCOME_LADDER.everTried.map(
            (v, i) => Math.round((v - INCOME_LADDER.stillActive[i]) * 100) / 100,
          ),
          backgroundColor: TEN_THINGS.seriesFill,
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
          ...valAxis({ beginAtZero: true, max: 5.6, title: 'Per 100 dog owners' }),
        },
      },
      plugins: {
        ...BASE_PLUGINS,
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            title: (items) => `Income decile ${items[0]?.label}`,
            label: (c) => `${c.dataset.label}: ${Number(c.parsed.y).toFixed(2)} per 100 dog owners`,
            footer: (items) => {
              const i = items[0]?.dataIndex ?? 0;
              return [
                `Ever tried: ${INCOME_LADDER.everTried[i].toFixed(2)} per 100 dog owners`,
                `Retention: ${INCOME_LADDER.retentionPct[i].toFixed(1)}%`,
              ];
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Audience"
      title="Trial climbs steeply with income, measured against dog owners"
      subtitle="Everyone who has ever tried, per 100 dog owners, split into still active and lapsed"
      height={340}
      discrepancy={discrepancy}
      caption={
        <>
          The richest tenth reaches <b>4.86 per 100 dog owners</b> ever tried, <b>3.97x</b> the
          poorest tenth, so 95 in 100 have still never tried Lyka. Switching from households to dog
          owners barely moves the ladder (4.07x becomes 3.97x), which is the useful finding: the
          income effect is real rather than an artefact of richer areas keeping fewer dogs. The
          still active split is derived from retention, which is the same on either base; the source
          publishes only the totals.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[everTriedTotals]}
        aria-label="Stacked column chart across ten household income deciles. Each column is everyone who has ever tried Lyka per 100 dog owners, split into still active at the base and lapsed above. The total rises with income from 1.20 at decile 1 to 4.86 at decile 10, and the still active share rises from 0.33 to 1.87 across the same deciles."
      />
    </TenThingsChart>
  );
};

export default IncomeLadder;
