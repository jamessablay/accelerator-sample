import React, { useState, useCallback } from 'react';
import { JourneyType } from '../types';
import { journeyMetricsByType, journeyMetrics } from '../data/journeyModel';
import { TAB_ORDER } from '../data/journeyMeta';
import { getSegmentColor, LYKA } from '../data/brand';
import { TRACKING } from '../data/type';
import VariantSwitcher from '../components/shared/VariantSwitcher';
import { useVariant } from '../hooks/useVariant';
import {
  JOURNEY_VARIANTS,
  JOURNEY_VARIANT_IDS,
  DEFAULT_JOURNEY_VARIANT,
  getJourneyVariant,
} from '../components/journey/variants';
import type { JourneyVariantId } from '../components/journey/variants';

/**
 * Thin host. It owns the persona tab and the variant choice.
 *
 * Journeys are per PERSONA, not per readiness stage, because that is how the
 * source deck models it. The tab strip is therefore a persona selector, ordered
 * up the readiness ladder to match the Personas page.
 *
 * ALL COPY AND ALL FIGURES NOW COME THROUGH data/journeyMeta.ts, which joins to a
 * persona by id. The stage, its colour, the market share and the customer share
 * are derived from that persona rather than restated here. The previous version
 * hand-duplicated all four, so a journey could disagree with its own persona.
 */
