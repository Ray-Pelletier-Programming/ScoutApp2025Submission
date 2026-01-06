'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { get2025CmpPrescoutList } from '@/db/queries/dmcp-2025-prescout-queries';
import { CmpPrescoutData } from '@/db/models/cmp-prescout-data';
import { RowComponent } from 'tabulator-tables';
import { matchTypes } from '@/app/ui/constants/match-type';
import { CmpPrescoutTableColumns } from '../cmp-prescout-table-columns';
import { PageProp } from '@/app/ui/types/page-props';
import { getCmpEvent } from '../dcmp-prescout-actions';

// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

export function CmpPrescout2025({ season, eventCode }: PageProp) {
  const debounce = React.useRef(true);

  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [prescoutData, setPrescoutData] = React.useState<CmpPrescoutData[]>([]);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      try {
        if (debounce.current) {
          debounce.current = false;
          //TODO: get event date instead of hardcoding
          const event = await getCmpEvent(`${season}${eventCode}`);
          console.log('Event:', JSON.stringify(event));
          const data = await get2025CmpPrescoutList(
            event[0].startDate,
            parseInt(season),
            eventCode,
            matchTypes.qual
          );
          setPrescoutData(data);
          console.log('Done', new Date());

          debounce.current = true;
        }
      } catch (error) {
        console.error('Error fetching CMP Prescout table data:', error);

        debounce.current = true;
      }
    };
    getRawMatchData();

    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [season, eventCode]);

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div style={{ display: 'inline-block' }}>
        <br />
        <table width="100%">
          <tbody>
            <tr>
              <td align="center" style={{ fontSize: '20px' }}>
                <h1>
                  <b>{eventCode} Prescouting</b>
                </h1>
              </td>
              <td width="80px"></td>
              <td width="150px"></td>
            </tr>
            <tr>
              <td align="center"></td>
              <td></td>
              <td width="150px"></td>
            </tr>
          </tbody>
        </table>
        <br />

        <DaisyTable
          data={prescoutData}
          columns={CmpPrescoutTableColumns}
          layout={'fitDataTable'}
          showDownload={true}
          rowFormatter={(row: RowComponent) => {
            const rowdata = row.getData();
            const rowElement = row.getElement();

            if (
              rowdata['lastEventStartDate'] == null &&
              rowdata['source'] != null
            ) {
              if (rowElement.classList.contains('tabulator-row-even')) {
                rowElement.style.backgroundColor = 'rgba(106, 168, 79, .2)';
              } else {
                rowElement.style.backgroundColor = 'rgba(106, 168, 79, .1)';
              }
            } else if (rowdata['lastEventStartDate'] != null) {
              if (rowElement.classList.contains('tabulator-row-even')) {
                rowElement.style.backgroundColor = 'rgba(255, 235, 156, .4)';
                rowElement.style.color = 'rgba(156, 87, 0, 1)';
              } else {
                rowElement.style.backgroundColor = 'rgba(255, 235, 156, 0.2)';
                rowElement.style.color = 'rgba(156, 87, 0, 1)';
              }
            }
          }}
        />
      </div>
    );
  }
}
