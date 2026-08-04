import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Persona } from '../data/personasData';
import { stageMetrics } from '../data/audienceModel';
import PersonaDetail from '../components/personas/PersonaDetail';
import XIcon from '../components/icons/XIcon';
import { categoryData } from '../data/categoryData';
import CategoryDetailComponent from '../components/personas/CategoryDetail';
import VariantSwitcher from '../components/shared/VariantSwitcher';
import { useVariant } from '../hooks/useVariant';
import {
  PERSONA_VARIANTS,
  PERSONA_VARIANT_IDS,
  DEFAULT_PERSONA_VARIANT,
  getPersonaVariant,
} from '../components/personas/variants';
import type { PersonaVariantId } from '../components/personas/variants';

/**
 * Thin host. It owns the two selections and the variant choice, and nothing else.
 * Every view renders the same model and drives the same two detail panels, so the
 * content layer is identical across all four and only the encoding changes.
 *
 * Two layout shapes:
 *   'square' keeps the sunburst's centred aspect-square frame and slides it left
 *            when a panel opens, which is what the wheel was built for.
 *   'wide'   lets the view fill the width, and a panel OVERLAYS it at full size.
 *
 * WHY THE WIDE PANEL IS AN OVERLAY AND NOT A SIDE PANEL.
 * It used to add `md:pr-[47%]`, squeezing the view to 53% width. That reads as
 * free because the wide views are percentage based, but two of the three are
 * SVG, so everything inside them scales with the box: Flow's fit rating rendered
 * at about 4.3px and its legend at about 5.2px. You were not seeing the chart and
 * the detail together, you were seeing an unreadable chart next to the detail.
 * The panel now covers the view, which also gives PersonaDetail the ~1048px it
 * needs for the video-beside-prose layout it was written for.
 */
