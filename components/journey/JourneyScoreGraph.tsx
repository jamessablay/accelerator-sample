import React, { useState } from 'react';
import { JourneyStageDetail } from '../../data/journeyDetailsData';
import { parseScoreValue, parseScoreData } from '../../data/journeyModel';
import { TYPE, TRACKING, svgFont } from '../../data/type';
import { FOCUS } from '../../data/brand';
import { useElementSize } from '../../hooks/useElementSize';

// -----------------------------------------------------------------------------
// The emotional and rational curves.
//
// THE PARSERS MOVED TO data/journeyModel.ts. They are unchanged, character for
// character, but more than one view needs the numbers now and a parser living
// inside a component is a duplication waiting to happen.
//
// EVERY PROP BELOW IS ADDITIVE AND OPTIONAL. Called with only `stages` this
// renders exactly what it always did, which matters because the original table
// is the baseline in the variant comparison.
// -----------------------------------------------------------------------------

interface JourneyScoreGraphProps {
  stages: JourneyStageDetail[];
  /**
   * Fixed y-domain. Defaults to a per-journey auto domain padded by 10, which is
   * fine in isolation but makes cross-journey comparison misleading: a curve
   * peaking at 65 and one peaking at 95 render at the same height. Pass
   * SHARED_SCORE_DOMAIN wherever more than one journey is on screen.
   */
  domain?: [number, number];
  /** Small multiple mode: shorter, no legend, smaller type. */
  compact?: boolean;
  /**
   * viewBox units per stage. Default 160.
   *
   * This is the aspect-ratio control, and it matters more than it looks. The SVG
   * scales to its container width, so height = containerWidth * (vbHeight /
   * vbWidth). At the default 160 the viewBox is 800 wide, and inside a 230px
   * small-multiple card that renders the curve about 40px tall, which is
   * unreadable. Drop this to around 52 for small multiples.
   */
  columnWidth?: number;
  /**
   * Stage names under the axis. Turn OFF for small multiples: all five journeys
   * share the same five stages, so label the grid once instead of 25 times, and
   * the labels do not fit a narrow column anyway.
   */
  showStageLabels?: boolean;
  /** Externally driven stage highlight, so a stepper and the curve stay in sync. */
  activeStageIndex?: number | null;
  /** Click a stage column. */
  onSelectStage?: (index: number) => void;
  /**
   * Stage TITLES to band as the media focus. Empty or absent draws nothing, so
   * the Table baseline is unaffected.
   *
   * Titles, not indices, and matched against `stage.title`. Every other
   * cross-journey join in this app learned the same lesson: an index marks the
   * wrong column silently when a stage moves, and the result still looks
   * deliberate.
   *
   * The band is painted FIRST, under the gridlines and both curves. It is
   * context for the plot, not a series in it, so nothing that encodes data may
   * end up behind it.
   */
  focusStages?: readonly string[];
}

interface PointData {
  x: number;
  y: number;
  score: number;
  label: string;
  type: 'Emotional' | 'Rational';
  stageName: string;
  stageIndex: number;
}

// Matched to the two Ring 2 segment colours in data/brand.ts so the graph reads
// as part of the same system: warm terracotta for emotion, teal for reason.
const EMOTIONAL_COLOR = '#B8571C';
const RATIONAL_COLOR = '#0A7D68';

