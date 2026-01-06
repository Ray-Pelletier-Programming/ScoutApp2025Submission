'use client';
import { MatchScheduleEditorTable } from '@/app/(admin)/event-schedule-editor/event-schedule-editor-table';
import { useSettings } from '@/app/ui/context/settings-context';
import React from 'react';

export default function MatchScheduleEditorPage() {
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
    return (
      <MatchScheduleEditorTable
        eventId={settings.getEventId()}
        eventCode={settings.eventCode}
        season={settings.season}
      />
    );
  };

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        <br />
        <main>{renderRawDataTable()}</main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div hidden>my footer</div>
        </footer>
      </div>
    );
  }
}
