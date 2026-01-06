'use client';

import { PitData2025 } from './2025/pit-data-2025';
import { useSettings } from '@/app/ui/context/settings-context';
import React from 'react';
import { LeaderData2025 } from './2025/leader-data-2025';
import { MatchData2025 } from './2025/match-data-2025';
import { Tabs, TabsRef } from 'flowbite-react';
import { DaisyButton } from '@/app/ui/DaisyButton';

export default function TeamPage() {
  const { settings } = useSettings();

  const [teamNumber, setTeam] = React.useState('');
  const [retrieveDisabled, setRetrieveDisabled] = React.useState(false);

  // handle versions of the pit data per season
  const renderPitForTeam = () => {
    switch (settings.season) {
      case '2025':
        return (
          <PitData2025
            season={settings.season}
            eventId={settings.getEventId()}
            teamNumber={teamNumber}
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

  // handle versions of the match data per season
  const renderMatchForTeam = () => {
    switch (settings.season) {
      case '2025':
        return (
          <MatchData2025
            season={settings.season}
            eventId={settings.getEventId()}
            teamNumber={teamNumber}
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

  // handle versions of the subjective data per season
  const renderLeaderForTeam = () => {
    switch (settings.season) {
      case '2025':
        return (
          <LeaderData2025
            season={settings.season}
            eventId={settings.getEventId()}
            teamNumber={teamNumber}
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

  // Set the entered team number to trigger the page refresh...
  async function getTeamData(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    setRetrieveDisabled(true);
    const teamField = document.getElementById('teamNumber') as HTMLInputElement;
    setTeam(teamField.value);
    setRetrieveDisabled(false);
  }

  const tabsRef = React.useRef<TabsRef>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <main>
        <table>
          <tbody>
            <tr>
              <td width="400px">
                <label htmlFor="matchNum">Enter Team Num:</label>{' '}
              </td>
              <td width="200px">
                <input
                  type="number"
                  min="0"
                  max="20000"
                  id="teamNumber"
                  name="teamNumber"
                  defaultValue={teamNumber || ''}
                  className="bg-yellow-100"
                />
              </td>
              <td width="200px">
                <DaisyButton
                  id="set-team"
                  onClick={getTeamData}
                  disabled={retrieveDisabled}
                  aria-disabled={retrieveDisabled}
                >
                  Retrieve Team Data
                </DaisyButton>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <div className="overflow-x-auto">
          <Tabs
            aria-label="Full width tabs"
            variant="fullWidth"
            ref={tabsRef}
            onActiveTabChange={(tab) => setActiveTab(tab)}
          >
            <Tabs.Item active title="Match">
              <div>{renderMatchForTeam()}</div>
            </Tabs.Item>
            <Tabs.Item title="Pit">
              <div>{renderPitForTeam()}</div>
            </Tabs.Item>
            <Tabs.Item active title="Leader">
              <div>{renderLeaderForTeam()}</div>
            </Tabs.Item>
          </Tabs>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div hidden>my footer</div>
      </footer>
    </div>
  );
}
