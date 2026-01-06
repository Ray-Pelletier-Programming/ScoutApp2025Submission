'use client';

import React from 'react';
import {
  get2025DoNotPicklistForEvent,
  removeFromDnpList,
} from '../pick-list-actions';
import { DoNotPickList2025Data } from '@/db/models/do-not-pick-list-2025-data';
import { PickListTableProps } from '../pick-list-table-props';
import { CellComponent } from 'tabulator-tables';
import dynamic from 'next/dynamic';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});
export function DoNotPickList2025({ eventId, tab }: PickListTableProps) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [matchData, setRawMatchData] = React.useState<DoNotPickList2025Data[]>(
    []
  );

  const getRawMatchData = async () => {
    const data = await get2025DoNotPicklistForEvent(eventId);
    setRawMatchData(data);
  };

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    getRawMatchData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, tab]);

  const removeFromDoNotPickButton = (
    cell: CellComponent,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
    formatterParams: {},
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered: () => void
  ): string | HTMLElement => {
    // Create a button element
    const button = document.createElement('button');
    button.className =
      'flex items-center rounded-lg px-4 text-sm font-medium text-white bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-red-600 disabled:text-white justify-center';
    button.innerHTML = 'Remove';

    // Attach a click event handler to the button
    button.addEventListener('click', async () => {
      button.disabled = true;
      // Get the row data
      const rowData = cell.getRow().getData();

      const eventId = rowData['eventId'];
      const teamNumber = rowData['teamNumber'];

      await removeFromDnpList(eventId, teamNumber);
      getRawMatchData();
    });

    // Return the button element
    return button;
  };

  const columns = [
    {
      title: '',
      formatter: removeFromDoNotPickButton,
      frozen: true,
      headerSort: false,
      width: 120,
    },
    { field: 'teamNumber', title: 'Team', width: 120 },
    { field: 'reason', title: 'Reason' },
  ];

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <DaisyTable data={matchData} columns={columns} layout="fitColumns" />
    );
  }
}
