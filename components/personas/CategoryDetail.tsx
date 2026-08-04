
import React from 'react';
import { CategoryDetail, categoryData } from '../../data/categoryData';
import { getSegmentColor, LYKA } from '../../data/brand';
import { TRACKING } from '../../data/type';
import type { PersonaMetrics } from '../../data/audienceModel';
import type { Persona } from '../../data/personasData';

interface CategoryDetailProps {
  category: CategoryDetail;
  /**
   * The personas sitting in this stage, so the panel is not a dead end.
   *
   * WHY THIS EXISTS. The wide views open their panel as a FULL OVERLAY, which
   * means the visualisation behind it is covered and cannot be clicked. A stage
   * band is the biggest, most obvious target in the Ladder and the Flow, so it is
   * what gets clicked first, and before this the only way on to a persona was to
   * close the panel and hunt for a chip. The reasonable conclusion from that dead
   * end was "the new views have no persona detail at all".
   */
  personas?: PersonaMetrics[];
  onSelectPersona?: (persona: Persona) => void;
}

/**
 * Optional emblem image per segment, keyed by `category.title`.
 *
 * POPULATED 2026-08-04, one emblem per readiness stage. It was empty from the
 * conversion until then: Hamilton Island's five illustrated travel emblems could
 * not ship on a Lyka deck, and rather than fall back to a decorative icon the
 * panel led with the two real share figures.
 *
 * KEYS MUST EQUAL `categoryData[k].title` BYTE FOR BYTE, parenthetical share
 * included, or the image silently does not render. That is why the ugly
 * `(49%)` is in the key. data/__integrity.ts asserts the join both ways.
 *
 * **The centre disc has no emblem, deliberately.** Four were supplied, one per
 * stage; "Australian Dog Owners" is the whole market rather than a stage, and
 * inventing one for it would mean either reusing a stage's art, which would say
 * something false, or generating art nobody briefed.
 */
export const SEGMENT_IMAGES: Record<string, string> = {
  'Unaware / Unconvinced (49%)': '/snapshot_emblems/unaware.png',
  'Curious (25%)': '/snapshot_emblems/curious.png',
  'Considering (15%)': '/snapshot_emblems/considering.png',
  'Ready (11%)': '/snapshot_emblems/ready.png',
};

/** Resolve the segment key from its title, so the panel can colour-match its wedge. */
const keyForTitle = (title: string): string =>
  Object.keys(categoryData).find(k => categoryData[k].title === title) ?? title;

const CategoryDetailComponent: React.FC<CategoryDetailProps> = ({
  category,
  personas,
  onSelectPersona,
}) => {
  const imageSrc = SEGMENT_IMAGES[category.title];
  const [imageFailed, setImageFailed] = React.useState(false);

  React.useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  const showImage = !!imageSrc && !imageFailed;
  const colors = getSegmentColor(keyForTitle(category.title));

  // Strip the parenthetical share off the heading: it is shown as a figure below.
  const heading = category.title.replace(/\s*\([^)]*\)\s*$/, '');

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="min-h-full w-full p-6 xl:p-10 flex items-start justify-center">
        <div className="max-w-3xl w-full">
          <div
            className="bg-white rounded-[2rem] overflow-hidden border"
            style={{ borderColor: LYKA.mint, boxShadow: LYKA.shadow }}
          >
            {/* Stage band, coloured to match its wedge on the wheel. */}
            <div className="px-8 py-7 xl:px-10" style={{ backgroundColor: colors.base }}>
              <p
                className="font-mono text-micro font-medium uppercase"
                style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: TRACKING.eyebrow }}
              >
                Readiness stage
              </p>
              <h3 className="mt-2 font-display text-3xl xl:text-4xl text-white leading-tight">{heading}</h3>
              {category.movement && (
                <p className="mt-3 text-lead leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {category.movement}
                </p>
              )}
            </div>

            {/* The two real figures. The gap between them is the commercial story. */}
            {(category.marketShare || category.customerShare) && (
              <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: LYKA.mint }}>
                {[
                  { label: 'of dog-owner market', value: category.marketShare },
                  { label: 'of Lyka customers', value: category.customerShare },
                ].map(stat => (
                  <div key={stat.label} className="px-6 py-5 text-center" style={{ backgroundColor: LYKA.cream }}>
                    <p className="font-display text-3xl" style={{ color: LYKA.tealDeepest }}>{stat.value ?? '—'}</p>
                    <p
                      className="mt-1 font-mono text-micro font-medium uppercase"
                      style={{ color: LYKA.muted, letterSpacing: TRACKING.eyebrow }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* THE WAY ON TO A PERSONA, and it sits ABOVE the prose on purpose.
                See the note on the `personas` prop for why the panel would
                otherwise be a dead end. It was first placed under the
                description, which put it below the fold of this scrolling pane,
                so it may as well not have existed. "Who is in this stage" is a
                navigation question, and navigation belongs at the top. */}
            {!!personas?.length && onSelectPersona && (
              <div
                className="px-8 pt-7 xl:px-10"
                style={{ backgroundColor: LYKA.ivory, borderBottom: `1px solid ${LYKA.mint}` }}
              >
                <p
                  className="font-mono text-micro font-medium uppercase"
                  style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
                >
                  {personas.length === 1 ? 'Persona in this stage' : 'Personas in this stage'}
                </p>
                <div className="mt-3 pb-7 grid gap-2 sm:grid-cols-2">
                  {personas.map(pm => {
                    const c = getSegmentColor(pm.persona.category);
                    const initials = pm.persona.name
                      .split(/\s+/)
                      .map(w => w[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <button
                        key={pm.persona.id}
                        onClick={() => onSelectPersona(pm.persona)}
                        className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-shadow hover:shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)] focus:outline-none focus-visible:ring-2"
                        style={{ borderColor: LYKA.mint, backgroundColor: c.tint }}
                        title={`Open the ${pm.persona.name} persona, including its film slot`}
                      >
                        <span
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-display text-meta"
                          style={{ backgroundColor: c.base, color: '#FFFFFF' }}
                          aria-hidden="true"
                        >
                          {initials}
                        </span>
                        <span className="min-w-0">
                          <span
                            className="block text-body font-semibold leading-tight"
                            style={{ color: c.tintInk }}
                          >
                            {pm.persona.name}
                          </span>
                          <span
                            className="block font-mono text-meta leading-tight"
                            style={{ color: c.tintInk, opacity: 0.85 }}
                          >
                            {pm.marketPct}% market | {pm.customerPct}% customers
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="px-8 py-8 xl:px-10 xl:py-9">
              {showImage && (
                <div className="mb-7 flex justify-center">
                  <img
                    src={imageSrc}
                    alt={category.title}
                    className="w-40 h-auto object-contain"
                    onError={() => setImageFailed(true)}
                  />
                </div>
              )}

              <p
                className="font-mono text-micro font-medium uppercase"
                style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}
              >
                Snapshot
              </p>

              {category.snapshot && (
                <p className="mt-3 text-title leading-relaxed font-semibold" style={{ color: LYKA.tealDeepest }}>
                  {category.snapshot}
                </p>
              )}

              {category.description && (
                <p className="mt-4 leading-relaxed text-lead" style={{ color: LYKA.ink }}>
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <p className="mt-4 px-2 text-meta leading-relaxed" style={{ color: LYKA.muted }}>
            Source: Roy Morgan Single Source stage definitions and the Lyka audience persona study.
            Market and customer shares are quoted from that study and each set sums to 100%.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CategoryDetailComponent);
