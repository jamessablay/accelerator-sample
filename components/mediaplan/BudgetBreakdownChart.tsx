import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Plugin,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PLAN_LAYERS, MONTHS, MEDIA_TOTAL } from '../../data/mediaPlanData';
import { LAYER_COLORS, LYKA, CHART_INK, CHART_MUTED, CHART_GRID } from '../../data/brand';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/** How far the last channel in a layer is lightened toward white. */
const LIGHTEN_CEILING = 0.34;

/** Mix a hex colour toward white by t (0..1). */
function lighten(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

// Draw the stacked column total above each bar (replaces the datalabels plugin).
const columnTotals: Plugin<'bar'> = {
  id: 'columnTotals',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const totals = MONTHS.map((_, i) =>
      chart.data.datasets.reduce((sum, ds) => sum + (Number((ds.data as number[])[i]) || 0), 0),
    );
    // Topmost visible dataset gives the y of each stack top.
    let topMeta = null as ReturnType<typeof chart.getDatasetMeta> | null;
    for (let d = chart.data.datasets.length - 1; d >= 0; d--) {
      if (chart.isDatasetVisible(d)) { topMeta = chart.getDatasetMeta(d); break; }
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
  const data = useMemo<ChartData<'bar'>>(() => {
    const datasets = PLAN_LAYERS.flatMap((layer) => {
      const base = LAYER_COLORS[layer.key].base;
      return layer.rows.map((row, idx) => ({
        label: row.channel,
        data: [...row.monthly],
        backgroundColor: lighten(base, (idx / Math.max(1, layer.rows.length)) * LIGHTEN_CEILING),
        borderColor: 'rgba(255,251,237,0.9)',
        borderWidth: 1,
        stack: 'spend',
      }));
    });
    return { labels: [...MONTHS], datasets };
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
            label: (c) => `${c.dataset.label}: $${Number(c.parsed.y).toLocaleString('en-AU')}`,
            footer: (items) => {
              const total = items.reduce((s, it) => s + Number(it.parsed.y || 0), 0);
              return `Total: $${total.toLocaleString('en-AU')}`;
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
        Total monthly spend, broken down by media channel. Media total {`$${MEDIA_TOTAL.toLocaleString('en-AU')}`} across the FY (Nov to Oct).
      </p>
      <div style={{ height: 'min(58vh, 460px)' }}>
        <Bar data={data} options={options} plugins={[columnTotals]} />
      </div>
    </div>
  );
};

export default BudgetBreakdownChart;
