import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Plugin,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { PLAN_LAYERS, MONTHS, MEDIA_TOTAL, FLIGHTING_PCT } from '../../data/mediaPlanData';
import { LAYER_COLORS, LYKA, TEN_THINGS, lighten, CHART_INK, CHART_MUTED, CHART_GRID } from '../../data/brand';

// The generic <Chart> registers NO controllers, and the typed <Bar> registers
// BarController only: a mixed bar-plus-line chart typechecks either way and
// throws at runtime unless BOTH controllers (and the line's elements) are
// registered explicitly. Same trap the Ten Things charts document in
// components/tenthings/charts/chartBase.ts.
ChartJS.register(CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Tooltip, Legend);

/** How far the last channel in a layer is lightened toward white. */
const LIGHTEN_CEILING = 0.34;

/** The dashed overlay: the workbook's planned monthly flighting weight, in dollars. */
const FLIGHTING_LABEL = 'Planned flighting weight';
const flightingDollars = FLIGHTING_PCT.map((p) => Math.round((p / 100) * MEDIA_TOTAL));

// Draw the stacked column total above each bar (replaces the datalabels plugin).
// Sums ONLY the 'spend' stack: the flighting overlay is a reference line, and
// summing it in would silently inflate every printed total by the demand value.
const columnTotals: Plugin<'bar'> = {
  id: 'columnTotals',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const totals = MONTHS.map((_, i) =>
      chart.data.datasets.reduce(
        (sum, ds) => sum + (ds.stack === 'spend' ? Number((ds.data as number[])[i]) || 0 : 0),
        0,
      ),
    );
    // Topmost visible SPEND dataset gives the y of each stack top.
    let topMeta = null as ReturnType<typeof chart.getDatasetMeta> | null;
    for (let d = chart.data.datasets.length - 1; d >= 0; d--) {
      if (chart.data.datasets[d].stack === 'spend' && chart.isDatasetVisible(d)) {
        topMeta = chart.getDatasetMeta(d);
        break;
      }
    }
    if (!topMeta) return;
    ctx.save();
    ctx.font = 'bold 10px "DM Sans", sans-serif';
    ctx.fillStyle = LYKA.tealDeepest;
    ctx.textAlign = 'center';
    topMeta.data.forEach((bar, i) => {
      if (!totals[i]) return;
      const label = `$${Math.round(totals[i] / 1000)}k`;
      ctx.fillText(label, bar.x, bar.y - 6);
    });
    ctx.restore();
  },
};

const BudgetBreakdownChart: React.FC = () => {
  // Mixed chart: bar datasets plus the dashed line overlay, so the data is
  // typed over the union rather than 'bar' alone.
  const data = useMemo<ChartData<'bar' | 'line', number[], string>>(() => {
    const datasets = PLAN_LAYERS.flatMap((layer) => {
      const base = LAYER_COLORS[layer.key].base;
      // In-house rows carry no dollars: a zero dataset draws nothing but still
      // takes a legend entry, so they are filtered out, and the shade index
      // runs over the FUNDED rows so the ramp has no gaps.
      const funded = layer.rows.filter((row) => row.budget > 0);
      return funded.map((row, idx) => ({
        label: row.channel,
        data: [...row.monthly],
        backgroundColor: lighten(base, (idx / Math.max(1, funded.length)) * LIGHTEN_CEILING),
        borderColor: 'rgba(255,251,237,0.9)',
        borderWidth: 1,
        stack: 'spend',
      }));
    });
    return {
      labels: [...MONTHS],
      datasets: [
        ...datasets,
        {
          type: 'line' as const,
          label: FLIGHTING_LABEL,
          data: [...flightingDollars],
          // TEN_THINGS.benchmark is the established dashed-benchmark stroke
          // (5.25:1 against the cream mat).
          borderColor: TEN_THINGS.benchmark,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 2,
          pointBackgroundColor: TEN_THINGS.benchmark,
          fill: false,
          stack: 'flighting',
          order: 0,
        },
      ],
    };
  }, []);

  const options = useMemo<ChartOptions<'bar'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 24 } },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 }, color: CHART_MUTED } },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: { callback: (v) => `$${Number(v) / 1000}k`, font: { size: 11 }, color: CHART_MUTED },
          grid: { color: CHART_GRID },
        },
      },
      plugins: {
        legend: {
          position: 'bottom',
          // Chart.js defaults legend text to #666, which is off brand on cream.
          labels: { boxWidth: 12, boxHeight: 12, font: { size: 10 }, padding: 8, usePointStyle: true, pointStyle: 'rectRounded', color: CHART_INK },
        },
        tooltip: {
          callbacks: {
            // ROUNDED. One row (Cricket Integration) carries the client's own
            // monthly figures to the cent, and this was the only place in the
            // plan that would have printed them: every other money site either
            // rounds already (`money()` in ChannelDetail) or only ever shows an
            // integer (the Budget column, the $k column totals). Whole dollars
            // is the plan's convention, so round here rather than let one row
            // display "$1,613,070.36" beside eighteen whole dollar rows.
            label: (c) => `${c.dataset.label}: $${Math.round(Number(c.parsed.y)).toLocaleString('en-AU')}`,
            // Total the spend stack only: the flighting overlay is a reference
            // line, not spend, and must not inflate the footer.
            footer: (items) => {
              const total = items.reduce(
                (s, it) => s + (it.dataset.stack === 'spend' ? Number(it.parsed.y || 0) : 0),
                0,
              );
              return `Total: $${Math.round(total).toLocaleString('en-AU')}`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <div>
      <p className="text-sm mb-3" style={{ color: CHART_MUTED }}>
        SPEED managed monthly spend, broken down by media channel, with the planned flighting weight as the dashed line.
        Media total {`$${MEDIA_TOTAL.toLocaleString('en-AU')}`} across the year (Oct to Sep).
      </p>
      <div style={{ height: 'min(58vh, 460px)' }}>
        <Chart type="bar" data={data} options={options} plugins={[columnTotals]} />
      </div>
    </div>
  );
};

export default BudgetBreakdownChart;
