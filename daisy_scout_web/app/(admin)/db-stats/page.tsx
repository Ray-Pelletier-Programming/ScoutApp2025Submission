'use client';
import React from 'react';
import { DbStatsTable } from './db-stats-table';

export default function DbStatsPage() {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, []);

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderDbStatsTable = () => {
    return <DbStatsTable />;
  };

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Database Stats for Events</h1>
        {renderDbStatsTable()}
      </div>
    );
  }
}
