'use client';

import React from 'react';
import { get2025SharableMatchDataFor2025Event } from '../event-stats-actions';
import { SharableMatch2025Data } from '@/db/models/sharable-match-2025-data';
import { PageEventProp } from '../../../ui/types/page-event-props';
import dynamic from 'next/dynamic';
import { matchTypes } from '@/app/ui/constants/match-type';

// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

export function EventDataShare2025({ eventId }: PageEventProp) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [eventMatchData, setRawEventMatchData] = React.useState<
    SharableMatch2025Data[]
  >([]);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      const data = await get2025SharableMatchDataFor2025Event(
        eventId,
        matchTypes.qual
      );
      setRawEventMatchData(data);
    };
    getRawMatchData();

    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [eventId]);

  interface Cell {
    getValue: () => number;
    getElement: () => HTMLElement;
  }

  const formatYN = (cell: Cell): string => {
    const val = cell.getValue();

    if (val > 0) {
      return 'Y';
    }
    return '-';
  };

  const columns = [
    {
      field: 'teamNumber',
      title: 'Team',
      width: 50,
      frozen: true,
      cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
      hozAlign: 'right',
    },
    {
      field: 'totalCoral',
      title: 'Total Avg<br/>Coral',
      width: 50,
      cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
      hozAlign: 'right',
    },
    {
      title: 'Auto',
      headerHozAlign: 'center',
      columns: [
        {
          field: 'totalAutoCoral',
          title: 'Avg<br/>Coral',
          width: 20,
          cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
          hozAlign: 'right',
        },
        {
          title: 'Score Level',
          headerHozAlign: 'center',
          columns: [
            {
              field: 'autoReefL1',
              title: 'L1',
              width: 20,
              formatter: formatYN,
              headerSort: false,
              cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
              hozAlign: 'center',
            },
            {
              field: 'autoReefL2',
              title: 'L2',
              width: 20,
              formatter: formatYN,
              headerSort: false,
              cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
              hozAlign: 'center',
            },
            {
              field: 'autoReefL3',
              title: 'L3',
              width: 20,
              formatter: formatYN,
              headerSort: false,
              cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
              hozAlign: 'center',
            },
            {
              field: 'autoReefL4',
              title: 'L4',
              width: 20,
              formatter: formatYN,
              headerSort: false,
              cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
              hozAlign: 'center',
            },
          ],
        },
        {
          field: 'leave',
          title: 'Leave',
          width: 40,
          formatter: formatYN,
          headerSort: false,
          cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
          hozAlign: 'center',
        },
        {
          field: 'autoNet',
          title: 'Net',
          width: 40,
          formatter: formatYN,
          headerSort: false,
          cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
          hozAlign: 'center',
        },
        {
          field: 'autoProcessor',
          title: 'Processor',
          width: 40,
          formatter: formatYN,
          headerSort: false,
          cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
          hozAlign: 'center',
        },
      ],
    },
    {
      title: 'Teleop',
      headerHozAlign: 'center',
      columns: [
        {
          field: 'totalTeleopCoral',
          title: 'Avg<br/>Coral',
          width: 30,
          cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
          hozAlign: 'right',
        },
        {
          title: 'Score Level',
          headerHozAlign: 'center',
          columns: [
            {
              field: 'teleopReefL1',
              title: 'L1',
              width: 30,
              formatter: formatYN,
              headerSort: false,
              cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
              hozAlign: 'center',
            },
            {
              field: 'teleopReefL2',
              title: 'L2',
              width: 30,
              formatter: formatYN,
              headerSort: false,
              cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
              hozAlign: 'center',
            },
            {
              field: 'teleopReefL3',
              title: 'L3',
              width: 30,
              formatter: formatYN,
              headerSort: false,
              cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
              hozAlign: 'center',
            },
            {
              field: 'teleopReefL4',
              title: 'L4',
              width: 30,
              formatter: formatYN,
              headerSort: false,
              cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
              hozAlign: 'center',
            },
          ],
        },
        {
          field: 'teleopNet',
          title: 'Net',
          width: 40,
          formatter: formatYN,
          headerSort: false,
          cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
          hozAlign: 'center',
        },
        {
          field: 'teleopProcessor',
          title: 'Processor',
          width: 40,
          formatter: formatYN,
          headerSort: false,
          cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
          hozAlign: 'center',
        },
        {
          field: 'teleopAlgaeRemoved',
          title: 'Algae</br>Removed',
          width: 40,
          formatter: formatYN,
          headerSort: false,
          cssClass: 'tabulator-col-vertical tabulator-col-vertical-flip',
          hozAlign: 'center',
        },
      ],
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
        <br />
        <h1 className="text-rose-800">
          <b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            Statistics as of match:{' '}
            {eventMatchData.length > 0 ? eventMatchData[0]['asOfMatch'] : ''}
          </b>
        </h1>
        <br />

        <DaisyTable
          //TODO: figure out how this can still be "undefined" after the useEffect
          data={eventMatchData}
          columns={columns}
          layout={'fitDataTable'}
        />
      </div>
    );
  }
}
