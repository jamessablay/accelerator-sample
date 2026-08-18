import React from 'react';
import Icon from './Icon';

/**
 * Plugging Into The Ecosystem.
 *
 * A central hub with four nodes plugging into it: the four connections into the
 * client's existing team, data and measurement tools.
 *
 * Geometry unchanged. Its outer nodes reach 1.6 from the edge where the linework
 * marks stop at 3, and that is deliberate optical compensation rather than
 * drift: four small discs on the axes read smaller than a form that fills its
 * bounding box, so pulling them in to 3 would leave this mark looking undersized
 * beside its neighbours.
 */
const EcosystemIcon = () => (
  <Icon>
    {/* Spokes */}
    <rect x="11.15" y="5" width="1.7" height="4" rx="0.85" />
    <rect x="11.15" y="15" width="1.7" height="4" rx="0.85" />
    <rect x="5" y="11.15" width="4" height="1.7" rx="0.85" />
    <rect x="15" y="11.15" width="4" height="1.7" rx="0.85" />
    {/* The four connections */}
    <circle cx="12" cy="3.6" r="2" />
    <circle cx="12" cy="20.4" r="2" />
    <circle cx="3.6" cy="12" r="2" />
    <circle cx="20.4" cy="12" r="2" />
    {/* The hub */}
    <circle cx="12" cy="12" r="3.3" />
  </Icon>
);

export default React.memo(EcosystemIcon);
