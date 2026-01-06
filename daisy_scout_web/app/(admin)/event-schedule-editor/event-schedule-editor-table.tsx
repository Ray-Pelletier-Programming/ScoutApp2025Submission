'use client';

import React from 'react';
import {
  getEventMatchSchedule,
  saveManualMatchSchedule,
} from '@/app/(admin)/event-schedule-editor/event-schedule-editor-actions';
import { CustomMatchSchedule } from '@/db/models/custom-match-schedule';
import { PageFullProps } from '@/app/ui/types/page-full-props';
import { RowComponent } from 'tabulator-tables';
import dynamic from 'next/dynamic';
import { matchTypes } from '@/app/ui/constants/match-type';
import { DaisyButton } from '@/app/ui/DaisyButton';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../ui/daisy-table-component'), {
  ssr: false,
});

export function MatchScheduleEditorTable({ eventId: event_id }: PageFullProps) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [matchData, setRawMatchData] = React.useState<CustomMatchSchedule[]>(
    []
  );

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      const data = await getEventMatchSchedule(event_id, matchTypes.qual);
      if (data.length > 0) {
        if (
          data[0].scheduledStartTime != null &&
          data[0].scheduledStartTime >= new Date('2000-01-01')
        ) {
          // cannot edit a downloaded schedule...
          alert(
            'This schedule has already been downloaded. Redirecting to Match Schedule.'
          );
          location.href = '/event-schedule';
          return;
        }
      }
      const formattedData = data.map((match) => ({
        matchNumber: match.matchNumber!,
        blue1: match.blue1,
        blue2: match.blue2,
        blue3: match.blue3,
        red1: match.red1,
        red2: match.red2,
        red3: match.red3,
      }));
      setRawMatchData(formattedData);
    };
    getRawMatchData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [event_id]);

  const TEAM_NUM = 341;
  const BTEAM_NUM = 9985;

  interface Cell {
    getValue: () => string;
    getElement: () => HTMLElement;
  }

  const formatTeam = (cell: Cell): string => {
    let val = cell.getValue();
    const el = cell.getElement();

    if (val == TEAM_NUM.toString()) {
      el.style.backgroundColor = '#FBDC0A';
      val = "<span style='font-weight:bold;color:#0086CB'>" + val + '</span>';
    } else if (val == BTEAM_NUM.toString()) {
      el.style.backgroundColor = '#B3D5FF';
      val = "<span style='font-weight:bold;color:#DE9F00'>" + val + '</span>';
    }

    return val;
  };

  const columns = [
    { field: 'matchNumber', title: 'Match #', frozen: true, sorter: 'number' },
    {
      field: 'blue1',
      title: 'Blue 1',
      formatter: formatTeam,
      sorter: 'number',
      headerSort: false,
      width: 100,
      editor: 'input',
      editorParams: {
        mask: '99999',
        elementAttributes: {
          maxlength: '5', //set the maximum character length of the input element to 5 characters
        },
      },
    },
    {
      field: 'blue2',
      title: 'Blue 2',
      formatter: formatTeam,
      sorter: 'number',
      headerSort: false,
      width: 100,
      editor: 'input',
      editorParams: {
        mask: '99999',
        elementAttributes: {
          maxlength: '5', //set the maximum character length of the input element to 5 characters
        },
      },
    },
    {
      field: 'blue3',
      title: 'Blue 3',
      formatter: formatTeam,
      sorter: 'number',
      headerSort: false,
      width: 100,
      editor: 'input',
      editorParams: {
        mask: '99999',
        elementAttributes: {
          maxlength: '5', //set the maximum character length of the input element to 5 characters
        },
      },
    },
    {
      field: 'red1',
      title: 'Red 1',
      formatter: formatTeam,
      sorter: 'number',
      headerSort: false,
      width: 100,
      editor: 'input',
      editorParams: {
        mask: '99999',
        elementAttributes: {
          maxlength: '5', //set the maximum character length of the input element to 5 characters
        },
      },
    },
    {
      field: 'red2',
      title: 'Red 2',
      formatter: formatTeam,
      sorter: 'number',
      headerSort: false,
      width: 100,
      editor: 'input',
      editorParams: {
        mask: '99999',
        elementAttributes: {
          maxlength: '5', //set the maximum character length of the input element to 5 characters
        },
      },
    },
    {
      field: 'red3',
      title: 'Red 3',
      formatter: formatTeam,
      sorter: 'number',
      headerSort: false,
      width: 100,
      editor: 'input',
      editorParams: {
        mask: '99999',
        elementAttributes: {
          maxlength: '5', //set the maximum character length of the input element to 5 characters
        },
      },
    },
  ];

  function generateMatches() {
    const text =
      'If this is an offseason event, press OK to continue. If this is a regular season event, press cancel and pull the schedule from the Match Schedule page.';
    if (confirm(text) == false) {
      return;
    }

    const numMatches = parseInt(
      (document.getElementById('num-matches') as HTMLInputElement).value
    );
    const newMatchData = matchData.slice();
    for (let i = matchData.length + 1; i <= numMatches; i++) {
      newMatchData.push({
        matchNumber: i,
        blue1: null,
        blue2: null,
        blue3: null,
        red1: null,
        red2: null,
        red3: null,
      });
    }
    setRawMatchData(newMatchData);
  }

  function areAllFieldsPopulated(): boolean {
    const keys: (keyof CustomMatchSchedule)[] = [
      'blue1',
      'blue2',
      'blue3',
      'red1',
      'red2',
      'red3',
    ];
    for (const match of matchData) {
      for (const key of keys) {
        if (match[key] === null || match[key] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  function areMatchTeamNumbersUnique(): boolean {
    const keys: (keyof CustomMatchSchedule)[] = [
      'blue1',
      'blue2',
      'blue3',
      'red1',
      'red2',
      'red3',
    ];
    for (const match of matchData) {
      const seen = new Set<number | null>();
      for (const key of keys) {
        const value = match[key];
        if (value !== null && seen.has(value)) {
          return false; // Duplicate found
        }
        seen.add(value);
      }
    }
    return true; // No duplicates found
  }

  async function saveMatchSchedule() {
    if (matchData.length === 0) {
      alert('No matches to save. Please generate matches first.');
      return;
    }

    if (!areAllFieldsPopulated()) {
      alert('One or more Team Numbers are missing. Please fill all fields.');
      return;
    }

    if (!areMatchTeamNumbersUnique()) {
      alert(
        'One or more matches have a duplicate team numbner. Please check the schedule.'
      );
      return;
    }

    alert('Saving match schedule...');
    console.log(matchData);
    await saveManualMatchSchedule(event_id, matchData);
  }

  function deleteMatchSchedule() {
    const text = 'Press OK to clear the schedule, or cancel to leave as is.';
    if (confirm(text) == true) {
      setRawMatchData([]);
    }
  }

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        <main>
          <div id="generate-controls">
            <input id="num-matches" type="text" placeholder="Total Matches" />
            {'  '}
            <DaisyButton id="gen-matches" onClick={generateMatches}>
              Generate
              <br />
              Matches Records
            </DaisyButton>
            {'  '}
            <DaisyButton id="del-schedule" onClick={deleteMatchSchedule}>
              Delete Generated
              <br />
              Schedule
            </DaisyButton>
            {'  '}
          </div>
          <br />
          <h2>Offseason Event Qualification Match Schedule Editor</h2>
          <DaisyTable
            data={matchData}
            columns={columns}
            layout={'fitData'}
            rowFormatter={(row: RowComponent) => {
              row.getElement().style.textAlign = 'right';
            }}
          />
          <br />
          <div>
            <DaisyButton id="save-schedule" onClick={saveMatchSchedule}>
              Save Schedule
            </DaisyButton>
          </div>
          <br />
          <br />
        </main>
      </div>
    );
  }
}
