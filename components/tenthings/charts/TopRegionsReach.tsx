import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import {
  TOP_REGIONS_REACH,
  MATCH_QUALITY,
  NATIONAL_PER_100_DOG_OWNERS,
} from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, CANVAS_FONT, catAxis, valAxis } from './chartBase';
import { benchmarkRule } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 07. REDRAWN per 100 dog owners, 2026-08-10. Replaces TopRegionsRav.tsx.
//
// A DIFFERENT MEASURE, not a rebased one. The household version plotted RAV,
// value per signup, as a deviation from 1.00. This plots REACH: active customers
// per 100 dog owners, across the top 18 of 58 Roy Morgan regions. RAV survives
// as this point's second numbers table and as the choropleth map below, because
// it is an average across customers and so no population divides it.
//
// -----------------------------------------------------------------------------
// THE MATCH GRADE IS NOT DRAWN IN THE BAR FILL, AND THAT IS DELIBERATE.
//
// Lyka's file is by postcode and Roy Morgan's regions are not postal boundaries,
// so each region carries how well the two line up (A close, B reasonable, C
// treat with caution). The source encodes it as dark green / light green / grey
// bars, which is the SAME green-against-grey pairing the basis pill uses, in the
// same modal: a light green bar could be read as "dog owner basis".
//
// So every bar keeps one fill and the grade rides on an annotation beside the
// value, in warmInk, which is 4.59:1 on the mat and is a documented stroke safe
// token. Same reasoning as the gap matrix outlining its focus cells rather than
// washing them, because there the fill IS the datum.
//
// ONLY B AND C ARE MARKED. Fifteen of the eighteen are A, so marking every row
// would be fifteen "A"s of noise around the three that matter. The absence of a
// mark is the A, and the caption says so.
//
// ⚠ THE TOP ROW IS A B AND THE THIRD IS A C. Sydney Central is the region both
// this point's copy and point 10's stat lead with. The source's own prose does
// not mention it. Left visible.
// -----------------------------------------------------------------------------

const nationalRule = benchmarkRule({
  axis: 'x',
  value: NATIONAL_PER_100_DOG_OWNERS,
  label: `national ${NATIONAL_PER_100_DOG_OWNERS.toFixed(2)}`,
});

/**
 * The value at the bar end, and the match grade after it when it is not an A.
 *
 * One plugin rather than `barValueLabels` plus a second, because the grade has
 * to be positioned AFTER the value text and only this can measure that text.
 * Built at module scope and reading from the scale, like every plugin here.
 */
const reachAndGradeLabels: Plugin<'bar'> = {
  id: 'topRegionsReachLabels',
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    const scale = chart.scales.x;
    if (!scale) return;
    const { ctx } = chart;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    meta.data.forEach((el, i) => {
      const row = TOP_REGIONS_REACH[i];
      if (!row) return;
      const x = scale.getPixelForValue(row.perHundred) + 7;
      const value = row.perHundred.toFixed(2);
      ctx.font = CANVAS_FONT.metaBold;
      ctx.fillStyle = TEN_THINGS.seriesDeep;
      ctx.fillText(value, x, el.y);
      if (row.match !== 'A') {
        // Measure the VALUE in its own font before switching, or the offset is
        // computed from the grade's font and the mark lands on the number.
        const valueWidth = ctx.measureText(value).width;
        ctx.font = CANVAS_FONT.micro;
        ctx.fillStyle = TEN_THINGS.warmInk;
        ctx.fillText(row.match, x + valueWidth + 5, el.y);
      }
    });
    ctx.restore();
  },
};

const TopRegionsReach = ({ discrepancy }: TenThingChartProps) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: TOP_REGIONS_REACH.map((r) => r.region),
      datasets: [
        {
          label: 'Active per 100 dog owners',
          data: TOP_REGIONS_REACH.map((r) => r.perHundred),
          backgroundColor: TEN_THINGS.seriesFill,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
          maxBarThickness: 18,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      indexAxis: 'y',
      // `top` is benchmarkRule's caption gutter. `right` has to clear the value
      // label AND the grade mark that follows it on three rows.
      layout: { padding: { top: 22, right: 62, bottom: 4 } },
      scales: {
        y: catAxis(),
        x: valAxis({ beginAtZero: true, max: 2.3, title: 'Active customers per 100 dog owners' }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            label: (c) => `${Number(c.parsed.x).toFixed(2)} active per 100 dog owners`,
            footer: (items) => {
              const r = TOP_REGIONS_REACH[items[0]?.dataIndex ?? 0];
              if (!r) return '';
              return `Boundary match ${r.match}: ${MATCH_QUALITY[r.match]}`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Geography"
      title="Where Lyka actually reaches dog owners: the top 18 of 58 regions"
      subtitle="Active customers per 100 dog owners, against a national rate of 1.03"
      height={560}
      discrepancy={discrepancy}
      caption={
        <>
          The short list is almost identical to the household version: <b>11 of the top 12 regions
          are the same</b>, with Canberra coming in and Sydney Outer Western dropping out.{' '}
          <b>
            Sydney Central and Melbourne Inner City are marked B and C for boundary match
          </b>
          , meaning the Lyka postcode file lines up with the Roy Morgan region only reasonably (B)
          or should be treated with caution (C). Unmarked rows are A, a close match. The RAV table
          below is on a different measure and is unaffected by the change of base.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[reachAndGradeLabels, nationalRule]}
        aria-label="Horizontal bar chart of the top 18 Roy Morgan regions by active customers per 100 dog owners, against a national rate of 1.03. Sydney Central leads at 2.09 and Sydney Northern at 2.08, then Melbourne Inner City 1.62, Melbourne Central 1.60, Gold Coast 1.55, Sunshine Coast 1.54, Sydney Gosford and Wyong 1.47, Brisbane Western 1.45, Sydney Southern and Brisbane City and Northern both 1.40, the ACT 1.33, Brisbane Eastern 1.30, Sydney Outer Western 1.24, Wollongong 1.18, Melbourne Outer North East 1.15, Melbourne Northern 1.14, Newcastle 1.09 and Geelong 1.07. Sydney Central and Brisbane Eastern are a reasonable boundary match, grade B, and Melbourne Inner City should be treated with caution, grade C."
      />
    </TenThingsChart>
  );
};

export default TopRegionsReach;
