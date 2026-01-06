'use client';

import React from 'react';
import {
  getEventMatchSchedule,
  pullScheduleFromApi,
} from '@/app/(public)/event-schedule/event-schedule-actions';
import { EventMatch } from '@/db/models/event-match';
import { PageFullProps } from '@/app/ui/types/page-full-props';
import { RowComponent } from 'tabulator-tables';
import dynamic from 'next/dynamic';
import { matchTypes } from '@/app/ui/constants/match-type';
import { DaisyButton } from '@/app/ui/DaisyButton';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../ui/daisy-table-component'), {
  ssr: false,
});

export function MatchScheduleTable({
  eventId: event_id,
  eventCode,
  season,
}: PageFullProps) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [filterValue, setFilterValue] = React.useState('');

  const [pullDisabled, setPullDisabled] = React.useState(false);

  const [matchData, setRawMatchData] = React.useState<EventMatch[]>([]);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      const data = await getEventMatchSchedule(event_id, matchTypes.qual);
      setRawMatchData(data);
    };
    getRawMatchData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [event_id]);

  React.useEffect(() => {
    console.log('useEffect');
    const div = document.getElementById('get-schedule-div') as HTMLDivElement;
    const button = document.getElementById('get-schedule') as HTMLButtonElement;
    if (div) {
      div.hidden = matchData.length > 0;
    }
    if (button) {
      button.disabled = matchData.length > 0;
      button.innerText = 'Pull Schedule...';
      console.log(button.hidden);
    }
  }, [matchData]);

  const TEAM_NUM = 341;
  const BTEAM_NUM = 9985;

  interface Cell {
    getValue: () => string;
    getElement: () => HTMLElement;
  }

  //TODO: REMOVE FOR OTHER FORMATTER
  const formatDateTemp = (cell: Cell): string => {
    const val = cell.getValue();
    const date = new Date(val);

    const format = 'mm/dd/yyyy hh:ii';
    const _padStart = (value: number): string =>
      value.toString().padStart(2, '0');
    return format
      .replace(/yyyy/g, _padStart(date.getFullYear()))
      .replace(/dd/g, _padStart(date.getDate()))
      .replace(/mm/g, _padStart(date.getMonth() + 1))
      .replace(/hh/g, _padStart(date.getHours() + 4))
      .replace(/ii/g, _padStart(date.getMinutes()))
      .replace(/ss/g, _padStart(date.getSeconds()));
  };

  const formatTeam = (cell: Cell): string => {
    let val = cell.getValue();
    const el = cell.getElement();
    if (filterValue != '' && val.toString().includes(filterValue)) {
      el.style.border = '2px';
      el.style.borderColor = '#FF0000';
      el.style.borderStyle = 'solid';
    }

    if (val == TEAM_NUM.toString()) {
      el.style.backgroundColor = '#FBDC0A';
      val = "<span style='font-weight:bold;color:#0086CB'>" + val + '</span>';
    } else if (val == BTEAM_NUM.toString()) {
      el.style.backgroundColor = '#B3D5FF';
      val = "<span style='font-weight:bold;color:#DE9F00'>" + val + '</span>';
    }

    return val;
  };

  const clearFilter = () => {
    setFilterValue('');
    //table.clearFilter();
  };

  const getFilteredData = () => {
    if (filterValue != '') {
      return matchData.filter(
        (item) =>
          item.blue1!.toString().includes(filterValue) ||
          item.blue2!.toString().includes(filterValue) ||
          item.blue3!.toString().includes(filterValue) ||
          item.red1!.toString().includes(filterValue) ||
          item.red2!.toString().includes(filterValue) ||
          item.red3!.toString().includes(filterValue)
      );
    } else {
      return matchData;
    }
  };

  const columns = [
    { field: 'matchNumber', title: 'Match #', frozen: true, sorter: 'number' },
    {
      field: 'blue1',
      title: 'Blue 1',
      formatter: formatTeam,
      sorter: 'number',
    },
    {
      field: 'blue2',
      title: 'Blue 2',
      formatter: formatTeam,
      sorter: 'number',
    },
    {
      field: 'blue3',
      title: 'Blue 3',
      formatter: formatTeam,
      sorter: 'number',
    },
    { field: 'red1', title: 'Red 1', formatter: formatTeam, sorter: 'number' },
    { field: 'red2', title: 'Red 2', formatter: formatTeam, sorter: 'number' },
    { field: 'red3', title: 'Red 3', formatter: formatTeam, sorter: 'number' },
    {
      field: 'scheduledStartTime',
      title: 'Scheduled Start Time',
      formatter: formatDateTemp,
      // formatter: DateTime,
      // formatterParams: {
      //   inputFormat: 'iso',
      //   outputFormat: 'MM/dd/yy hh:mm a',
      //   invalidPlaceholder: '(invalid date)',
      //   timezone: 'utc',
      // },
    },
  ];

  async function pullEventSchedule(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    setPullDisabled(true);
    const data = await pullScheduleFromApi(season, eventCode);
    setRawMatchData(data!);
    setPullDisabled(false);
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
          <div>
            <input
              id="filter-value"
              type="text"
              value={filterValue}
              placeholder="team number to filter"
              onChange={(e) => {
                setFilterValue(e.target.value);
              }}
            />
            {'  '}
            <DaisyButton id="filter-clear" onClick={clearFilter}>
              Clear Filter
            </DaisyButton>
            {'  '}
            <div id="get-schedule-div">
              <DaisyButton
                onClick={pullEventSchedule}
                id="get-schedule"
                aria-disabled={pullDisabled}
                disabled={pullDisabled}
              >
                {pullDisabled ? 'Pull Schedule...' : 'Pull Schedule'}
              </DaisyButton>
            </div>
          </div>
          <br />
          <DaisyTable
            data={getFilteredData()}
            columns={columns}
            layout={'fitData'}
            rowFormatter={(row: RowComponent) => {
              row.getElement().style.textAlign = 'right';
            }}
          />
        </main>
      </div>
    );
  }
}
