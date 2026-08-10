import React, { useState } from 'react';
import { getSegmentColor, LYKA } from '../../../data/brand';
import { personaMetricsById } from '../../../data/audienceModel';
import { growthLabel, GROWTH_LABEL_NOTE } from '../../../data/growthLabels';
import { TYPE, TRACKING, svgFont } from '../../../data/type';
import { useElementSize } from '../../../hooks/useElementSize';
import type { PersonaVizProps } from './types';

// -----------------------------------------------------------------------------
// ONE OWNER, FOUR MINDSETS
//
// THE ARGUMENT: these are not four kinds of person, they are four states one
// person moves through. So the view is a track, not a taxonomy, and the edges
// carry as much weight as the nodes. What a media plan actually buys is the
// movement, and the trigger that causes it.
//
// ⚠ THE HONESTY CONSTRAINT ON RIBBON WIDTH. LOAD BEARING.
// The study measures NO transition rates. Nothing in the research says how many
// owners move from Curious to Considering in a year. A Sankey encodes measured
// flow, so this must not be read as one. Ribbon width therefore encodes the
// SOURCE STAGE'S MARKET SHARE, meaning how many people are sitting there to be
// moved. Ribbons are constant width, never tapered, because a taper implies a
// rate. The legend states this in words on screen. Do not "improve" this by
// scaling a ribbon to anything that looks like a conversion volume.
//
// EVERY EDGE IS SOURCED. Each one quotes a persona's `movement` field verbatim,
// which is transcribed from the research document. The two dashed routes are the
// two non-sequential jumps the research names explicitly. No edge here is an
// agency invention, which is the whole reason this view is defensible.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// VERTICAL GEOMETRY IS DERIVED, NOT HARDCODED.
//
// This was a fixed 1160x494 viewBox on a `w-full h-auto` SVG, which means the
// rendered height is dictated by the width: at 1440 it drew 1048x446 inside a
// 1048x714 box and left a third of the page empty. You cannot fix that by
// stretching the element, because `preserveAspectRatio` would either letterbox
// it (meet) or turn the circles into ellipses (none). The viewBox itself has to
// change shape.
//
// VB_W STAYS 1160, so the horizontal scale never changes and every type size and
// chip box renders at exactly the same px as before. Only VB_H moves, which adds
// vertical user units to spread the drawing into.
//
// Everything below the nodes is a fixed stack (caption, sub-line, two chip rows),
// because those are type sized and must not scale. So the layout solves from the
// bottom up: node centre = VB_H - LOWER_STACK - radius. Whatever is left above
// the nodes is the skip-route band, and the two lanes sit at fixed fractions of
// it, which reproduces the old 58 / 122 exactly at the old VB_H.
// -----------------------------------------------------------------------------

const VB_W = 1160;
const STATION_X = [130, 420, 710, 1000];
const CHIP_W = 250;
/** Chip box, and the two text baselines inside it. Sized to `label` over `meta`. */
/**
 * 48 until 2026-08-10, when the client's growth labels added TWO lines: the tag
 * and its tactic. Baselines are name 20, figures 38, tag 56, tactic 72.
 *
 * The two unlabelled personas keep the same box rather than a shorter one, so
 * every chip in the view is one size. A chip that shrinks when it has less to
 * say makes the labelled ones look like the exception, when the argument is
 * that the unlabelled ones are.
 */
const CHIP_H = 80;
/** CHIP_H + the 6 unit gutter between the two rows Curious carries. */
const CHIP_ROW_GAP = 86;

/** Node bottom to caption baseline, caption to sub-line, sub-line to first chip. */
const CAPTION_GAP = 34;
const SUBLINE_GAP = 22;
const CHIP_GAP = 20;
/** Most personas any one stage carries. Curious, since 2026-08-07. */
const MAX_CHIP_ROWS = 2;
const BOTTOM_PAD = 16;
/** Fixed, type-driven block under the node row. Never scales. */
const LOWER_STACK =
  CAPTION_GAP + SUBLINE_GAP + CHIP_GAP + MAX_CHIP_ROWS * CHIP_ROW_GAP + BOTTOM_PAD;