// Catmull-Rom to Bezier conversion for a smooth curve through points.
const buildSmoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length < 2) return '';
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  const tension = 0.5;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) * (tension / 6);
    const cp1y = p1.y + (p2.y - p0.y) * (tension / 6);
    const cp2x = p2.x - (p3.x - p1.x) * (tension / 6);
    const cp2y = p2.y - (p3.y - p1.y) * (tension / 6);

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const JourneyScoreGraph: React.FC<JourneyScoreGraphProps> = ({
  stages,
  domain,
  compact = false,
  columnWidth = 160,
  showStageLabels = true,
  activeStageIndex = null,
  onSelectStage,
  focusStages = [],
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<PointData | null>(null);
  const [hoveredStageIndex, setHoveredStageIndex] = useState<number | null>(null);

  // Hover wins over the external highlight, so pointing at the chart always
  // responds even when a stepper has a stage selected.
  const activeStage = hoveredStageIndex ?? activeStageIndex;

  // Layout
  const width = stages.length * columnWidth;
  const height = compact ? 148 : 200;
  const paddingTop = compact ? 12 : 24;

  // SVG TEXT SIZE IS NOT WHAT IT SAYS IT IS.
  //
  // `columnWidth` sets the viewBox width, and callers pass wildly different
  // values (44 for small multiples, 160 default, 300 for the wide strip). The SVG
  // then scales to its container, so an identical `fontSize` rendered at 15.0px
  // in the Table and 6.8px in the Strip. Measuring the container and dividing
  // through makes a TYPE token mean the same thing in every caller.
  //
  // Gated on `compact`, deliberately. `!compact` is the Table baseline only, and
  // it is the A/B control for the three new journey views. Leave it alone.
  const [measureRef, measured] = useElementSize<HTMLDivElement>();
  const svgPx = measured === null ? null : measured.width - (compact ? 8 : 32); // p-1 / p-4
  const stageLabelSize = compact ? svgFont(TYPE.label, svgPx, width) : 11;

  // The label gutter follows the label. Hardcoding 30 here is what made a font
  // bump collide with the curve, and the svg is `overflow-visible` so it spills
  // silently rather than clipping.
  const paddingBottom = showStageLabels
    ? compact
      ? Math.round(stageLabelSize * 1.9) + 8
      : 44
    : 10;
  const graphHeight = height - paddingTop - paddingBottom;
  const gradientId = React.useId();

  const allEndScores = stages.flatMap((stage) => [
    parseScoreValue(stage.emotionalScore),
    parseScoreValue(stage.rationalScore),
  ]);

  const dataMin = Math.min(...allEndScores);
  const dataMax = Math.max(...allEndScores);
  // Pad the auto y-domain a bit so peaks never touch the top edge.
  const [minScore, maxScore] = domain ?? [Math.max(0, dataMin - 10), Math.min(100, dataMax + 10)];
  const scoreRange = maxScore - minScore > 0 ? maxScore - minScore : 1;

  const yFromScore = (value: number) =>
    paddingTop + graphHeight - ((value - minScore) / scoreRange) * graphHeight;

  const getPoints = (scoreType: 'Emotional' | 'Rational'): PointData[] =>
    stages.map((stage, i) => {
      const raw = scoreType === 'Emotional' ? stage.emotionalScore : stage.rationalScore;
      const { value, label } = parseScoreData(raw);
      return {
        x: i * columnWidth + columnWidth / 2,
        y: yFromScore(value),
        score: value,
        label,
        type: scoreType,
        stageName: stage.title,
        stageIndex: i,
      };
    });

  const emotionalData = getPoints('Emotional');
  const rationalData = getPoints('Rational');

  const emotionalPath = buildSmoothPath(emotionalData);
  const rationalPath = buildSmoothPath(rationalData);

  const buildArea = (points: PointData[]) => {
    const top = buildSmoothPath(points);
    const baseY = paddingTop + graphHeight;
    return `${top} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`;
  };
  const emotionalArea = buildArea(emotionalData);
  const rationalArea = buildArea(rationalData);

  const gridScores = [25, 50, 75].filter((s) => s > minScore && s < maxScore);

  const dotBase = compact ? 3 : 4;
  const lastIndex = stages.length - 1;

  return (
    <div ref={measureRef} className={`relative ${compact ? 'p-1' : 'p-4'}`}>
      {/* `font-sans` was removed: it resolves to Tailwind's ui-sans-serif stack
          and overrode the DM Sans set on body, so the chart rendered in the OS UI
          font while the rest of the page did not. */}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id={`e-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={EMOTIONAL_COLOR} stopOpacity="0.18" />
            <stop offset="100%" stopColor={EMOTIONAL_COLOR} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`r-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={RATIONAL_COLOR} stopOpacity="0.14" />
            <stop offset="100%" stopColor={RATIONAL_COLOR} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Media focus bands. FIRST, so gridlines, fills and both curves draw
            over the top and nothing that encodes data is obscured. */}
        {stages.map((stage, i) =>
          focusStages.includes(stage.title) ? (
            <rect
              key={`focus-${i}`}
              x={i * columnWidth}
              y={paddingTop}
              width={columnWidth}
              height={graphHeight}
              fill={FOCUS.wash}
            />
          ) : null,
        )}

        {gridScores.map((s) => (
          <g key={`grid-${s}`}>
            <line
              x1={0}
              x2={width}
              y1={yFromScore(s)}
              y2={yFromScore(s)}
              stroke="#DBE6DC"
              strokeWidth={1}
              strokeDasharray="1 4"
            />
            {/* Axis value fill is #5B6E64, not the old #A9C3B4: a number a reader
                has to read, and 1.88:1 on white was under every floor. Colour
                only, so the Table baseline's geometry is untouched. */}
            {!compact && (
              <text x={8} y={yFromScore(s) - 4} fontSize="10" fill="#5B6E64" className="select-none">
                {s}
              </text>
            )}
          </g>
        ))}

        {stages.map((stage, i) => {
          const colX = i * columnWidth;
          const isActive = activeStage === i;
          return (
            <g key={`col-${i}`}>
              {i > 0 && (
                <line
                  x1={colX}
                  y1={paddingTop}
                  x2={colX}
                  y2={height - paddingBottom}
                  stroke="#DBE6DC"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
              )}
              {isActive && (
                <rect
                  x={colX}
                  y={paddingTop}
                  width={columnWidth}
                  height={graphHeight}
                  fill={EMOTIONAL_COLOR}
                  opacity={0.04}
                />
              )}
              <rect
                x={colX}
                y={paddingTop}
                width={columnWidth}
                height={graphHeight}
                fill="transparent"
                className={onSelectStage ? 'cursor-pointer' : undefined}
                onMouseEnter={() => setHoveredStageIndex(i)}
                onMouseLeave={() => setHoveredStageIndex((prev) => (prev === i ? null : prev))}
                onClick={onSelectStage ? () => onSelectStage(i) : undefined}
              />
              {showStageLabels && (
                <text
                  x={colX + columnWidth / 2}
                  y={height - (compact ? Math.round(stageLabelSize * 0.85) : 14)}
                  fontSize={stageLabelSize}
                  fontWeight={isActive ? 700 : 500}
                  fill={isActive ? '#143C33' : '#5B6E64'}
                  textAnchor="middle"
                  className="select-none transition-colors"
                >
                  {stage.title}
                </text>
              )}
            </g>
          );
        })}

        <path d={rationalArea} fill={`url(#r-${gradientId})`} />
        <path d={emotionalArea} fill={`url(#e-${gradientId})`} />

        <path
          d={rationalPath}
          fill="none"
          stroke={RATIONAL_COLOR}
          strokeWidth={compact ? 2 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.85}
        />
        <path
          d={emotionalPath}
          fill="none"
          stroke={EMOTIONAL_COLOR}
          strokeWidth={compact ? 2.5 : 3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {activeStage !== null && (
          <line
            x1={activeStage * columnWidth + columnWidth / 2}
            x2={activeStage * columnWidth + columnWidth / 2}
            y1={paddingTop}
            y2={height - paddingBottom}
            stroke="#143C33"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.25}
          />
        )}

        {[
          { data: rationalData, colour: RATIONAL_COLOR, key: 'r' },
          { data: emotionalData, colour: EMOTIONAL_COLOR, key: 'e' },
        ].map(({ data, colour, key }) =>
          data.map((p, i) => {
            const isHovered = hoveredPoint?.type === p.type && hoveredPoint.stageIndex === i;
            const isStageActive = activeStage === i;
            const r = isHovered ? dotBase + 3 : isStageActive ? dotBase + 1.5 : dotBase;
            return (
              <g
                key={`${key}-dot-${i}`}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredPoint(p);
                  setHoveredStageIndex(i);
                }}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={onSelectStage ? () => onSelectStage(i) : undefined}
              >
                <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill="white"
                  stroke={colour}
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ transition: 'r 150ms ease, stroke-width 150ms ease' }}
                />
              </g>
            );
          }),
        )}
      </svg>

      {!compact && (
        <div className="flex justify-end items-center gap-5 text-xs text-[#5B6E64] pt-2">
          <div className="flex items-center">
            <span className="inline-block w-4 h-0.5 mr-2" style={{ background: EMOTIONAL_COLOR }} />
            <span>Emotional</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-4 h-0.5 mr-2" style={{ background: RATIONAL_COLOR }} />
            <span>Rational</span>
          </div>
        </div>
      )}

      {/* Tooltip.
          Anchored to the container edge at the first and last stage. Centring it
          there pushed roughly a quarter of the box outside the container, which
          matters far more now the graph is the hero of the spine view. */}
      {hoveredPoint && (
        <div
          className="absolute z-50 bg-white p-3 rounded-lg shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] border border-[#DBE6DC] text-body pointer-events-none w-60"
          style={{
            ...(hoveredPoint.stageIndex === 0
              ? { left: 0 }
              : hoveredPoint.stageIndex === lastIndex
                ? { right: 0 }
                : { left: `${(hoveredPoint.x / width) * 100}%` }),
            top: `${(hoveredPoint.y / height) * 100}%`,
            transform:
              hoveredPoint.stageIndex === 0 || hoveredPoint.stageIndex === lastIndex
                ? 'translate(0, calc(-100% - 14px))'
                : 'translate(-50%, calc(-100% - 14px))',
          }}
        >
          <div
            className="text-micro uppercase text-[#5B6E64] mb-1"
            style={{ letterSpacing: TRACKING.eyebrow }}
          >
            {hoveredPoint.stageName}
          </div>
          <div className="flex items-center mb-1">
            <span
              className="w-2 h-2 rounded-full mr-2"
              style={{
                background: hoveredPoint.type === 'Emotional' ? EMOTIONAL_COLOR : RATIONAL_COLOR,
              }}
            />
            <span className="font-bold text-[#003D33]">
              {hoveredPoint.type} | {hoveredPoint.score}
            </span>
          </div>
          {hoveredPoint.label && (
            <div className="text-[#5B6E64] italic leading-snug">&ldquo;{hoveredPoint.label}&rdquo;</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JourneyScoreGraph;
