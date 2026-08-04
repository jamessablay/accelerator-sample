import React from 'react';
import { LYKA } from '../../data/brand';
import { TRACKING } from '../../data/type';

// -----------------------------------------------------------------------------
// A section that is BUILT but has no Lyka data yet.
//
// This exists because two pages, the Interactive Media Plan and APEX by SPEED,
// still carry HAMILTON ISLAND content: a travel media plan and an affluent
// traveller Roy Morgan pull. Showing either to Lyka presents another client's
// figures under Lyka labels, which is the highest severity honesty failure this
// deck can make. Neither page is deleted, because both are complete and reusable
// the moment their input lands; they are simply not what a viewer sees.
//
// It follows BusinessDashboard's empty state deliberately, and that page is the
// reason the pattern is right: a designed statement of what will be here reads
// as a roadmap, whereas a blank pane or a hidden nav item reads as a gap.
//
// THE COPY IS THE POINT. Each instance names the ONE input that unblocks it, so
// the page doubles as the ask. Keep `needs` specific enough to action.
// -----------------------------------------------------------------------------

export interface PendingSectionProps {
  /** Page h1. Matches the real page's heading so nothing moves when it lands. */
  title: string;
  /** Page subtitle, likewise. */
  subtitle: string;
  /** The section's own nav icon, rendered in the disc. Any `h-6 w-6` icon. */
  icon: React.ReactNode;
  /** The empty state h2. A statement of what the section will say. */
  heading: string;
  /** One or two sentences under it. */
  body: React.ReactNode;
  /** What the section will carry. Rendered as a two column chip grid. */
  items: readonly string[];
  /** The single input that unblocks it. Rendered as the closing ask. */
  needs: React.ReactNode;
}

const PendingSection: React.FC<PendingSectionProps> = ({
  title,
  subtitle,
  icon,
  heading,
  body,
  items,
  needs,
}) => (
  <div className="animate-fadeIn h-full flex flex-col">
    <header className="flex-shrink-0 pb-2 md:pb-4 md:mr-[92px]">
      <h1 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--lyka-teal-deep)' }}>
        {title}
      </h1>
      <p className="mt-3 text-base md:text-xl max-w-4xl" style={{ color: 'var(--lyka-muted)' }}>
        {subtitle}
      </p>
    </header>

    <div
      className="flex-1 mt-6 rounded-2xl border overflow-hidden"
      style={{ borderColor: 'var(--lyka-mint)' }}
    >
      {/* overflow-y-auto, not overflow-hidden. Same reason as the Ten Things
          frame: a one screen design is an intent, not a licence to clip at
          200% zoom. */}
      <div
        className="h-full w-full overflow-y-auto custom-scrollbar flex items-center justify-center p-8 md:p-12"
        style={{ backgroundColor: 'var(--lyka-cream)' }}
      >
        <div className="max-w-2xl text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: 'var(--lyka-accent-ink)' }}
          >
            {icon}
          </div>

          <p
            className="mt-6 font-mono text-micro font-medium uppercase"
            style={{ letterSpacing: TRACKING.eyebrow, color: LYKA.accentInk }}
          >
            Awaiting Lyka data
          </p>

          <h2
            className="mt-3 text-2xl md:text-3xl font-display"
            style={{ color: 'var(--lyka-teal-deep)' }}
          >
            {heading}
          </h2>

          <p className="mt-4 text-body md:text-lead leading-relaxed" style={{ color: LYKA.muted }}>
            {body}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 text-left">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 rounded-lg border bg-white px-3.5 py-2.5 text-label"
                style={{ borderColor: 'var(--lyka-mint)', color: LYKA.ink }}
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: LYKA.accent }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* The ask. Tangerine rail, matching the provenance notices elsewhere
              in the deck, so "this is a caveat" reads the same everywhere. */}
          <div
            className="mt-8 flex items-start gap-3 rounded-xl border-l-[3px] bg-white px-4 py-3 text-left"
            style={{ borderColor: LYKA.tangerine }}
          >
            <div>
              <p
                className="font-mono text-micro font-medium uppercase"
                style={{ letterSpacing: TRACKING.eyebrow, color: '#8C3D24' }}
              >
                To turn this on
              </p>
              <p className="mt-1.5 text-label leading-relaxed" style={{ color: LYKA.ink }}>
                {needs}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PendingSection;
