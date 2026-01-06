'use client';

import { useSettings } from '@/app/ui/context/settings-context';
import { MatchPredict2024 } from './2024/match-predict-2024';
import { MatchPredict2025 } from './2025/match-predict-2025';

export default function MatchPredictorPage() {
  const { settings } = useSettings();

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderPrediction = () => {
    switch (settings.season) {
      case '2025':
        return <MatchPredict2025 />;
      case '2024':
        return <MatchPredict2024 />;
      default:
        return (
          <div>Season {settings.season} is not supported on this page.</div>
        );
    }
  };

  return (
    <div>
      <main>
        <div>{renderPrediction()}</div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div hidden>my footer</div>
      </footer>
    </div>
  );
}
