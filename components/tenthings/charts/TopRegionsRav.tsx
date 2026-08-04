import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { TOP_REGIONS_RAV, RAV_BENCHMARK } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import { barValueLabels, benchmarkRule } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 07. SIMPLIFIED to a deviation chart.
//
// The source runs the x axis 0 to 1.4 for ten values between 1.07 and 1.34.
// Ninety per cent of every bar is the part all ten regions share, and the
// differences, which are the entire point, are squeezed into the last tenth.
//
// The reference here is 1.00, not zero, so the bars are anchored there. Bar
// length is then the premium over the national average, which is the quantity
// the headline is about.
//
// THE MAP IS NOT THIS COMPONENT. The five capital choropleth stays a PNG and is
// rendered by TenThingsDetail from the record's `mapImage`. There is no
// Chart.js path to 956 ABS postal area boundaries and no reason to look for one.
// -----------------------------------------------------------------------------

const averageRule = benchmarkRule({
  axis: 'x',
  value: RAV_BENCHMARK,
  label: 'national average 1.00',
});

const ravLabels = barValueLabels({
  orient: 'x',
  fmt: (v) => `${v.toFixed(2)}x`,
  base: RAV_BENCHMARK,
});

const TopRegionsRav: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: TOP_REGIONS_RAV.map((r) => r.region),
      datasets: [
        {
          label: 'RAV',
          data: TOP_REGIONS_RAV.map((r) => r.rav),
          base: RAV_BENCHMARK,
          backgroundColor: TEN_THINGS.seriesFill,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
          maxBarThickness: 20,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      indexAxis: 'y',
      // `top` is the gutter the benchmark caption is drawn into, above the plot
      // area. 16 left the 11px caption 4px from the canvas edge.
      layout: { padding: { top: 22, right: 54, bottom: 4 } },
      scales: {
        y: catAxis(),
        x: valAxis({
          min: 0.98,
          max: 1.4,
          title: 'Value per signup against the national average',
          tick: (v) => `${v.toFixed(2)}x`,
        }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            label: (c) => {
              const r = TOP_REGIONS_RAV[c.dataIndex];
              if (!r) return '';
              return [
                `RAV: ${r.rav.toFixed(2)}x the national average`,
                `Penetration: ${r.penetration.toFixed(2)} per 100 households`,
                `Headroom: ${r.headroom}`,
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
      eyebrow="Geography"
      title="The ten highest value regions in the country"
      subtitle="Value per signup, measured as a premium over the national average"
      height={360}
      discrepancy={discrepancy}
      truncatedAxis="Bars are drawn from the 1.00 national average, not from zero, so bar length is the premium over that average rather than the RAV itself."
      caption={
        <>
          Half the customer base sits in 19 SA4 regions covering the same households as 258
          postcodes. Hover a bar for its penetration and headroom.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[averageRule, ravLabels]}
        aria-label="Horizontal bar chart of the ten highest value SA4 regions by RAV, value per signup, measured from the national average of 1.00. Sydney Northern Beaches leads at 1.34 times, then North Sydney and Hornsby 1.20, Sutherland 1.19, Perth Inner 1.18, Brisbane Inner City 1.15, Sydney Eastern Suburbs and the Australian Capital Territory both 1.13, Illawarra and Melbourne Inner South both 1.10, and Southern Highlands and Shoalhaven at 1.07."
      />
    </TenThingsChart>
  );
};

export default TopRegionsRav;
