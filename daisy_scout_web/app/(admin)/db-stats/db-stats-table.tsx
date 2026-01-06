'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { EventStats } from '@/db/queries/admin-queries';
import {
  DoCmpTxLoad,
  get2025EventStats,
  GetSeasonEventMatchResultsFromFms,
  GetSeasonEventMatchResultsFromTba,
} from './db-stats-actions';
import { CellComponent } from 'tabulator-tables';
import { pullEventFromApi } from '../settings/settings-actions';
import { pullScheduleFromApi } from '@/app/(public)/event-schedule/event-schedule-actions';
import { DaisyButton } from '@/app/ui/DaisyButton';
import { useSettings } from '@/app/ui/context/settings-context';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../ui/daisy-table-component'), {
  ssr: false,
});

export function DbStatsTable() {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const { settings } = useSettings();

  const [dbStatsData, setDbStatsData] = React.useState<EventStats[]>([]);

  const getDbStatsData = async () => {
    const data = await get2025EventStats();
    setDbStatsData(data);
  };

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    getDbStatsData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, []);

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
      .replace(/hh/g, _padStart(date.getHours()))
      .replace(/ii/g, _padStart(date.getMinutes()))
      .replace(/ss/g, _padStart(date.getSeconds()));
  };

  const refreshTeams = (
    cell: CellComponent,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
    formatterParams: {},
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered: () => void
  ): string | HTMLElement => {
    // Create a button element
    const cellValue = cell.getValue();

    const div = document.createElement('div');
    div.style.display = 'flex';

    const span = document.createElement('span');
    span.innerHTML = cellValue;
    div.appendChild(span);
    const button = document.createElement('button');
    button.className =
      'flex items-center rounded-lg px-4 text-sm font-medium text-white bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-red-600 disabled:text-white justify-center';
    button.innerHTML =
      '<svg class="w-4 h-4 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/> </svg>';

    // Attach a click event handler to the button
    button.addEventListener('click', async () => {
      //button.innerHTML = 'Refreshing...';
      button.disabled = true;
      // Get the row data
      const rowData = cell.getRow().getData();

      const eventCode = rowData['eventCode'];
      const season = rowData['season'];

      await pullEventFromApi(season, eventCode);
      getDbStatsData();
      button.disabled = false;
      //button.innerHTML = 'Refresh Teams';
    });
    button.style.marginLeft = 'auto';

    div.appendChild(button);
    return div;
  };

  const refreshEvents = (
    cell: CellComponent,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
    formatterParams: {},
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered: () => void
  ): string | HTMLElement => {
    // Create a button element
    const cellValue = cell.getValue();

    const div = document.createElement('div');
    div.style.display = 'flex';
    const span = document.createElement('span');
    span.innerHTML = cellValue;
    div.appendChild(span);
    const button = document.createElement('button');
    button.className =
      'flex items-center rounded-lg px-4 text-sm font-medium text-white bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-red-600 disabled:text-white justify-center';
    button.innerHTML =
      '<svg class="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/> </svg>';

    // Attach a click event handler to the button
    button.addEventListener('click', async () => {
      //button.innerHTML = 'Refreshing...';
      button.disabled = true;
      // Get the row data
      const rowData = cell.getRow().getData();

      const eventCode = rowData['eventCode'];
      const season = rowData['season'];

      await pullScheduleFromApi(season, eventCode);
      getDbStatsData();
      button.disabled = false;
      //button.innerHTML = 'Refresh Matches';
    });
    button.style.marginLeft = 'auto';

    div.appendChild(button);
    return div;
  };

  const refreshResults = (
    cell: CellComponent,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
    formatterParams: {},
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered: () => void
  ): string | HTMLElement => {
    // Create a button element
    // Create a button element
    const cellValue = cell.getValue();

    const div = document.createElement('div');
    div.style.display = 'flex';
    const span = document.createElement('span');
    span.innerHTML = cellValue;
    div.appendChild(span);
    const button = document.createElement('button');
    button.className =
      'flex items-center rounded-lg px-4 text-sm font-medium text-white bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-red-600 disabled:text-white justify-center';
    button.innerHTML =
      '<svg class="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/> </svg>';

    // Attach a click event handler to the button
    button.addEventListener('click', async () => {
      //button.innerHTML = 'Refreshing...';
      button.disabled = true;
      // Get the row data
      const rowData = cell.getRow().getData();

      const eventCode = rowData['eventCode'];
      const season = rowData['season'];

      await GetSeasonEventMatchResultsFromFms(season, eventCode);
      getDbStatsData();
      button.disabled = false;
      //button.innerHTML = 'Refresh Results';
    });
    button.style.marginLeft = 'auto';

    div.appendChild(button);
    return div;
  };

  const refreshTba = (
    cell: CellComponent,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
    formatterParams: {},
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered: () => void
  ): string | HTMLElement => {
    // Create a button element
    const cellValue = cell.getValue();

    const div = document.createElement('div');
    div.style.display = 'flex';
    const span = document.createElement('span');
    span.style.float = 'left';
    span.innerHTML = cellValue;
    div.appendChild(span);

    const button = document.createElement('button');
    button.className =
      'flex items-center rounded-lg px-4 text-sm font-medium text-white bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-red-600 disabled:text-white justify-center';

    button.innerHTML =
      '<svg class="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"/> </svg>';

    // Attach a click event handler to the button
    button.addEventListener('click', async () => {
      //button.innerHTML = 'Refreshing...';
      button.disabled = true;
      // Get the row data
      const rowData = cell.getRow().getData();

      const eventCode = rowData['eventCode'];
      const season = rowData['season'];

      await GetSeasonEventMatchResultsFromTba(season, eventCode);
      getDbStatsData();
      button.disabled = false;
      //button.innerHTML = 'Refresh Tba Results';
    });
    button.style.marginLeft = 'auto';

    div.appendChild(button);
    return div;
  };

  async function getCMPData(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    await DoCmpTxLoad(parseInt(settings.season), settings.getEventId());

    return;
  }

  const columns = [
    { field: 'eventId', title: 'Event Id', frozen: true },
    {
      field: 'eventCode',
      title: 'Event Code',
    },
    {
      field: 'startDate',
      title: 'Start Date',
      formatter: formatDateTemp,
    },
    {
      field: 'numTeams',
      title: 'Num Teams',
      sorter: 'number',
      formatter: refreshTeams,
    },
    {
      field: 'lastTeamAdd',
      title: 'Last Team Add',
      formatter: formatDateTemp,
    },
    {
      field: 'numMatches',
      title: 'Num Matches',
      sorter: 'number',
      formatter: refreshEvents,
    },
    {
      field: 'lastMatchAdd',
      title: 'Last Match Add',
      formatter: formatDateTemp,
    },
    {
      field: 'numMatchResults',
      title: 'Num Results',
      sorter: 'number',
      formatter: refreshResults,
    },
    {
      field: 'lastResultAdd',
      title: 'Last Result Add',
      formatter: formatDateTemp,
    },
    {
      field: 'numMatchTbaResults',
      title: 'Num TBA Results',
      sorter: 'number',
      formatter: refreshTba,
    },
    {
      field: 'lastTbaResultAdd',
      title: 'Last TBA Add',
      formatter: formatDateTemp,
    },
  ];

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        <main>
          <DaisyTable data={dbStatsData} columns={columns} layout={'fitData'} />
          <div id="CmpTxPuller" hidden={false}>
            {
              // really is load last event for every team in curent active event
              // Can't use this for DCMP Because lock is too late.
            }
            <DaisyButton
              id="Load CMPTX Division Data"
              onClick={getCMPData}
              disabled={false}
              aria-disabled={false}
            >
              Load CMPTX Division Data
            </DaisyButton>
          </div>
        </main>
      </div>
    );
  }
}
