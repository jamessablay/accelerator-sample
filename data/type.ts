// -----------------------------------------------------------------------------
// COMPATIBILITY RE-EXPORT.
//
// The type scale moved into the design system container at `theme/house.ts`,
// beside motion, elevation and the radii, because they are one system and were
// being maintained as four.
//
// This file stays so the ~31 files importing `TYPE`, `TRACKING` and `svgFont`
// from `data/type` keep working. New code should import from `theme` directly.
//
// The scale is no longer mirrored by hand into a Tailwind config either: the
// `text-micro` through `text-display` utilities are generated from these exact
// numbers by `theme/tailwindPreset.ts`, so the class and the token cannot
// describe different sizes.
// -----------------------------------------------------------------------------

export { TYPE, TRACKING, LINE_HEIGHT, svgFont, type TypeToken } from '../theme';
