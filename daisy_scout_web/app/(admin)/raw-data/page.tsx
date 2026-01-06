'use client';
import { RawDataTable2025 } from '@/app/(admin)/raw-data/2025/raw-data-table-2025';
import { RawDataTable2024 } from '@/app/(admin)/raw-data/2024/raw-data-table-2024';
import { useSettings } from '@/app/ui/context/settings-context';
import React from 'react';

export default function RawDataPage() {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const { settings } = useSettings();

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, []);

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderRawDataTable = () => {
    switch (settings.season) {
      case '2025':
        return <RawDataTable2025 eventId={settings.getEventId()} />;
      case '2024':
        return <RawDataTable2024 eventId={settings.getEventId()} />;
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
        <main>{renderRawDataTable()}</main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div hidden>my footer</div>
        </footer>
      </div>
    );
  }
}
