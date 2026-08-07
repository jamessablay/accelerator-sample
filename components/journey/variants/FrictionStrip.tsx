import React, { useState } from 'react';
import Modal from '../../shared/Modal';
import JourneyScoreGraph from '../JourneyScoreGraph';
import { LYKA, FOCUS, getSegmentColor } from '../../../data/brand';
import { isFocusCell, MEDIA_FOCUS_NOTE } from '../../../data/mediaFocus';
import {
  splitBullets,
  parseScoreData,
  isTruncatedDescriptor,
  SHARED_SCORE_DOMAIN,
} from '../../../data/journeyModel';
import { TRACKING } from '../../../data/type';
import type { JourneyStageDetail } from '../../../data/journeyDetailsData';
import type { JourneyVizProps } from './types';

// -----------------------------------------------------------------------------
// FRICTION STRIP
//
// THE FIX: keep all five stages on screen, which is the one real advantage the
// original table has, but stop printing 567 words to do it.
//
// Each cell shows a COUNT plus ONE anchor line, and the rest on click. The anchor
// is the first bullet, which in this data is consistently the strongest: the
// source deck lists barriers and opportunities in priority order.
//
// `doingThinking` is the exception. Its LAST semicolon item is the first-person
// quote, and a quote says more in one line than a summary does, so that is the
// anchor. Nice side effect of the semicolon format rule.
//
// Emotional and rational collapse to a two-row sparkline strip, because at this
// density the shape of the curve is the readable part, not the values.
// -----------------------------------------------------------------------------

interface CellSpec {
  key: 'painPoints' | 'influences' | 'momentsToWin';
  label: string;
  tone: 'friction' | 'neutral' | 'win';
}

const CELLS: CellSpec[] = [
  { key: 'painPoints', label: 'Barriers', tone: 'friction' },
  { key: 'influences', label: 'Touchpoints', tone: 'neutral' },
  { key: 'momentsToWin', label: 'Moments to win', tone: 'win' },
];

const TONE_COLOR: Record<CellSpec['tone'], string> = {
  friction: '#B8571C',
  neutral: '#5B6E64',
  win: '#0A7D68',
};

/** Count marks. Intensity is the count itself, which is the only honest reading:
 *  the source lists items, it does not score them. */
const Marks: React.FC<{ n: number; colour: string }> = ({ n, colour }) => (
  <span className="inline-flex items-center gap-[2px]" aria-hidden="true">
    {Array.from({ length: Math.min(n, 8) }, (_, i) => (
      <span
        key={i}
        className="block rounded-[1px]"
        style={{ width: 4, height: 9, backgroundColor: colour, opacity: 0.3 + (i / 8) * 0.7 }}
      />
    ))}
  </span>
);

