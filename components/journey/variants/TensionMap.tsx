import React from 'react';
import JourneyScoreGraph from '../JourneyScoreGraph';
import { LYKA, getSegmentColor } from '../../../data/brand';
import {
  SHARED_SCORE_DOMAIN,
  LEAD_MODE_THRESHOLDS,
  JOURNEY_STAGE_NAMES,
} from '../../../data/journeyModel';
import { TRACKING } from '../../../data/type';
import type { JourneyMetrics } from '../../../data/journeyModel';
import type { JourneyVizProps } from './types';

// -----------------------------------------------------------------------------
// TENSION MAP
//
// THE FIX: the original page can only ever show one journey, on an axis that
// rescales per journey. So the five curves have never been comparable, and one
// finding sitting in the data has never been visible:
//
//   The two Unaware personas are the ONLY ones where rational runs 40 points
//   ahead of emotional at Precontemplation. They can argue themselves into their
//   current food. Everyone else is emotion first.
//
// That is the belief gap, quantified from the study's own scores.
//
// ⚠ `gap` AND `leadMode` ARE DERIVED, not study ratings. The footnote says so on
// screen. Do not drop it: labelled next to five research-sourced curves, an
// unlabelled derivation reads as a finding.
//
// This view is a NAVIGATOR. Clicking a card selects that journey and hands off to
// the spine, so it is a way in rather than a dead end.
// -----------------------------------------------------------------------------

const LEAD_MODE_STYLE: Record<string, { bg: string; fg: string }> = {
  'Emotion led': { bg: '#F3DFD7', fg: '#6E2F1B' },
  'Rational led': { bg: '#D6EDE7', fg: '#075746' },
  Balanced: { bg: LYKA.cream, fg: LYKA.muted },
};

const GapBar: React.FC<{ gap: number }> = ({ gap }) => {
  // Symmetric around zero, clamped to the observed range of -40 to +25.
  const MAX = 45;
  const half = Math.min(Math.abs(gap), MAX) / MAX / 2;
  const positive = gap > 0;
  return (
    <div className="relative h-1.5 rounded-full mt-1" style={{ backgroundColor: LYKA.cream }}>
      <div className="absolute inset-y-0 left-1/2 w-px" style={{ backgroundColor: LYKA.mintMuted }} />
      <div
        className="absolute inset-y-0 rounded-full"
        style={{
          backgroundColor: positive ? '#B8571C' : LYKA.accentInk,
          left: positive ? '50%' : `${50 - half * 100}%`,
          width: `${half * 100}%`,
        }}
      />
    </div>
  );
};

const JourneyCard: React.FC<{
  journey: JourneyMetrics;
  isActive: boolean;
  onSelect: () => void;
}> = ({ journey, isActive, onSelect }) => {
  const colour = getSegmentColor(journey.segmentKey);
  const mode = LEAD_MODE_STYLE[journey.leadMode] ?? LEAD_MODE_STYLE.Balanced;
  return (
    <button
      onClick={onSelect}
      className="text-left rounded-2xl border bg-white overflow-hidden transition-shadow focus:outline-none focus-visible:ring-2 hover:shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)]"
      style={{
        borderColor: isActive ? colour.base : LYKA.mint,
        borderWidth: isActive ? 2 : 1,
        boxShadow: isActive ? LYKA.shadow : undefined,
      }}
      title={`Open the ${journey.meta.title} journey`}
    >
      <div className="px-3 pt-2.5 pb-2" style={{ backgroundColor: colour.tint }}>
        <div
          className="font-display text-lead font-bold leading-tight truncate"
          style={{ color: colour.tintInk }}
        >
          {journey.meta.title}
        </div>
        <div className="font-mono text-meta mt-0.5" style={{ color: colour.tintInk, opacity: 0.9 }}>
          {journey.persona.marketPct}% market | {journey.persona.customerPct}% customers
        </div>
      </div>

      <div className="px-3 pt-2">
        {/* `flex-wrap`, and the pill lost `whitespace-nowrap`. At five columns this
            row held a 9.5px uppercase pill and "opening gap +25" on one line
            inside about 179px of a card with `overflow-hidden`, so there was no
            escape when either grew. */}
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span
            className="px-2 py-0.5 rounded text-micro font-bold uppercase"
            style={{ backgroundColor: mode.bg, color: mode.fg, letterSpacing: TRACKING.caps }}
          >
            {journey.leadMode}
          </span>
          <span className="font-mono text-meta" style={{ color: LYKA.muted }}>
            opening gap {journey.openingGap > 0 ? '+' : ''}
            {journey.openingGap}
          </span>
        </div>
        <GapBar gap={journey.openingGap} />
      </div>

      {/* columnWidth is the ASPECT RATIO control: rendered curve height is
          cardWidth * vbHeight / (5 * columnWidth). The grid went from five ~203px
          cards to three ~345px ones, so holding 44 here would have stretched the
          curve from about 137px tall to 232px. 75 keeps the same footprint.
          Stage labels stay off because all five cards share the same five stages;
          they are named once beneath the grid. */}
      <JourneyScoreGraph
        stages={journey.stages}
        domain={SHARED_SCORE_DOMAIN}
        compact
        columnWidth={75}
        showStageLabels={false}
      />
    </button>
  );
};

