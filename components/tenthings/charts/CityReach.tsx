import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { CITY_REACH, NATIONAL_PER_100_DOG_OWNERS } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import { barValueLabels, benchmarkRule } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 05. REDRAWN per 100 dog owners, 2026-08-10. Replaces CityLifecycle.tsx.
//
// IT IS NO LONGER A BUBBLE CHART, and that is the source's call rather than a
// styling preference. The household version plotted penetration against tenure
// with bubble area as the active base, which was a lifecycle claim: markets sit
// at different points on one curve. The redrawn source plots one measure as
// bars, because the lifecycle SPACING was the thing the change of base broke.
//
// WHAT THE CHANGE OF BASE DID. On households Brisbane read 1.55 against
// Melbourne's 1.20, a clear step ahead. It is not: Brisbane simply owns more
// dogs, 43 adults in 100 against Melbourne's 39, and on the true base they are
// level at 1.23 and 1.21. The markets really are at different stages; the
// old chart just had the gaps wrong. Do not say Brisbane is a year ahead.
//
// THE ACT IS A SIXTH ROW the household version did not carry at all.
//
// THREE THINGS WENT WITH THE BUBBLE, and nothing else uses them: the
// `bubbleLabels` plugin (with its collision halo), `BubbleController` in
// chartBase, and `TEN_THINGS.bubbleFill`. All three were removed with this
// rebuild rather than left as dead weight. It also drops `useElementSize` and
// the MIN_CHART_WIDTH text fallback: those existed because a bubble radius has
// to be derived from the measured container, and a bar does not.
// -----------------------------------------------------------------------------

const reachLabels = barValueLabels({ orient: 'x', fmt: (v) => v.toFixed(2) });

const nationalRule = benchmarkRule({
  axis: 'x',
  value: NATIONAL_PER_100_DOG_OWNERS,
  label: `national ${NATIONAL_PER_100_DOG_OWNERS.toFixed(2)}`,
});

const CityReach = ({ discrepancy }: TenThingChartProps) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: CITY_REACH.map((c) => c.city),
      datasets: [
        {
          label: 'Active per 100 dog owners',
          data: CITY_REACH.map((c) => c.perHundred),
          backgroundColor: TEN_THINGS.seriesFill,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
          maxBarThickness: 26,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      indexAxis: 'y',
      // `top` is the gutter benchmarkRule draws a VERTICAL rule's caption into.
      // `right` is headroom for the value label at the end of the longest bar.
      layout: { padding: { top: 22, right: 48, bottom: 4 } },
      scales: {
        y: catAxis(),
        x: valAxis({ beginAtZero: true, max: 1.7, title: 'Active customers per 100 dog owners' }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            label: (c) => `${Number(c.parsed.x).toFixed(2)} active per 100 dog owners`,
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Life stage"
      title="On the true base the ladder has a different running order"
      subtitle="Active customers per 100 dog owners, six markets"
      height={300}
      discrepancy={discrepancy}
      caption={
        <>
          <b>Brisbane 1.23 and Melbourne 1.21 are level.</b> On households Brisbane looked a clear
          step ahead, because it owns more dogs: 43 adults in 100 against Melbourne&rsquo;s 39.
          Perth also sits further back than the household view suggested, 0.99 to 0.85. Markets are
          genuinely at different stages; the spacing was wrong.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[reachLabels, nationalRule]}
        aria-label="Horizontal bar chart of active customers per 100 dog owners across six markets. Sydney leads at 1.49, then the ACT at 1.33, Brisbane 1.23, Melbourne 1.21, Perth 0.85 and Adelaide 0.71, against a national rate of 1.03. Brisbane and Melbourne are level."
      />
    </TenThingsChart>
  );
};

export default CityReach;
