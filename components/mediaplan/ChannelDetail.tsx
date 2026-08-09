import React, { useCallback, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Plugin,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MONTHS, MEDIA_TOTAL, MediaRow, LayerKey, OwnerKey } from '../../data/mediaPlanData';
import { LAYER_COLORS, OWNER_COLORS, LYKA, CHART_MUTED, CHART_GRID, CHART_SEPARATOR } from '../../data/brand';
import { TRACKING } from '../../data/type';
import Lightbox from '../shared/Lightbox';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * Pop-up accent. SPEED rows keep their STAGE accent, for continuity with the
 * funnel rail and both budget charts. In-house rows take the OWNER green, so
 * the pop-up matches the green bar that was clicked (and never lands on the
 * deliberately quiet TRY IT / SHARE IT rail fills, which cannot carry text on
 * a white card).
 *
 * `line` fills the strip and decorates; `ink` is the text ON `line`; `text`
 * is the stage-flavoured heading and chart stroke on the WHITE card. `line`
 * hues like SHOW IT teal are 2.62:1 on white, fine as a fill, too faint as a
 * heading or a data stroke (the 3:1 stroke floor documented on TEN_THINGS),
 * which is why `text` exists.
 */
const accentFor = (key: LayerKey, owner: OwnerKey) => {
  if (owner === 'lyka') {
    return { line: OWNER_COLORS.lyka.base, area: OWNER_COLORS.lyka.area, ink: OWNER_COLORS.lyka.ink, text: OWNER_COLORS.lyka.base };
  }
  const headingFor: Record<LayerKey, string> = {
    'SHOW IT': '#0A7D68',  // 4.89:1 on white; the teal band's established stroke tone
    'CHECK IT': '#B8571C', // 4.70:1; the warm band's established stroke tone
    'PROVE IT': '#B8571C',
    'TRY IT': '#003D33',   // unreachable (no SPEED rows), typed for totality
    'SHARE IT': '#003D33',
  };
  return { line: LAYER_COLORS[key].base, area: LAYER_COLORS[key].area, ink: LAYER_COLORS[key].ink, text: headingFor[key] };
};

const money = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;

const MagnifyIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

interface CreativeCardProps {
  src: string;
  alt: string;
  accent: string;
  onClick: () => void;
  /** Small label rendered in the card footer (e.g. platform name). */
  label?: string;
  /** Italic pull-quote rendered above the card (Social formats). */
  quote?: string;
  /** Fixed height of the image mat, in px. */
  boxHeight: number;
  className?: string;
  style?: React.CSSProperties;
}

