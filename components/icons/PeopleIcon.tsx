import React from 'react';

const PeopleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 6a3 3 0 11-6 0 3 3 0 016 0zM12 9a6 6 0 00-6 6v3h12v-3a6 6 0 00-6-6z"
    />
  </svg>
);

export default React.memo(PeopleIcon);
