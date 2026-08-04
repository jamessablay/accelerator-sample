import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { BRANDED_SEARCH } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import { lineValueLabels } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 09. SIMPLIFIED, because the source chart has a unit error.
//
// It plots 10.5 (a percentage) and 100 (an index) on a SINGLE axis captioned
// "index / %". Those are not the same quantity, and the axis label admits it
// with a slash. The consequence is that the branded share series is pinned to
// the floor of the plot and reads as approximately zero, which is not what
// 10.5% means.
//
// Two axes here. Same six numbers. The divergence, which is the whole argument,
// becomes readable rather than being an artefact of the floor.
//
// The branded line is seriesInk, NOT seriesFill. seriesFill (#10B193) is 2.62:1
// against the cream mat and would be a hairline that vanishes. The FILL ONLY
// rule in the TEN_THINGS block of brand.ts exists for exactly this instinct.
// -----------------------------------------------------------------------------

const brandedLabels = lineValueLabels({
  datasetIndex: 0,
  fmt: (v) => `${v.toFixed(1)}%`,
  dy: 16,
  color: TEN_THINGS.seriesInk,
});

const interestLabels = lineValueLabels({
  datasetIndex: 1,
  fmt: (v) => String(v),
  dy: -13,
  color: TEN_THINGS.warmInk,
});

const BrandedSearchGap: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const data = useMemo<ChartData<'line'>>(
    () => ({
      labels: [...BRANDED_SEARCH.labels],
      datasets: [
        {
          label: 'Branded share of search contribution',
          yAxisID: 'y',
          data: [...BRANDED_SEARCH.brandedSharePct],
          borderColor: TEN_THINGS.seriesInk,
          backgroundColor: 'rgba(10,125,104,0.12)',
          borderWidth: 3,
          fill: 'origin',
          tension: 0.2,
          pointRadius: 5,
          pointHoverRadius: 7.5,
          pointBackgroundColor: TEN_THINGS.seriesInk,
          pointBorderColor: CHART_SEPARATOR,
          pointBorderWidth: 2,
        },
        {
          label: 'External interest in the brand, indexed',
          yAxisID: 'y1',
          data: [...BRANDED_SEARCH.interestIndex],
          borderColor: TEN_THINGS.warmInk,
          backgroundColor: TEN_THINGS.warmInk,
          borderWidth: 3,
          borderDash: [7, 5],
          fill: false,
          tension: 0.2,
          pointRadius: 5,
          pointHoverRadius: 7.5,
          pointStyle: 'rect',
          pointBackgroundColor: TEN_THINGS.warmInk,
          pointBorderColor: CHART_SEPARATOR,
          pointBorderWidth: 2,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      ...BASE_OPTIONS,
      layout: { padding: { top: 30, right: 14, bottom: 6 } },
      scales: {
        x: catAxis(),
        y: valAxis({
          beginAtZero: true,
          max: 16,
          title: 'Branded share of search: %',
          tick: (v) => `${v}%`,
        }),
        y1: valAxis({
          beginAtZero: true,
          max: 150,
          position: 'right',
          noGrid: true,
          title: 'Interest, indexed to FY24 = 100',
        }),
      },
      plugins: {
        ...BASE_PLUGINS,
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            label: (c) =>
              c.datasetIndex === 0
                ? `Branded share: ${Number(c.parsed.y).toFixed(1)}% of search contribution`
                : `Interest index: ${c.parsed.y} against FY24 = 100`,
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Channel"
      title="Interest climbs. The share that converts unprompted does not."
      subtitle="Two different quantities, so two axes"
      height={330}
      discrepancy={discrepancy}
      caption={
        <>
          The two series are on separate axes because they are not the same quantity: a percentage
          and an index. Branded share has held at 10 to 11% for three straight years while interest
          rose 35 points. Lifetime, the ratio is 9:1 non-branded to branded.
        </>
      }
    >
      <Line
        data={data}
        options={options}
        plugins={[brandedLabels, interestLabels]}
        aria-label="Line chart over three financial years with two axes. Branded share of search contribution, on the left axis, is flat at 10.5 per cent in FY24, 10.8 in FY25 and 10.6 in FY26. External interest in the brand, on the right axis and indexed to FY24 equals 100, climbs to 118 in FY25 and 135 in FY26. Interest rises while the converting share does not move."
      />
    </TenThingsChart>
  );
};

export default BrandedSearchGap;
