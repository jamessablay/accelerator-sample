import React from 'react';
import { PLAN_LAYERS, MONTHS, MEDIA_TOTAL, MediaRow, PlanLayer } from '../../data/mediaPlanData';
import { LAYER_COLORS, OWNER_COLORS, LYKA, CHART_GRID } from '../../data/brand';

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

/**
 * Contiguous runs of active months. SPEED rows derive activity from spend;
 * in-house rows have no dollars, so they declare `activeMonths` instead.
 */
function activeRuns(active: boolean[]): { start: number; len: number }[] {
  const runs: { start: number; len: number }[] = [];
  let i = 0;
  while (i < active.length) {
    if (active[i]) {
      let j = i;
      while (j < active.length && active[j]) j++;
      runs.push({ start: i, len: j - i });
      i = j;
    } else {
      i++;
    }
  }
  return runs;
}

// Bars are OWNER coloured (green = Lyka in house, red = SPEED managed), per the
// client's legend. The rail keeps the STAGE colour; the two never encode the
// same dimension.
const GanttTrack: React.FC<{ row: MediaRow; onClick: () => void }> = ({ row, onClick }) => {
  const runs = activeRuns(row.activeMonths ?? row.monthly.map((v) => (v || 0) > 0));
  const color = OWNER_COLORS[row.owner].base;
  return (
    <div
      className="relative h-7 my-0.5 rounded-md cursor-pointer group"
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
              height: '16px',
              backgroundColor: color,
              boxShadow: '0 1px 2px rgba(0,86,72,0.18)',
            }}
          />
        );
      })}
    </div>
  );
};

const ChannelRow: React.FC<{ row: MediaRow; onSelect: () => void }> = ({ row, onSelect }) => (
  <div className="grid items-center border-b hover:bg-[#F9F6F1]" style={{ gridTemplateColumns: ROW_COLS, borderColor: LYKA.mint }}>
    {/* Media */}
    <div className="py-1.5 pr-3 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[13px] leading-tight" style={{ color: LYKA.ink }}>{row.channel}</span>
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
    <GanttTrack row={row} onClick={onSelect} />

    {/* Budget: in-house rows carry no dollars, and "In house" is also the
        non-colour encoding of the green/red legend. */}
    {row.owner === 'lyka' ? (
      <div className="text-right pr-3 text-xs font-medium" style={{ gridColumn: '14', color: OWNER_COLORS.lyka.base }}>
        In house
      </div>
    ) : (
      <div className="text-right pr-3 text-sm font-semibold tabular-nums" style={{ gridColumn: '14', color: LYKA.ink }}>
        {fmtMoney(row.budget)}
      </div>
    )}

    {/* % */}
    <div className="text-right pr-1 text-xs tabular-nums" style={{ gridColumn: '15', color: LYKA.muted }}>
      {row.owner === 'lyka' ? '' : pctOf(row.budget)}
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
        title={layer.blurb}
      >
        <span
          className={`font-display ${nameSize} whitespace-nowrap`}
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: railInk }}
        >
          {layer.key}
          {/* An all in-house stage has no SPEED dollars: the name alone fits a
              1-row rail, "| 0.0%" does not, and would also read as an error. */}
          {layerTotal > 0 && (
            <span className="font-sans font-semibold text-[10px] tabular-nums" style={{ color: railInk, opacity: 0.85 }}> | {layerPct}</span>
          )}
        </span>
      </div>

      {/* Rows */}
      <div className="flex-1 min-w-0 px-3">
        {layer.rows.map((row) => (
          <ChannelRow key={row.channel} row={row} onSelect={() => onSelectChannel(row)} />
        ))}
      </div>
    </div>
  );
};

/** The client-requested key to the bar colours, at the bottom of the plan. */
const OwnerLegend: React.FC = () => (
  <div className="flex items-center justify-center gap-8 py-2.5 border-t" style={{ borderColor: LYKA.mint, backgroundColor: LYKA.ivory }}>
    <span className="flex items-center gap-2">
      <span className="inline-block w-7 h-3.5 rounded" style={{ backgroundColor: OWNER_COLORS.speed.base }} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: LYKA.ink, fontFamily: '"DM Mono", monospace' }}>
        SPEED managed
      </span>
    </span>
    <span className="flex items-center gap-2">
      <span className="inline-block w-7 h-3.5 rounded" style={{ backgroundColor: OWNER_COLORS.lyka.base }} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: LYKA.ink, fontFamily: '"DM Mono", monospace' }}>
        Lyka in house
      </span>
    </span>
  </div>
);

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

      {/* Bar colour legend */}
      <OwnerLegend />
    </div>
  );
};

export default MacroBlockPlan;
