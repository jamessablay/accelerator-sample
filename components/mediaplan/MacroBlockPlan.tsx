import React from 'react';
import { PLAN_LAYERS, MONTHS, MEDIA_TOTAL, MediaRow, PlanLayer } from '../../data/mediaPlanData';
import { LAYER_COLORS, LYKA, CHART_GRID } from '../../data/brand';

interface MacroBlockPlanProps {
  onSelectChannel: (row: MediaRow) => void;
  onShowBudget: () => void;
  onShowPct: () => void;
}

// Grid template shared by the header and each channel row (after the funnel rail).
// 220px media/assets | 12 equal month tracks | 120px budget | 64px %
const ROW_COLS = '220px repeat(12, minmax(0, 1fr)) 120px 64px';
const RAIL_W = 44;

const fmtMoney = (n: number) => `$${n.toLocaleString('en-AU')}`;
const pctOf = (n: number) => `${((n / MEDIA_TOTAL) * 100).toFixed(1)}%`;

/** Contiguous runs of active (non-zero) months. */
function spendRuns(monthly: number[]): { start: number; len: number; total: number }[] {
  const runs: { start: number; len: number; total: number }[] = [];
  let i = 0;
  while (i < monthly.length) {
    if ((monthly[i] || 0) > 0) {
      let j = i;
      let total = 0;
      while (j < monthly.length && (monthly[j] || 0) > 0) {
        total += monthly[j];
        j++;
      }
      runs.push({ start: i, len: j - i, total });
      i = j;
    } else {
      i++;
    }
  }
  return runs;
}

const GanttTrack: React.FC<{ row: MediaRow; color: string; onClick: () => void }> = ({ row, color, onClick }) => {
  const runs = spendRuns(row.monthly);
  return (
    <div
      className="relative h-9 my-1 rounded-md cursor-pointer group"
      style={{
        gridColumn: '2 / 14',
        // 12 faint vertical guides to read the months against
        backgroundImage:
          `repeating-linear-gradient(to right, ${CHART_GRID} 0, ${CHART_GRID} 1px, transparent 1px, transparent calc(100%/12))`,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`${row.channel} flighting. Click for detail.`}
      title={`${row.channel} — click for detail`}
    >
      {runs.map((run, idx) => {
        const left = (run.start / 12) * 100;
        const width = (run.len / 12) * 100;
        return (
          <div
            key={idx}
            className="absolute top-1/2 -translate-y-1/2 rounded-md transition-transform duration-150 group-hover:brightness-110 group-hover:scale-y-110 flex items-center justify-center"
            style={{
              left: `calc(${left}% + 3px)`,
              width: `calc(${width}% - 6px)`,
              height: '20px',
              backgroundColor: color,
              boxShadow: '0 1px 2px rgba(0,86,72,0.18)',
            }}
          />
        );
      })}
    </div>
  );
};

const ChannelRow: React.FC<{ row: MediaRow; layer: PlanLayer; onSelect: () => void }> = ({ row, layer, onSelect }) => (
  <div className="grid items-center border-b hover:bg-[#F9F6F1]" style={{ gridTemplateColumns: ROW_COLS, borderColor: LYKA.mint }}>
    {/* Media */}
    <div className="py-2 pr-3 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm leading-tight" style={{ color: LYKA.ink }}>{row.channel}</span>
        {row.provisional && (
          <span
            className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: '#8C3D24' }}
            title="Performance still being finalised"
          >
            Pending
          </span>
        )}
      </div>
    </div>

    {/* Gantt */}
    <GanttTrack row={row} color={layer.color} onClick={onSelect} />

    {/* Budget */}
    <div className="text-right pr-3 text-sm font-semibold tabular-nums" style={{ gridColumn: '14', color: LYKA.ink }}>
      {fmtMoney(row.budget)}
    </div>

    {/* % */}
    <div className="text-right pr-1 text-xs tabular-nums" style={{ gridColumn: '15', color: LYKA.muted }}>
      {pctOf(row.budget)}
    </div>
  </div>
);

