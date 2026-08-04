import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { RETENTION_CUTS } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import { barValueLabels } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 04. SIMPLIFIED. The source is the weakest chart in the set.
//
// It draws two matplotlib subplots of four bars each on a y axis truncated at
// 20, with the shared axis label bolted to the left panel only. Three problems:
// the truncation makes both cuts look dramatic, two side by side panels invite a
// left to right read across a boundary that does not exist, and the long labels
// force rotation at modal width.
//
// One chart, axis to zero, eight bars, and the TWO CUTS ARE SEPARATED BY COLOUR
// rather than by a panel border. That is the finding encoded directly:
//
//   inertFill (muted grey green) = the dwelling cut. It does nothing. A 2.3
//     point spread across four quartiles.
//   seriesFill (Lyka teal)       = the income cut. It does everything. A 9.1
//     point spread across four bands.
//
// inertFill is 1.82:1 against the cream mat, so per the TEN_THINGS block in
// brand.ts it ALWAYS carries a benchmark hairline. It has one here.
// -----------------------------------------------------------------------------

const DWELLING_COUNT = RETENTION_CUTS.dwelling.labels.length;

const valueLabels = barValueLabels({ orient: 'y', fmt: (v) => `${v.toFixed(1)}%` });

const RetentionCuts: React.FC<TenThingChartProps> = ({ discrepancy }) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: [...RETENTION_CUTS.dwelling.labels, ...RETENTION_CUTS.income.labels],
      datasets: [
        {
          label: 'Retention',
          data: [...RETENTION_CUTS.dwelling.values, ...RETENTION_CUTS.income.values],
          backgroundColor: [
            ...RETENTION_CUTS.dwelling.values.map(() => TEN_THINGS.inertFill),
            ...RETENTION_CUTS.income.values.map(() => TEN_THINGS.seriesFill),
          ],
          borderColor: [
            ...RETENTION_CUTS.dwelling.values.map(() => TEN_THINGS.benchmark),
            ...RETENTION_CUTS.income.values.map(() => CHART_SEPARATOR),
          ],
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 58,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      scales: {
        x: catAxis(),
        y: valAxis({
          beginAtZero: true,
          max: 40,
          title: 'Share of customers still active: %',
          tick: (v) => `${v}%`,
        }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            title: (items) => {
              const i = items[0]?.dataIndex ?? 0;
              return i < DWELLING_COUNT
                ? `Dwelling cut: ${items[0]?.label}`
                : `Income cut: ${items[0]?.label}`;
            },
            label: (c) => `Retention ${Number(c.parsed.y).toFixed(1)}%`,
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Audience"
      title="Dwelling type does nothing to retention. Income does all of it."
      subtitle="The same customer base, cut two ways"
      height={340}
      discrepancy={discrepancy}
      caption={
        <>
          The four muted bars are the dwelling cut, a 2.3 point spread. The four teal bars are the
          income cut, a 9.1 point spread. The two sets are separate cuts of the same base, so there
          is no left to right reading across them.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[valueLabels]}
        aria-label="Column chart of retention, the same customer base cut two ways. By dwelling type, from most houses to most flats: 32.7, 32.8, 34.8 and 35.0 per cent, a spread of 2.3 points. By household income, from deciles 1 to 3 up to deciles 9 to 10: 27.5, 30.3, 32.5 and 36.6 per cent, a spread of 9.1 points."
      />
    </TenThingsChart>
  );
};

export default RetentionCuts;
