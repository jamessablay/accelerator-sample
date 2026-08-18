

import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import { Page } from './types';
import { theme } from './theme';

// PAGES ARE LAZY, and the reason is measurable rather than stylistic. Statically
// imported, all seven pages plus Chart.js landed in one 718 kB entry chunk, so a
// viewer who opened the deck on Personas and never left it still downloaded and
// parsed the media plan's charts, the APEX tables and both scrolling narrative
// pages before anything rendered.
//
// Chart.js alone is the largest single dependency and only three of the seven
// pages touch it. vite.config.ts splits it into its own chunk so those three
// share one cached copy.
//
// Safe here specifically BECAUSE there is no router: `activePage` is state, the
// only way to reach a page is the nav, and every transition is already a user
// gesture with a natural moment to resolve a promise.
const Personas = lazy(() => import('./pages/Personas'));
const CustomerJourney = lazy(() => import('./pages/CustomerJourney'));
const InteractiveMediaPlan = lazy(() => import('./pages/InteractiveMediaPlan'));
const ApexBySpeed = lazy(() => import('./pages/ApexBySpeed'));
const TenThings = lazy(() => import('./pages/TenThings'));
const NotionCoworkingSetup = lazy(() => import('./pages/NotionCoworkingSetup'));
const EcosystemFit = lazy(() => import('./pages/EcosystemFit'));

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
    <div className="flex h-screen overflow-hidden" style={{ color: 'var(--brand-ink)' }}>
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
        <main className="custom-scrollbar relative flex-1 p-4 md:p-8 overflow-y-auto w-full">
          {/* The client wordmark, from the theme rather than hardcoded. Its
              rendered HEIGHT is a per-client value for a real reason: a wide
              wordmark at the same height as a compact one collides with the page
              h1, which is why this mark was sized down from the one it replaced.
              That number belongs with the client, not in the shell. */}
          <img
            src={theme.identity.logoSrc}
            alt={theme.identity.logoAlt}
            className={`absolute top-4 right-4 md:top-8 md:right-8 w-auto pointer-events-none z-0 ${theme.identity.logoHeightClass}`}
          />

          <div className="relative z-10 h-full">
            {/* No spinner, deliberately. Page chunks resolve in single-digit ms
                from cache, and a flashed loader on every nav click reads as the
                deck being slow when the opposite is true. An empty box holds the
                space without drawing attention to it. */}
            <Suspense fallback={<div className="h-full" aria-busy="true" />}>
              {renderPage()}
            </Suspense>
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
