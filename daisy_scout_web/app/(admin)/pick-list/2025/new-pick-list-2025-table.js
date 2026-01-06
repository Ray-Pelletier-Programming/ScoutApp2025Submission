'use client';
import React from 'react';
import 'tabulator-tables/dist/css/tabulator.min.css'; //import Tabulator stylesheet
import { DaisyTemp } from '../../../ui/table.js';
import {
  addToDnpList,
  get2025PicklistForEvent,
  moveTeams,
  setAllianceSelected,
} from '../pick-list-actions.jsx';

export function PickList2025({ eventId, tab }) {
  const [data, setData] = React.useState(null);
  const [isLoading, setLoading] = React.useState(true);
  const getRawMatchData = async () => {
    const data = await get2025PicklistForEvent(eventId);
    setData(data);
    setLoading(false);
  };
  React.useEffect(() => {
    getRawMatchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, tab]);

  function onRowMoved() {
    return function (row) {
      console.log('Row: ' + row.getData().name + ' has been moved');
      console.log('rowMoved', row);

      const rows = row.getTable().getRows();
      const updates = [];

      for (const row1 of rows) {
        let oldIndex = row1.getData().pickIndex;
        const newIndex = row1.getPosition(true);
        if (typeof newIndex === 'number') {
          oldIndex = parseInt(oldIndex);
          if (oldIndex !== newIndex) {
            const { teamNumber, eventId } = row1.getData();
            updates.push({ teamNumber, pickIndex: newIndex, eventId });
            //moveTeam(eventId, row1.getData().teamNumber, newIndex);
            //console.log(`row now at ${newIndex} from ${oldIndex}`);
          }
        }
      }
      if (updates.length > 0) {
        moveTeams(updates);
      }
      // cause table to reload and re-render after move...
      getRawMatchData();
    };
  }

  const allianceSelection = (
    cell,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    formatterParams,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered
  ) => {
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
    cell,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    formatterParams,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    onRendered
  ) => {
    // Create a button element
    const button = document.createElement('button');
    button.className =
      'flex items-center rounded-lg px-4 text-sm font-medium text-white bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-red-600 disabled:text-white justify-center';
    button.innerHTML = 'DNP';

    // Attach a click event handler to the button
    button.addEventListener('click', async () => {
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

  function rowFormatter() {
    return function (row) {
      console.log('rowformatter start');
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

  var columns = [
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
    { field: 'teamNumber', title: 'Team' },
    { field: 'pickIndex', title: 'Pick Index' },
    { field: 'rank', title: 'Rank' },
    { field: 'allianceSelected', title: 'Picked' },
    { field: 'driveTrain', title: 'Drivetrain' },

    { field: 'autoStart', title: 'Auto Start<br/>All/Ctr/Opp', width: 110 },
    { field: 'leave', title: 'Leave', width: 80 },
    { field: 'autoCoral', title: 'Auto<br/>Coral', width: 70 },
    { field: 'autoNet', title: 'Auto<br/>Net', width: 75 },
    { field: 'autoProcessor', title: 'Auto<br/>Processor', width: 75 },

    { field: 'teleopCoral', title: 'Tele<br/>Coral', width: 70 },
    { field: 'teleopNet', title: 'Tele<br/>Net', width: 70 },
    { field: 'teleopProcessor', title: 'Tele<br/>Processor', width: 75 },
    { field: 'teleopAlgaeRemoved', title: 'Tele<br/>Algae Removed', width: 75 },

    {
      field: 'autoReef',
      title: 'Auto Reef<br/>A / B / C / D / E / F',
      width: 210,
    },

    {
      field: 'endgame',
      title: 'Endgame <br/> Dp/Shlw/Prk/None',
      width: 140,
    },
    {
      field: 'driverAbility',
      title: 'Driver<br>Ability',
      width: 80,
    },
    {
      field: 'operability',
      title: 'Operability<br/>W/B/D/NS',
      width: 120,
    },
    {
      field: 'role',
      title: 'Role <br/> C/A/D',
      width: 120,
    },
    {
      field: 'hpNetShots',
      title: 'HP Net <br/> made/miss',
      width: 100,
    },
  ];

  if (isLoading) return <p>Loading...</p>;

  return (
    <DaisyTemp
      tableData={data}
      columns={columns}
      onRowMoved={onRowMoved}
      rowFormatter={rowFormatter}
    />
  );
}
