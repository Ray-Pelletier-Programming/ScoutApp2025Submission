'use client';
import { useSettings } from '@/app/ui/context/settings-context';
import React from 'react';

export function ActiveCompBanner() {
  const { settings } = useSettings();
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        Season: {settings.season} - Event: {settings.eventCode}
      </div>
    );
  }
}
