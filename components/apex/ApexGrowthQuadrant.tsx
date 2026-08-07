import React from 'react';
import { LYKA } from '../../data/brand';
import { TYPE, svgFont } from '../../data/type';
import { useElementSize } from '../../hooks/useElementSize';
import {
  ApexTable,
  QuadrantKey,
  QUADRANTS,
  QUAD_STYLES,
  TIER_COLOURS,
  REACH_THRESHOLD,
  INDEX_THRESHOLD,
  SOURCE_CREDIT,
} from '../../data/apexData';
import { placeLabels } from './labelPlacement';
import type { Rect } from './labelPlacement';

// The Growth Quadrant: the PPTX slide 5 view, ported from the APEX by SPEED
// Tool's GrowthQuadrant.tsx and restyled to Lyka tokens. X = addressable
// reach %, Y = True Net Worth Index, dividers at 40% reach and index 100,
// adapted from the Boston Consulting Group framework. Plain SVG, no chart
// library, same as the sunburst.
//
// TYPE SIZES ARE COMPENSATED. The SVG scales to its container, so a declared
// fontSize is not a rendered size (the documented trap). Every text size here
// goes through svgFont() against the measured container width, and the label
// placement pass receives box sizes derived from the SAME compensated fonts,
// so the collision maths stay true at every container width. Below MIN_W the
// card scrolls horizontally instead of compensating further.

interface Props {
  table: ApexTable;
}

const VB_W = 760;
const VB_H = 500;
const M = { top: 44, right: 28, bottom: 52, left: 60 };
const PLOT_W = VB_W - M.left - M.right;
const PLOT_H = VB_H - M.top - M.bottom;
/** Matches the svg's min-w below: the width compensation never sees less. */
const MIN_W = 560;

const DOT_R = 6;
/** Average glyph advance as a fraction of font size, DM Sans at these weights. */
const CHAR_W_RATIO = 0.55;
/**
 * Character budget per action line. 30, not the tool's 38: the compensated
 * font makes a line LONGER in user units as the container narrows, and at
 * 1280 a 38 character line from the influence booster corner ran into the
 * BVOD dot. The corner block's height is computed from the actual wrapped
 * line count, so a third line is accounted for everywhere it matters.
 */
const ACTION_CHARS = 30;

function wrapAction(text: string, maxChars = ACTION_CHARS): string[] {
  const lines: string[] = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= maxChars || !line) line = next;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const QUAD_KEYS = Object.keys(QUADRANTS) as QuadrantKey[];

