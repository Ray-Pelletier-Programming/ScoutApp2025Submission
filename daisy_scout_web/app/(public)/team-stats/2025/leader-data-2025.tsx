import React from 'react';
import { TeamDataProps } from '../../../ui/types/team-data-props';
import {
  getIsPublicCloud,
  getTeam2025LeaderDataForEvent,
} from '../team-stats-actions';
import dynamic from 'next/dynamic';
import { matchTypes } from '@/app/ui/constants/match-type';
import { TbaLeader2025Data } from '@/db/models/tba-leader-2025-data';
import { CellComponent } from 'tabulator-tables';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
export function LeaderData2025({ season, eventId, teamNumber }: TeamDataProps) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [teamLeaderData, setRawTeamLeaderData] = React.useState<
    Array<TbaLeader2025Data> | undefined
  >(undefined);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leaderNoteColumns, setLeaderNoteColumns] = React.useState<any[]>([]);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      if (teamNumber != null && teamNumber != '') {
        const data = await getTeam2025LeaderDataForEvent(
          eventId,
          teamNumber,
          matchTypes.qual
        );

        // can only get env variables server side, and must be async...
        const isPubCloud = await getIsPublicCloud();
        if (isPubCloud) {
          setLeaderNoteColumns([
            { field: 'matchNumber', title: 'Match', width: 80, frozen: true },
            { field: 'otherNotes', title: 'Notes', width: 650 },
            {
              field: 'videoKey',
              title: 'Video',
              width: 360,
              formatter: formatVideo,
            },
          ]);
        } else {
          setLeaderNoteColumns([
            { field: 'matchNumber', title: 'Match', width: 80, frozen: true },
            { field: 'scoutName', title: 'Scout', width: 150, frozen: true },
            { field: 'otherNotes', title: 'Notes', width: 650 },
            {
              field: 'videoKey',
              title: 'Video',
              width: 360,
              formatter: formatVideo,
            },
          ]);
        }
        setRawTeamLeaderData(data);
      } else {
        setRawTeamLeaderData(undefined);
      }
    };
    getRawMatchData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [eventId, teamNumber]);

  const formatVideo = (
    cell: CellComponent,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
    formatterParams: {},
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered: () => void
  ): string | HTMLElement => {
    const rowData = cell.getRow().getData();

    // Create a button element
    const href = document.createElement('a');

    //todo: use videoType to generate link in case not youtube...
    href.href = `https://youtube.com/watch?v=${rowData['videoKey']}`;
    href.target = '_blank';
    href.innerText = `https://youtube.com/watch?v=${rowData['videoKey']}`;
    href.className =
      'font-medium text-blue-600 dark:text-blue-500 hover:underline';
    return href;
  };

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderLeaderNotes = () => {
    if (teamLeaderData && teamLeaderData.length > 0) {
      return (
        <div>
          <strong>Leader Notes</strong>
          <br />
          <DaisyTable
            data={teamLeaderData}
            columns={leaderNoteColumns}
            layout={'fitDataTable'}
          />
        </div>
      );
    } else {
      return;
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
        <center>
          <div>{renderLeaderNotes()}</div>
        </center>
        <br />
        {
          //teamLeaderData ? JSON.stringify(teamLeaderData) : 'No data available'
        }
      </div>
    );
  }
}
