
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

  const stepButton = (
    label: string,
    handler: (() => void) | null | undefined,
    path: string,
  ) => (
    <button
      type="button"
      onClick={handler ?? undefined}
      disabled={!handler}
      className="flex-shrink-0 rounded-lg border p-2 transition-colors disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#0A7D68] enabled:hover:bg-[#003D33] enabled:hover:text-white"
      style={{ borderColor: '#DBE6DC', color: '#143C33' }}
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
      <div className="absolute inset-0 bg-[#003D33]/60 backdrop-blur-sm" aria-hidden="true"></div>

      <div
        ref={cardRef}
        className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col transform transition-all ${isAnimatingOut ? 'animate-modal-scale-out' : 'animate-modal-scale-in'}`}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="flex-shrink-0 px-8 py-6 border-b border-[#DBE6DC] flex justify-between items-center bg-white rounded-t-2xl">
          <div className="flex-grow pr-4">
            {content.eyebrow && (
              <p
                className="mb-1 text-micro font-bold uppercase font-mono"
                style={{ letterSpacing: '0.08em', color: '#0A7D68' }}
              >
                {content.eyebrow}
              </p>
            )}
            <h2 id={titleId} className="text-2xl font-bold text-[#003D33]">{content.title}</h2>
            {content.subtitle && <p className="text-[#5B6E64] mt-1">{content.subtitle}</p>}
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {hasStepper && (
              <>
                {position && (
                  <span
                    className="hidden text-micro font-bold uppercase font-mono sm:inline"
                    style={{ letterSpacing: '0.08em', color: '#5B6E64' }}
                  >
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
              className="flex-shrink-0 p-2 rounded-full text-[#A9C3B4] hover:bg-[#F0F2E9] hover:text-[#143C33] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A7D68]"
              aria-label="Close modal"
            >
              <XIcon />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
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
