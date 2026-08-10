import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { LAPSED_VS_ACTIVE } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, CANVAS_FONT, catAxis, valAxis } from './chartBase';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 10. REDRAWN per 100 dog owners, 2026-08-10. Replaces LapsedPool.tsx.
//
// The cut changed as well as the base: ten income deciles became twelve regions.
//
// -----------------------------------------------------------------------------
// THIS IS THE SAME CORRECTNESS FIX THE HOUSEHOLD VERSION NEEDED, AGAIN.
//
// The new source's chart draws each bar's TOTAL LENGTH as the LAPSED figure,
// with the active figure overlaid inside it. Lapsed and active are DISJOINT, so
// that reads as a part to whole: Sydney Central looks like "2.09 of 3.71 are
// active" when the true reading is 2.09 of 5.80. The household chart had exactly
// this defect across all ten of its columns and was stacked for exactly this
// reason; the redraw reintroduced it.
//
// Stacked, a bar is everyone who has ever tried and the split inside it is real.
// The arithmetic corroborates it: 2.09 of 5.80 is 36% still active, which is the
// "two thirds of everyone who has ever tried is now inactive" the copy states
// and matches the national retention rate. On the source's reading it would be
// 56%, which contradicts the same sentence.
//
// Anyone comparing against the source PNG will see different bars. This is why.
//
// THE VALUE LABEL KEEPS THE SOURCE'S OWN WORDING, "3.71 lapsed vs 2.09 active",
// so the two figures a reader is looking for are still printed verbatim even
// though the geometry now says something different from the source's.
// -----------------------------------------------------------------------------

/** "3.71 lapsed vs 2.09 active" at the end of each stack. The source's own phrasing. */
const splitLabels: Plugin<'bar'> = {
  id: 'lapsedVsActiveLabels',
  afterDatasetsDraw(chart) {
    const scale = chart.scales.x;
    if (!scale) return;
    let topMeta = null as ReturnType<typeof chart.getDatasetMeta> | null;
    for (let d = chart.data.datasets.length - 1; d >= 0; d--) {
      if (chart.isDatasetVisible(d)) {
        topMeta = chart.getDatasetMeta(d);
        break;
      }
    }
    if (!topMeta) return;
    const { ctx } = chart;
    ctx.save();
    ctx.font = CANVAS_FONT.metaBold;
    ctx.fillStyle = TEN_THINGS.seriesDeep;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    topMeta.data.forEach((el, i) => {
      const row = LAPSED_VS_ACTIVE[i];
      if (!row) return;
      const x = scale.getPixelForValue(row.active + row.lapsed) + 7;
      ctx.fillText(`${row.lapsed.toFixed(2)} lapsed vs ${row.active.toFixed(2)} active`, x, el.y);
    });
    ctx.restore();
  },
};

const LapsedVsActive = ({ discrepancy }: TenThingChartProps) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: LAPSED_VS_ACTIVE.map((r) => r.region),
      datasets: [
        {
          label: 'Still active',
          stack: 'ever',
          data: LAPSED_VS_ACTIVE.map((r) => r.active),
          backgroundColor: TEN_THINGS.seriesDeep,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
        },
        {
          label: 'Lapsed',
          stack: 'ever',
          data: LAPSED_VS_ACTIVE.map((r) => r.lapsed),
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
      indexAxis: 'y',
      // `right` has to clear the longest split label, which is about 168px.
      layout: { padding: { top: 8, right: 186, bottom: 4 } },
      scales: {
        y: { stacked: true, ...catAxis() },
        x: {
          stacked: true,
          ...valAxis({
            beginAtZero: true,
            max: 6.2,
            title: 'Customers per 100 dog owners who have ever tried',
          }),
        },
      },
      plugins: {
        ...BASE_PLUGINS,
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            label: (c) => `${c.dataset.label}: ${Number(c.parsed.x).toFixed(2)} per 100 dog owners`,
            footer: (items) => {
              const r = LAPSED_VS_ACTIVE[items[0]?.dataIndex ?? 0];
              if (!r) return '';
              const ever = r.active + r.lapsed;
              return [
                `Ever tried: ${ever.toFixed(2)} per 100 dog owners`,
                `Still active: ${((r.active / ever) * 100).toFixed(0)}%`,
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
      eyebrow="Retention"
      title="Every strong market carries more lapsed customers than active ones"
      subtitle="Each bar is everyone who has ever tried, per 100 dog owners, split into still active and lapsed"
      height={440}
      discrepancy={discrepancy}
      caption={
        <>
          <b>Sydney Central leads on both counts</b>, 3.71 lapsed per 100 dog owners against 2.09
          active, so 36% of everyone who has ever tried there is still a customer. The win back
          geography survives the change of base: 7 of the top 8 markets are the same. The source
          chart draws the bar total as the LAPSED figure with active overlaid inside it, which reads
          as a part to whole; these two groups are disjoint, so they are stacked here and a bar is
          everyone who ever tried.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[splitLabels]}
        aria-label="Stacked horizontal bar chart across the twelve strongest markets. Each bar is everyone who has ever tried Lyka per 100 dog owners, split into still active at the left and lapsed to the right. Sydney Central leads with 2.09 active and 3.71 lapsed, then the Gold Coast 1.55 and 3.22, Sydney Northern 2.08 and 3.09, the Sunshine Coast 1.54 and 3.09, Melbourne Inner City 1.62 and 3.08, Sydney Gosford and Wyong 1.47 and 3.02, Melbourne Central 1.60 and 2.87, Brisbane City and Northern 1.40 and 2.72, Sydney Southern 1.40 and 2.62, Sydney Outer Western 1.24 and 2.48, Brisbane Western 1.45 and 2.45, and Brisbane Eastern 1.30 and 2.35. Every market carries more lapsed than active."
      />
    </TenThingsChart>
  );
};

export default LapsedVsActive;
