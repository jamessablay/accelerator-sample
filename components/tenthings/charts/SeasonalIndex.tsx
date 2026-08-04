import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { SEASONAL_INDEX } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import { barValueLabels, benchmarkRule } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 06. SIMPLIFIED, and this one is free.
//
// The source truncates the y axis at 70 so a 39 point swing is visible, which is
// the classic complaint about a bar chart. But this series is an INDEX WITH A
// DEFINED BASELINE OF 100, so the fix is structural rather than cosmetic:
// anchor the bars at 100 with the dataset's `base` option. Peaks grow up from
// the average month, troughs grow down.
//
// Bar LENGTH now encodes the deviation, which is the meaningful quantity for an
// index. The 100 line stops being a truncated axis pretending to be zero and
// becomes what it actually is: the average month. Same twelve numbers, and
// nothing left to apologise for.
//
// COLOUR IS REDUNDANT to direction, not the only cue: teal above the line,
// tangerine below. Anyone who cannot separate those two hues still has the
// direction of the bar.
// -----------------------------------------------------------------------------

const baselineRule = benchmarkRule({
  axis: 'y',
  value: SEASONAL_INDEX.baseline,
  label: 'average month = 100',
});

const indexLabels = barValueLabels({
  orient: 'y',
  fmt: (v) => String(v),
  base: SEASONAL_INDEX.baseline,
});

const SeasonalIndex: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: [...SEASONAL_INDEX.labels],
      datasets: [
        {
          label: 'Demand index',
          data: [...SEASONAL_INDEX.values],
          base: SEASONAL_INDEX.baseline,
          backgroundColor: SEASONAL_INDEX.values.map((v) =>
            v >= SEASONAL_INDEX.baseline ? TEN_THINGS.seriesFill : TEN_THINGS.warnFill,
          ),
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
          maxBarThickness: 46,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      // `right` is the gutter the baseline caption is drawn into, past the end
      // of the rule. At 14 it fell back to inline and landed on Nov's label.
      layout: { padding: { top: 26, bottom: 22, right: 124 } },
      scales: {
        x: catAxis(),
        y: valAxis({ min: 78, max: 132, title: 'Index: 100 is the average month' }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            label: (c) => {
              const v = Number(c.parsed.y);
              const d = v - SEASONAL_INDEX.baseline;
              return `Index ${v}, ${d >= 0 ? '+' : ''}${d} against the average month`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Life stage"
      title="Two months of the year are dependable. The rest are not."
      subtitle="Monthly demand index with the growth trend removed"
      height={330}
      discrepancy={discrepancy}
      truncatedAxis="Bars are drawn from the 100 baseline, not from zero, so bar length is the deviation from an average month rather than the index value itself."
      caption={
        <>
          January indexes 123 and September 84, a 39 point swing. The pattern holds across the last
          two years. We could not separate demand from promotion: media activity also peaks in
          January, at index 119. So the shape is real and the cause is open.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[baselineRule, indexLabels]}
        aria-label="Column chart of a twelve month demand index where 100 is the average month, drawn as deviations from that baseline. January is highest at 123 and February 110. March through August sit close to the line between 93 and 99. September is lowest at 84. October is 104, November 100 and December 97. The peak to trough swing is 39 points."
      />
    </TenThingsChart>
  );
};

export default SeasonalIndex;
