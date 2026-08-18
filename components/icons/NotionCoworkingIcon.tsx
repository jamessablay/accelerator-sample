import React from 'react';
import Icon from './Icon';

/**
 * Notion Coworking Setup.
 *
 * Two overlapping rounded squares: two workspaces (the client and SPEED) meeting
 * in one shared space, interlinking where they overlap. NOT the Notion logo,
 * which is a trademark and would read as an external link rather than a page.
 *
 * Geometry unchanged; it was already on the house grid at x/y 3 to 21. The
 * `fillRule` and `clipRule` moved from the svg element onto the path, because
 * the shared `Icon` wrapper owns the svg and does not carry them. They are load
 * bearing here: they are what makes each square read as a frame with a hole
 * rather than a solid block.
 */
const NotionCoworkingIcon = () => (
  <Icon>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.5 3h5a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 3 10.5v-5A2.5 2.5 0 0 1 5.5 3zm.8 2a1.3 1.3 0 0 0-1.3 1.3v3.4A1.3 1.3 0 0 0 6.3 11h3.4a1.3 1.3 0 0 0 1.3-1.3V6.3A1.3 1.3 0 0 0 9.7 5H6.3zM13.5 11h5a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5h-5a2.5 2.5 0 0 1-2.5-2.5v-5a2.5 2.5 0 0 1 2.5-2.5zm.8 2a1.3 1.3 0 0 0-1.3 1.3v3.4a1.3 1.3 0 0 0 1.3 1.3h3.4a1.3 1.3 0 0 0 1.3-1.3v-3.4a1.3 1.3 0 0 0-1.3-1.3h-3.4z"
    />
  </Icon>
);

export default React.memo(NotionCoworkingIcon);
