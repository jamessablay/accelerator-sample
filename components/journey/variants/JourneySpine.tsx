import React, { useState, useEffect } from 'react';
import JourneyScoreGraph from '../JourneyScoreGraph';
import { LYKA, FOCUS, getSegmentColor } from '../../../data/brand';
import { isFocusCell, MEDIA_FOCUS_LABEL } from '../../../data/mediaFocus';
import { SHARED_SCORE_DOMAIN, splitBullets, parseScoreData, isTruncatedDescriptor } from '../../../data/journeyModel';
import { TRACKING } from '../../../data/type';
import type { JourneyVizProps } from './types';

// -----------------------------------------------------------------------------
// EMOTION SPINE
//
// THE FIX: the original page puts 567 words of table above a chart nobody scrolls
// to. This inverts it. The curve is the hero, a stepper carries the five stages,
// and ONE stage of detail is open at a time. Roughly 80 words on screen by
// default instead of 567, with every word still one click away.
//
// The y-domain is fixed to 0 to 100. The default auto domain rescales per
// journey, which quietly makes a Sleepwalker peak of 65 look like a Caterer peak
// of 95.
// -----------------------------------------------------------------------------

const COLUMN_TITLES = [
  { key: 'doingThinking' as const, label: 'Doing and thinking' },
  { key: 'painPoints' as const, label: 'Barriers' },
  { key: 'influences' as const, label: 'Touchpoints' },
  { key: 'momentsToWin' as const, label: 'Moments to win' },
];