// The param is annotated DIRECTLY, not only via React.FC. @types/react is not
// installed in this app, so 'react' is an untyped module and a React.FC<Props>
// annotation is decorative: the props would be silently `any`, and passing type
// arguments to anything derived from them trips TS2347. `({ table }: Props)`
// restores real typing for the whole body.
const ApexGrowthQuadrant: React.FC<Props> = ({ table }: Props) => {
  const [measureRef, measured] = useElementSize<HTMLDivElement>();
  const containerW = Math.max(measured?.width ?? 0, MIN_W);

  // Compensated font sizes, in viewBox user units.
  const fLabel = svgFont(TYPE.meta, containerW, VB_W); // dot labels
  const fQuad = svgFont(TYPE.label, containerW, VB_W); // quadrant names
  const fAction = svgFont(TYPE.meta, containerW, VB_W); // quadrant action lines
  const fTick = svgFont(TYPE.meta, containerW, VB_W); // axis tick values
  const fAxis = svgFont(TYPE.label, containerW, VB_W); // axis titles

  const labelH = fLabel * 1.25;
  const actionLineH = fAction * 1.15;

  const rows = table.rows;

  // Y range: always show the 100 line with headroom above the strongest channel.
  const maxIndex = Math.max(INDEX_THRESHOLD + 40, ...rows.map((r) => r.tnwIndex));
  const yMax = Math.ceil(maxIndex / 20) * 20;

  const xOf = (reach: number) => M.left + (Math.min(100, Math.max(0, reach)) / 100) * PLOT_W;
  const yOf = (index: number) => M.top + PLOT_H - (Math.min(yMax, Math.max(0, index)) / yMax) * PLOT_H;

  const xDiv = xOf(REACH_THRESHOLD);
  const yDiv = yOf(INDEX_THRESHOLD);

  const xTicks = [0, 20, 40, 60, 80, 100];
  const yTicks = [0, 50, 100, 150, yMax].filter((v, i, a) => a.indexOf(v) === i && v <= yMax);

  // Each corner's quadrant label + action copy is a no-go zone for dot labels.
  // Derived from the same offsets and the same wrapped lines the text renders
  // with, so the block grows when a sentence takes a third line.
  const quadLines: Record<QuadrantKey, string[]> = Object.fromEntries(
    QUAD_KEYS.map((k) => [k, wrapAction(QUADRANTS[k].action)]),
  ) as Record<QuadrantKey, string[]>;
  const quadLabelY = (k: QuadrantKey): number =>
    QUADRANTS[k].highIndex
      ? M.top + fQuad + 6
      : M.top + PLOT_H - 6 - quadLines[k].length * actionLineH - fQuad + actionLineH * 0.4;
  const textBlockW = ACTION_CHARS * CHAR_W_RATIO * fAction;
  const obstacles: Rect[] = QUAD_KEYS.map((k) => {
    const labelY = quadLabelY(k);
    const x = QUADRANTS[k].highReach ? M.left + PLOT_W - 8 - textBlockW : M.left + 8;
    return { x, y: labelY - fQuad, w: textBlockW, h: fQuad + 4 + actionLineH * quadLines[k].length + 2 };
  });

  // Full channel names, positioned so none overlaps another, covers a dot, sits
  // on the quadrant copy, or leaves the frame.
  const labels = placeLabels(
    rows.map((r) => ({
      id: r.channel,
      cx: xOf(r.addressableReach),
      cy: yOf(r.tnwIndex),
      w: r.channel.length * CHAR_W_RATIO * fLabel,
      h: labelH,
    })),
    {
      bounds: { x: M.left, y: M.top, w: VB_W - 4 - M.left, h: PLOT_H },
      gap: 3,
      dotR: DOT_R,
      obstacles,
    },
  );

  // Counts per quadrant, for the key under the chart.
  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.quadrant] = (acc[r.quadrant] ?? 0) + 1;
    return acc;
  }, {});

  const usedTiers = [...new Set(rows.map((r) => r.tier))];

  return (
    <div className="mt-2 rounded-2xl bg-white shadow-sm border border-[#DBE6DC] overflow-hidden">
      <div className="px-4 md:px-6 pt-5">
        <h3 className="text-base md:text-lg font-semibold" style={{ color: LYKA.tealDeepest }}>
          {table.label} | Growth Quadrant
        </h3>
        <p className="text-xs md:text-sm mt-0.5" style={{ color: LYKA.muted }}>
          Addressable reach vs True Net Worth Index | dividers at {REACH_THRESHOLD}% reach and index {INDEX_THRESHOLD} | adapted
          from the Boston Consulting Group framework
        </p>
      </div>

      <div ref={measureRef} className="px-2 md:px-4 py-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full min-w-[560px]"
          role="img"
          aria-label={`${table.label} Growth Quadrant scatter chart`}
        >
          {/* quadrant tints */}
          <rect x={xDiv} y={M.top} width={M.left + PLOT_W - xDiv} height={yDiv - M.top} fill={QUAD_STYLES['must-win'].tint} />
          <rect x={M.left} y={M.top} width={xDiv - M.left} height={yDiv - M.top} fill={QUAD_STYLES['influence-booster'].tint} />
          <rect x={xDiv} y={yDiv} width={M.left + PLOT_W - xDiv} height={M.top + PLOT_H - yDiv} fill={QUAD_STYLES['reach-booster'].tint} />
          <rect x={M.left} y={yDiv} width={xDiv - M.left} height={M.top + PLOT_H - yDiv} fill={QUAD_STYLES.tangential.tint} />

          {/* quadrant labels + the action to take, inside each region, so the
              chart reads on its own without a key */}
          {QUAD_KEYS.map((k) => {
            const q = QUADRANTS[k];
            const right = q.highReach;
            const x = right ? M.left + PLOT_W - 8 : M.left + 8;
            const labelY = quadLabelY(k);
            const actionY = labelY + fQuad + 4;
            return (
              <g key={k}>
                <text
                  x={x}
                  y={labelY}
                  textAnchor={right ? 'end' : 'start'}
                  style={{ fontSize: fQuad, fontWeight: 700, fill: QUAD_STYLES[k].ink }}
                >
                  {q.label}
                </text>
                {quadLines[k].map((line, i) => (
                  <text
                    key={i}
                    x={x}
                    y={actionY + i * actionLineH}
                    textAnchor={right ? 'end' : 'start'}
                    style={{ fontSize: fAction, fontWeight: 600, fill: LYKA.ink }}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* axes frame */}
          <rect x={M.left} y={M.top} width={PLOT_W} height={PLOT_H} fill="none" stroke={LYKA.mint} strokeWidth={1} />
          {/* dividers */}
          <line x1={xDiv} y1={M.top} x2={xDiv} y2={M.top + PLOT_H} stroke={LYKA.muted} strokeWidth={1.5} strokeDasharray="5 4" />
          <line x1={M.left} y1={yDiv} x2={M.left + PLOT_W} y2={yDiv} stroke={LYKA.muted} strokeWidth={1.5} strokeDasharray="5 4" />

          {/* x ticks */}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={xOf(t)} y1={M.top + PLOT_H} x2={xOf(t)} y2={M.top + PLOT_H + 5} stroke={LYKA.muted} />
              <text x={xOf(t)} y={M.top + PLOT_H + 6 + fTick} textAnchor="middle" style={{ fontSize: fTick, fill: LYKA.muted }}>
                {t}%
              </text>
            </g>
          ))}
          {/* y ticks */}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={M.left - 5} y1={yOf(t)} x2={M.left} y2={yOf(t)} stroke={LYKA.muted} />
              <text x={M.left - 9} y={yOf(t) + fTick * 0.35} textAnchor="end" style={{ fontSize: fTick, fill: LYKA.muted }}>
                {t}
              </text>
            </g>
          ))}

          {/* axis titles */}
          <text
            x={M.left + PLOT_W / 2}
            y={VB_H - 10}
            textAnchor="middle"
            style={{ fontSize: fAxis, fontWeight: 600, fill: LYKA.ink }}
          >
            Addressable reach %
          </text>
          <text
            transform={`translate(16 ${M.top + PLOT_H / 2}) rotate(-90)`}
            textAnchor="middle"
            style={{ fontSize: fAxis, fontWeight: 600, fill: LYKA.ink }}
          >
            Attention | True Net Worth Index
          </text>

          {/* points, then their full names at the placed positions */}
          {rows.map((r, i) => {
            const cx = xOf(r.addressableReach);
            const cy = yOf(r.tnwIndex);
            const box = labels[i];
            const tip = `${r.channel}: reach ${r.addressableReach.toFixed(1)}%, index ${r.tnwIndex} (${QUADRANTS[r.quadrant].label})`;
            return (
              <g key={r.channel}>
                <circle cx={cx} cy={cy} r={DOT_R} fill={TIER_COLOURS[r.tier].bg} stroke="#fff" strokeWidth={1.5}>
                  <title>{tip}</title>
                </circle>
                {/* a hairline from dot to label when the label had to move off centre */}
                {Math.abs(box.y + box.h / 2 - cy) > labelH && (
                  <line
                    x1={cx}
                    y1={cy}
                    x2={box.side === 'right' ? box.x : box.x + box.w}
                    y2={box.y + box.h / 2}
                    stroke={LYKA.mint}
                    strokeWidth={1}
                  />
                )}
                <text x={box.x} y={box.y + labelH - fLabel * 0.25} style={{ fontSize: fLabel, fill: LYKA.ink }}>
                  {r.channel}
                  <title>{tip}</title>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* tier legend + quadrant counts. The action per quadrant is printed
          inside its own region above, so it is not repeated here. */}
      <div className="px-4 md:px-6 pb-4 space-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {usedTiers.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-xs" style={{ color: LYKA.muted }}>
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: TIER_COLOURS[t].bg }} />
              {TIER_COLOURS[t].label}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs" style={{ color: LYKA.muted }}>
          {QUAD_KEYS.map((k) => (
            <span key={k} className="whitespace-nowrap">
              <span className="font-semibold" style={{ color: QUAD_STYLES[k].ink }}>
                {QUADRANTS[k].label}
              </span>
              : {counts[k] ?? 0} channel{(counts[k] ?? 0) === 1 ? '' : 's'}
            </span>
          ))}
        </div>
      </div>

      {/* Footnote, same treatment as the table's */}
      <div className="px-4 md:px-6 py-3 md:py-4 text-[11px] md:text-xs text-[#5B6E64] leading-relaxed border-t border-[#DBE6DC] bg-[#F9F6F1]">
        Sources: {SOURCE_CREDIT}. Addressable reach is a different Roy Morgan measure from Heavy reach %:
        the share of the audience each channel can reach in the recent window.
      </div>
    </div>
  );
};

export default ApexGrowthQuadrant;
