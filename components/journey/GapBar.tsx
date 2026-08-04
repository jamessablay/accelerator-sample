import React from 'react';
import { LYKA, GAP_POSITIVE_HUE, GAP_NEGATIVE_HUE, GAP_SCALE_MAX } from '../../data/brand';

// -----------------------------------------------------------------------------
// A diverging bar for one gap value, symmetric around zero.
//
// PROMOTED OUT OF TensionMap, where it was a private const, when the gap matrix
// needed the same bar on a washed background. It lives OUTSIDE variants/ on
// purpose: the variant registry is temporary review scaffolding and will be cut
// down to one view, and this should survive that.
//
// EVERY PROP EXCEPT `gap` IS ADDITIVE AND OPTIONAL, defaulted to exactly what
// TensionMap rendered before the move, so its call site is pixel identical. Same
// pattern JourneyScoreGraph uses to serve four callers without disturbing the
// baseline. If you change a default here you change the Compare view.
//
// WHY BOTH A BAR AND A NUMBER, wherever this is used: nobody can rank a -25 tint
// against a -30 tint, and the bar also carries the sign WITHOUT hue, which is
// the colour vision fallback. The number is the precise value. Neither is
// decoration.
// -----------------------------------------------------------------------------

interface GapBarProps {
  /** Emotional minus rational. DERIVED, so the caller must label it as such. */
  gap: number;
  /** Symmetric clamp. Defaults to the shared GAP_SCALE_MAX so encodings agree. */
  max?: number;
  /** Track behind the bar. Defaults to cream, which is right on white. */
  track?: string;
  /** Defaults to TensionMap's original geometry. */
  className?: string;
}

const GapBar: React.FC<GapBarProps> = ({
  gap,
  max = GAP_SCALE_MAX,
  track = LYKA.cream,
  className = 'relative h-1.5 rounded-full mt-1',
}) => {
  const half = Math.min(Math.abs(gap), max) / max / 2;
  const positive = gap > 0;
  return (
    <div className={className} style={{ backgroundColor: track }}>
      <div className="absolute inset-y-0 left-1/2 w-px" style={{ backgroundColor: LYKA.mintMuted }} />
      <div
        className="absolute inset-y-0 rounded-full"
        style={{
          backgroundColor: positive ? GAP_POSITIVE_HUE : GAP_NEGATIVE_HUE,
          left: positive ? '50%' : `${50 - half * 100}%`,
          width: `${half * 100}%`,
        }}
      />
    </div>
  );
};

export default GapBar;
