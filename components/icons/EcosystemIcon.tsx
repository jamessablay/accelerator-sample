import React from 'react';

/**
 * Plugging Into The Ecosystem.
 *
 * A central hub with four nodes plugging into it: the four connections into
 * Lyka's existing ecosystem. Same house contract as the other icons: no props,
 * h-6 w-6, fill currentColor so the sidebar drives the colour, filled shapes,
 * wrapped in React.memo.
 */
const EcosystemIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
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
  </svg>
);

export default React.memo(EcosystemIcon);
