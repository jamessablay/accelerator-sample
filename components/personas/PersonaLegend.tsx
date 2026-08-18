import React from 'react';
import { getSegmentColor } from '../../data/brand';
import type { StageMetrics } from '../../data/audienceModel';
import type { Persona } from '../../data/personasData';

// -----------------------------------------------------------------------------
// The persona list that sits beside the sunburst.
//
// WHY IT EXISTS. The wheel labels are ABBREVIATED BY CONSTRUCTION: `title` is a
// short form fitted to its arc, so "Conflicted Troubleshooters" reads as
// "Troubleshooters" on the ring and "Disciplined Outsourcers" as "Outsourcers".
// The full names were reachable only by clicking a wedge. This puts all five in
// one column, in ladder order, and clicking a row opens exactly the same panel
// the wedge does.
//
// ⚠ IT INTRODUCES NO NEW INFORMATION, AND THAT CONSTRAINT IS THE DESIGN. Every
// field here is already rendered elsewhere on this page: the name and stage
// label come off the persona record and appear in the detail panel's heading,
// and the market share is the figure printed on the persona's own wedge. The
// colour is the wedge's own `lighter` fill, so a row and its wedge cannot
// disagree. Nothing is computed, ranked, summarised or captioned.
//
// NO INDEX NUMBERS, deliberately. A numbered list reads as a ranking, and these
// five are ordered by readiness stage rather than by importance. The reference
// mockup numbered them 01 to 05; the numbers carry no meaning the data supports.
//
// MARKET SHARE ONLY, not both shares. The wheel prints market share on its
// wedges, so the column matches what it sits beside. The market against customer
// inversion that the deck argues from needs both figures side by side to read at
// all, and it already has that, twice: on the stage panel and on the persona
// panel. Half of a pairing is worse than a pointer to it.
// -----------------------------------------------------------------------------

interface PersonaLegendProps {
  stages: StageMetrics[];
  selectedPersonaId: number | null;
  onSelectPersona: (persona: Persona) => void;
  className?: string;
}

const PersonaLegend: React.FC<PersonaLegendProps> = ({
  stages,
  selectedPersonaId,
  onSelectPersona,
  className = '',
}: PersonaLegendProps) => (
  // Stops propagation for the same reason the wheel does: the page treats a
  // click on the visualisation background as "close the panel", and a row here
  // would otherwise open a persona and immediately close it again.
  <div className={className} onClick={(e) => e.stopPropagation()}>
    <ul className="flex flex-col gap-1.5">
      {stages.flatMap((stage) =>
        // `persona.marketShare` is the SOURCE STRING, not the parsed number
        // beside it. The wheel prints the same string, so taking it here means
        // the column and the wedge cannot round differently.
        stage.personas.map(({ persona }) => {
          const colour = getSegmentColor(stage.key);
          const isSelected = persona.id === selectedPersonaId;
          return (
            <li key={persona.id}>
              <button
                type="button"
                onClick={() => onSelectPersona(persona)}
                aria-pressed={isSelected}
                className="group flex w-full items-center gap-2.5 rounded-card border bg-white px-3 py-2 text-left transition-[background-color,border-color,transform] duration-150 hover:-translate-y-px hover:bg-brand-surface-alt focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  // The selected row takes the wedge's own base colour as its
                  // border, which is the same language the chart uses when a
                  // wedge is selected. Everything else keeps the hairline.
                  borderColor: isSelected ? colour.base : 'var(--brand-hairline)',
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-7 w-1.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: colour.lighter }}
                />
                <span className="min-w-0 flex-1">
                  <span
                    className="block truncate text-label font-semibold"
                    style={{ color: 'var(--brand-ink-deepest)' }}
                  >
                    {persona.name}
                  </span>
                  <span
                    className="block truncate text-micro uppercase font-mono tracking-eyebrow"
                    style={{ color: 'var(--brand-ink-muted)' }}
                  >
                    {persona.stageLabel}
                  </span>
                </span>
                <span
                  className="flex-shrink-0 text-label font-bold tabular-nums"
                  style={{ color: colour.base }}
                >
                  {persona.marketShare}
                </span>
              </button>
            </li>
          );
        }),
      )}
    </ul>
    {/* The one caption, and it is the sentence the page already carried above
        the wheel rather than a new claim. */}
    <p className="mt-2.5 px-1 text-meta" style={{ color: 'var(--brand-ink-muted)' }}>
      Share of the dog owner market. Select a persona for its full profile.
    </p>
  </div>
);

export default PersonaLegend;
