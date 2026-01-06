'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

import React from 'react';
import {
  addToDnpList,
  get2025PicklistForEvent,
  moveTeams,
  setAllianceSelected,
} from '../pick-list-actions';
import { PickList2025Data } from '@/db/models/pickList-2025-data';
import { PickListTableProps } from '../pick-list-table-props';
import { CellComponent, RowComponent } from 'tabulator-tables';

export function PickList2025({ eventId, tab }: PickListTableProps) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [matchData, setRawMatchData] = React.useState<PickList2025Data[]>([]);

  const getRawMatchData = async () => {
    const data = await get2025PicklistForEvent(eventId);
    setRawMatchData(data);
  };
  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    getRawMatchData();
    // Updating a state causes a re-render
    setInitialRenderComplete(true);

    // TODO: figure out getRawMatchData to not need to be a dependency...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, tab]);

  const allianceSelection = (
    cell: CellComponent,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
    formatterParams: {},
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered: () => void
  ): string | HTMLElement => {
    const rowData = cell.getRow().getData();

    // Create a button element
    const button = document.createElement('button');
    button.className =
      'flex items-center rounded-lg px-4 text-sm font-medium text-white bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-red-600 disabled:text-white justify-center';
    if (rowData['allianceSelected']) {
      button.innerHTML = 'Make Unselected';
    } else {
      button.innerHTML = 'Mark Selected';
    }

    // Attach a click event handler to the button
    button.addEventListener('click', async () => {
      button.disabled = true;

      // Get the row data
      const rowData = cell.getRow().getData();

      let newSelected;
      if (rowData['allianceSelected'] == 0) {
        newSelected = true;
      } else {
        newSelected = false;
      }

      // updated selected for
      // event and team...

      const eventId = rowData['eventId'];
      const teamNumber = rowData['teamNumber'];

      await setAllianceSelected(eventId, teamNumber, newSelected);
      cell.getRow().update({ allianceSelected: newSelected });
      getRawMatchData();
    });

    // Return the button element
    return button;
  };

  const addToDoNotPickButton = (
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
    button.innerHTML = 'DNP';

    // Attach a click event handler to the button
    button.addEventListener('click', async () => {
      button.disabled = true;
      // Get the row data
      const rowData = cell.getRow().getData();

      const reason = prompt(
        'Please provide a reason for being placed on the Do Not Pick list:'
      );

      if (!reason) {
        // this section means they clicked cancel
        alert(
          'Cancelling add - either cancel was pressed or no reason was given'
        );
        button.disabled = false;
        return false;
      }

      const eventId = rowData['eventId'];
      const teamNumber = rowData['teamNumber'];

      await addToDnpList(eventId, teamNumber, reason);
      getRawMatchData();
    });

    // Return the button element
    return button;
  };

  const columns = [
    {
      title: '',
      rowHandle: true,
      formatter: 'handle',
      headerSort: false,
      frozen: false,
      width: 30,
      minWidth: 30,
    },
    {
      title: '',
      formatter: addToDoNotPickButton,
      frozen: true,
      headerSort: false,
      width: 80,
    },
    {
      title: '',
      formatter: allianceSelection,
      frozen: true,
      headerSort: false,
      width: 160,
    },
    { field: 'teamNumber', title: 'Team', headerSort: false },
    { field: 'pickIndex', title: 'Pick Index', headerSort: false },
    { field: 'rank', title: 'Rank', headerSort: false },
    { field: 'allianceSelected', title: 'Picked', headerSort: false },
    { field: 'driveTrain', title: 'Drivetrain', headerSort: false },

    {
      field: 'autoStart',
      title: 'Auto Start<br/>All/Ctr/Opp',
      width: 110,
      headerSort: false,
    },
    { field: 'leave', title: 'Leave', width: 80, headerSort: false },
    {
      field: 'autoCoral',
      title: 'Auto<br/>Coral',
      width: 70,
      headerSort: false,
    },
    { field: 'autoNet', title: 'Auto<br/>Net', width: 75, headerSort: false },
    {
      field: 'autoProcessor',
      title: 'Auto<br/>Processor',
      width: 75,
      headerSort: false,
    },

    {
      field: 'teleopCoral',
      title: 'Tele<br/>Coral',
      width: 70,
      headerSort: false,
    },
    { field: 'teleopNet', title: 'Tele<br/>Net', width: 70, headerSort: false },
    {
      field: 'teleopProcessor',
      title: 'Tele<br/>Processor',
      width: 75,
      headerSort: false,
    },
    {
      field: 'teleopAlgaeRemoved',
      title: 'Tele<br/>Algae Removed',
      width: 75,
      headerSort: false,
    },

    {
      field: 'autoReef',
      title: 'Auto Reef<br/>A / B / C / D / E / F',
      width: 210,
      headerSort: false,
    },

    {
      field: 'endgame',
      title: 'Endgame <br/> Dp/Shlw/Prk/None',
      width: 140,
      headerSort: false,
    },
    {
      field: 'driverAbility',
      title: 'Driver<br>Ability',
      width: 80,
      headerSort: false,
    },
    {
      field: 'operability',
      title: 'Operability<br/>W/B/D/NS',
      width: 120,
      headerSort: false,
    },
    {
      field: 'role',
      title: 'Role <br/> C/A/D',
      width: 120,
      headerSort: false,
    },
    {
      field: 'hpNetShots',
      title: 'HP Net <br/> made/miss',
      width: 100,
      headerSort: false,
    },
  ];

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <DaisyTable
        data={matchData}
        columns={columns}
        rowFormatter={rowFormatter()}
        picklistRowMoved={picklistRowMoved()}
        canMoveRows={true}
        layout="fitDataTable"
      />
    );
  }

  // eslint-disable-next-line no-unused-vars
  function picklistRowMoved(): ((row: RowComponent) => void) | undefined {
    return function (row) {
      console.log('rowMoved', row);

      const rows = row.getTable().getRows();

      rowMoved(rows);
    };
  }

  async function rowMoved(rows: RowComponent[]) {
    const updates = [];

    for (const row1 of rows) {
      let oldIndex = row1.getData().pickIndex;
      const newIndex = row1.getPosition(true);
      if (typeof newIndex === 'number') {
        oldIndex = parseInt(oldIndex);
        if (oldIndex !== newIndex) {
          const { teamNumber, eventId } = row1.getData();
          updates.push({ teamNumber, pickIndex: newIndex, eventId });
        }
      }
    }
    if (updates.length > 0) {
      await moveTeams(updates);
    }

    // cause table to reload and re-render after move...
    getRawMatchData();
  }

  function rowFormatter() {
    return function (row: RowComponent) {
      const data = row.getData();
      const allianceSelected = data.allianceSelected;
      if (allianceSelected) {
        const children = row.getElement().childNodes;
        children.forEach((child) => {
          if (child instanceof HTMLElement) {
            if (child.innerHTML.indexOf('<button') >= 0) {
            } else {
              child.style.textDecoration = 'line-through';
              child.style.color = '#FF0000';
            }
          }
        });
      }
    };
  }
}
