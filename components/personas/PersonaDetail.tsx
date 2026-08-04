
import React from 'react';
import { Persona } from '../../data/personasData';
import { personaVideo } from '../../data/personaMedia';
import { getSegmentColor, LYKA } from '../../data/brand';
import { TRACKING } from '../../data/type';

import ZapIcon from '../icons/ZapIcon';
import StopIcon from '../icons/StopIcon';
import UsersGroupIcon from '../icons/UsersGroupIcon';
import ChatBubbleIcon from '../icons/ChatBubbleIcon';
import InfoIcon from '../icons/InfoIcon';

interface PersonaDetailProps {
  persona: Persona;
  /**
   * Force the single-column layout regardless of viewport width.
   *
   * WHY THIS IS NEEDED. The side-by-side layout below is gated on `xl:`, which is
   * a VIEWPORT query, but the constraint is the width of the PANEL this renders
   * into. At 1440 the wide persona views give the panel about 480px, `xl:` still
   * matches, and the identity card takes 300px of it, leaving the prose two words
   * per line. Tailwind has no container query here (CDN build, no plugin), so the
   * host tells the panel which layout it can afford.
   */
  stacked?: boolean;
}

/** Lyka natural fit rating -> chip colours. Ratings are verbatim from the source doc. */
const FIT_STYLES: Record<string, { bg: string; fg: string }> = {
  'Very High': { bg: LYKA.accentInk, fg: '#FFFFFF' },
  'High Growth Potential': { bg: LYKA.tangerine, fg: LYKA.tealDeepest },
  Medium: { bg: LYKA.mint, fg: LYKA.tealDeepest },
  Low: { bg: LYKA.mintMuted, fg: LYKA.tealDeepest },
};

const DetailSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full text-white" style={{ backgroundColor: 'var(--lyka-accent-ink)' }}>
          {/* Icons are expected to be 6x6, which fits nicely in a 10x10 circle */}
          {icon}
        </div>
        <div className="ml-4">
            <h4 className="text-title font-bold text-[#143C33]">{title}</h4>
            {/* `lead`, not the old text-sm. The two prose paragraphs below carry
                no size class and inherit 16px, so 14px bullets made the pane step
                18 / 16 / 14 / 16 as you scrolled. This pane scrolls internally,
                so matching them costs nothing. */}
            <div className="mt-1 text-[#5B6E64] text-lead">{children}</div>
        </div>
    </div>
);

/**
 * The persona media slot: ALWAYS a 9:16 frame, whatever is in it.
 *
 * WHY IT IS ALWAYS RENDERED. This used to be an either/or: a 9:16 video frame if
 * `videoUrl` or `avatar` was set, otherwise a content-height identity card. Since
 * both fields are empty on every record by design, the frame never rendered and
 * the deck had no reserved place for persona film.
 *
 * The identity card is the frame's EMPTY STATE rather than an alternative to it:
 * same aspect ratio, same position, same rounded corners, same stage colour.
 *
 * **THE FILM LANDED 2026-08-04 AND NOTHING MOVED**, which was the whole point of
 * building the frame before there was anything to put in it. All five personas
 * now resolve a video through `personaVideo()`, so the empty state below no
 * longer renders for any current record. Keep it: it is what a sixth persona
 * gets, and it is the reason this slot could be designed once rather than twice.
 *
 * THE EMPTY STATE HAS TO LOOK LIKE A RESERVED FILM SLOT. First attempt kept the
 * monogram card and simply made it 9:16, which was a real container but read as
 * a coloured persona card: there was no signal that a video belongs there, and
 * the first question asked of it was "where is the video container?". A reserved
 * space that does not announce itself is not reserved. Hence the dashed well, the
 * play glyph and the explicit "awaiting footage" line.
 *
 * The films are Lyka's own. `public/personaVideos/` previously held 20 Hamilton
 * Island vignettes and was deleted during the conversion; do not reintroduce
 * another client's footage here.
 */
