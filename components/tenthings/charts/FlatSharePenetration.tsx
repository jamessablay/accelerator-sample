import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { FLAT_SHARE } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import { barValueLabels } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 03. SIMPLIFIED BY ADDING, not by removing.
//
// The source plots penetration alone. But the headline is "Lyka wins in dense,
// AFFLUENT postcodes" and the paragraph says the effect is the postcode, not the
// flat. A penetration-only chart cannot show that: the reader has to take the
// caption on faith.
//
// The average income decile column is ALREADY IN THE SOURCE'S OWN PUBLISHED
// NUMBERS TABLE (6.9, 6.1, 6.1, 6.3, 7.7) and it tracks penetration almost
// exactly. Plotting it makes the chart argue its own headline. Nothing is added
// to the data; something stops being hidden.
//
// <Chart type="bar"> for the mixed bar plus line. See IncomeLadder's header.
// -----------------------------------------------------------------------------

const penetrationLabels = barValueLabels({ orient: 'y', fmt: (v) => v.toFixed(2) });

const FlatSharePenetration: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: [...FLAT_SHARE.labels],
      datasets: [
        {
          type: 'bar' as const,
          label: 'Penetration per 100 households',
          yAxisID: 'y',
          order: 2,
          data: [...FLAT_SHARE.penetration],
          backgroundColor: TEN_THINGS.seriesFill,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 68,
        },
        {
          type: 'line' as const,
          label: 'Average income decile of the postcode',
          yAxisID: 'y1',
          order: 1,
          data: [...FLAT_SHARE.avgIncomeDecile],
          borderColor: TEN_THINGS.warmInk,
          backgroundColor: TEN_THINGS.warmInk,
          borderWidth: 2.5,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6.5,
          pointBackgroundColor: TEN_THINGS.warmInk,
          pointBorderColor: CHART_SEPARATOR,
          pointBorderWidth: 1.5,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      scales: {
        x: catAxis('Postcodes grouped by their share of flats'),
        y: valAxis({ beginAtZero: true, max: 1.6, title: 'Penetration per 100 households' }),
        y1: valAxis({
          min: 0,
          max: 10,
          position: 'right',
          noGrid: true,
          title: 'Average income decile',
        }),
      },
      plugins: {
        ...BASE_PLUGINS,
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            label: (c) =>
              c.dataset.label?.startsWith('Average')
                ? `Average income decile: ${Number(c.parsed.y).toFixed(1)}`
                : `Penetration: ${Number(c.parsed.y).toFixed(2)} per 100 households`,
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Audience"
      title="Penetration follows the flats, and the flats follow the money"
      subtitle="Five quintiles of postcodes, ordered by the share of dwellings that are flats"
      height={340}
      discrepancy={discrepancy}
      caption={
        <>
          The income line is plotted alongside penetration because the two move together: the
          flattest quintile is also the richest at decile 7.7. Within a single city the apartment
          advantage falls to 1.16 to 1.19x, and in Brisbane it reverses.
        </>
      }
    >
      <Chart
        type="bar"
        data={data}
        options={options}
        plugins={[penetrationLabels]}
        aria-label="Combination chart across five quintiles of postcodes ordered by share of flats. Penetration per 100 households is 0.96, 0.94, 0.94, 1.03 and 1.33 from fewest flats to most. A line shows the average household income decile of each quintile: 6.9, 6.1, 6.1, 6.3 and 7.7. Penetration and income both peak in the flattest quintile."
      />
    </TenThingsChart>
  );
};

export default FlatSharePenetration;
