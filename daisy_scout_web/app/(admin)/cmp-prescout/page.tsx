'use client';
import { useSettings } from '@/app/ui/context/settings-context';
import React from 'react';
import { CmpPrescout2025 } from '@/app/(admin)/cmp-prescout/2025/cmp-prescout-2025';

export default function Home() {
  const { settings } = useSettings();

  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    // get data from db here...

    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, []);

  // handle versions of the match data per season
  const renderCmpPrescout = () => {
    switch (settings.season) {
      case '2025':
        return (
          <CmpPrescout2025
            season={settings.season}
            eventCode={settings.eventCode}
          />
        );
      //case '2024':
      //  return <MatchPredict2024 />;
      default:
        return (
          <div>Season {settings.season} is not supported on this page.</div>
        );
    }
  };

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        <main>
          <div>{renderCmpPrescout()}</div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div hidden>my footer</div>
        </footer>
      </div>
    );
  }
}
