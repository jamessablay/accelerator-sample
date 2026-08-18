import React from 'react';
import Icon from './Icon';

/**
 * APEX by SPEED.
 *
 * A disc with a peak and a plotted point knocked out of it. This one is a
 * PRODUCT MARK rather than a UI glyph, which is why it stays solid while the
 * rest of the set is linework: APEX is a SPEED product with its own logo, and
 * flattening it into the house style would misrepresent it. It is the one
 * deliberate exception in the set.
 *
 * WAS `0 0 32 32` holding a disc of radius 16 centred at (16,16), which is edge
 * to edge by construction: no optical margin at all, in a set whose other marks
 * sit inside three units.
 *
 * The path is UNCHANGED. Only a transform was added:
 *
 *   source bounds   0 to 32 on both axes, fully filled by the disc
 *   target          a 17 unit box centred in the 24 unit grid
 *   scale           17 / 32 = 0.53125
 *   translate       3.5, 3.5
 *
 * 17 rather than the 18 the other marks use, and that is optical compensation
 * rather than an inconsistency: a SOLID disc bounded identically to an open
 * linework mark reads heavier and therefore larger. Sizing it a unit down is
 * what makes the row feel even.
 */
const ApexIcon = () => (
  <Icon>
    <g transform="translate(3.5 3.5) scale(0.53125)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zM6 19.25v4.25l10-12.75L26 23.5v-4.25L16 6.5 6 19.25zm10.5 1.25a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
      />
    </g>
  </Icon>
);

export default React.memo(ApexIcon);
