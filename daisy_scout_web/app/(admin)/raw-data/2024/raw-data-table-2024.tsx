'use client';

import React from 'react';
import { getMatch2024DataForEvent } from '../raw-data-actions';
import { Match2024Data } from '@/db/queries/match-2024-data-queries';
import { PageEventProp } from '../../../ui/types/page-event-props';
import { RowComponent } from 'tabulator-tables';
import dynamic from 'next/dynamic';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});
export function RawDataTable2024({ eventId }: PageEventProp) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [matchData, setRawMatchData] = React.useState<Match2024Data[]>([]);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      const data = await getMatch2024DataForEvent(eventId);
      setRawMatchData(data);
    };
    getRawMatchData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [eventId]);

  const columns = [
    { field: 'matchNumber', title: 'Match' },
    { field: 'teamNumber', title: 'Team' },
    { field: 'scoutName', title: 'Scout' },
    { field: 'allianceColor', title: 'Color' },
    { field: 'robotLeave', title: 'Leave' },
    { field: 'autoStartLoc', title: 'Auto Start Location' },
    { field: 'autoNotesIntook1', title: 'Auto Notes Intook 1' },
    { field: 'autoNotesIntook2', title: 'Auto Notes Intook 2' },
    { field: 'autoNotesIntook3', title: 'Auto Notes Intook 3' },
    { field: 'autoNotesIntook4', title: 'Auto Notes Intook 4' },
    { field: 'autoNotesIntook5', title: 'Auto Notes Intook 5' },
    { field: 'autoNotesIntook6', title: 'Auto Notes Intook 6' },
    { field: 'autoNotesIntook7', title: 'Auto Notes Intook 7' },
    { field: 'autoNotesIntook8', title: 'Auto Notes Intook 8' },
    { field: 'autoNotesIntook9', title: 'Auto Notes Intook 9' },
    { field: 'autoAmpScored', title: 'Auto Amp' },
    { field: 'autoSpeakerScored', title: 'Auto Speaker' },
    { field: 'autoAmpMissed', title: 'Auto Missed' },
    { field: 'autoSpeakerMissed', title: 'Auto Missed' },
    { field: 'teleAmpScored', title: 'Tele Amp' },
    { field: 'teleSpeakerScored', title: 'Tele Speaker' },
    { field: 'teleAmpMissed', title: 'Tele Missed' },
    { field: 'teleSpeakerMissed', title: 'Tele Missed' },
    { field: 'climbState', title: 'Climb Percentage' },
    { field: 'ferry', title: 'Ferry' },
    { field: 'trap', title: 'Trap' },
    { field: 'harmony', title: 'Harmony' },
    { field: 'betColor', title: 'Bet Color' },
    { field: 'betAmount', title: 'Bet Amount' },
    { field: 'overUnder', title: 'Over/Under' },
    { field: 'createdAt', title: 'Created At' },
    { field: 'updatedAt', title: 'Updated At' },
    { field: 'syncedAt', title: 'Synced' },
  ];

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div className="grid p-4 font-[family-name:var(--font-geist-sans)]">
        <main className="row-start-2">
          <DaisyTable
            data={matchData}
            columns={columns}
            layout={'fitData'}
            rowFormatter={(row: RowComponent) => {
              const data = row.getData();
              if (data.col != 'teamNumber') {
                row.getElement().style.textAlign = 'right';
              }

              if (row.getData()['allianceColor'] == 'B') {
                row.getElement().style.backgroundColor =
                  'rgba(218, 247, 255, .4)';
              } else if (row.getData()['allianceColor'] == 'R') {
                row.getElement().style.backgroundColor =
                  'rgba(255, 204, 204, 0.40)';
              } else {
                row.getElement().style.backgroundColor = 'rgb(255, 255, 255)';
              }
            }}
            // //Do not copy these events -- this is for performance
            // //debugging
            // events={{
            //   dataLoaded: function (data: Match2024Data[]) {
            //     console.log('dataLoaded', new Date().toISOString());
            //     return data; //return the response data to tabulator
            //   },
            //   tableLoading: function () {
            //     console.log('tableLoading', new Date().toISOString());
            //   },
            //   tableBuilt: function () {
            //     console.log('tableBuilt', new Date().toISOString());
            //   },
            //   dataProcessing: function () {
            //     console.log('dataProcessing', new Date().toISOString());
            //   },
            //   dataProcessed: function () {
            //     console.log('dataProcessed', new Date().toISOString());
            //   },
            //   renderStarted: function () {
            //     console.log('renderStarted', new Date().toISOString());
            //   },
            //   renderComplete: function () {
            //     console.log('renderComplete', new Date().toISOString());
            //   },
            // }}
          />
        </main>
        <footer className="row-start-3 flex items-center justify-center">
          <div hidden>my footer</div>
        </footer>
      </div>
    );
  }
}
