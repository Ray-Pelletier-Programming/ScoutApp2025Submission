'use client';
import { useSettings } from '@/app/ui/context/settings-context';
import React, { useActionState } from 'react';
import {
  haveEventData,
  pullEventFromApi,
  resetMatch,
} from './settings-actions';
import { Button } from '@/app/ui/button';
import { DaisyButton } from '@/app/ui/DaisyButton';
import { GetSeasonEventMatchResultsFromFms } from '../db-stats/db-stats-actions';

export default function SettingsPage() {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);
  const { settings, updateSettings } = useSettings();
  const [haveData, updateHaveData] = React.useState('');

  const [retrieveTeamData, setRetrieveTeamData] = React.useState(false);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, []);

  React.useEffect(() => {
    async function fetchState() {
      const events = await haveEventData(settings.getEventId());
      let msg = '';
      if (events.length > 0) {
        msg = `Data is available for ${settings.getEventId()}`;
      } else {
        msg = `No data available for ${settings.getEventId()}`;
      }
      updateHaveData(msg);

      const div = document.getElementById('get-event-div') as HTMLDivElement;
      const button = document.getElementById('get-event') as HTMLButtonElement;
      if (div) {
        div.hidden = events.length > 0;
      }
      if (button) {
        button.disabled = events.length > 0;
        button.innerText = 'Pull Event';
        console.log(button.hidden);
      }
    }
    fetchState();
  }, [settings]); // <-- dependency array

  // Set the entered team number to trigger the page refresh...
  async function pullFMSResultData(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    setRetrieveTeamData(true);

    await GetSeasonEventMatchResultsFromFms(
      parseInt(settings.season),
      settings.eventCode
    );
    setRetrieveTeamData(false);
  }

  async function pullEvent(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    const button = document.getElementById('get-event') as HTMLButtonElement;
    if (button) {
      button.disabled = true;
      button.innerText = 'Pulling Event...';
    }
    await pullEventFromApi(settings.season, settings.eventCode);

    updateSettings(settings);
  }

  const [, resetMatchForReplay] = useActionState(resetMatch, null);

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div className="p-6">
        <div className="absolute left-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="mt-4">
            <label className="block">Season</label>
            <input
              type="text"
              value={settings.season}
              onChange={(e) => updateSettings({ season: e.target.value })}
              className="border p-2"
            ></input>
          </div>
          <div className="mt-4">
            <label className="block">Event</label>
            <input
              type="text"
              value={settings.eventCode}
              onChange={(e) => updateSettings({ eventCode: e.target.value })}
              className="border p-2"
            ></input>
          </div>
          <div className="mt-4">
            <p>{haveData}</p>
            <div id="get-event-div">
              <Button id="get-event" onClick={pullEvent}>
                Pull Event
              </Button>
            </div>
          </div>{' '}
        </div>
        <div className="absolute right-6">
          <div className="bg-red-100 p-6" style={{ width: '500px' }}>
            <h1 className="text-xl font-bold">Reset Match for Replay</h1>
            <br />
            <p className="text-sm">
              Enter match number that will be replayed before scanning data from
              the replayed match.
            </p>
            <br />
            <form action={resetMatchForReplay}>
              <table>
                <tbody>
                  <tr>
                    <td width="400px">
                      <input
                        type="hidden"
                        id="eventId"
                        name="eventId"
                        value={settings.getEventId()}
                      />
                      <label htmlFor="matchNum">Enter Match Num:</label>{' '}
                    </td>
                    <td width="200px">
                      <input
                        type="number"
                        min="0"
                        max="200"
                        id="matchNum"
                        name="matchNum"
                        className="bg-yellow-100"
                      />
                    </td>
                    <td width="200px">
                      <Button type="submit">Reset Qual Match</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
            </form>
          </div>
          <br />
          <div className="bg-yellow-100 p-6" style={{ width: '500px' }}>
            <h1 className="text-xl font-bold">Pull FMS Data</h1>
            <br />
            <p className="text-sm">
              Retrieves the latest FMS data for the current event.
            </p>
            <br />
            <DaisyButton
              id="get-fms-data"
              onClick={pullFMSResultData}
              disabled={retrieveTeamData}
              aria-disabled={retrieveTeamData}
            >
              Retrieve Team Data
            </DaisyButton>
          </div>
        </div>
      </div>
    );
  }
}
