import React, { useState } from 'react';
import { LYKA, OWNER_COLORS } from '../../data/brand';
import { HUB } from '../../data/notionCoworkingData';

// -----------------------------------------------------------------------------
// Section B: the shared-space hub (slide 3).
//
// DOM, not SVG (the gap-matrix precedent): flex columns and connector bars get
// real CSS px for free and stack cleanly below md. The two sides are coloured
// via OWNER_COLORS, the one sanctioned reuse of the two-party palette on this
// page: green = Lyka, red = SPEED. Hovering either side dims the other, the same
// focus/dim pattern ApexMethodology uses on its source cards.
// -----------------------------------------------------------------------------

type Side = 'lyka' | 'speed';

const SharedSpaceDiagram: React.FC = () => {
  const [active, setActive] = useState<Side | null>(null);

  return (
    <div>
      <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-3">
        <TeamSide
          side="lyka"
          team={HUB.lyka.team}
          ai={HUB.lyka.ai}
          dimmed={active !== null && active !== 'lyka'}
          onEnter={() => setActive('lyka')}
          onLeave={() => setActive(null)}
        />

        <Connector />

        {/* The shared space itself: the emphasis of the diagram. */}
        <div
          className="flex-1 rounded-2xl px-6 py-6 text-center shadow-[0_18px_40px_-16px_rgba(0,86,72,0.28)]"
          style={{ backgroundColor: LYKA.tealDeepest }}
        >
          <p className="text-lead leading-tight text-white md:text-title">
            {HUB.centre}
          </p>
          <p className="mx-auto mt-2 max-w-xs text-meta leading-relaxed text-white/75">
            {HUB.centreSub}
          </p>
        </div>

        <Connector />

        <TeamSide
          side="speed"
          team={HUB.speed.team}
          ai={HUB.speed.ai}
          dimmed={active !== null && active !== 'speed'}
          onEnter={() => setActive('speed')}
          onLeave={() => setActive(null)}
        />
      </div>

      <p
        className="mx-auto mt-6 max-w-2xl text-center text-body leading-relaxed"
        style={{ color: LYKA.muted }}
      >
        {HUB.caption}
      </p>
    </div>
  );
};

interface TeamSideProps {
  side: Side;
  team: string;
  ai: string;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

const TeamSide: React.FC<TeamSideProps> = ({ side, team, ai, dimmed, onEnter, onLeave }: TeamSideProps) => {
  const accent = OWNER_COLORS[side].base;
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      className={`flex-1 rounded-2xl outline-none transition-all duration-300 ease-out focus-visible:ring-2 ${
        dimmed ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ ['--tw-ring-color' as string]: accent }}
    >
      <NodeCard label={team} accent={accent} strong />
      <div className="mx-auto h-4 w-px" style={{ backgroundColor: accent }} />
      <NodeCard label={ai} accent={accent} />
    </div>
  );
};

const NodeCard: React.FC<{ label: string; accent: string; strong?: boolean }> = ({ label, accent, strong }) => (
  <div
    className="rounded-xl border bg-white px-4 py-3 text-center"
    style={{ borderColor: LYKA.mint, borderLeft: `3px solid ${accent}` }}
  >
    <span
      className={`text-body ${strong ? 'font-semibold' : ''}`}
      style={{ color: strong ? LYKA.ink : LYKA.muted }}
    >
      {label}
    </span>
  </div>
);

// A short two-way link. Horizontal on md+, vertical when the sides stack below.
const Connector: React.FC = () => (
  <>
    <div className="mx-auto hidden h-px w-8 md:block" style={{ backgroundColor: LYKA.mint }} />
    <div className="mx-auto block h-5 w-px md:hidden" style={{ backgroundColor: LYKA.mint }} />
  </>
);

export default SharedSpaceDiagram;
