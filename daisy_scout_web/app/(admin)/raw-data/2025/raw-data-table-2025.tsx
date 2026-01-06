'use client';

import React from 'react';
import { getMatch2025DataForEvent } from '../raw-data-actions';
import { Match2025Data } from '@/db/models/match-2025-data';
import { PageEventProp } from '../../../ui/types/page-event-props';
import { RowComponent } from 'tabulator-tables';
import dynamic from 'next/dynamic';
import { matchTypes } from '@/app/ui/constants/match-type';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

export function RawDataTable2025({ eventId }: PageEventProp) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [matchData, setRawMatchData] = React.useState<Match2025Data[]>([]);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      const data = await getMatch2025DataForEvent(eventId, matchTypes.qual);
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
    //{ field: 'allianceColor', title: 'Color' },
    { field: 'alliancePosition', title: 'Position' },
    { field: 'leave', title: 'Leave' },
    { field: 'autoStartLoc', title: 'Auto Start Location' },
    { field: 'autoReefL1', title: 'Auto Reef L1' },
    { field: 'autoReefL2', title: 'Auto Reef L2' },
    { field: 'autoReefL3', title: 'Auto Reef L3' },
    { field: 'autoReefL4', title: 'Auto Reef L4' },
    { field: 'coralA', title: 'Auto Reef A' },
    { field: 'coralB', title: 'Auto Reef B' },
    { field: 'coralC', title: 'Auto Reef C' },
    { field: 'coralD', title: 'Auto Reef D' },
    { field: 'coralE', title: 'Auto Reef E' },
    { field: 'coralF', title: 'Auto Reef F' },
    { field: 'autoNet', title: 'Auto Net' },
    { field: 'autoProcessor', title: 'Auto Processor' },
    { field: 'teleopReefL1', title: 'Teleop L1' },
    { field: 'teleopReefL2', title: 'Teleop L2' },
    { field: 'teleopReefL3', title: 'Teleop L3' },
    { field: 'teleopReefL4', title: 'Teleop L4' },
    { field: 'teleopNet', title: 'Teleop Net' },
    { field: 'teleopProcessor', title: 'Teleop Processor' },
    {
      field: 'teleopAlgaeRemoved',
      title: 'Teleop Algae Removed',
    },
    { field: 'endgame', title: 'Endgame' },
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
            //   dataLoaded: function (data: Match2025Data[]) {
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
