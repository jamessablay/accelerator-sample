import React from 'react';
import Icon from './Icon';

/**
 * Consumer Journey.
 *
 * Two routes running down and converging: five persona journeys through the same
 * five stages.
 *
 * WAS a `0 0 1920 1920` viewBox whose artwork touched all four edges, so this
 * mark rendered noticeably LARGER than its neighbours, which sit inside three
 * units of optical margin. The nav read as one icon slightly too big rather than
 * as an inconsistent grid, which is why it survived so long.
 *
 * The path is UNCHANGED, byte for byte. Only a transform was added, so the mark
 * itself is preserved exactly and this cannot have altered the drawing:
 *
 *   source bounds   x 27 to 1893 (1866 wide), y 0 to 1920 (1920 tall)
 *   target          an 18 unit box centred in the 24 unit grid
 *   scale           18 / 1920 = 0.009375
 *   translate       3, 3   (leaves 3.25 left and right, 3 top and bottom)
 *
 * Re-derive those four numbers if the path is ever redrawn. They are a fit to
 * THIS bounding box, not a general conversion.
 */
const ConsumerJourneyIcon = () => (
  <Icon>
    <g transform="translate(3 3) scale(0.009375)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m1496.099 0-397.312 397.312 151.551 151.55L1388.92 410.28v330.754c0 146.835-74.06 198.066-215.965 283.273-71.06 42.55-150.693 90.46-212.75 161.733-62.056-71.274-141.69-119.183-212.75-161.733C605.552 939.1 531.49 887.87 531.49 741.034V410.28l138.582 138.582 151.551-151.55L424.312 0 27 397.312l151.55 151.55L317.134 410.28v330.754c0 275.02 177.38 381.556 319.928 466.978 141.905 85.207 215.966 136.438 215.966 283.273V1920h214.357v-428.715c0-146.835 74.06-198.066 215.965-283.273 142.548-85.422 319.929-191.958 319.929-466.978V410.28l138.582 138.582 151.55-151.55L1496.1 0Z"
      />
    </g>
  </Icon>
);

export default React.memo(ConsumerJourneyIcon);
