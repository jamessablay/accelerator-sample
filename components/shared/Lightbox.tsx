import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// -----------------------------------------------------------------------------
// Click to enlarge, for any image.
//
// Extracted from components/mediaplan/ChannelDetail.tsx, which had this inline.
// Two consumers now: the media plan creative gallery and the Ten Things postcode
// maps. Escape and focus restore were added in the extraction.
//
// PORTALLED TO document.body, NOT to #app-content-area. This is the one overlay
// in the app that must escape the Modal's transformed, overflow-hidden card, and
// a portal into the content area would be clipped by it.
//
// -----------------------------------------------------------------------------
// THE ESCAPE LISTENER IS CAPTURE PHASE AND IT STOPS PROPAGATION.
//
// The lightbox opens ON TOP OF an already open Modal, which has its own Escape
// handler on the bubble phase. Without the capture phase plus stopPropagation,
// one Escape closes both and the reader is thrown back to the grid from a map
// they were only trying to shrink. The original standalone page solved this with
// a global `window.__zoomOpen` flag; capture phase is the same fix without the
// global.
// -----------------------------------------------------------------------------

interface LightboxProps {
  /** The image to show. Null closes it. */
  src: string | null;
  alt?: string;
  onClose: () => void;
  /** Shown along the bottom. Defaults to the click and Escape hint. */
  hint?: string;
}

const Lightbox: React.FC<LightboxProps> = ({
  src,
  alt = 'Enlarged image',
  onClose,
  hint = 'Click anywhere or press Escape to close',
}) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!src) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Capture phase plus stopPropagation, so the Modal underneath stays open.
      e.stopPropagation();
      onClose();
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      openerRef.current?.focus?.();
    };
  }, [src, onClose]);

  if (!src) return null;

  return createPortal(
    <div
      // BUG, shipped and invisible until the Tailwind build made it checkable:
      // this backdrop was `bg-[#003D33]/92`, and 92 is not a step in Tailwind's
      // opacity scale (it runs ...85, 90, 95, 100). A bare `/92` is a THEME
      // LOOKUP, not an arbitrary value, so the utility was never generated and
      // the overlay rendered with no background at all: an enlarged image
      // floating over an unobscured page. The CDN did exactly the same thing,
      // so this predates the build move.
      //
      // `/[0.92]` is the arbitrary form and cannot silently miss.
      className="fixed inset-0 z-[9999] flex cursor-zoom-out items-center justify-center bg-[#003D33]/[0.92] p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[92vw] rounded-lg bg-white object-contain p-5 shadow-2xl"
      />
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-5 top-4 grid h-10 w-10 place-items-center rounded-xl border border-white/25 bg-white/10 text-white transition-colors hover:bg-[#0A7D68] hover:border-[#0A7D68] focus:outline-none focus:ring-2 focus:ring-white/70"
        aria-label="Close enlarged image"
      >
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <span
        className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-micro font-mono uppercase text-white/55"
        style={{ letterSpacing: '0.08em' }}
      >
        {hint}
      </span>
    </div>,
    document.body,
  );
};

export default Lightbox;
