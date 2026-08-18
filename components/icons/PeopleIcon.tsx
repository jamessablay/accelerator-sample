import React from 'react';
import Icon from './Icon';

/**
 * Personas.
 *
 * WAS a stock Heroicons v1 outline at `strokeWidth={2}`, one of only two in a
 * set of seven, which made this nav item read visibly lighter than the five
 * solid marks around it. Redrawn as a filled figure on the house grid.
 *
 * The metaphor is deliberately unchanged. A single figure is what this page has
 * always used, and swapping it for a group mark is a separate decision about
 * what the page is about, not part of making the set consistent.
 *
 * Optical box: x 4 to 20, y 3.6 to 21.
 */
const PeopleIcon = () => (
  <Icon>
    <circle cx="12" cy="7.2" r="3.6" />
    <path d="M12 12.4c-4.4 0-8 2.9-8 6.5v.9a1.2 1.2 0 0 0 1.2 1.2h13.6a1.2 1.2 0 0 0 1.2-1.2v-.9c0-3.6-3.6-6.5-8-6.5z" />
  </Icon>
);

export default React.memo(PeopleIcon);
