import React from 'react';
import { LYKA } from '../../data/brand';
import type { VariantOption } from '../../hooks/useVariant';

// -----------------------------------------------------------------------------
// Segmented control for flipping between visualisation variants.
//
// Deliberately reads as review chrome rather than as part of the deck: mono
// eyebrow type, a hairline mint frame, small. It should be obvious that this
// control goes away once a direction is chosen.
//
// Shape follows the Consumer Journey tab strip (pill radii, filled active state)
// so it does not introduce a new interaction idiom to an app that already has one.
// -----------------------------------------------------------------------------

interface VariantSwitcherProps<T extends string> {
  options: readonly VariantOption<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Screen-reader label for the group, e.g. "Persona visualisation". */
  ariaLabel: string;
}

function VariantSwitcher<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: VariantSwitcherProps<T>) {
  return (
    // md:mr clears the Lyka wordmark, which App.tsx pins absolute at top-8
    // right-8 with z-0 over the whole content area on every page. Without it the
    // last pill sits under the logo.
    // The "View" eyebrow that used to sit here was DELETED, not enlarged. It was
    // 9px DM Mono at 0.18em tracking in mintMuted on ivory, roughly 1.9:1, which
    // made it the worst size-and-contrast pairing on either page. It also labelled
    // a segmented control whose four pills already say what they are. Removing it
    // is what lets the pills grow to `label` without touching the wordmark
    // clearance below.
    <div className="flex items-center gap-2 flex-shrink-0 md:mr-[92px]">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="inline-flex items-center gap-0.5 rounded-full p-0.5 border"
        style={{ backgroundColor: LYKA.ivory, borderColor: LYKA.mint }}
      >
        {options.map((opt) => {
          const isActive = opt.id === value;
          return (
            <button
              key={opt.id}
              role="tab"
              aria-selected={isActive}
              title={opt.hint}
              onClick={() => onChange(opt.id)}
              className="px-3 py-1.5 rounded-full text-meta md:text-label font-semibold whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2"
              style={
                isActive
                  ? { backgroundColor: LYKA.tealDark, color: '#FFFFFF' }
                  : { color: LYKA.muted, backgroundColor: 'transparent' }
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSwitcher;