const LayerBlock: React.FC<{ layer: PlanLayer; onSelectChannel: (row: MediaRow) => void }> = ({ layer, onSelectChannel }) => {
  const layerTotal = layer.rows.reduce((s, r) => s + r.budget, 0);
  const layerPct = `${((layerTotal / MEDIA_TOTAL) * 100).toFixed(1)}%`;
  // The rail label runs vertically, so its available length is the rail HEIGHT,
  // which is driven by row count. Short rails get a smaller label. Derived from
  // rows.length rather than a hardcoded layer name so this survives a rename,
  // and stepped down overall because Poppins is far wider than the Bebas Neue
  // this replaced.
  const nameSize = layer.rows.length <= 2 ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm';
  // Text ON the rail: white fails on Tangerine (2.43:1) and Orange (2.34:1).
  const railInk = LAYER_COLORS[layer.key].ink;
  return (
    <div className="flex border-b-2" style={{ borderColor: LYKA.pageBg }}>
      {/* Funnel rail */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ width: RAIL_W, backgroundColor: layer.color }}
      >
        <span
          className={`font-display ${nameSize} whitespace-nowrap`}
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: railInk }}
        >
          {layer.key}
          <span className="font-sans font-semibold text-[10px] tabular-nums" style={{ color: railInk, opacity: 0.85 }}> | {layerPct}</span>
        </span>
      </div>

      {/* Rows */}
      <div className="flex-1 min-w-0 px-3">
        {layer.rows.map((row) => (
          <ChannelRow key={row.channel} row={row} layer={layer} onSelect={() => onSelectChannel(row)} />
        ))}
      </div>
    </div>
  );
};

const MacroBlockPlan: React.FC<MacroBlockPlanProps> = ({ onSelectChannel, onShowBudget, onShowPct }) => {
  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: LYKA.mint }}>
      {/* Header */}
      <div
        className="grid items-stretch text-white text-xs md:text-sm font-semibold"
        style={{ gridTemplateColumns: `${RAIL_W}px 220px repeat(12, minmax(0, 1fr)) 120px 64px`, backgroundColor: LYKA.tealDeepest }}
      >
        <div /> {/* rail spacer */}
        <div className="flex items-center px-1 py-3">Media</div>
        {MONTHS.map((m) => (
          <div key={m} className="flex items-center justify-center py-3 border-l border-white/10">{m}</div>
        ))}
        {/* Budget header = the clickable "breakdown" affordance */}
        <button
          type="button"
          onClick={onShowBudget}
          className="group/budget relative flex items-center justify-center px-3 py-2 cursor-pointer transition-all duration-200 ease-out hover:brightness-95 hover:shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          style={{ backgroundColor: LYKA.tangerine, color: LYKA.tealDeepest }}
          title="Click for the stacked monthly budget breakdown"
        >
          <span className="relative leading-none transition-transform duration-200 group-hover/budget:-translate-y-0.5">
            Budget
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-0.5 w-full -translate-x-1/2 origin-center scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/budget:scale-x-100" />
          </span>
        </button>
        <button
          type="button"
          onClick={onShowPct}
          className="group/pct relative flex items-center justify-center px-1 py-3 cursor-pointer transition-all duration-200 ease-out hover:brightness-95 hover:shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          style={{ backgroundColor: LYKA.tangerine, color: LYKA.tealDeepest }}
          title="Click for the budget percentage distribution"
        >
          <span className="relative leading-none transition-transform duration-200 group-hover/pct:-translate-y-0.5">
            %
            <span className="pointer-events-none absolute left-1/2 -bottom-1 h-0.5 w-full -translate-x-1/2 origin-center scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/pct:scale-x-100" />
          </span>
        </button>
      </div>

      {/* Layer blocks */}
      {PLAN_LAYERS.map((layer) => (
        <LayerBlock key={layer.key} layer={layer} onSelectChannel={onSelectChannel} />
      ))}
    </div>
  );
};

export default MacroBlockPlan;