/**
 * The shape the drawing collapses to when there is nothing to measure.
 *
 * 494 until 2026-08-10, RAISED BY EXACTLY THE 64 UNITS THE TALLER CHIPS ADDED to
 * LOWER_STACK, and that is the point rather than a round number. Both clamp ends
 * are defined so the geometry ABOVE the nodes is untouched: at the floor
 * CY is still 220 and the skip band still 146, so SKIP_LANE_FRACTIONS still
 * reproduces 58 / 122 exactly as its comment claims, and at the ceiling CY is
 * still 375 and the band still 250. Verified arithmetically, both ends.
 *
 * What DOES change is the middle, and it is unavoidable: at a fixed container
 * the viewBox height is set by the container's aspect, so a bigger lower stack
 * comes out of the nodes. At VB_H 632 (a 1440 viewport) R_MAX goes 112.6 to 94.7
 * and the band 206.7 to 178.6. The node collision cap is unaffected, with far
 * more headroom than before (1.76 x 94.7 = 167 against a 290 station gap).
 */
const VB_H_MIN = 558;
/**
 * Past this the nodes stop growing and the extra height becomes air, which reads
 * as a broken layout rather than a bigger diagram. Raised by the same 64.
 */
const VB_H_MAX = 764;

/**
 * Largest node radius, growing with the box.
 *
 * CAPPED AT 125 BY THE HORIZONTAL GEOMETRY, not by taste. Stations are 290 apart
 * and the two biggest neighbours are Curious (R_MAX) and Unaware
 * (R_MAX x sqrt(27/47) = 0.76 R_MAX). They collide once 1.76 x R_MAX exceeds the
 * 290 gap less the ribbon run, so anything above about 130 touches.
 *
 * That pair USED to be Unaware (R_MAX) and Curious (0.71 R_MAX) summing to 1.71,
 * and it moved on 2026-08-07 when Disciplined Outsourcers went to Curious: the
 * biggest node is now Curious at 47%, not Unaware at 49%. The cap held because
 * the sum only went 1.71 to 1.76, but RE-CHECK THIS SUM whenever a persona moves
 * stage, because the two largest ADJACENT nodes are what sets it, not the two
 * largest nodes.
 */
const maxRadiusFor = (vbH: number) => Math.min(125, Math.max(74, 74 + (vbH - VB_H_MIN) * 0.28));

/** Lanes as fractions of the band above the nodes. Reproduces 58 / 122 at VB_H_MIN. */
const SKIP_LANE_FRACTIONS = [0.36, 0.75];

/**
 * Below this container width the compensation is switched off.
 *
 * `svgFont` holds text at a fixed apparent size while the geometry keeps
 * scaling, so on a narrow container the type grows relative to the drawing and
 * eventually collides. This view is a wide diagram; under ~640px it is already
 * the wrong instrument, so it reverts to scaling naturally rather than
 * overlapping.
 */
const MIN_COMPENSATED_WIDTH = 640;

interface SkipEdge {
  fromIndex: number;
  toIndex: number;
  /**
   * Which vertical lane this jump routes along. Orthogonal routing, so a crossing
   * reads as a wire crossing rather than two tangent curves. The lane's y is
   * resolved at render time from SKIP_LANE_FRACTIONS, because the band above the
   * nodes grows with the box.
   */
  laneIndex: 0 | 1;
  /** The persona whose movement goal this edge is. `movement` is shown on hover. */
  personaId: number;
  /** Short label. A quoted fragment of that persona's `movement` field. */
  label: string;
  /**
   * Horizontal offset of the riser off the source node's centre, in user units.
   *
   * NEEDED SINCE 2026-08-07, because BOTH jumps now leave the same node. Two
   * risers on the same x are collinear from the node top up to the lower lane,
   * so they overprint: the upper edge's white casing erases the lower edge's
   * dashes for that whole run, and what should read as two routes reads as one
   * line that forks. Splitting them a few units apart keeps each one traceable
   * back to its own node. The riser still starts ON the circle, because the
   * chord offset is solved into y1 rather than assumed to be the top.
   */
  fromDx?: number;
}

/**
 * The two jumps the research names. BOTH NOW LEAVE CURIOUS.
 *
 *  - Conflicted Troubleshooters (301): "An acute health or fussiness trigger can
 *    produce a direct Curious → Ready jump."
 *  - Disciplined Outsourcers (401): "Unconvinced → Considering or Ready after an
 *    expert or health trigger." Drawn to Considering, the first named target;
 *    the label carries "or Ready".
 *
 * ⚠ THE OUTSOURCERS EDGE MOVED WITH THE PERSONA and its `movement` string did
 * not. That string still says "Unconvinced", because it is the research's own
 * wording and the client asked only for the placement to change. The edge is
 * drawn from where the persona now SITS, which is the honest reading: the jump
 * is theirs, so it leaves from wherever they are.
 */
