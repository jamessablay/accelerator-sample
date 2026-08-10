import React from 'react';
import BusinessDashboardIcon from '../components/icons/BusinessDashboardIcon';

// The Power BI iframe that used to live here embedded ANOTHER CLIENT's
// commercial report (Hamilton Island Audience Dashboard, publish-to-web URL on
// the SPEED tenant). It was removed rather than repointed: a foreign live
// dashboard inside a Lyka deck is a confidentiality problem, not a placeholder.
//
// To wire Lyka's report: drop a publish-to-web `app.powerbi.com/view?r=...` URL
// into REPORT_URL below and the iframe renders in place of the empty state.
const REPORT_URL: string | null = null;

const BusinessDashboard: React.FC = () => {
  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <header className="flex-shrink-0 pb-2 md:pb-4">
        <h1 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--lyka-teal-deep)' }}>
          Business Dashboard
        </h1>
        <p className="mt-3 text-base md:text-xl max-w-4xl" style={{ color: 'var(--lyka-muted)' }}>
          Subscriptions, retention, lifetime value and acquisition efficiency by segment.
        </p>
      </header>

      <div
        className="flex-1 mt-6 rounded-2xl border overflow-hidden bg-white"
        style={{ borderColor: 'var(--lyka-mint)' }}
      >
        {REPORT_URL ? (
          <iframe
            title="Lyka Audience Dashboard"
            src={REPORT_URL}
            className="w-full h-full block"
            frameBorder={0}
            allowFullScreen
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center p-8 md:p-12"
            style={{ backgroundColor: 'var(--lyka-cream)' }}
          >
            <div className="max-w-2xl text-center">
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: 'var(--lyka-accent-ink)' }}
              >
                <BusinessDashboardIcon />
              </div>

              <p
                className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.22em]"
                style={{ color: 'var(--lyka-accent-ink)' }}
              >
                Awaiting data connection
              </p>

              <h2
                className="mt-3 text-2xl md:text-3xl font-display"
                style={{ color: 'var(--lyka-teal-deep)' }}
              >
                Lyka&apos;s commercial picture, in one place
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
