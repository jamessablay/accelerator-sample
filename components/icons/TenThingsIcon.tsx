import React from 'react';

/**
 * Ten Things The Data Says.
 *
 * A bar chart with the tallest column struck through by a rising line: the page
 * is findings drawn from data, and half of them are about a trend hiding inside
 * a level. Same house contract as the other sixteen icons: no props, h-6 w-6,
 * fill currentColor so the sidebar drives the colour, wrapped in React.memo.
 */
const TenThingsIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 19.25h18a.75.75 0 010 1.5H3a.75.75 0 010-1.5z" />
    <path d="M4.25 11.5h2.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-2.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 01.75-.75z" />
    <path d="M10.75 8.5h2.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75h-2.5a.75.75 0 01-.75-.75v-7.5a.75.75 0 01.75-.75z" />
    <path d="M17.25 13.5h2.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75h-2.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 01.75-.75z" />
    <path d="M21.03 3.72a.75.75 0 01.052 1.008l-.052.056-5 5a.75.75 0 01-.977.07l-.084-.07-2.469-2.47-4.97 4.97a.75.75 0 01-1.114-1.004l.053-.056 5.5-5.5a.75.75 0 01.977-.07l.084.07 2.47 2.47 4.469-4.47a.75.75 0 011.06 0z" />
  </svg>
);

export default React.memo(TenThingsIcon);
