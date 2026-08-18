import React, { useState } from 'react';
import { LYKA, OWNER_COLORS } from '../../data/brand';
import { PRACTICE_STEPS, ACTOR_LABEL, CoworkActor } from '../../data/notionCoworkingData';

// -----------------------------------------------------------------------------
// Section D (bottom): how it feels in practice (slide 6).
//
// Four step cards, each carrying an actor tag (Lyka / SPEED / Both) in the
// two-party colours from OWNER_COLORS. `both` is a joint moment, so it takes the
// page's dark teal rather than either owner hue.
//
// Hovering a step highlights its actor CONSISTENTLY ACROSS THE STRIP: every card
// that shares the hovered card's actor lights its tag, the others dim. That is
// the point of the strip, that the two teams alternate and meet.
//
// Text on every actor fill is that set's paired ink (white): green 5.06:1, red
// 4.61:1, teal well past AA. Never a hardcoded text-white on an unchecked fill.
// -----------------------------------------------------------------------------

const actorFill = (actor: CoworkActor): string =>
  actor === 'lyka' ? OWNER_COLORS.lyka.base : actor === 'speed' ? OWNER_COLORS.speed.base : LYKA.tealDeepest;

const PracticeWalkthrough: React.FC = () => {
  const [activeActor, setActiveActor] = useState<CoworkActor | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {PRACTICE_STEPS.map((step) => {
        const highlit = activeActor !== null && activeActor === step.actor;
        const dimmed = activeActor !== null && activeActor !== step.actor;
        const fill = actorFill(step.actor);
        return (
          <article
            key={step.number}
            onMouseEnter={() => setActiveActor(step.actor)}
            onMouseLeave={() => setActiveActor(null)}
            onFocus={() => setActiveActor(step.actor)}
            onBlur={() => setActiveActor(null)}
            tabIndex={0}
            className={`flex flex-col rounded-2xl border bg-white p-5 outline-none transition-all duration-300 ease-out focus-visible:ring-2 ${
              highlit ? '-translate-y-1 shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)]' : ''
            } ${dimmed ? 'opacity-55' : 'opacity-100'}`}
            style={{ borderColor: highlit ? fill : LYKA.border }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-title leading-none"
                style={{ color: LYKA.tealDeepest }}
              >
                {step.number}
              </span>
              {/* Actor tag. Filled when its actor is active, hairline otherwise,
                  so the alternation reads at a glance and on hover. */}
              <span
                className="rounded-full px-2.5 py-1 text-micro font-bold uppercase font-mono transition-all duration-300"
                style={
                  highlit
                    ? { backgroundColor: fill, color: '#FFFFFF', letterSpacing: '0.08em' }
                    : { border: `1px solid ${fill}`, color: fill, letterSpacing: '0.08em' }
                }
              >
                {ACTOR_LABEL[step.actor]}
              </span>
            </div>
            <h4 className="mt-3 text-lead font-semibold" style={{ color: LYKA.ink }}>
              {step.title}
            </h4>
            <p className="mt-1.5 text-body leading-relaxed" style={{ color: LYKA.muted }}>
              {step.body}
            </p>
          </article>
        );
      })}
    </div>
  );
};

export default PracticeWalkthrough;
