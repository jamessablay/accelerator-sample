import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS } from '../../../data/brand';
import { GROWTH_SHARE, CHANNEL_RAV } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import { barValueLabels, benchmarkRule } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 01. Two panels, deliberately.
//
// Share of growth and RAV are two different measures of the same four channels,
// and the whole finding is that the RANKING INVERTS between them. Merging them
// into one dual axis chart would imply the two quantities are commensurable.
//
// COLOUR IS RE-ENCODED, not transcribed. The source uses a three step green
// lightness ramp on the left panel that encodes nothing. Here the rule is the
// same across both panels: TANGERINE means the channel is below the 1.00
// national average on RAV, TEAL means above it. Media is the only teal bar,
// which states the argument the headline makes (78% of growth came from below
// average channels) without touching a number.
//
// tangerine against seriesInk is only 2.08:1, so the colour has to be REDUNDANT:
// bar length carries the value, the right panel and the caption carry the
// threshold. Never rely on this pair alone to separate two series.
// -----------------------------------------------------------------------------

/** Which channels sit below the 1.00 average. Drives the fill on both panels. */
const BELOW_AVERAGE = new Set(['Kiosks', 'Partnerships', 'Referral', 'Partnerships and referral']);

const fillFor = (label: string) =>
  BELOW_AVERAGE.has(label) ? TEN_THINGS.warnFill : TEN_THINGS.seriesInk;

const growthLabels = barValueLabels({ orient: 'y', fmt: (v) => `${v.toFixed(1)}%` });
const ravLabels = barValueLabels({ orient: 'x', fmt: (v) => v.toFixed(2) });
const nationalAverage = benchmarkRule({
  axis: 'x',
  value: CHANNEL_RAV.benchmark,
  label: 'national average 1.00',
});

const DistributionSplit: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const growthData = useMemo<ChartData<'bar'>>(
    () => ({
      // Chart.js reads an ARRAY label as multiple lines. "Partnerships and
      // referral" is 25 characters in a 150px column, and on one line Chart.js
      // auto rotates it into the neighbouring tick. Two lines, no rotation.
      labels: GROWTH_SHARE.labels.map((l) => (l.includes(' and ') ? l.split(' and ').map((s, i) => (i ? `and ${s}` : s)) : l)),
      datasets: [
        {
          label: 'Share of growth',
          data: [...GROWTH_SHARE.values],
          backgroundColor: GROWTH_SHARE.labels.map(fillFor),
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 74,
        },
      ],
    }),
    [],
  );

  const growthOptions = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      scales: {
        x: catAxis(),
        y: valAxis({
          beginAtZero: true,
          max: 60,
          title: 'Share of the growth increment: %',
          tick: (v) => `${v}%`,
        }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: { label: (c) => `${Number(c.parsed.y).toFixed(1)}% of the growth increment` },
        },
      },
    }),
    [],
  );

  const ravData = useMemo<ChartData<'bar'>>(
    () => ({
      labels: [...CHANNEL_RAV.labels],
      datasets: [
        {
          label: 'RAV',
          data: [...CHANNEL_RAV.values],
          backgroundColor: CHANNEL_RAV.labels.map(fillFor),
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 34,
        },
      ],
    }),
    [],
  );

  const ravOptions = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      indexAxis: 'y',
      layout: { padding: { top: 20, right: 46 } },
      scales: {
        y: catAxis(),
        x: valAxis({
          beginAtZero: true,
          max: 1.4,
          title: 'RAV: value per signup vs national average',
          tick: (v) => v.toFixed(1),
        }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            label: (c) => {
              const v = Number(c.parsed.x);
              return `RAV ${v.toFixed(2)}, ${v >= 1 ? 'above' : 'below'} the national average`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Distribution"
      title="Volume comes from one channel. Value comes from another."
      subtitle="Share of the H1 FY26 growth increment, and what a signup from each channel is worth"
      panels={2}
      height={330}
      discrepancy={discrepancy}
      caption={
        <>
          Tangerine is a channel below the 1.00 national average on value per signup, teal is above
          it. Kiosks, partnerships and referral together are 78% of growth and all three sit below
          the line.
        </>
      }
    >
      <div className="relative h-full min-h-[240px]">
        <Bar
          data={growthData}
          options={growthOptions}
          plugins={[growthLabels]}
          aria-label="Column chart. Share of the growth increment, H1 FY26 against H1 FY25. Kiosks 49.3 per cent, Media 22.0 per cent, Partnerships and referral 28.7 per cent."
        />
      </div>
      <div className="relative h-full min-h-[240px]">
        <Bar
          data={ravData}
          options={ravOptions}
          plugins={[ravLabels, nationalAverage]}
          aria-label="Horizontal bar chart. Value per signup, RAV, against a national average of 1.00. Marketing 1.15, Partnerships 0.96, Referral 0.82, Kiosks 0.29."
        />
      </div>
    </TenThingsChart>
  );
};

export default DistributionSplit;
