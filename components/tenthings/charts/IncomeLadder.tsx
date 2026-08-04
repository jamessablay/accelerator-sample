import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { INCOME_LADDER } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 02. Grouped bars plus a line on a second axis.
//
// <Chart type="bar">, NOT <Bar>. react-chartjs-2's typed <Bar> registers
// BarController only, so the `type: 'line'` dataset below throws
// '"line" is not a registered controller' at runtime while typechecking clean.
// chartBase registers LineController and PointElement for exactly this.
//
// GROUPED, NOT STACKED. "Ever tried" and "still active" are a superset and a
// subset, so a stack would draw a total that does not exist.
//
// THE RIGHT AXIS GOES TO ZERO. The source truncates it at 20, which turns a
// 10.8 point retention spread into something that looks like a doubling. At
// full scale the line is a gentle climb, which is what 27.6 to 38.4 per cent is.
// The gap between the two bar series is the louder finding anyway.
//
// The source's arrow callout at decile 10 is in the caption, not on the canvas.
// -----------------------------------------------------------------------------

const IncomeLadder: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: [...INCOME_LADDER.labels],
      datasets: [
        {
          type: 'bar' as const,
          label: 'Ever tried',
          yAxisID: 'y',
          order: 2,
          data: [...INCOME_LADDER.everTried],
          backgroundColor: TEN_THINGS.seriesFill,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          type: 'bar' as const,
          label: 'Still active',
          yAxisID: 'y',
          order: 2,
          data: [...INCOME_LADDER.stillActive],
          backgroundColor: TEN_THINGS.seriesDeep,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
          borderRadius: 3,
          borderSkipped: false,
        },
        {
          type: 'line' as const,
          label: 'Retention %',
          yAxisID: 'y1',
          order: 1,
          data: [...INCOME_LADDER.retentionPct],
          borderColor: TEN_THINGS.warmInk,
          backgroundColor: TEN_THINGS.warmInk,
          borderWidth: 2.5,
          tension: 0.3,
          pointRadius: 3.5,
          pointHoverRadius: 6,
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
        x: catAxis('Household income decile: 1 lowest to 10 highest'),
        y: valAxis({ beginAtZero: true, max: 6, title: 'Customers per 100 households' }),
        y1: valAxis({
          beginAtZero: true,
          max: 50,
          position: 'right',
          noGrid: true,
          title: 'Still active: %',
          tick: (v) => `${v}%`,
        }),
      },
      plugins: {
        ...BASE_PLUGINS,
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            title: (items) => `Income decile ${items[0]?.label}`,
            label: (c) =>
              c.dataset.label === 'Retention %'
                ? `Retention: ${Number(c.parsed.y).toFixed(1)}%`
                : `${c.dataset.label}: ${Number(c.parsed.y).toFixed(2)} per 100 households`,
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Audience"
      title="Every step up the income ladder wins on both trial and retention"
      subtitle="Trial and active base per 100 households, with retention on the right axis"
      height={340}
      discrepancy={discrepancy}
      caption={
        <>
          At decile 10, <b>5.08 per 100 households</b> have ever tried Lyka, so 94.9 in 100 never
          have. Against a demonstrated ceiling near 8 per 100 in the best postcodes, the richest
          decile sits at about half its proven potential.
        </>
      }
    >
      <Chart
        type="bar"
        data={data}
        options={options}
        aria-label="Combination chart across ten household income deciles. Two bar series, ever tried and still active per 100 households, both rising with income from 1.28 and 0.35 at decile 1 to 5.08 and 1.95 at decile 10. A line shows retention rising from 27.6 per cent to 38.4 per cent across the same deciles."
      />
    </TenThingsChart>
  );
};

export default IncomeLadder;
