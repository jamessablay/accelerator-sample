import React from 'react';
import Icon from './Icon';

/**
 * Interactive Media Plan.
 *
 * WAS a stock Heroicons v1 calendar outline at `strokeWidth={2}`, the other of
 * the two outlines in a set of seven.
 *
 * Redrawn as staggered horizontal bars, which is a change of METAPHOR and worth
 * saying why. The page is not a calendar, it is a macro block GANTT: five funnel
 * stages of channels flighted across twelve months, where the information is
 * which bar starts when and how long it runs. Staggered bars say that; a
 * calendar grid says "dates", which is the one thing the page does not show.
 *
 * It also reads at 24px in a way the outline did not, and it cannot be confused
 * with the Ten Things mark beside it in the nav, which is VERTICAL columns.
 *
 * Optical box: x 3 to 21, y 3.8 to 20.2.
 */
const CalendarAltIcon = () => (
  <Icon>
    <rect x="3" y="3.8" width="11" height="3.2" rx="1.6" />
    <rect x="7" y="8.2" width="14" height="3.2" rx="1.6" />
    <rect x="5" y="12.6" width="9" height="3.2" rx="1.6" />
    <rect x="10" y="17" width="11" height="3.2" rx="1.6" />
  </Icon>
);

export default React.memo(CalendarAltIcon);
