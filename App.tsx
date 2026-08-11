

import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Personas from './pages/Personas';
import CustomerJourney from './pages/CustomerJourney';
import InteractiveMediaPlan from './pages/InteractiveMediaPlan';
import ApexBySpeed from './pages/ApexBySpeed';
import TenThings from './pages/TenThings';
import NotionCoworkingSetup from './pages/NotionCoworkingSetup';
import EcosystemFit from './pages/EcosystemFit';
import { Page } from './types';

// All SEVEN sections are live. APEX by SPEED was the last one held back (behind
// a `SHOW_ALL` / `?show=all` switch here) and opened on 2026-08-07 when its Lyka
// Roy Morgan pull landed. The hold-back pattern, if ever needed again, is in
// git history: pages/PendingSections.tsx + components/shared/PendingSection.tsx
// plus one ternary in renderPage().
//
// Seven, not eight: Business Dashboard was removed on 2026-08-11 (see types.ts).
// There is no URL routing here, so removing a Page member breaks no deep link.

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
      case Page.TEN_THINGS:
        return <TenThings />;
      case Page.PERSONAS:
        return <Personas />;
      case Page.CUSTOMER_JOURNEY:
        return <CustomerJourney />;
      case Page.INTERACTIVE_MEDIA_PLAN:
        return <InteractiveMediaPlan />;
      case Page.APEX_BY_SPEED:
        return <ApexBySpeed />;
      case Page.NOTION_COWORKING:
        return <NotionCoworkingSetup />;
      case Page.ECOSYSTEM:
        return <EcosystemFit />;
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