const FrictionStrip: React.FC<JourneyVizProps> = ({ active }) => {
  const [open, setOpen] = useState<{ stage: JourneyStageDetail; field: string; label: string } | null>(null);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const colour = getSegmentColor(active.segmentKey);
  const { stages } = active;

  const anchorFor = (stage: JourneyStageDetail, key: CellSpec['key']) => splitBullets(stage[key])[0] ?? '';

  const focusStages = stages
    .map((s) => s.title)
    .filter((title) => isFocusCell(active.type, title));
  const isFocus = (stage: JourneyStageDetail) => focusStages.includes(stage.title);

  /**
   * Background for a clickable cell.
   *
   * ⚠ HOVER HAS TO BE INLINE HERE, not the `hover:bg-[#F9F6F1]` utility these
   * cells use elsewhere. An inline `background-color` OUTRANKS any stylesheet
   * rule, so a washed cell keeping the utility would show its resting green and
   * never respond to the pointer, while every unwashed cell around it did. That
   * is the exact trap the ladder's persona chips hit: hover looks like it works
   * because half of it still does. This component already tracks `hoverIndex`
   * for the score strip, so the state was free.
   */
  const cellBg = (stage: JourneyStageDetail, i: number): string | undefined => {
    if (isFocus(stage)) return hoverIndex === i ? FOCUS.washHover : FOCUS.wash;
    return hoverIndex === i ? LYKA.ivory : undefined;
  };

  return (
    <div className="animate-fadeIn h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
      <div
        className="rounded-2xl border bg-white overflow-hidden flex-shrink-0"
        style={{ borderColor: LYKA.mint, boxShadow: LYKA.shadow }}
      >
        {/* Stage headers */}
        <div className="grid grid-cols-5 border-b" style={{ borderColor: LYKA.mint, backgroundColor: LYKA.cream }}>
          {stages.map((s, i) => (
            <div
              key={s.title}
              className="relative px-3 py-2 border-l first:border-l-0"
              style={{
                borderColor: LYKA.mint,
                backgroundColor: isFocus(s) ? FOCUS.wash : undefined,
              }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(-1)}
            >
              {isFocus(s) && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ backgroundColor: FOCUS.edge }}
                />
              )}
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: colour.base }}
                >
                  <span className="scale-[0.5] block">{s.icon}</span>
                </span>
                <span
                  className="text-label font-bold truncate"
                  style={{ color: LYKA.tealDeepest }}
                >
                  {s.title}
                </span>
              </div>
              {/* Two lines rather than `truncate`. These strings run to 38
                  characters and were already losing their ends at 9px in a
                  ~187px cell; at `meta` a single line would be mostly ellipsis. */}
              <div
                className="font-mono text-meta mt-0.5 leading-snug line-clamp-2"
                style={{ color: LYKA.muted }}
                title={s.duration}
              >
                {s.duration}
              </div>
            </div>
          ))}
        </div>

        {/* The quote row: doingThinking's last item is the first-person voice. */}
        <div className="grid grid-cols-5 border-b" style={{ borderColor: LYKA.mint }}>
          {stages.map((s, i) => {
            const parts = splitBullets(s.doingThinking);
            const quote = parts[parts.length - 1] ?? '';
            return (
              <button
                key={s.title}
                className="px-3 py-2.5 text-left border-l first:border-l-0 transition-colors"
                style={{ borderColor: LYKA.mint, backgroundColor: cellBg(s, i) }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(-1)}
                onClick={() => setOpen({ stage: s, field: 'doingThinking', label: 'Doing and thinking' })}
              >
                {/* The clamp stays at 3 lines, so `label` here shows slightly
                    less of the quote than 11.5px did. Accepted: the full text is
                    one click away in the modal, and an unreadable full quote is
                    worth less than a readable partial one. */}
                <div
                  className="text-label italic leading-snug line-clamp-3"
                  style={{ color: LYKA.ink }}
                >
                  {quote}
                </div>
                <div className="font-mono text-meta mt-1" style={{ color: LYKA.accentInk }}>
                  + {parts.length - 1} behaviours
                </div>
              </button>
            );
          })}
        </div>

        {/* Encoded rows */}
        {CELLS.map((cell) => (
          <div
            key={cell.key}
            className="grid grid-cols-5 border-b"
            style={{ borderColor: LYKA.mint }}
          >
            {stages.map((s, i) => {
              const items = splitBullets(s[cell.key]);
              const anchor = anchorFor(s, cell.key);
              return (
                <button
                  key={s.title}
                  className="px-3 py-2.5 text-left border-l first:border-l-0 transition-colors"
                  style={{ borderColor: LYKA.mint, backgroundColor: cellBg(s, i) }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(-1)}
                  onClick={() => setOpen({ stage: s, field: cell.key, label: cell.label })}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {i === 0 ? (
                      <span
                        className="font-mono text-micro uppercase"
                        style={{ color: TONE_COLOR[cell.tone], letterSpacing: TRACKING.eyebrow }}
                      >
                        {cell.label}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="flex items-center gap-1.5">
                      <Marks n={items.length} colour={TONE_COLOR[cell.tone]} />
                      <span
                        className="font-mono text-meta font-bold"
                        style={{ color: TONE_COLOR[cell.tone] }}
                      >
                        {items.length}
                      </span>
                    </span>
                  </div>
                  <div
                    className="text-label leading-snug line-clamp-2"
                    style={{ color: LYKA.muted }}
                  >
                    {anchor}
                  </div>
                </button>
              );
            })}
          </div>
        ))}

        {/* Score strip.
            A hand-rolled two-row sparkline was tried here and abandoned: at this
            width, preserveAspectRatio="none" over a 26px box flattens a 60 point
            swing to about 12px of travel across 1050px, so both lines read as
            straight. The real graph at columnWidth 300 gives the same footprint
            with a legible slope, hover tooltips, and one less bespoke chart. */}
        <div className="px-3 pt-1.5 pb-1" style={{ backgroundColor: LYKA.ivory }}>
          <span
            className="font-mono text-micro uppercase"
            style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
          >
            Emotional and rational, 0 to 100
          </span>
          <JourneyScoreGraph
            key={active.type}
            stages={active.stages}
            domain={SHARED_SCORE_DOMAIN}
            compact
            columnWidth={300}
            showStageLabels={false}
            activeStageIndex={hoverIndex >= 0 ? hoverIndex : null}
            focusStages={focusStages}
          />
        </div>
      </div>

      <p className="mt-2 text-meta" style={{ color: LYKA.muted }}>
        Marks and the number show how many items the source lists for that cell. The line
        beneath is the first, which the source deck orders by priority. Select any cell for the
        full text. Quotes are the study&apos;s own first-person voice.
        {focusStages.length > 0 ? ` ${MEDIA_FOCUS_NOTE}` : ''}
      </p>

      <Modal
        isOpen={!!open}
        onClose={() => setOpen(null)}
        title={open ? `${open.stage.title} | ${open.label}` : undefined}
        maxWidth="max-w-xl"
      >
        {open && (
          <div>
            {open.stage.definition && (
              <p className="text-body italic mb-4" style={{ color: LYKA.muted }}>
                {open.stage.definition}
              </p>
            )}
            <ul className="list-disc pl-5 space-y-2 text-lead leading-snug" style={{ color: LYKA.ink }}>
              {splitBullets(open.stage[open.field as CellSpec['key'] | 'doingThinking']).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {(() => {
              const e = parseScoreData(open.stage.emotionalScore);
              const r = parseScoreData(open.stage.rationalScore);
              return isTruncatedDescriptor(e.label) || isTruncatedDescriptor(r.label) ? (
                <p className="mt-4 text-meta" style={{ color: LYKA.muted }}>
                  Note: a score descriptor for this stage is cut off in the source deck. Shown as
                  supplied, not completed.
                </p>
              ) : null;
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FrictionStrip;
