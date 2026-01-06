'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DcmpPrescoutTableColumns } from '../dcmp-prescout-table-columns';
import { get2025DcmpPrescoutList } from '@/db/queries/dmcp-2025-prescout-queries';
import { GetDcmpPredictedTeams } from '../get-dcmp-predicted-teams';
import { DcmpPrescoutData } from '@/db/models/dcmp-prescout-data';
import { PageSeasonProp } from '@/app/ui/types/page-season-props';
import { getDcmpEvent } from '../dcmp-prescout-actions';
import { RowComponent } from 'tabulator-tables';
import { matchTypes } from '@/app/ui/constants/match-type';

// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

export function DcmpPrescout2025({ season }: PageSeasonProp) {
  const debounce = React.useRef(true);

  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [prescoutData, setPrescoutData] = React.useState<DcmpPrescoutData[]>(
    []
  );

  const isDcmpDateSet = React.useRef(false);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      try {
        if (debounce.current) {
          debounce.current = false;

          console.log('Fetch', new Date(), season);
          let jsonArrayString = localStorage.getItem('frcLocksData');
          if (
            !jsonArrayString ||
            jsonArrayString == undefined ||
            jsonArrayString == null
          ) {
            jsonArrayString = await GetDcmpPredictedTeams();
            localStorage.setItem('frcLocksData', jsonArrayString);
            localStorage.setItem(
              'frcLocksDataDate',
              new Date().toLocaleDateString()
            );
            console.log('refreshed frclocks');
          }
          console.log('Got FRCLocks', new Date());
          // assume DCMP is June 1st (will work fine if DCMP has not yet been pulled)
          let dcmpDate = new Date(`${season}-06-01 12:00:00 EDT`);
          const savedDcmpDate = localStorage.getItem(`${season}-dcmpDate`);
          isDcmpDateSet.current = savedDcmpDate != null;

          // attempt to get DCMP Event from DB
          if (!(savedDcmpDate != null)) {
            const dcmpEvent = await getDcmpEvent(`${season.toString()}DCMP`);
            // if found, use the actual start date of DCMP.
            if (dcmpEvent.length > 0) {
              dcmpDate = dcmpEvent[0].startDate;
              localStorage.setItem(
                `${season}-dcmpDate`,
                dcmpEvent[0].startDate.toLocaleString()
              );
            }
            console.log('retrieved DCMP Date');
          } else {
            dcmpDate = new Date(savedDcmpDate);
            console.log('existing DCMP Date');
          }
          console.log('GotDCMP', dcmpDate, new Date());
          const data = await get2025DcmpPrescoutList(
            jsonArrayString,
            dcmpDate,
            matchTypes.qual
          );
          console.log('GOt Prescout', new Date());
          setPrescoutData(data);
          console.log(' DOne', new Date());

          debounce.current = true;
        }
      } catch (error) {
        console.error('Error fetching DCMP Prescout table data:', error);

        debounce.current = true;
      }
    };
    getRawMatchData();

    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [season]);

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
                  <b>FMA District Competition Prescouting</b>
                </h1>
              </td>
              <td width="80px">Legend: </td>
              <td
                width="150px"
                style={{
                  backgroundColor: 'rgba(106, 168, 79, .6)',
                  textAlign: 'center',
                }}
              >
                Fully Scouted
              </td>
            </tr>
            <tr>
              <td align="center">
                <i>
                  FRC Locks Data as of:{' '}
                  {localStorage.getItem('frcLocksDataDate')}
                </i>
              </td>
              <td></td>
              <td
                width="150px"
                style={{
                  backgroundColor: 'rgba(255, 235, 156, .6)',
                  color: 'rgba(156, 87, 0, 1)',
                  textAlign: 'center',
                }}
              >
                Has Future Event
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <DaisyTable
          data={prescoutData}
          columns={DcmpPrescoutTableColumns}
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
