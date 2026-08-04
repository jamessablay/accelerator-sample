import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Plugin, ChartData, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PLAN_LAYERS, MEDIA_TOTAL } from '../../data/mediaPlanData';
import { LAYER_COLORS, LYKA, CHART_INK, CHART_MUTED, CHART_SEPARATOR } from '../../data/brand';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * How far the last channel in a layer is lightened toward white.
 * Held at 0.34, not 0.5: at 0.5 the final slice of each layer lands near cream
 * and cannot carry a readable in-slice label at any ink colour.
 */
const LIGHTEN_CEILING = 0.34;

function lighten(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

// Draw the % inside each slice large enough to fit it.
const sliceLabels: Plugin<'pie'> = {
  id: 'sliceLabels',
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    const values = chart.data.datasets[0].data as number[];
    const total = values.reduce((s, v) => s + v, 0);
    const ctx = chart.ctx;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    meta.data.forEach((arc, i) => {
      const pct = values[i] / total;
      if (pct < 0.04) return; // skip slivers
      const pos = (arc as any).tooltipPosition();
      // Dark ink, not white: the Lyka layer hues are light (Bright Teal,
      // Tangerine, Orange) and white labels fail on all three.
      ctx.fillStyle = LYKA.tealDeepest;
      ctx.font = 'bold 12px "DM Sans", sans-serif';
      ctx.fillText(`${(pct * 100).toFixed(1)}%`, pos.x, pos.y - 7);
      ctx.font = '10px "DM Sans", sans-serif';
      ctx.fillText(`$${Math.round(values[i] / 1000)}k`, pos.x, pos.y + 7);
    });
    ctx.restore();
  },
};

const BudgetPieChart: React.FC = () => {
  const { data, channels } = useMemo(() => {
    const channels = PLAN_LAYERS.flatMap((layer) =>
      layer.rows.map((row, idx) => ({
        label: row.channel,
        value: row.budget,
        color: lighten(LAYER_COLORS[layer.key].base, (idx / Math.max(1, layer.rows.length)) * LIGHTEN_CEILING),
      })),
    );
    const data: ChartData<'pie'> = {
      labels: channels.map((c) => c.label),
      datasets: [
        {
          data: channels.map((c) => c.value),
          backgroundColor: channels.map((c) => c.color),
          borderColor: CHART_SEPARATOR,
          borderWidth: 2,
          hoverOffset: 18,
          hoverBorderColor: CHART_SEPARATOR,
          hoverBorderWidth: 3,
        },
      ],
    };
    return { data, channels };
  }, []);

  const options = useMemo<ChartOptions<'pie'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          // Chart.js defaults legend text to #666, which is off brand on cream.
          labels: { boxWidth: 12, boxHeight: 12, font: { size: 11 }, padding: 8, usePointStyle: true, pointStyle: 'rectRounded', color: CHART_INK },
        },
        tooltip: {
          callbacks: {
            label: (c) => {
              const v = Number(c.parsed);
              return `${c.label}: $${v.toLocaleString('en-AU')} (${((v / MEDIA_TOTAL) * 100).toFixed(1)}%)`;
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
        Budget allocation by media channel. Share of working media (${MEDIA_TOTAL.toLocaleString('en-AU')}).
      </p>
      <div style={{ height: 'min(58vh, 460px)' }}>
        <Pie data={data} options={options} plugins={[sliceLabels]} />
      </div>
    </div>
  );
};

export default BudgetPieChart;