const PersonaMediaSlot: React.FC<{ persona: Persona; stacked?: boolean }> = ({
  persona,
  stacked = false,
}) => {
  const colors = getSegmentColor(persona.category);
  const initials = persona.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const fit = FIT_STYLES[persona.solutionFit] ?? { bg: LYKA.mint, fg: LYKA.tealDeepest };
  // Resolved, not read off the record: the film lives in data/personaMedia.ts so
  // regenerating the personas cannot delete it. See that file's header.
  const videoUrl = personaVideo(persona);
  const hasMedia = !!(videoUrl || persona.avatar);

  return (
    // WIDTH DRIVEN WHEN STACKED, HEIGHT DRIVEN IN TWO COLUMNS. A fixed 9:16 block
    // sized off width overflows a short column: the wheel's panel gives about
    // 448px of height at 1280x800, and 300px wide would demand 533. `xl:h-full
    // xl:w-auto` lets the height lead and the width follow, which is what the
    // original Hamilton video frame did.
    <div
      className={`relative w-full max-w-[280px] max-h-full aspect-[9/16] rounded-3xl overflow-hidden flex flex-col ${
        stacked ? '' : 'xl:max-w-none xl:w-auto xl:h-full'
      }`}
      style={{
        backgroundColor: hasMedia ? LYKA.tealDeepest : colors.base,
        boxShadow: LYKA.shadow,
      }}
    >
      {videoUrl ? (
        // NO `transform: scale()` HERE, DELIBERATELY. Hamilton Island's vignettes
        // had baked in black side bars and carried `scale(1.08)` to crop them.
        // The Lyka films are native 1080x1920 with full width content (verified
        // with cropdetect), so the same scale would have thrown away about 4% of
        // every edge of correctly framed portrait footage for no reason. If a
        // future film arrives pillarboxed, crop the file, not the container.
        <video
          key={videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          // The films are decorative: the panel beside them carries every fact.
          aria-hidden="true"
          src={videoUrl}
        />
      ) : persona.avatar ? (
        <img
          src={persona.avatar}
          alt={`${persona.name} avatar`}
          className="w-full h-full object-cover"
        />
      ) : (
        <>
          {/* The film well. Dashed, because a dashed boundary is the established
              read for "content goes here" and a solid one would read as a card. */}
          <div className="flex flex-1 min-h-0 flex-col p-3">
            <div
              className="flex flex-1 min-h-0 flex-col items-center justify-center rounded-2xl px-4 text-center"
              style={{
                border: '1.5px dashed rgba(255,255,255,0.38)',
                backgroundColor: 'rgba(255,255,255,0.07)',
              }}
            >
              <span
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
                style={{ border: '1.5px solid rgba(255,255,255,0.55)' }}
                aria-hidden="true"
              >
                {/* Play glyph, nudged right so it reads optically centred. */}
                <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px]" fill="#FFFFFF">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <p
                className="mt-3 font-mono text-micro font-bold uppercase text-white"
                style={{ letterSpacing: TRACKING.eyebrow }}
              >
                Persona film
              </p>
              <p className="mt-1 text-meta leading-snug" style={{ color: 'rgba(255,255,255,0.78)' }}>
                9:16 vignette. Awaiting Lyka footage.
              </p>
            </div>

            {/* Identity, below the well rather than inside it, so the well stays
                legible as an empty container. The monogram is retained from the
                original Hamilton card: it was briefly dropped when the well was
                added and its absence was noticed immediately, so it stays. */}
            <div className="flex-shrink-0 pt-3 flex items-center gap-3 min-w-0">
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full font-display text-lead"
                style={{ backgroundColor: 'rgba(255,255,255,0.16)', color: '#FFFFFF' }}
                aria-hidden="true"
              >
                {initials}
              </span>
              <div className="min-w-0 text-left">
                <p
                  className="font-mono text-micro font-medium uppercase"
                  style={{ color: 'rgba(255,255,255,0.82)', letterSpacing: TRACKING.eyebrow }}
                >
                  {persona.stageLabel}
                </p>
                <h3 className="mt-0.5 font-display text-lead text-white leading-tight">
                  {persona.name}
                </h3>
                <span
                  className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 font-mono text-micro font-bold uppercase"
                  style={{ backgroundColor: fit.bg, color: fit.fg, letterSpacing: TRACKING.eyebrow }}
                >
                  Fit: {persona.solutionFit}
                </span>
              </div>
            </div>
          </div>

          {/* The two figures. The gap between them is the argument of the whole
              model, so they keep the foot of the card. */}
          <div
            className="mt-auto grid flex-shrink-0 grid-cols-2 gap-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
          >
            {[
              { label: 'of dog-owner market', value: persona.marketShare },
              { label: 'of Lyka customers', value: persona.customerShare },
            ].map(stat => (
              <div key={stat.label} className="px-3 py-3 text-center" style={{ backgroundColor: colors.base }}>
                <p className="font-display text-figure text-white">{stat.value}</p>
                <p
                  className="mt-1 font-mono text-micro font-medium uppercase leading-snug"
                  style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: TRACKING.eyebrow }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PersonaDetail: React.FC<PersonaDetailProps> = ({ persona, stacked = false }) => {
  // `stacked` drops every xl: variant, which is exactly the pre-xl layout.
  const x = (classes: string) => (stacked ? '' : classes);

  return (
    <div
      className={`flex flex-col h-full w-full bg-white overflow-hidden ${x('xl:flex-row xl:bg-transparent')}`}
    >
      {/* Left column: the persona media slot. Always present, always 9:16. */}
      <div
        className={`flex-shrink-0 flex justify-center items-start p-6 border-b border-[#DBE6DC] ${x('xl:items-center xl:p-4 xl:h-full xl:border-b-0')}`}
      >
        <PersonaMediaSlot persona={persona} stacked={stacked} />
      </div>

      {/* Right column: the source document's content, section for section. */}
      <div className={`flex-1 overflow-y-auto p-6 custom-scrollbar ${x('xl:p-0 xl:py-4')}`}>
        <div className="flex flex-col gap-6 pr-2">

            {/* Snapshot pull-out, then the rest of the source snapshot. */}
            <div className="mb-2">
                <p className="text-[#003D33] leading-relaxed text-title font-semibold">
                    {persona.snapshot}
                </p>
                <p className="mt-3 text-[#143C33] leading-relaxed text-lead">
                    {persona.description}
                </p>
            </div>

            {/* Section titles match the source document headings exactly, so the
                deck and the research read as the same artefact. */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-8">
              <DetailSection icon={<StopIcon/>} title="Key Barriers">
                  <ul className="list-disc pl-5 space-y-1.5">{persona.barriers.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </DetailSection>

              <DetailSection icon={<ZapIcon/>} title="Key Triggers">
                  <ul className="list-disc pl-5 space-y-1.5">{persona.triggers.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </DetailSection>

              <DetailSection icon={<ChatBubbleIcon/>} title="Core Motivations">
                  <ul className="list-disc pl-5 space-y-1.5">{persona.motivations.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </DetailSection>

              <DetailSection icon={<UsersGroupIcon/>} title="Media Consumption">
                  <ul className="list-disc pl-5 space-y-1.5">{persona.influences.map((inf, i) => <li key={i}>{inf}</li>)}</ul>
              </DetailSection>

              <DetailSection icon={<InfoIcon/>} title={`Lyka Natural Fit: ${persona.solutionFit}`}>
                  {persona.fitRationale && <p className="leading-relaxed">{persona.fitRationale}</p>}
                  <p className="mt-3">
                    <span className="font-mono text-micro font-bold uppercase" style={{ color: LYKA.accentInk, letterSpacing: TRACKING.eyebrow }}>
                      Movement goal
                    </span>
                    <br />
                    <span className="font-semibold" style={{ color: LYKA.ink }}>{persona.movement}</span>
                  </p>
              </DetailSection>

            </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PersonaDetail);