const JourneySpine: React.FC<JourneyVizProps> = ({ active }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const colour = getSegmentColor(active.segmentKey);

  // Resolved once, by title, and reused by the curve and the stepper so the two
  // can never disagree about which stages are marked.
  const focusStages = active.stages
    .map((s) => s.title)
    .filter((title) => isFocusCell(active.type, title));

  // Reset to the first stage when the persona changes, otherwise stage 4 of one
  // journey silently becomes stage 4 of another.
  useEffect(() => setStageIndex(0), [active.type]);

  const stage = active.stages[stageIndex];
  if (!stage) return null;

  const scores = active.scores[stageIndex];
  const emotional = parseScoreData(stage.emotionalScore);
  const rational = parseScoreData(stage.rationalScore);

  return (
    // Fixed frame: chart and stepper hold their height, the detail pane takes
    // what is left and scrolls inside itself. See the note in CustomerJourney.
    <div className="animate-fadeIn h-full flex flex-col gap-3 min-h-0">
      {/* Hero curve */}
      <div
        className="rounded-2xl border bg-white flex-shrink-0"
        style={{ borderColor: LYKA.mint, boxShadow: LYKA.shadow }}
      >
        {/* The legend lives up here rather than under the chart, so the graph can
            run in `compact` mode. That is 120px of the budget needed to keep the
            whole page inside one viewport at 1440x900. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 px-5 pt-2.5">
          <span
            className="font-mono text-micro uppercase"
            style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
          >
            Emotional and rational intensity | 0 to 100
          </span>
          <span className="flex items-center gap-4 text-meta" style={{ color: LYKA.muted }}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 h-0.5" style={{ background: '#B8571C' }} />
              Emotional
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 h-0.5" style={{ background: LYKA.accentInk }} />
              Rational
            </span>
            {focusStages.length > 0 && (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-4 h-2.5 rounded-sm border"
                  style={{ background: FOCUS.wash, borderColor: FOCUS.edge }}
                />
                {MEDIA_FOCUS_LABEL}
              </span>
            )}
            <span className="font-mono text-meta" style={{ color: LYKA.muted }}>
              Fixed scale, comparable across all five
            </span>
          </span>
        </div>
        <div className="max-w-[980px] mx-auto px-3 pb-0">
          <JourneyScoreGraph
            key={active.type}
            stages={active.stages}
            domain={SHARED_SCORE_DOMAIN}
            activeStageIndex={stageIndex}
            onSelectStage={setStageIndex}
            focusStages={focusStages}
            compact
          />
        </div>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-5 gap-2 flex-shrink-0">
        {active.stages.map((s, i) => {
          const isActive = i === stageIndex;
          const isFocus = focusStages.includes(s.title);
          return (
            <button
              key={s.title}
              onClick={() => setStageIndex(i)}
              title={`${s.title} | ${s.duration}${isFocus ? ` | ${MEDIA_FOCUS_LABEL}` : ''}`}
              className="relative overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2"
              style={{
                // SELECTION STILL WINS. An active step keeps the persona colour,
                // because the stepper's primary job is saying where you are; the
                // focus mark degrades to the top rule below, which reads on both
                // states. Two backgrounds competing for the same button is how a
                // stepper stops being a stepper.
                backgroundColor: isActive ? colour.base : isFocus ? FOCUS.wash : '#FFFFFF',
                borderColor: isActive ? colour.base : isFocus ? FOCUS.edge : LYKA.mint,
              }}
            >
              {isFocus && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ backgroundColor: FOCUS.edge }}
                />
              )}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.22)' : LYKA.cream,
                    color: isActive ? colour.ink : LYKA.accentInk,
                  }}
                >
                  <span className="scale-[0.62] block">{s.icon}</span>
                </span>
                <span
                  className="text-label font-semibold truncate"
                  style={{ color: isActive ? colour.ink : LYKA.tealDeepest }}
                >
                  {s.title}
                </span>
              </div>
              {/* Two lines, not `truncate`. Durations run to 38 characters
                  ("Vulnerable during first 3 to 6 months") and at `meta` in a
                  ~145px cell a single line is mostly ellipsis. The stepper is
                  flex-shrink-0 so this costs one line of height once, and the
                  full string is on the button's title. */}
              <div
                className="mt-1 font-mono text-meta leading-snug line-clamp-2"
                style={{ color: isActive ? colour.ink : LYKA.muted, opacity: isActive ? 0.9 : 1 }}
              >
                {s.duration}
              </div>
            </button>
          );
        })}
      </div>

      {/* One stage of detail */}
      <div
        key={`${active.type}-${stageIndex}`}
        className="rounded-2xl border bg-white animate-fadeIn flex-1 min-h-0 flex flex-col overflow-hidden"
        style={{ borderColor: LYKA.mint, boxShadow: LYKA.shadow }}
      >
        <div
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-2.5 border-b flex-shrink-0"
          style={{ borderColor: LYKA.mint, backgroundColor: LYKA.cream }}
        >
          <h3 className="font-display text-title font-bold" style={{ color: LYKA.tealDeepest }}>
            {stage.title}
          </h3>
          {stage.definition && (
            <span className="text-body italic" style={{ color: LYKA.muted }}>
              {stage.definition}
            </span>
          )}
          <span className="ml-auto flex items-center gap-3 font-mono text-meta">
            <span style={{ color: '#B8571C' }}>Emotional {emotional.value}</span>
            <span style={{ color: LYKA.accentInk }}>Rational {rational.value}</span>
            <span style={{ color: LYKA.muted }}>
              Gap {scores.gap > 0 ? '+' : ''}
              {scores.gap}
            </span>
          </span>
        </div>

        {/* lg, not xl. At 1440 the sidebar leaves a 1056px column, which is under
            the xl container assumption people reach for first; four columns is
            what keeps this block short enough for one viewport. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-3 px-5 py-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar content-start">
          {COLUMN_TITLES.map((col) => (
            <div key={col.key}>
              <h4
                className="font-mono text-micro uppercase mb-1.5"
                style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
              >
                {col.label}
              </h4>

              {/* The critical conversion moment, set on Action only. It leads the
                  moments-to-win column rather than sitting in its own banner:
                  that is where it belongs semantically, and a full width block
                  was the one thing pushing the Action stage past one viewport. */}
              {col.key === 'momentsToWin' && stage.coreQuestion && (
                <div
                  className="rounded-lg px-2.5 py-2 mb-1.5"
                  style={{ backgroundColor: LYKA.tealDeepest }}
                >
                  {/* This was 8.5px at 0.14em tracking, the smallest text in the
                      app, labelling the single most important thing on the
                      slide. It is now a tag rather than a whisper. */}
                  <span
                    className="inline-block rounded px-1.5 py-0.5 font-mono text-micro font-bold uppercase"
                    style={{
                      backgroundColor: LYKA.accent,
                      color: LYKA.tealDeepest,
                      letterSpacing: TRACKING.eyebrow,
                    }}
                  >
                    Critical moment
                  </span>
                  <div className="text-body italic text-white leading-snug mt-1.5">
                    &ldquo;{stage.coreQuestion.replace(/^['"]+|['"]+$/g, '')}&rdquo;
                  </div>
                </div>
              )}

              <ul className="list-disc pl-4 space-y-1.5 text-body leading-snug" style={{ color: LYKA.muted }}>
                {splitBullets(stage[col.key]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Honest about a defect in the source deck rather than papering over it. */}
        {(isTruncatedDescriptor(emotional.label) || isTruncatedDescriptor(rational.label)) && (
          <p className="px-5 pb-2 text-meta flex-shrink-0" style={{ color: LYKA.muted }}>
            Note: a score descriptor for this stage is cut off in the source deck. Shown as
            supplied, not completed.
          </p>
        )}
      </div>
    </div>
  );
};

export default JourneySpine;
