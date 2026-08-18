import React from 'react';

/**
 * THE HOUSE ICON CONTRACT, enforced rather than described.
 *
 * Three of the icon files used to state this contract in a comment ("no props,
 * h-6 w-6, fill currentColor, wrapped in React.memo") and the set still drifted
 * anyway, in exactly the ways a comment cannot prevent:
 *
 *   - Two of the seven nav icons were stock Heroicons v1 OUTLINES at
 *     `strokeWidth={2}` sitting beside five solid marks, so Personas and
 *     Interactive Media Plan read visibly lighter than their neighbours.
 *   - Consumer Journey carried a `0 0 1920 1920` viewBox whose artwork touched
 *     all four edges, against neighbours with three units of optical margin.
 *   - APEX carried `0 0 32 32` holding a disc of radius 16, which is edge to
 *     edge by construction.
 *
 * Wrapping the grid, the fill and the sizing here means a new icon inherits them
 * instead of restating them, and a drifted one is visible as a missing wrapper.
 *
 * OPTICAL BOX: artwork lives inside roughly x/y 3 to 21, an 18 unit box in a 24
 * unit grid. Round and pointed forms may run slightly wider, because a circle
 * bounded identically to a square reads smaller than it.
 *
 * `aria-hidden` is correct for all of them: every consumer pairs the icon with a
 * real text label (the sidebar renders `item.label`, and adds `title` when it is
 * collapsed), so announcing the glyph as well would be duplication.
 *
 * NOTE the params are annotated on the destructure rather than via `React.FC`.
 * `@types/react` is not installed, so `React.FC` is `any` and silently drops
 * type checking for the whole component body. The apex components already do
 * this; it is the documented workaround until that install happens.
 */
interface IconProps {
  children: React.ReactNode;
  /** Escape hatch for a mark that genuinely needs its own grid. Prefer not to. */
  viewBox?: string;
  className?: string;
}

const Icon = ({ children, viewBox = '0 0 24 24', className = 'h-6 w-6' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox={viewBox}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

export default React.memo(Icon);
