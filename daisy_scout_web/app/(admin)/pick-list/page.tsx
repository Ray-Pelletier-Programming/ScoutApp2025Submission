'use client';
import { useSettings } from '@/app/ui/context/settings-context';
import React from 'react';
import { PickList2025 } from './2025/pick-list-2025-table';
import { DoNotPickList2025 } from './2025/do-not-pick-list-2025-table';
import { Tabs, TabsRef } from 'flowbite-react';

export default function PicklistPage() {
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
  const renderPickListTable = (activeTab: number) => {
    switch (settings.season) {
      case '2025':
        return <PickList2025 eventId={settings.getEventId()} tab={activeTab} />;
      //case '2024':
      //  return <MatchPredict2024 />;
      default:
        return (
          <div>Season {settings.season} is not supported on this page.</div>
        );
    }
  };

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderDoNotPickListTable = (activeTab: number) => {
    switch (settings.season) {
      case '2025':
        return (
          <DoNotPickList2025 eventId={settings.getEventId()} tab={activeTab} />
        );
      //case '2024':
      //  return <MatchPredict2024 />;
      default:
        return (
          <div>Season {settings.season} is not supported on this page.</div>
        );
    }
  };

  const tabsRef = React.useRef<TabsRef>(null);

  const [activeTab, setActiveTab] = React.useState(0);

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        <br />
        <main>
          <Tabs
            aria-label="Full width tabs"
            variant="fullWidth"
            ref={tabsRef}
            onActiveTabChange={(tab) => setActiveTab(tab)}
          >
            <Tabs.Item active title="PickList">
              <div>{renderPickListTable(activeTab)}</div>
            </Tabs.Item>
            <Tabs.Item title="DNP">
              <div>{renderDoNotPickListTable(activeTab)}</div>
            </Tabs.Item>
          </Tabs>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div hidden>my footer</div>
        </footer>
      </div>
    );
  }
}
