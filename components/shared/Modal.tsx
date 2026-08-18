
import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import XIcon from '../icons/XIcon';

// -----------------------------------------------------------------------------
// The shared dialog. Four consumers: the three media plan pop-ups, the journey
// "Definition" pop-up, the friction strip cell pop-up, and Ten Things.
//
// ESCAPE, THE FOCUS TRAP, THE SCROLL LOCK AND FOCUS RESTORE were added with the
// Ten Things page. They are unconditional, so every existing consumer gained
// them. The STEPPER is opt in: it only renders when onPrev or onNext is passed,
// and the arrow key handler is gated on the same thing so the media plan pop-ups
// do not suddenly navigate.
// -----------------------------------------------------------------------------

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: string;
  /** Opt in stepper. Pass null to render the button disabled rather than absent. */
  onPrev?: (() => void) | null;
  onNext?: (() => void) | null;
  /** Shown beside the stepper, e.g. "01 / 10". */
  position?: string;
  /** Mono eyebrow above the title. */
  eyebrow?: string;
}

/** Everything focusable inside the card. Used by the tab trap. */
const FOCUSABLE =
  'button:not(:disabled), summary, a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  maxWidth = 'max-w-6xl',
  onPrev,
  onNext,
  position,
  eyebrow,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [content, setContent] = useState({ title, subtitle, children, eyebrow });
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  /** The element focused when the modal opened, so focus can go back to it. */
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const hasStepper = onPrev !== undefined || onNext !== undefined;

  useEffect(() => {
    // Attempt to find the specific app content area to render inside.
    // This allows the modal to be centered relative to the content area (respecting sidebar),
    // rather than the viewport.
    const container = document.getElementById('app-content-area') || document.body;
    setPortalContainer(container);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Latch the content when the modal opens
      setContent({ title, subtitle, children, eyebrow });
      setIsMounted(true);
      setIsAnimatingOut(false);
    } else if (isMounted && !isOpen) {
      setIsAnimatingOut(true);
    }
  }, [isOpen, isMounted, title, subtitle, children, eyebrow]);

  // Remember the opener, move focus in, lock the body, and put all three back on
  // close. Focus restore matters most for the Ten Things grid: without it, Escape
  // drops the caret to the top of the document and the keyboard path is lost.
  useEffect(() => {
    if (!isOpen) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus?.();
    };
  }, [isOpen]);

  // MOVING FOCUS IN IS ITS OWN EFFECT, KEYED ON `isMounted`, AND THAT IS THE
  // WHOLE FIX. It used to sit in the effect above on `[isOpen]` with a single
  // rAF and the comment "after the portal has painted". It had never worked, in
  // any consumer.
  //
  // The render below is gated on `isMounted`, which a DIFFERENT effect sets in
  // the same commit. So when `isOpen` flipped, both effects ran while the guard
  // was still false, the card was not in the DOM, and `closeRef.current` was
  // null. One frame later the rAF fired against that same null ref and quietly
  // did nothing. Measured across three consumers before the fix: the Ten Things
  // tile, the friction strip cell and the gap matrix cell all left focus sitting
  // on the opener, OUTSIDE the dialog, so Tab walked the page behind it and the
  // focus trap below had nothing to trap.
  //
  // Keyed on `isMounted` the effect runs after the commit that actually rendered
  // the card, so the ref is set. The rAF is kept because it also defers past the
  // opening transition.
  useEffect(() => {
    if (!isOpen || !isMounted) return;
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [isOpen, isMounted]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'ArrowRight' && onNext) {
        onNext();
        return;
      }
      if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
        return;
      }
      if (e.key !== 'Tab') return;

      // The trap. Filter on offsetParent so hidden controls are skipped: a
      // disabled stepper button is already excluded by the selector, but a
      // collapsed <details> body is not.
      const card = cardRef.current;
      if (!card) return;
      const focusable = Array.prototype.slice
        .call(card.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const handleAnimationEnd = () => {
    if (isAnimatingOut) {
      setIsMounted(false);
    }
  };

  if (!isMounted || !portalContainer) {
    return null;
  }

  // If we are mounting to the app-content-area, use 'absolute' to stay contained within it.
  // If fallback to body, use 'fixed' for viewport centering.
  const positionClass = portalContainer.id === 'app-content-area' ? 'absolute' : 'fixed';

  // ⚠ THE CHEVRON COLOUR IS A CLASS, NOT AN INLINE STYLE, AND THAT IS THE FIX.
  //
  // This button used to set `color: '#143C33'` inline beside a
  // `enabled:hover:text-white` utility. An inline style outranks any stylesheet
  // rule, so the hover colour NEVER applied while `hover:bg` did: the fill went
  // to `#003D33` and the arrow stayed dark ink on it, at 1.2:1. The chevron
  // vanished at exactly the moment the pointer was on it, which reads as a
  // broken button rather than a contrast bug.
  //
  // Third instance of this trap in the deck. The other two are written up on
  // `.persona-chip` and `.gap-cell` in styles/app.css, and the rule is the same:
  // if a property has a hover state, it cannot arrive inline.
  const stepButton = (
    label: string,
    handler: (() => void) | null | undefined,
    path: string,
  ) => (
    <button
      type="button"
      onClick={handler ?? undefined}
      disabled={!handler}
      className="flex-shrink-0 rounded-control border border-brand-hairline p-2 text-brand-ink transition-colors disabled:opacity-30 focus:outline-none focus:ring-2 enabled:hover:border-brand-ink-deepest enabled:hover:bg-brand-ink-deepest enabled:hover:text-white"
      aria-label={label}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </button>
  );

  return createPortal(
    <div
        className={`${positionClass} inset-0 z-[60] flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-labelledby={content.title ? titleId : undefined}
    >
      {/* Backdrop with blur added */}
      <div className="absolute inset-0 bg-brand-ink-deepest/60 backdrop-blur-sm" aria-hidden="true"></div>

      <div
        ref={cardRef}
        className={`relative bg-white rounded-surface overflow-hidden shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col transform transition-all ${isAnimatingOut ? 'animate-modal-scale-out' : 'animate-modal-scale-in'}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* ⚠ `items-start`, NOT `items-center`, AND THE STEPPER IS WHY.
            Centring the control cluster against the title block pins it to the
            MIDDLE of a box whose height is the title's. Ten Things steps through
            ten findings of 44 to 87 characters, so the title wraps to one line
            on some and three on others, and the prev/next buttons slid down the
            header as you stepped. Aligned to the top they sit at a fixed offset
            from the card's edge on every point, which is what a stepper has to
            do to be usable. */}
        <div className="flex-shrink-0 px-panel py-6 border-b border-brand-hairline flex justify-between items-start bg-white rounded-t-surface">
          <div className="flex-grow pr-4">
            {content.eyebrow && (
              <p className="eyebrow mb-1 font-bold">{content.eyebrow}</p>
            )}
            {/* `text-title`, not `text-2xl`: 22 from the scale rather than 24
                from Tailwind's stock steps, which was the one size in this
                dialog no token governed. Weight comes from the h2 base rule.

                THE FLOOR IS TWO LINES, AND ONLY WHEN STEPPING. It holds the
                header at a constant height across a stepped set so the body
                does not jump under the reader between points. Modals without a
                stepper are opened one at a time with nothing to compare
                against, and floring those would put an empty second line under
                every short channel name in the media plan. */}
            <h2
              id={titleId}
              className={`text-title text-brand-ink-deepest ${hasStepper ? 'min-h-[2.7em]' : ''}`}
            >
              {content.title}
            </h2>
            {content.subtitle && <p className="mt-1 text-brand-ink-muted">{content.subtitle}</p>}
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {hasStepper && (
              <>
                {position && (
                  <span className="hidden text-micro font-bold uppercase font-mono tracking-eyebrow text-brand-ink-muted sm:inline">
                    {position}
                  </span>
                )}
                {stepButton('Previous point', onPrev, 'M15 18l-6-6 6-6')}
                {stepButton('Next point', onNext, 'M9 6l6 6-6 6')}
              </>
            )}
            <button
              ref={closeRef}
              onClick={onClose}
              // #5B6E64, not the old #A9C3B4: this is an interactive control, and
              // 1.88:1 missed even the 3:1 non-text floor in WCAG 1.4.11. Every
              // pop-up in the app shares this button.
              className="flex-shrink-0 rounded-full p-2 text-brand-ink-muted transition-colors hover:bg-brand-surface-sunk hover:text-brand-ink focus:outline-none focus:ring-2"
              aria-label="Close modal"
            >
              <XIcon />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-panel custom-scrollbar">
          {content.children}
        </div>
      </div>
       <style>{`
        @keyframes modal-scale-in {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes modal-scale-out {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.98) translateY(10px); }
        }
        .animate-modal-scale-in {
          animation: modal-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-scale-out {
          animation: modal-scale-out 0.2s ease-in forwards;
        }
      `}</style>
    </div>,
    portalContainer
  );
};

export default Modal;
