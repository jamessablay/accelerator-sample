import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { TEN_THINGS, CHART_SEPARATOR } from '../../../data/brand';
import { FLAT_SHARE, NATIONAL_PER_100_DOG_OWNERS } from '../../../data/tenThingsSeries';
import TenThingsChart from '../TenThingsChart';
import { BASE_OPTIONS, BASE_PLUGINS, catAxis, valAxis } from './chartBase';
import { barValueLabels, benchmarkRule } from './chartPlugins';
import type { TenThingChartProps } from './types';

// -----------------------------------------------------------------------------
// Point 03. REDRAWN per 100 dog owners, 2026-08-10.
//
// THE CHANGE OF BASE WIDENS THE GAP, which is the finding. On households the
// flattest fifth ran 1.41x the least flat; on dog owners it is 1.64x, because
// flat heavy areas own fewer dogs and the household measure was hiding part of
// the effect.
//
// THE INCOME LINE IS GONE, and that is a real loss the caption has to cover.
// The household version ADDED that line, because the headline claims the driver
// is the postcode rather than the flat and a penetration only chart cannot show
// it. The redrawn source plots one series, so the line goes and the argument
// moves into the caption and the numbers table, where the column still lives.
// This is the one place the redraw makes a chart argue its own headline less
// well, and it is recorded rather than quietly patched by re-adding a series the
// new source does not carry.
//
// <Bar>, NOT <Chart type="bar">: no line dataset left. See IncomeLadder's header.
//
// TWO LINE X LABELS. Chart.js renders an array label as one line per element, so
// each quintile carries its own flats percentage under its name. That is the
// source's own labelling and it is what stops "most flats" reading as a category
// rather than as 52% of dwellings.
// -----------------------------------------------------------------------------

const penetrationLabels = barValueLabels({ orient: 'y', fmt: (v) => v.toFixed(2) });

const nationalRule = benchmarkRule({
  axis: 'y',
  value: NATIONAL_PER_100_DOG_OWNERS,
  label: `national ${NATIONAL_PER_100_DOG_OWNERS.toFixed(2)}`,
});

const FlatSharePenetration = ({ discrepancy }: TenThingChartProps) => {
  const data = useMemo<ChartData<'bar'>>(
    () => ({
      labels: FLAT_SHARE.labels.map((l, i) => [l, `${FLAT_SHARE.flatsPct[i]}% flats`]),
      datasets: [
        {
          label: 'Active per 100 dog owners',
          data: [...FLAT_SHARE.penetration],
          backgroundColor: TEN_THINGS.seriesFill,
          borderColor: CHART_SEPARATOR,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 68,
        },
      ],
    }),
    [],
  );

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      ...BASE_OPTIONS,
      // `right` is the gutter benchmarkRule draws a HORIZONTAL rule's caption
      // into. Without it the caption falls back inline and lands on a bar.
      layout: { padding: { top: 26, right: 96 } },
      scales: {
        x: catAxis('Postcodes grouped by their share of flats'),
        y: valAxis({ beginAtZero: true, max: 1.5, title: 'Active per 100 dog owners' }),
      },
      plugins: {
        ...BASE_PLUGINS,
        legend: { display: false },
        tooltip: {
          ...BASE_PLUGINS.tooltip,
          callbacks: {
            title: (items) => {
              const i = items[0]?.dataIndex ?? 0;
              return `${FLAT_SHARE.labels[i]}: ${FLAT_SHARE.flatsPct[i]}% flats`;
            },
            label: (c) => `Active: ${Number(c.parsed.y).toFixed(2)} per 100 dog owners`,
            footer: (items) => {
              const i = items[0]?.dataIndex ?? 0;
              return `Average income decile: ${FLAT_SHARE.avgIncomeDecile[i].toFixed(1)}`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <TenThingsChart
      eyebrow="Audience"
      title="The flatter the postcode, the better Lyka does"
      subtitle="Five quintiles of postcodes, ordered by the share of dwellings that are flats"
      height={340}
      discrepancy={discrepancy}
      caption={
        <>
          <b>1.64x</b> between the most and fewest flats, against 1.41x on households: flat heavy
          areas own fewer dogs, so the household base was hiding part of this. A region grain cross
          check that needs no estimate at all puts the same gap at 2.16x. The driver is still the
          postcode rather than the flat, and the average income decile in the numbers table is the
          evidence: the flattest quintile is also the richest at 7.7. Hover a bar for it.
        </>
      }
    >
      <Bar
        data={data}
        options={options}
        plugins={[penetrationLabels, nationalRule]}
        aria-label="Column chart across five quintiles of postcodes ordered by share of flats, from 1 per cent to 52 per cent. Active customers per 100 dog owners are 0.80, 0.87, 0.83, 0.89 and 1.31 from fewest flats to most, against a national rate of 1.03. Only the flattest quintile is above the national rate."
      />
    </TenThingsChart>
  );
};

export default FlatSharePenetration;