const Personas: React.FC = () => {
  const [variantId, setVariantId] = useVariant<PersonaVariantId>(
    'pv',
    'lyka.personaVariant',
    PERSONA_VARIANT_IDS,
    DEFAULT_PERSONA_VARIANT,
  );
  const variant = getPersonaVariant(variantId);
  const Viz = variant.Component;
  const isSquare = variant.shape === 'square';

  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

  const handleSelectPersona = useCallback((persona: Persona) => {
    setSelectedPersona(persona);
    setSelectedCategoryKey(null);
  }, []);

  const handleCloseDetail = useCallback(() => setSelectedPersona(null), []);

  const handleSelectCategory = useCallback((categoryKey: string) => {
    setSelectedCategoryKey(categoryKey);
    setSelectedPersona(null);
  }, []);

  const handleCloseCategoryDetail = useCallback(() => setSelectedCategoryKey(null), []);

  const selectedCategoryData = useMemo(() => {
    if (!selectedCategoryKey) return null;
    return categoryData[selectedCategoryKey] || null;
  }, [selectedCategoryKey]);

  // The personas in the selected stage, so the Segment Deep Dive can hand off to
  // one. The wide views open their panel as a full overlay, so the chart behind
  // it cannot be clicked, and a stage band is the biggest target in both the
  // Ladder and the Flow. Without this the panel is a dead end. The centre disc
  // has no stage of its own, hence the empty fallback.
  const selectedStagePersonas = useMemo(
    () => stageMetrics.find(s => s.key === selectedCategoryKey)?.personas ?? [],
    [selectedCategoryKey],
  );

  const hasSelection = !!selectedPersona || !!selectedCategoryKey;

  const handleBackgroundClick = useCallback(() => {
    if (hasSelection) {
      setSelectedPersona(null);
      setSelectedCategoryKey(null);
    }
  }, [hasSelection]);

  // The wide panel now covers the view, so a click-outside target is a thin
  // margin rather than most of the page. Escape is the expected way out of
  // anything that behaves like a dialog.
  useEffect(() => {
    if (!hasSelection) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPersona(null);
        setSelectedCategoryKey(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasSelection]);

  // Switching view clears the selection: a persona panel left open over a
  // different encoding reads as a bug.
  const handleVariantChange = useCallback(
    (id: PersonaVariantId) => {
      setVariantId(id);
      setSelectedPersona(null);
      setSelectedCategoryKey(null);
    },
    [setVariantId],
  );

  return (
    <div className="animate-fadeIn h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 pb-2 md:pb-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {/* Smaller on the wide views. The switcher and the Lyka wordmark take
                the right of this row, and at 1280 the full size h1 wrapped to two
                lines, which came straight out of the visualisation's height.
                Wide is `display` (30) rather than the old text-4xl (36): the
                header and the body copy compete for the same vertical, and 6px
                here pays for most of the reading-floor lift below. */}
            <h1
              className={`font-display ${isSquare ? 'text-3xl md:text-5xl' : 'text-2xl md:text-display'}`}
              style={{ color: 'var(--lyka-teal-deep)' }}
            >
              Lyka Audience Architecture
            </h1>
            <p
              className={`mt-1.5 max-w-3xl ${isSquare ? 'text-sm md:text-lg' : 'text-body md:text-lead'}`}
              style={{ color: 'var(--lyka-muted)' }}
            >
              Five personas across a four stage readiness ladder. {variant.hint}
            </p>
            {/* True of the wheel only, which is why it is conditional. The other
                three views encode market share as size. */}
            {!variant.proportional && (
              <p className="mt-1.5 text-meta max-w-3xl" style={{ color: 'var(--lyka-muted)' }}>
                Quadrants are equal for legibility, not proportional to size. Real shares are on
                every wedge and panel.
              </p>
            )}
          </div>
          <div className="pt-1 hidden sm:block">
            <VariantSwitcher
              options={PERSONA_VARIANTS}
              value={variantId}
              onChange={handleVariantChange}
              ariaLabel="Persona visualisation"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden" onClick={handleBackgroundClick}>
        {/* Visualisation */}
        <div
          className={[
            'absolute inset-0 transition-all duration-500 ease-in-out',
            isSquare
              ? 'flex justify-center items-center'
              : // `flex` + `m-auto` on the child is the centring idiom that still
                // scrolls correctly when the content is taller than the box.
                // `items-center` would clip the top and make it unreachable.
                'overflow-y-auto custom-scrollbar flex justify-center',
            isSquare && hasSelection
              ? 'opacity-0 scale-90 pointer-events-none md:opacity-100 md:scale-100 md:pointer-events-auto md:-translate-x-[30%]'
              : '',
            // The wide views keep their FULL width when a panel opens. The panel
            // overlays them instead. See the component header for why: the old
            // `md:pr-[47%]` halved every glyph in the two SVG views.
            !isSquare && hasSelection ? 'opacity-0 md:opacity-30 md:pointer-events-none' : '',
          ].join(' ')}
          style={{ willChange: 'transform, opacity' }}
        >
          {isSquare ? (
            <div
              className={`relative transition-all duration-500 ease-in-out p-2 md:p-4 bg-white rounded-full shadow-[0_12px_28px_-12px_rgba(0,86,72,0.22)] border border-[#DBE6DC] aspect-square w-[90vw] max-w-[400px] md:w-[70vh] md:max-w-none md:max-h-[90%] ${
                hasSelection ? 'md:w-[55vh]' : ''
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <Viz
                stages={stageMetrics}
                selectedPersonaId={selectedPersona?.id ?? null}
                selectedStageKey={selectedCategoryKey}
                onSelectPersona={handleSelectPersona}
                onSelectStage={handleSelectCategory}
              />
            </div>
          ) : (
            // `fills` views take the whole box height; the SVG views keep
            // `my-auto` and their natural, width-derived height. Stretching an
            // h-auto SVG would letterbox the drawing rather than enlarge it.
            <div
              className={
                variant.fills
                  ? 'w-full px-1 py-2 h-full flex flex-col min-h-0'
                  : 'w-full px-1 my-auto py-2'
              }
            >
              <Viz
                stages={stageMetrics}
                selectedPersonaId={selectedPersona?.id ?? null}
                selectedStageKey={selectedCategoryKey}
                onSelectPersona={handleSelectPersona}
                onSelectStage={handleSelectCategory}
              />
            </div>
          )}
        </div>

        {/* Scrim, wide views only. Without it the dimmed visualisation shows
            through the gutter either side of the panel card and reads as a
            rendering fault rather than as background. It is also the
            click-outside target, which the overlay would otherwise leave as an
            8px strip. */}
        {!isSquare && (
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 hidden md:block ${
              hasSelection ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ backgroundColor: 'rgba(255, 251, 237, 0.82)' }}
            aria-hidden="true"
          />
        )}

        {/* Detail panel. Side panel for the wheel, full overlay for the wide
            views (see the component header). */}
        <div
          className={`absolute top-0 right-0 h-full w-full transition-transform duration-500 ease-in-out z-20 ${
            isSquare ? 'md:w-3/5 md:z-auto' : 'md:w-full'
          } ${hasSelection ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
          style={{ willChange: 'transform' }}
        >
          <div
            className={`h-full w-full py-2 md:py-4 ${
              // The wheel's panel butts against the wheel, so it keeps the
              // asymmetric gutter. The overlay is symmetric.
              isSquare ? 'pr-0 md:pr-2 pl-0 md:pl-4' : 'px-0 md:px-2'
            }`}
          >
            {(selectedPersona || selectedCategoryData) && (
              <>
                {selectedPersona && (
                  <div
                    key={selectedPersona.id}
                    className="bg-white rounded-none md:rounded-2xl shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] w-full h-full flex flex-col animate-fadeIn border-l md:border border-[#DBE6DC] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 md:p-6 border-b flex justify-between items-center z-10">
                      <div className="pr-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#143C33] leading-tight">
                          {selectedPersona.name}
                        </h2>
                        {/* Wraps rather than truncates: in the narrower wide-view
                            panel the ellipsis was eating "customers", which is
                            half of the pairing the whole model turns on. */}
                        <p className="text-body md:text-lead text-[#5B6E64] mt-1 leading-snug">{`${selectedPersona.stageLabel} | ${selectedPersona.marketShare} of market | ${selectedPersona.customerShare} of Lyka customers`}</p>
                      </div>
                      <button
                        onClick={handleCloseDetail}
                        className="p-2 rounded-full bg-[#F0F2E9] text-[#5B6E64] hover:bg-[#DBE6DC] hover:text-[#143C33] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A7D68]"
                        aria-label="Close details"
                      >
                        <XIcon />
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {/* NOBODY STACKS ANY MORE, and that is a restoration, not
                          a new decision.
                          `stacked` exists because PersonaDetail's side-by-side
                          layout is gated on the xl: VIEWPORT query while the real
                          constraint is PANEL width. It was passed for the WIDE
                          views, whose panel used to be about 480px.
                          The wheel was never stacked: media left, content right,
                          inherited from Hamilton Island. Keep it that way.
                          The wide views now get a full width overlay, about
                          1048px at 1440, so two columns is right there too. */}
                      <PersonaDetail persona={selectedPersona} />
                    </div>
                  </div>
                )}
                {selectedCategoryData && (
                  <div
                    key={selectedCategoryKey}
                    className="bg-white rounded-none md:rounded-2xl shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] w-full h-full flex flex-col animate-fadeIn border-l md:border border-[#DBE6DC] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 md:p-6 border-b flex justify-between items-center z-10">
                      <div className="pr-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#143C33] leading-tight">
                          {selectedCategoryData.title}
                        </h2>
                        <p className="text-sm md:text-lg text-[#5B6E64] mt-1">Segment Deep Dive</p>
                      </div>
                      <button
                        onClick={handleCloseCategoryDetail}
                        className="p-2 rounded-full bg-[#F0F2E9] text-[#5B6E64] hover:bg-[#DBE6DC] hover:text-[#143C33] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A7D68]"
                        aria-label="Close details"
                      >
                        <XIcon />
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <CategoryDetailComponent
                        category={selectedCategoryData}
                        personas={selectedStagePersonas}
                        onSelectPersona={handleSelectPersona}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personas;