const CustomerJourney: React.FC = () => {
  const [variantId, setVariantId] = useVariant<JourneyVariantId>(
    'jv',
    'lyka.journeyVariant',
    JOURNEY_VARIANT_IDS,
    DEFAULT_JOURNEY_VARIANT,
  );
  const variant = getJourneyVariant(variantId);
  const Viz = variant.Component;

  const [selectedJourneyType, setSelectedJourneyType] = useState<JourneyType>(
    JourneyType.CONFLICTED_TROUBLESHOOTERS,
  );

  const handleJourneyTypeChange = useCallback((journeyType: JourneyType) => {
    setSelectedJourneyType(journeyType);
  }, []);

  const active = journeyMetricsByType[selectedJourneyType];
  const activeColor = getSegmentColor(active.segmentKey);
  const stageLabel = active.persona?.persona.stageLabel ?? active.segmentKey;

  return (
    // THE COMPACT VIEWS ARE A FIXED FRAME, NOT A LONG PAGE.
    //
    // Chasing one-viewport fit by trimming padding does not converge: 25
    // persona-by-stage combinations each have a different tallest column, so any
    // set of fixed heights is wrong for some of them. Instead the header, tabs
    // and footnote are fixed, the view gets the remaining height, and anything
    // that does not fit scrolls INSIDE the view.
    //
    // `overflow-y-auto`, NOT `overflow-hidden`. At 1440x900 and 1280x800 this
    // frame does not scroll, so the one-viewport design is intact and measured
    // page overflow is 0. But `overflow-hidden` meant that once the fixed rows
    // alone exceeded the box, content was simply GONE: at 200% browser zoom the
    // spine lost 102px off the bottom, footnote included, with no way to reach
    // it. That is a WCAG 1.4.4 failure, and a fixed frame is a design intent, not
    // a reason to destroy content. Auto degrades to a scrollbar instead.
    //
    // The baseline table keeps the original long-page layout. Giving it the same
    // treatment would flatter the comparison.
    <div
      className={
        variant.compactHeader
          ? 'animate-fadeIn h-full flex flex-col overflow-y-auto custom-scrollbar pb-1'
          : 'animate-fadeIn pb-10 md:pb-16'
      }
    >
      <div className="flex items-start justify-between gap-4 flex-shrink-0">
        <div className="min-w-0">
          <p
            className="font-mono text-micro font-medium uppercase"
            style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
          >
            {stageLabel}
            {' | '}
            {active.persona?.marketPct}% of market | {active.persona?.customerPct}% of Lyka
            customers
          </p>

          {/* Type steps down on the compact views. At 1280x800 the full size h1
              wraps to two lines and the task to three, which is 50px taken
              straight out of the detail pane below. Compact is now `display`
              (30) rather than the old 1.95rem (31.2): a hair smaller, and one
              step on the scale instead of a bespoke rem value. */}
          <h1
            className={`mt-1 leading-tight font-display ${
              variant.compactHeader ? 'text-2xl md:text-display' : 'text-3xl md:text-[2.6rem]'
            }`}
            style={{ color: 'var(--lyka-teal-deep)' }}
          >
            {active.meta.title}
          </h1>

          {/* The behaviour-change task: the single sentence that defines this journey. */}
          <p
            className={`mt-1.5 font-semibold max-w-4xl leading-snug ${
              variant.compactHeader ? 'text-body md:text-lead' : 'text-base md:text-xl'
            }`}
            style={{ color: activeColor.base }}
          >
            {active.meta.description}
          </p>
        </div>

        <div className="pt-1 hidden sm:block">
          <VariantSwitcher
            options={JOURNEY_VARIANTS}
            value={variantId}
            onChange={setVariantId}
            ariaLabel="Consumer journey visualisation"
          />
        </div>
      </div>

      {/* The 90 word journey dynamic. Inline on the baseline, behind a disclosure
          everywhere else: it is context rather than content, and it is the single
          biggest block of header height. */}
      {variant.compactHeader ? (
        <details className="mt-2 max-w-4xl group flex-shrink-0">
          <summary
            className="cursor-pointer text-label font-semibold list-none inline-flex items-center gap-1.5 select-none"
            style={{ color: LYKA.accentInk }}
          >
            <span className="transition-transform group-open:rotate-90">&rsaquo;</span>
            Journey dynamic
          </summary>
          <p className="mt-1.5 text-body leading-relaxed" style={{ color: LYKA.muted }}>
            {active.meta.dynamic}
          </p>
        </details>
      ) : (
        <p className="mt-3 text-sm md:text-base max-w-4xl leading-relaxed" style={{ color: LYKA.muted }}>
          {active.meta.dynamic}
        </p>
      )}

      {/* Persona selector, ordered up the readiness ladder. */}
      <div
        className={`flex flex-wrap gap-2 border-b pb-2.5 pt-1 flex-shrink-0 ${
          variant.compactHeader ? 'mt-2.5 mb-3' : 'my-4'
        }`}
        style={{ borderColor: 'var(--lyka-mint)' }}
      >
        {TAB_ORDER.map((journeyType) => {
          const j = journeyMetricsByType[journeyType];
          const isSelected = selectedJourneyType === journeyType;
          return (
            <button
              key={journeyType}
              onClick={() => handleJourneyTypeChange(journeyType)}
              className={`px-4 py-2 text-label md:text-body font-semibold rounded-full transition-colors duration-200 focus:outline-none whitespace-nowrap ${
                isSelected ? 'text-white' : 'hover:bg-[#F0F2E9]'
              }`}
              style={
                isSelected
                  ? { backgroundColor: getSegmentColor(j.segmentKey).base }
                  : { color: 'var(--lyka-ink)' }
              }
            >
              {j.meta.label}
            </button>
          );
        })}
      </div>

      <div className={variant.compactHeader ? 'flex-1 min-h-0' : undefined}>
        <Viz
          journeys={journeyMetrics}
          active={active}
          onSelectJourney={handleJourneyTypeChange}
          onRequestVariant={setVariantId}
        />
      </div>

      <p
        className={`max-w-4xl ${
          variant.compactHeader
            ? 'mt-1.5 text-meta leading-snug flex-shrink-0'
            : 'mt-4 text-meta leading-relaxed'
        }`}
        style={{ color: LYKA.muted }}
      >
        Five journeys on the Transtheoretical model of behaviour change, one per persona.
        Source: the Lyka consumer journeys study. Emotional and rational scores are that
        study&apos;s own 0 to 100 ratings, not derived. Any gap or lead mode shown alongside
        them is arithmetic SPEED performs on those scores.
      </p>
    </div>
  );
};

export default CustomerJourney;
