

import React from 'react';
import { Page } from '../types';
import PeopleIcon from './icons/PeopleIcon';
import MenuIcon from './icons/MenuIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import CalendarAltIcon from './icons/CalendarAltIcon';
import BusinessDashboardIcon from './icons/BusinessDashboardIcon';
import ConsumerJourneyIcon from './icons/ConsumerJourneyIcon';
import ApexIcon from './icons/ApexIcon';
import TenThingsIcon from './icons/TenThingsIcon';
import NotionCoworkingIcon from './icons/NotionCoworkingIcon';
import EcosystemIcon from './icons/EcosystemIcon';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  activePage: Page;
  setActivePage: (page: Page) => void;
  isMobile?: boolean;
}

const navItems = [
  // First, on request 2026-08-10. It has now held every slot this deck has
  // tried: it shipped second (the findings set up the audience model), moved
  // below the media plan on 2026-08-04 (lead with who the audience is, close
  // on the evidence), and leads the deck since 2026-08-10. Note the DEFAULT
  // LANDING PAGE is still Personas (App.tsx); nav order and landing page are
  // independent decisions.
  { page: Page.TEN_THINGS, icon: <TenThingsIcon />, label: 'Ten Things The Data Says' },
  { page: Page.BUSINESS_DASHBOARD, icon: <BusinessDashboardIcon />, label: 'Business Dashboard' },
  { page: Page.PERSONAS, icon: <PeopleIcon />, label: 'Personas' },
  { page: Page.CUSTOMER_JOURNEY, icon: <ConsumerJourneyIcon />, label: 'Consumer Journey' },
  { page: Page.APEX_BY_SPEED, icon: <ApexIcon />, label: 'APEX by SPEED' },
  { page: Page.INTERACTIVE_MEDIA_PLAN, icon: <CalendarAltIcon />, label: 'Interactive Media Plan' },
  // The Lyka x SPEED shared-Notion-workspace proposal, a ways-of-working page
  // rather than an audience or media page.
  { page: Page.NOTION_COWORKING, icon: <NotionCoworkingIcon />, label: 'Notion Coworking Setup' },
  // Last. SPEED's operating role: plug into Lyka's existing team, data and
  // measurement tools rather than replace them. A positioning page, so it closes
  // the deck after the ways-of-working page.
  { page: Page.ECOSYSTEM, icon: <EcosystemIcon />, label: 'Plugging Into The Ecosystem' },
];

const Sidebar: React.FC<SidebarProps> = ({ isExpanded, onToggle, activePage, setActivePage, isMobile }) => {
  return (
    <>
      {/* Placeholder div to occupy space in flex layout only on Desktop when expanded/collapsed */}
      {!isMobile && (
         <div 
            className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-20'}`} 
         />
      )}

      {/* Black sidebar, kept as the SPEED accelerator house chrome rather than
          re-themed to Lyka teal. It also keeps the white drop-shadow glow on the
          SPEED Accelerator logo below working as originally designed, which was
          tuned against black.

          The active nav pill stays #0A7D68 (--lyka-accent-ink): 5.1:1 for its
          white label and clearly separated from black. Do not use #10B193 here,
          which is only 2.7:1 for the label. */}
      <aside
        className={`bg-black text-white transition-all duration-300 ease-in-out flex flex-col
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 shadow-2xl' : 'absolute inset-y-0 left-0 z-40'}
          ${isExpanded ? 'w-80' : 'w-20'}
          ${isMobile && !isExpanded ? '-translate-x-full' : 'translate-x-0'} 
          /* On mobile: fully hide when collapsed (translate-x-full). On desktop: show collapsed icon bar (w-20) */
          ${!isMobile ? 'translate-x-0' : ''}
        `}
      >
          <div className="relative flex items-center h-24 px-6 border-b border-white/10">
              <img
                  src="/icons/accelerator_logo.png"
                  alt="SPEED Accelerator Logo"
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isExpanded ? 'w-44 opacity-100' : 'w-0 opacity-0'
                  }`}
                  style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5)) drop-shadow(0 0 12px rgba(255,255,255,0.22))' }}
              />
              <button
                  onClick={onToggle}
                  className={`absolute p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 ease-in-out ${
                      isExpanded ? 'right-6' : 'left-1/2 -translate-x-1/2'
                  }`}
                  aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                  {isExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
              </button>
          </div>

        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul>
            {navItems.map((item) => (
              <li key={item.label} className="px-4 py-1">
                <button
                  onClick={() => setActivePage(item.page)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 group ${
                    activePage === item.page
                      ? 'text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  style={activePage === item.page ? { backgroundColor: 'var(--lyka-accent-ink)' } : undefined}
                  title={!isExpanded ? item.label : ''}
                >
                  <div className="flex-shrink-0">{item.icon}</div>
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'opacity-100 ml-4 max-w-full' : 'opacity-0 ml-0 max-w-0 pointer-events-none'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile Toggle Handle (if sidebar is hidden) - Optional, but we usually use a top bar hamburger. 
            Since App.tsx has no top bar, we rely on the sidebar always being visible on desktop (w-20).
            On mobile, if it translates away, we need a trigger. 
            Added a floating trigger button for mobile when collapsed.
        */}
        {isMobile && !isExpanded && (
            <button
                onClick={onToggle}
                className="fixed bottom-6 left-6 z-50 p-4 text-white rounded-full shadow-[0_12px_28px_-12px_rgba(0,86,72,0.22)] focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: 'var(--lyka-accent-ink)' }}
            >
                <MenuIcon />
            </button>
        )}
      </aside>
    </>
  );
};

export default React.memo(Sidebar);