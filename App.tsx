

import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Personas from './pages/Personas';
import CustomerJourney from './pages/CustomerJourney';
import InteractiveMediaPlan from './pages/InteractiveMediaPlan';
import BusinessDashboard from './pages/BusinessDashboard';
import ApexBySpeed from './pages/ApexBySpeed';
import TenThings from './pages/TenThings';
import { ApexPending } from './pages/PendingSections';
import { Page } from './types';

// -----------------------------------------------------------------------------
// ONE SECTION IS HELD BACK, and this is the only switch that does it.
//
// APEX by SPEED still carries HAMILTON ISLAND content: an affluent traveller
// Roy Morgan pull. The page is complete and stays wired below; what a viewer
// opens is a designed "awaiting Lyka data" placeholder instead. See
// pages/PendingSections.tsx. (The Interactive Media Plan got its Lyka brief
// on 2026-08-05 and now opens for everyone.)
//
// `?show=all` restores the real page, for internal review only. It is read
// ONCE at module scope because it never changes within a session, and it is
// deliberately not surfaced anywhere in the UI.
//
// TO SHIP THE REAL PAGE: delete this const and the ternary in renderPage().
// Nothing else has to change.
// -----------------------------------------------------------------------------
const SHOW_ALL = (() => {
  if (typeof window === 'undefined') return false;
  try {
    return new URLSearchParams(window.location.search).get('show') === 'all';
  } catch {
    // Malformed search string. Default to the client safe view.
    return false;
  }
})();

const App: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activePage, setActivePage] = useState<Page>(Page.PERSONAS);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarExpanded(prev => !prev);
  }, []);

  const handleSetActivePage = useCallback((page: Page) => {
    setActivePage(page);
    if (window.innerWidth < 1024) {
      setIsSidebarExpanded(false);
    }
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case Page.BUSINESS_DASHBOARD:
        return <BusinessDashboard />;
      case Page.TEN_THINGS:
        return <TenThings />;
      case Page.PERSONAS:
        return <Personas />;
      case Page.CUSTOMER_JOURNEY:
        return <CustomerJourney />;
      case Page.INTERACTIVE_MEDIA_PLAN:
        return <InteractiveMediaPlan />;
      case Page.APEX_BY_SPEED:
        return SHOW_ALL ? <ApexBySpeed /> : <ApexPending />;
      default:
        return <Personas />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ color: 'var(--lyka-ink)' }}>
      <Sidebar
        isExpanded={isSidebarExpanded}
        onToggle={handleToggleSidebar}
        activePage={activePage}
        setActivePage={handleSetActivePage}
        isMobile={isMobile}
      />

      <div
        id="app-content-area"
        className="relative flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out"
      >
        <main className="relative flex-1 p-4 md:p-8 overflow-y-auto w-full">
          {/* Lyka wordmark. Solid dark teal on transparency, so it needs no
              filter on the #FFFBED page (approximately 8.5:1). Sized down from
              the Hamilton logotype it replaced: the Lyka mark is far wider at
              equal height and would otherwise collide with the page h1. */}
          <img
            src="/images/lyka-logo.png"
            alt="Lyka"
            className="absolute top-4 right-4 md:top-8 md:right-8 h-7 md:h-10 w-auto pointer-events-none z-0"
          />

          <div className="relative z-10 h-full">
            {renderPage()}
          </div>
        </main>
      </div>

      {isMobile && isSidebarExpanded && (
        <div
          className="fixed inset-0 z-30"
          style={{ backgroundColor: 'rgba(0, 61, 51, 0.6)' }}
          onClick={() => setIsSidebarExpanded(false)}
        />
      )}
    </div>
  );
};

export default App;