/**
 * ORDER AND LANE ARE BOTH LOAD BEARING, and only rendering shows why.
 *
 * LANE: the LONGER jump takes the outer lane (0, higher up the page) and the
 * shorter one takes the inner lane. Do it the other way round and the long
 * route's descent lands at x 710, which is in the middle of the short route's
 * lane, so it crosses that lane's LABEL and its 8px white casing eats a hole in
 * the middle of a sentence. With the long route outside, its descent is at x
 * 1000, past where the short route's run ends, and the two never cross at all.
 *
 * ORDER: the short edge is second so that its label casing paints OVER the long
 * edge's riser, which does pass behind that label. Later wins in SVG, so the
 * edge whose label is at risk must be drawn last.
 */
const SKIP_EDGES: SkipEdge[] = [
  { fromIndex: 1, toIndex: 3, laneIndex: 0, personaId: 301, label: 'Acute health or fussiness trigger: a direct jump to Ready', fromDx: -26 },
  { fromIndex: 1, toIndex: 2, laneIndex: 1, personaId: 401, label: 'Expert or health trigger: Outsourcers jump to Considering or Ready', fromDx: 26 },
];

/** Which persona's movement goal drives each sequential step. */
const SEQUENTIAL_PERSONA_ID = [402, 301, 201];