/** A framed, hover-lifting gallery card that opens the lightbox on click. */
const CreativeCard: React.FC<CreativeCardProps> = ({ src, alt, accent, onClick, label, quote, boxHeight, className, style }) => (
  <div className={`flex flex-col ${className ?? ''}`} style={style}>
    {quote && <p className="mb-2 text-center text-xs font-medium italic leading-snug text-[#5B6E64]">&ldquo;{quote}&rdquo;</p>}
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-1 cursor-zoom-in flex-col overflow-hidden rounded-xl border border-[#DBE6DC] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#A9C3B4] hover:shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] focus:outline-none"
      aria-label={`Enlarge ${alt}`}
    >
      <div className="relative flex flex-shrink-0 items-center justify-center p-4" style={{ height: boxHeight, backgroundColor: LYKA.ivory }}>
        <img src={src} alt={alt} className="h-full w-full object-contain" />
        <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#003D33]/60 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <MagnifyIcon />
        </span>
      </div>
      {label && (
        <p className="flex flex-1 items-center justify-center border-t border-[#DBE6DC] px-2 py-2 text-center text-[10px] font-bold uppercase leading-snug tracking-[0.12em] text-[#5B6E64]">{label}</p>
      )}
      <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" style={{ backgroundColor: accent }} />
    </button>
  </div>
);

// Draw the spend value above each point (replaces chartjs-plugin-datalabels).
const pointLabels: Plugin<'line'> = {
  id: 'pointLabels',
  afterDatasetsDraw(chart) {
    const meta = chart.getDatasetMeta(0); // dataset 0 = spend line
    if (!meta || meta.hidden) return;
    const ctx = chart.ctx;
    const values = chart.data.datasets[0].data as number[];
    ctx.save();
    ctx.font = 'bold 9px "DM Sans", sans-serif';
    ctx.fillStyle = CHART_MUTED;
    ctx.textAlign = 'center';
    meta.data.forEach((pt, i) => {
      if (!values[i]) return;
      ctx.fillText(money(values[i]), pt.x, pt.y - 10);
    });
    ctx.restore();
  },
};

interface ChannelDetailProps {
  row: MediaRow;
  layerKey: LayerKey;
}

const ChannelDetail: React.FC<ChannelDetailProps> = ({ row, layerKey }) => {
  const accent = accentFor(layerKey, row.owner);
  const inHouse = row.owner === 'lyka';
  const images = row.images ?? [];
  const d = row.detail ?? {};
  const [zoomed, setZoomed] = useState<string | null>(null);
  // Stable, because Lightbox's Escape effect depends on it. An inline arrow would
  // tear down and re-add the capture listener on every parent render.
  const closeZoom = useCallback(() => setZoomed(null), []);

  /**
   * The five rationale rows, in the client's stated reading order:
   * Strategy, Role of Channel, Implementation, Assets, Key metrics.
   *
   * TWO CHANGES HERE WERE CLIENT DIRECTION, and both are labelling rather than
   * content: every string below already came from the briefing workbook.
   *
   * `role` is the workbook's own "Role of the Channel" column (D) and it was
   * ALREADY on all 21 funded rows, but it rendered as an unlabelled paragraph
   * above this table. Unlabelled, it read as an intro to the channel rather
   * than as one of the five rationale fields, so the report back was that Role
   * of Channel was missing from every rationale. **A field with no label is a
   * field nobody can find.** It is a labelled row now, second, and the
   * paragraph is gone.
   *
   * `comesToLife` is the workbook's "How It Comes to Life" column (E). It was
   * labelled "Activation"; the client asked for "Implementation" instead.
   *
   * The order is the CLIENT'S, not the workbook's: the sheet runs Consumer
   * Journey, Assets, Role of the Channel, How It Comes to Life, so Assets moves
   * down two and Role of Channel up one. Do not "restore" the sheet order.
   */
  const tableRows: [string, string | undefined][] = [
    ['Strategy', d.strategyLink],
    ['Role of Channel', d.role],
    ['Implementation', d.comesToLife],
    ['Assets', d.assets ?? row.assets],
    ['Key metrics', d.metrics],
  ];
  const visibleRows = tableRows.filter(([, v]) => v && v.trim().length > 0);
  // The TRY IT and SHARE IT rows carry no description copy at all (their
  // description sheets are hidden in the briefing workbook, excluded per
  // client direction), so the whole rationale block goes, not just its rows.
  // `role` is inside `tableRows` now, so this is simply "are there any rows".
  const hasCopy = visibleRows.length > 0;

  const paired = !!row.pairedImages && images.length > 0;
  const activeMonths = row.activeMonths ?? row.monthly.map((v) => (v || 0) > 0);

  const dataMax = Math.max(...row.monthly);
  const step = dataMax > 500000 ? 100000 : dataMax > 100000 ? 20000 : 5000;
  const yAxisMax = Math.ceil((dataMax * 1.35) / step) * step;

  const chartData = useMemo<ChartData<'line'>>(
    () => ({
      labels: [...MONTHS],
      datasets: [
        {
          label: `${row.channel} spend`,
          data: [...row.monthly],
          fill: true,
          backgroundColor: accent.area,
          // The stage `line` hues are fills, not strokes (SHOW IT teal is
          // 2.62:1 on white): the data line uses the stroke-safe `text` tone,
          // same pattern as TEN_THINGS seriesFill + seriesInk.
          borderColor: accent.text,
          pointBackgroundColor: accent.text,
          pointBorderColor: CHART_SEPARATOR,
          pointRadius: 3,
          tension: 0.1,
        },
      ],
    }),
    [row, accent],
  );

  const chartOptions = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 22 } },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => `Cost: ${money(Number(c.parsed.y))}` } },
      },
      scales: {
        y: { beginAtZero: true, max: yAxisMax, ticks: { callback: (v) => `$${Number(v) / 1000}k`, font: { size: 11 }, color: CHART_MUTED }, grid: { color: CHART_GRID } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    }),
    [yAxisMax],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Themed strip. Text on the fill comes from the paired ink token, never
          a hardcoded white: white on the stage hues is as low as 2.34:1. */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: accent.line }}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: accent.ink, opacity: 0.92 }}>{layerKey}</span>
        {/* The owner pill ties the pop-up back to the bar colour and the legend. */}
        {inHouse ? (
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white" style={{ color: OWNER_COLORS.lyka.base }}>
            Lyka in house
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: OWNER_COLORS.speed.base, color: OWNER_COLORS.speed.ink }}>
            SPEED managed
          </span>
        )}
        {inHouse ? (
          <span className="ml-auto text-sm font-semibold" style={{ color: accent.ink }}>Managed and funded by Lyka's in house team</span>
        ) : row.budgetLabel ? (
          /* A SPEED row substituting a word for its figure. The "% of media"
             line goes with it, for the same reason the grid's % cell blanks:
             the share alone reconstructs the dollars. The flighting chart
             below is unaffected, since it plots shape rather than a total. */
          <span className="ml-auto text-lg font-bold" style={{ color: accent.ink }}>{row.budgetLabel}</span>
        ) : (
          <>
            <span className="ml-auto text-lg font-bold" style={{ color: accent.ink }}>{money(row.budget)}</span>
            <span className="text-xs" style={{ color: accent.ink, opacity: 0.85 }}>{((row.budget / MEDIA_TOTAL) * 100).toFixed(1)}% of media</span>
          </>
        )}
        {row.provisional && <span className="w-full text-xs font-semibold" style={{ color: accent.ink, opacity: 0.92 }}>Performance still being finalised. Figures are provisional.</span>}
      </div>

      {/* Rationale + execution table */}
      {hasCopy && (
        <div>
          <h3 className="text-base font-bold mb-3" style={{ color: accent.text }}>{row.channel} rationale</h3>
          {visibleRows.length > 0 && (
            <div className="rounded-lg overflow-hidden border border-[#DBE6DC]">
              {/* 150px, not the old 110px, and the number is MEASURED rather than
                  taste. The two new labels are the longest in the set, and
                  "IMPLEMENTATION" is a single unbreakable token, so it cannot
                  wrap out of an undersized cell the way "KEY METRICS" can: it
                  would simply overflow. At 11px bold uppercase + 0.025em it
                  needs 102.8px in Arial Bold and 118.3px in the widest bold
                  sans on this machine, and DM Sans Bold is narrower than both.
                  150px leaves 126px after `px-3`, clearing even that upper
                  bound. The old 110px left 86px and would have clipped it. */}
              {visibleRows.map(([label, value], i) => (
                <div key={label} className={`grid grid-cols-[150px_1fr] ${i < visibleRows.length - 1 ? 'border-b border-[#DBE6DC]' : ''}`}>
                  <div className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white flex items-start" style={{ backgroundColor: 'var(--lyka-teal-deep)' }}>
                    {label}
                  </div>
                  <div className="px-3 py-2.5 text-sm text-[#143C33] leading-relaxed">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Example creative: framed gallery cards, click any to enlarge */}
      {images.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-px w-6 flex-shrink-0" style={{ backgroundColor: accent.line }} />
            <span className="font-mono text-micro font-medium uppercase" style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.muted }}>Examples</span>
            {/* Was #A9C3B4 at 1.88:1 on white, and lowercase prose at 11px. `meta` 12 in muted is 5.44:1. */}
            <span className="text-meta italic" style={{ color: LYKA.muted }}>tap to enlarge</span>
          </div>
          <div className="mx-auto max-w-4xl">
            {paired ? (
              <div className="grid grid-cols-2 gap-5">
                {images.map((src, i) => (
                  <CreativeCard
                    key={src}
                    src={src}
                    alt={`${row.channel} example ${i + 1}`}
                    accent={accent.line}
                    onClick={() => setZoomed(src)}
                    quote={row.captions?.[i]}
                    boxHeight={420}
                  />
                ))}
              </div>
            ) : row.stackedImages ? (
              <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
                {images.map((src, i) => {
                  const small = !!row.stackedFirstSmall && i === 0;
                  return (
                    <CreativeCard
                      key={src}
                      src={src}
                      alt={`${row.channel} example ${i + 1}`}
                      accent={accent.line}
                      onClick={() => setZoomed(src)}
                      boxHeight={small ? 130 : 380}
                      className={small ? 'w-1/2' : 'w-full'}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-row items-stretch justify-center gap-4">
                {images.map((src, i) => {
                  const weight = row.imageWeights?.[i] ?? 1;
                  return (
                    <CreativeCard
                      key={src}
                      src={src}
                      alt={`${row.channel} example ${i + 1}`}
                      accent={accent.line}
                      onClick={() => setZoomed(src)}
                      label={row.captions?.[i]}
                      boxHeight={230}
                      className="min-w-0"
                      style={{ flexGrow: weight, flexBasis: 0 }}
                    />
                  );
                })}
              </div>
            )}

            {/* Optional second row of examples (e.g. screen mock-ups) */}
            {row.extraImages && row.extraImages.length > 0 && (
              <div className="mt-4 flex flex-row items-stretch justify-center gap-4">
                {row.extraImages.map((src, i) => (
                  <CreativeCard
                    key={src}
                    src={src}
                    alt={`${row.channel} example ${images.length + i + 1}`}
                    accent={accent.line}
                    onClick={() => setZoomed(src)}
                    label={row.extraCaptions?.[i]}
                    boxHeight={240}
                    className="min-w-0"
                    style={{ flexGrow: 1, flexBasis: 0 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flighting. Two rows get the dollar-free month strip instead of the
          spend chart: in-house rows, which have no dollars at all (the client
          chose flighting only for them), and a `budgetLabel` row, whose dollars
          exist but are deliberately not on display.
          **THE SECOND CASE IS THE WHOLE POINT.** The chart prints its values
          above each point, tooltips them as "Cost: $50,000" and scales its y
          axis in thousands, so charting a row whose Budget cell reads "Package"
          would hand the figure straight back, in the same pop-up, a few inches
          below the label hiding it.
          The strip is OWNER COLOURED, so it still matches the bar that was
          clicked: green for in house, red for a SPEED package row. */}
      {inHouse || row.budgetLabel ? (
        <div>
          <h3 className="text-base font-bold" style={{ color: accent.text }}>Flighting: {row.channel}</h3>
          <p className="text-sm italic text-[#5B6E64] mb-2">
            {inHouse
              ? 'Active months, Oct to Sep, shaded by presence. Run by Lyka in house, so no SPEED media investment is shown.'
              : `Active months, Oct to Sep, shaded by presence. Reported as ${row.budgetLabel.toLowerCase()}, so no monthly investment is charted.`}
          </p>
          <div className="grid grid-cols-12 gap-1.5">
            {MONTHS.map((m, i) => {
              // Same encoding as the gantt bar, so the pop-up and the grid agree.
              const w = activeMonths[i] ? row.weight[i] ?? 'medium' : null;
              return (
                <div
                  key={m}
                  className="rounded-md py-2 text-center text-meta font-semibold"
                  title={w ? `${m}: ${w} presence` : `${m}: not running`}
                  style={
                    w
                      ? { backgroundColor: OWNER_COLORS[row.owner].weight[w], color: OWNER_COLORS[row.owner].ink }
                      // An inactive month is quiet, not invisible: mintMuted was
                      // 1.75:1 on ivory. muted is 5.06:1 and still reads as off.
                      : { backgroundColor: LYKA.ivory, color: LYKA.muted }
                  }
                >
                  {m}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-base font-bold" style={{ color: accent.text }}>Flighting: {row.channel}</h3>
          <p className="text-sm italic text-[#5B6E64] mb-2">Spend by month, Oct to Sep</p>
          <div className="rounded-xl border border-[#DBE6DC] p-3" style={{ height: 320 }}>
            <Line data={chartData} options={chartOptions} plugins={[pointLabels]} />
          </div>
        </div>
      )}

      {/* Click-to-enlarge. Extracted to components/shared/Lightbox.tsx so the Ten
          Things postcode maps use the same one; that move added Escape and focus
          restore, which this gallery never had. Still portalled to body, so it
          escapes the modal's transformed / overflow-hidden box. */}
      <Lightbox src={zoomed} alt="Enlarged example" onClose={closeZoom} />
    </div>
  );
};

export default ChannelDetail;