const TensionMap: React.FC<JourneyVizProps> = ({
  journeys,
  active,
  onSelectJourney,
  onRequestVariant,
}) => (
  <div className="animate-fadeIn h-full flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
      <span
        className="font-mono text-micro uppercase"
        style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
      >
        All five journeys | shared 0 to 100 scale
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
      </span>
    </div>

    {/* THREE COLUMNS, NOT FIVE. At 1440 the content column is about 1056px, so
        five cards were 203px each: too narrow for a `lead` title, and the lead
        mode row had no room to wrap. Three gives ~345px and puts the fourth and
        fifth card on a second row. This view is already `overflow-y-auto`, so it
        scrolls as designed rather than clipping. */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-shrink-0">
      {journeys.map((j) => (
        <JourneyCard
          key={j.type}
          journey={j}
          isActive={j.type === active.type}
          onSelect={() => {
            onSelectJourney(j.type);
            onRequestVariant?.('spine');
          }}
        />
      ))}

      {/* THE FINDING SITS IN THE SIXTH GRID CELL, not below the grid.
          Five cards over three columns leave one slot empty, and putting the
          finding under the grid instead pushed it and the derived-metrics note
          below the internal scroll fold. That note is load bearing: `gap`,
          `openingGap` and `leadMode` are SPEED arithmetic, not study ratings, and
          a reader who never scrolls must still see that said. */}
      <div
        className="rounded-2xl border px-4 py-3 flex flex-col justify-center"
        style={{ borderColor: LYKA.mint, backgroundColor: LYKA.ivory }}
      >
        <p className="text-body leading-snug" style={{ color: LYKA.ink }}>
          <strong>The two Unaware personas are the only ones where reason runs ahead of
          feeling at the start</strong>, both by 40 points. They can argue themselves into the
          food they already buy, which is why removing friction does nothing for them and only a
          credible reason to doubt will move them. Every other persona opens emotion first.
        </p>
        <p className="mt-2 text-meta leading-snug" style={{ color: LYKA.muted }}>
          The 50 emotional and rational scores are the study&apos;s own 0 to 100 ratings. Gap,
          opening gap and lead mode are derived by SPEED: gap is emotional minus rational, and
          lead mode splits at {LEAD_MODE_THRESHOLDS.emotionLed > 0 ? '+' : ''}
          {LEAD_MODE_THRESHOLDS.emotionLed} and {LEAD_MODE_THRESHOLDS.rationalLed} on the
          Precontemplation gap.
        </p>
      </div>
    </div>

    {/* A row of five stage names spread across the grid would read as "card one
        is Precontemplation", which is wrong: every card contains all five
        stages. So it is a sentence, not a fake axis. */}
    <p className="mt-2 text-meta flex-shrink-0" style={{ color: LYKA.muted }}>
      Each curve runs left to right through {JOURNEY_STAGE_NAMES.join(', ')}. Select any journey
      to open it in full.
    </p>
  </div>
);

export default TensionMap;