const MindsetFlow: React.FC<PersonaVizProps> = ({
  stages,
  selectedPersonaId,
  selectedStageKey,
  onSelectPersona,
  onSelectStage,
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [measureRef, measured] = useElementSize<HTMLDivElement>();

  // ---- Vertical layout, solved from the measured box. See the header. ----
  // Match the viewBox aspect to the container so `h-auto` renders at exactly the
  // container height, then clamp: too short and the lower stack collides, too
  // tall and the extra is just air.
  const VB_H = !measured || measured.width <= 0
    ? VB_H_MIN
    : Math.min(VB_H_MAX, Math.max(VB_H_MIN, (VB_W * measured.height) / measured.width));

  const R_MAX = maxRadiusFor(VB_H);
  const CY = VB_H - LOWER_STACK - R_MAX;
  const CAPTION_Y = CY + R_MAX + CAPTION_GAP;
  const SUBLINE_Y = CAPTION_Y + SUBLINE_GAP;
  const CHIP_TOP = SUBLINE_Y + CHIP_GAP;
  // Whatever is left above the nodes is the skip-route band.
  const skipBand = CY - R_MAX;
  const skipLaneY = SKIP_LANE_FRACTIONS.map((f) => skipBand * f);

  const maxMarket = Math.max(...stages.map((s) => s.marketPct));
  // Area proportional, so radius follows the square root.
  const radiusFor = (pct: number) => R_MAX * Math.sqrt(pct / maxMarket);
  const radii = stages.map((s) => radiusFor(s.marketPct));

  const selectedStageOfPersona = selectedPersonaId
    ? stages.find((s) => s.personas.some((p) => p.persona.id === selectedPersonaId))?.key ?? null
    : null;
  const activeKey = selectedStageKey ?? selectedStageOfPersona;
  const hasSelection = activeKey !== null;
  const isDim = (key: string) => hasSelection && key !== activeKey;

  const chipRows = (index: number) => stages[index].personas;

  // EVERY fontSize below is a TYPE token converted through the measured scale.
  // Declared user units are not a legibility guarantee: this viewBox is 1160
  // wide inside a ~1048px column, so the old literals rendered about 10% SMALLER
  // than they read in the source, and used to halve again whenever a detail
  // panel opened. (The panel is a full overlay now, so that second problem is
  // gone, but the first was always here.)
  const px =
    measured !== null && measured.width >= MIN_COMPENSATED_WIDTH ? measured.width : null;
  const size = (token: number) => svgFont(token, px, VB_W);

  const skipLabelSize = size(TYPE.meta);
  const captionSize = size(TYPE.lead);
  const subLineSize = size(TYPE.meta);
  const chipNameSize = size(TYPE.label);
  const chipFigureSize = size(TYPE.meta);
  /** The growth tag. `micro` is sanctioned here: uppercase, and the only one. */
  const chipTagSize = size(TYPE.micro);
  const legendSize = size(TYPE.meta);

  return (
    // `h-full` so there is a height to measure, and `justify-center` because the
    // VB_H clamp means the drawing does not always consume all of it. Cap matches
    // the ladder's 1600.
    <div
      ref={measureRef}
      className="w-full max-w-[1600px] mx-auto h-full flex flex-col justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* `font-sans` removed: it resolves to Tailwind's ui-sans-serif stack and
          overrode the DM Sans on body, so this diagram rendered in the OS UI
          font while the page around it did not. */}
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto">
        <defs>
          <marker id="flow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill={LYKA.muted} />
          </marker>
        </defs>

        {/* ---- Sequential ribbons. Constant width. Behind the nodes. ---- */}
        {stages.slice(0, -1).map((stage, i) => {
          // FILLED FROM THE DESTINATION STAGE, not the source (client direction
          // 2026-08-10, "weird shading in this area").
          //
          // Source filling put `Unaware` on the first connector, and that stage
          // is `#5B6E64`, a deliberately desaturated grey-green ("the audience
          // that perceives no problem"). At the 0.3 the ribbons carry it lands
          // on #CED1C4, so the first arrow read GREY while the two after it read
          // warm, which looks like a disabled state rather than a step in a
          // ramp. Destination filling gives pink, peach, teal: the run warms up
          // and resolves on the brand colour, which is the ladder's own story.
          //
          // **The palette itself is untouched**, which was the constraint. The
          // muted `Unaware` is a documented decision and still owns its wheel
          // wedge, its ladder band and this view's first node. Only what fills
          // the connectors moved.
          //
          // ⚠ WIDTH STILL COMES FROM `stage`, THE SOURCE, and must. That is the
          // honesty constraint at the top of this file: width is the size of the
          // stage a movement starts from, never a measured transition rate. So
          // colour and width now describe different stages, which is why the
          // legend says so out loud. Interaction stays on the source too: this
          // ribbon IS that stage's movement, and clicking it opens that stage.
          const c = getSegmentColor(stages[i + 1].key);
          const x1 = STATION_X[i] + radii[i];
          const x2 = STATION_X[i + 1] - radii[i + 1];
          // Width from the SOURCE stage's share. See the honesty note above.
          // Scaled by the same factor as the nodes so the connectors do not read
          // as thread once the circles grow. RELATIVE widths are untouched, which
          // is what the honesty constraint is about: it forbids implying a rate,
          // not a consistent visual scale.
          const w = (6 + 44 * (stage.marketPct / maxMarket)) * (R_MAX / 74);
          const h = w / 2;
          const tip = 16 * (R_MAX / 74);
          const persona = personaMetricsById[SEQUENTIAL_PERSONA_ID[i]];
          const dim = isDim(stage.key);
          return (
            <g
              key={`ribbon-${stage.key}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredKey(stage.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStage(stage.key);
              }}
            >
              <title>{persona?.persona.movement ?? ''}</title>
              <path
                d={`M ${x1} ${CY - h} L ${x2 - tip} ${CY - h} L ${x2 - tip} ${CY - h - 6} L ${x2} ${CY} L ${x2 - tip} ${CY + h + 6} L ${x2 - tip} ${CY + h} L ${x1} ${CY + h} Z`}
                fill={c.base}
                opacity={dim ? 0.12 : hoveredKey === stage.key ? 0.55 : 0.3}
                style={{ transition: 'opacity 250ms' }}
              />
            </g>
          );
        })}

        {/* ---- Non-sequential jumps. Dashed, orthogonal, white cased. ---- */}
        {SKIP_EDGES.map((edge, idx) => {
          const from = stages[edge.fromIndex];
          const to = stages[edge.toIndex];
          const c = getSegmentColor(from.key);
          // The riser leaves the node's rim, not its bounding box. Offsetting x
          // without solving y would start the line INSIDE the circle by
          // r - sqrt(r^2 - dx^2), which at dx 26 on the big node is visible.
          const dx = edge.fromDx ?? 0;
          const rFrom = radii[edge.fromIndex];
          const x1 = STATION_X[edge.fromIndex] + dx;
          const x2 = STATION_X[edge.toIndex];
          const y1 = CY - Math.sqrt(Math.max(0, rFrom * rFrom - dx * dx));
          const y2 = CY - radii[edge.toIndex];
          const Y = skipLaneY[edge.laneIndex];
          const r = 14;
          const d = `M ${x1} ${y1} L ${x1} ${Y + r} Q ${x1} ${Y} ${x1 + r} ${Y} L ${x2 - r} ${Y} Q ${x2} ${Y} ${x2} ${Y + r} L ${x2} ${y2}`;
          const persona = personaMetricsById[edge.personaId];
          const dim = hasSelection && from.key !== activeKey && to.key !== activeKey;
          return (
            <g key={`skip-${idx}`} opacity={dim ? 0.2 : 1} style={{ transition: 'opacity 250ms' }}>
              <title>{persona?.persona.movement ?? ''}</title>
              {/* White casing so the one crossing reads cleanly. */}
              <path d={d} fill="none" stroke={LYKA.pageBg} strokeWidth={8} strokeLinecap="round" />
              <path
                d={d}
                fill="none"
                stroke={c.base}
                strokeWidth={2}
                strokeDasharray="6 5"
                strokeLinecap="round"
                markerEnd="url(#flow-arrow)"
              />
              {/* Casing widened 440 to 520 and deepened 18 to 22: the label is a
                  68 character string and it only just cleared 440 at the old
                  11.5 units. A casing narrower than its text is invisible until
                  you look at the crossing. */}
              <rect
                x={(x1 + x2) / 2 - 260}
                y={Y - 22}
                width={520}
                height={22}
                rx={4}
                fill={LYKA.pageBg}
                opacity={0.92}
              />
              <text
                x={(x1 + x2) / 2}
                y={Y - 7}
                textAnchor="middle"
                fontSize={skipLabelSize}
                fontWeight={600}
                fill={c.base}
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* ---- Stations ---- */}
        {stages.map((stage, i) => {
          const c = getSegmentColor(stage.key);
          const x = STATION_X[i];
          const r = radii[i];
          const dim = isDim(stage.key);
          const isActive = activeKey === stage.key;
          // Still proportional to the circle, because that is a data encoding,
          // but the floor and cap are now TYPE tokens rather than raw units, so
          // the smallest node (Ready, 11%) cannot fall under the reading floor.
          const pctSize = Math.min(size(28), Math.max(size(TYPE.label), r * 0.42));
          return (
            <g
              key={stage.key}
              className="cursor-pointer"
              opacity={dim ? 0.32 : 1}
              style={{ transition: 'opacity 250ms' }}
              onMouseEnter={() => setHoveredKey(stage.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStage(stage.key);
              }}
            >
              <circle
                cx={x}
                cy={CY}
                r={r}
                fill={c.base}
                stroke={isActive || hoveredKey === stage.key ? LYKA.tealDeepest : LYKA.pageBg}
                strokeWidth={isActive || hoveredKey === stage.key ? 3 : 2}
              />
              <text
                x={x}
                y={CY + pctSize * 0.35}
                textAnchor="middle"
                fontSize={pctSize}
                fontWeight={700}
                fill={c.ink}
                className="select-none"
              >
                {stage.marketPct}%
              </text>

              {/* Stage caption, on a shared baseline so all four align. */}
              <text
                x={x}
                y={CAPTION_Y}
                textAnchor="middle"
                fontSize={captionSize}
                fontWeight={700}
                fill={LYKA.tealDeepest}
              >
                {stage.label}
              </text>
              <text x={x} y={SUBLINE_Y} textAnchor="middle" fontSize={subLineSize} fill={LYKA.muted}>
                {stage.marketPct}% of market | {stage.customerPct}% of customers
              </text>
            </g>
          );
        })}

        {/* ---- Persona chips ---- */}
        {stages.map((stage, i) => {
          const c = getSegmentColor(stage.key);
          const x = STATION_X[i];
          const dim = isDim(stage.key);
          return chipRows(i).map((pm, j) => {
            const y = CHIP_TOP + j * CHIP_ROW_GAP;
            const selected = selectedPersonaId === pm.persona.id;
            const half = CHIP_W / 2;
            return (
              <g
                key={pm.persona.id}
                className="persona-chip-svg cursor-pointer"
                opacity={dim ? 0.32 : 1}
                style={{
                  transition: 'opacity 250ms',
                  // Hover, applied by .persona-chip-svg in index.html. Same two
                  // properties and the same reasoning as the ladder's chips, so
                  // a persona highlights identically in both views: wash toward
                  // white, ring in the segment's base colour. A selected chip is
                  // already dark, so it lifts to `hover` and takes a light ring.
                  ['--chip-hover-bg' as string]: selected ? c.hover : '#FFFFFF',
                  ['--chip-hover-ring' as string]: selected ? c.tint : c.base,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPersona(pm.persona);
                }}
              >
                <title>{pm.persona.movement}</title>
                <rect
                  x={x - half}
                  y={y}
                  width={CHIP_W}
                  height={CHIP_H}
                  rx={6}
                  fill={selected ? c.base : c.tint}
                  stroke={selected ? LYKA.tealDeepest : LYKA.mint}
                  strokeWidth={1}
                />
                <text
                  x={x - half + 10}
                  y={y + 20}
                  fontSize={chipNameSize}
                  fontWeight={600}
                  fill={selected ? c.ink : c.tintInk}
                >
                  {pm.persona.name}
                </text>
                {/* THE FIT RATING WAS DELETED FROM THIS CHIP, not enlarged. It was
                    the smallest text in the view (9 units, about 8.1px rendered)
                    and simultaneously the heaviest at weight 700, right anchored
                    on the same baseline as the figures. The old comment here
                    recorded that "Conflicted Troubleshooters" and "High Growth
                    Potential" already overlapped. The rating is in the detail
                    panel and in this chip's title tooltip, so the figures now get
                    the whole line at `meta` and the collision is gone. */}
                <text
                  x={x - half + 10}
                  y={y + 38}
                  fontSize={chipFigureSize}
                  fill={selected ? c.ink : c.tintInk}
                  opacity={0.92}
                >
                  {pm.marketPct}% mkt | {pm.customerPct}% cust | {pm.conversionIndex.toFixed(2)}x
                </text>
                {/* THE GROWTH PLAY, client direction 2026-08-10. Three personas
                    carry one and two deliberately do not: see data/growthLabels.ts
                    for why the absence is the finding, and why this is keyed by
                    PERSONA ID rather than by stage (Curious holds two personas,
                    and only one of them is the Primary HVA).

                    Two lines, not one. The tag and its tactic run to about 47
                    characters together, which overflows a 250 unit chip at any
                    size that is still legible, so they stack. The tag is the
                    app's eyebrow treatment: uppercase, micro, tracked.

                    Nothing renders for an unlabelled persona, and the chip does
                    NOT shrink to suit. */}
                {(() => {
                  const g = growthLabel(pm.persona.id);
                  if (!g) return null;
                  return (
                    <>
                      <text
                        x={x - half + 10}
                        y={y + 56}
                        fontSize={chipTagSize}
                        fontWeight={700}
                        letterSpacing={TRACKING.eyebrow}
                        fill={selected ? c.ink : c.tintInk}
                      >
                        {g.tag}
                      </text>
                      <text
                        x={x - half + 10}
                        y={y + 72}
                        fontSize={chipFigureSize}
                        fill={selected ? c.ink : c.tintInk}
                        opacity={0.92}
                      >
                        {g.text}
                      </text>
                    </>
                  );
                })()}
              </g>
            );
          });
        })}

      </svg>

      {/* ---- Legend. The honesty note is not optional. ----
          DOM, not SVG <text>. An SVG string cannot wrap, so it silently runs off
          the right edge of the viewBox when someone adds a clause, and this is
          precisely the copy most likely to be edited. As DOM it reflows. */}
      <p className="mt-1 text-meta leading-relaxed" style={{ color: LYKA.muted }}>
        Node area = share of market. Ribbon colour = the stage it leads into.{' '}
        <strong className="font-semibold">
          Ribbon width = the size of the stage a movement starts from, not a measured transition
          rate: the study does not measure movement between stages.
        </strong>{' '}
        Dashed routes are the two non-sequential jumps the research names. {GROWTH_LABEL_NOTE}{' '}
        Hover any node, ribbon or chip for its movement goal, verbatim.
      </p>
    </div>
  );
};

export default MindsetFlow;
