import React from 'react';

/**
 * Notion Coworking Setup.
 *
 * Two overlapping rounded squares: two workspaces (Lyka and SPEED) meeting in
 * one shared space, where they overlap they interlink. NOT the Notion logo,
 * which is a trademark and would read as an external link rather than a page.
 *
 * Same house contract as the other seventeen icons: no props, h-6 w-6, fill
 * currentColor so the sidebar drives the colour, filled paths with even-odd
 * cutouts (so each square reads as a frame and the overlap notches out), wrapped
 * in React.memo.
 */
const NotionCoworkingIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    fillRule="evenodd"
    clipRule="evenodd"
  >
    <path
      d="M5.5 3h5a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 3 10.5v-5A2.5 2.5 0 0 1 5.5 3zm.8 2a1.3 1.3 0 0 0-1.3 1.3v3.4A1.3 1.3 0 0 0 6.3 11h3.4a1.3 1.3 0 0 0 1.3-1.3V6.3A1.3 1.3 0 0 0 9.7 5H6.3zM13.5 11h5a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5h-5a2.5 2.5 0 0 1-2.5-2.5v-5a2.5 2.5 0 0 1 2.5-2.5zm.8 2a1.3 1.3 0 0 0-1.3 1.3v3.4a1.3 1.3 0 0 0 1.3 1.3h3.4a1.3 1.3 0 0 0 1.3-1.3v-3.4a1.3 1.3 0 0 0-1.3-1.3h-3.4z"
    />
  </svg>
);

export default React.memo(NotionCoworkingIcon);
