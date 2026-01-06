'use client';

import React, { useActionState } from 'react';
import { get2025MatchAveragesForEvent } from '../event-stats-actions';
import { TeamMatch2025Performance } from '@/db/models/team-match-2025-performance';
import { PageEventProp } from '../../../ui/types/page-event-props';
import dynamic from 'next/dynamic';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
);

import { Bar /*, Line, Scatter, Bubble*/ } from 'react-chartjs-2';
import { Button } from '@/app/ui/button';
import { matchTypes } from '@/app/ui/constants/match-type';

export function EventData2025({ eventId }: PageEventProp) {
  const [initialRenderComplete, setInitialRenderComplete] =
    React.useState(false);

  const [eventMatchData, setRawEventMatchData] = React.useState<
    TeamMatch2025Performance[]
  >([]);

  const [allSeasonHistory, setAllSeasonHistory] =
    React.useState<boolean>(false);

  const [eventMatchChartData, setRawEventMatchChartData] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function SetLastMatchesFilter(prevState: any, formData: FormData) {
    const match = formData.get('lastNMatches');
    if (match == null || match == '') {
      return undefined;
    } else {
      return parseInt(match.toString());
    }
  }

  const [lastNMatches, SetLastNMatches] = useActionState(
    SetLastMatchesFilter,
    undefined
  );

  function resetFilter() {
    document.getElementById('lastNMatches')!.setAttribute('value', '');
    document.getElementById('submitBtn')!.click();
  }
  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    const getRawMatchData = async () => {
      const data = await get2025MatchAveragesForEvent(
        eventId,
        matchTypes.qual,
        lastNMatches,
        allSeasonHistory
      );
      setRawEventMatchData(data);
    };
    getRawMatchData();

    // Updating a state causes a re-render
    setInitialRenderComplete(true);
  }, [eventId, lastNMatches, allSeasonHistory]);

  // This useEffect will only run once, during the first render
  React.useEffect(() => {
    let data = {};
    // transform data for chart
    const labels: string[] = [];
    const autoR1: number[] = [];
    const autoR2: number[] = [];
    const autoR3: number[] = [];
    const autoR4: number[] = [];
    const teleR1: number[] = [];
    const teleR2: number[] = [];
    const teleR3: number[] = [];
    const teleR4: number[] = [];
    const autoNet: number[] = [];
    const autoProcessor: number[] = [];
    const teleNet: number[] = [];
    const teleProcessor: number[] = [];
    const teleAlgaeRemoved: number[] = [];
    const hpNetMade: number[] = [];

    if (eventMatchData != undefined) {
      eventMatchData.forEach((element) => {
        labels.push(element.teamNumber.toString());
        autoR1.push(element.autoReefL1);
        autoR2.push(element.autoReefL2);
        autoR3.push(element.autoReefL3);
        autoR4.push(element.autoReefL4);
        autoNet.push(element.autoNet);
        autoProcessor.push(element.autoProcessor);
        teleR1.push(element.teleopReefL1);
        teleR2.push(element.teleopReefL2);
        teleR3.push(element.teleopReefL3);
        teleR4.push(element.teleopReefL4);
        teleNet.push(element.teleopNet);
        teleProcessor.push(element.teleopProcessor);
        teleAlgaeRemoved.push(element.teleopAlgaeRemoved);
        hpNetMade.push(element.hpNetMade ?? 0);
      });

      data = {
        labels: labels,
        datasets: [
          {
            label: 'Auto L1',
            data: autoR1,
            backgroundColor: 'rgba(224, 189, 162, 1)',
          },
          {
            label: 'Auto L2',
            data: autoR2,
            backgroundColor: 'rgba(221, 203, 144, 1)',
          },
          {
            label: 'Auto L3',
            data: autoR3,
            backgroundColor: 'rgba(173, 185, 141, 1)',
          },
          {
            label: 'Auto L4',
            data: autoR4,
            backgroundColor: 'rgba(166, 176, 168, 1)',
          },
          {
            label: 'Teleop L1',
            data: teleR1,
            backgroundColor: 'rgba(239, 142, 168, 1)',
          },
          {
            label: 'Teleop L2',
            data: teleR2,
            backgroundColor: 'rgba(227, 25, 107, 1)',
          },
          {
            label: 'Teleop L3',
            data: teleR3,
            backgroundColor: 'rgba(202, 18, 88, 1)',
          },
          {
            label: 'Teleop L4',
            data: teleR4,
            backgroundColor: 'rgba(177, 11, 70, 1)',
          },

          {
            label: 'Auto net',
            data: autoNet,
            backgroundColor: 'rgba(189, 235, 219, 1)',
          },
          {
            label: 'Auto Processor',
            data: autoProcessor,
            backgroundColor: 'rgba(160, 224, 202, 1)',
          },

          {
            label: 'Teleop net',
            data: teleNet,
            backgroundColor: 'rgba(85, 203, 168, 1)',
          },
          {
            label: 'Teleop Processor',
            data: teleProcessor,
            backgroundColor: 'rgba(67, 181, 147, 1)',
          },

          {
            label: 'HP Net',
            data: hpNetMade,
            backgroundColor: 'rgba(49, 160, 127, 1)',
          },
          {
            label: 'Teleop Algae Removed',
            data: teleAlgaeRemoved,
            backgroundColor: 'rgba(67, 147, 181, 1)',
          },
        ],
      };
    } else {
      data = {
        datasets: [],
      };
    }

    setRawEventMatchChartData(data);
  }, [eventMatchData]);

  const columns = [
    {
      field: 'teamNumber',
      title: 'Team',
      width: 75,
      frozen: true,
      hozAlign: 'right',
    },
    {
      field: 'numMatches',
      title: '#<br/>Matches',
      width: 60,
      frozen: true,
      headerSort: false,
      hozAlign: 'right',
    },
    {
      field: 'totalRobotPieces',
      title: '#<br/>Pieces',
      width: 60,
      frozen: true,
      headerSort: true,
      hozAlign: 'right',
    },
    {
      field: 'autoStartLocAlliance',
      title: 'Start<br/>Alliance',
      width: 80,
    },
    {
      field: 'autoStartLocCenter',
      title: 'Start<br/>Center',
      width: 80,
    },
    {
      field: 'autoStartLocOpponent',
      title: 'Start<br/>Opponent',
      width: 80,
    },
    {
      field: 'autoStartLocNoShow',
      title: 'Start<br/>No Show',
      width: 80,
    },
    { field: 'autoReefL1', title: 'Auto<br/>L1', width: 70 },
    { field: 'autoReefL2', title: 'Auto<br/>L2', width: 70 },
    { field: 'autoReefL3', title: 'Auto<br/>L3', width: 70 },
    { field: 'autoReefL4', title: 'Auto<br/>L4', width: 70 },
    { field: 'coralA', title: 'Auto<br/>Reef A', width: 80 },
    { field: 'coralB', title: 'Auto<br/>Reef B', width: 80 },
    { field: 'coralC', title: 'Auto<br/>Reef C', width: 80 },
    { field: 'coralD', title: 'Auto<br/>Reef D', width: 80 },
    { field: 'coralE', title: 'Auto<br/>Reef E', width: 80 },
    { field: 'coralF', title: 'Auto<br/>Reef F', width: 80 },
    { field: 'autoNet', title: 'Auto<br/>Net', width: 75 },
    { field: 'autoProcessor', title: 'Auto<br/>Processor', width: 75 },

    { field: 'teleopReefL1', title: 'Tele<br/>L1', width: 70 },
    { field: 'teleopReefL2', title: 'Tele<br/> L2', width: 70 },
    { field: 'teleopReefL3', title: 'Tele<br/>L3', width: 70 },
    { field: 'teleopReefL4', title: 'Tele<br/>L4', width: 70 },
    { field: 'teleopNet', title: 'Tele<br/>Net', width: 70 },
    { field: 'teleopProcessor', title: 'Tele<br/>Processor', width: 75 },
    { field: 'teleopAlgaeRemoved', title: 'Tele<br/>Algae Removed', width: 75 },
    {
      field: 'endgame',
      title: 'Endgame <br/> D/S/P/N',
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

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        display: false,
        stacked: true,
      },
      y: {
        display: true,
        stacked: true,
      },

      xAxis: {
        display: true,
        ticks: {
          autoSkip: false,
        },
      },
      yAxis: {
        display: false,
        autoSkip: false,
      },
    },
  };

  // initialRenderComplete will be false on the first render and true on all following renders
  if (!initialRenderComplete) {
    // Returning null will prevent the component from rendering, so the content will simply be missing from
    // the server HTML and also wont render during the first client-side render.
    return null;
  } else {
    return (
      <div>
        <form action={SetLastNMatches}>
          <table>
            <tbody>
              <tr>
                <td width="400px">
                  <input
                    type="hidden"
                    id="eventId"
                    name="eventId"
                    value={eventId}
                  />
                  <label htmlFor="lastNMatches">Last # Matches Filter :</label>{' '}
                </td>
                <td width="200px">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    id="lastNMatches"
                    name="lastNMatches"
                    defaultValue={lastNMatches}
                    className="bg-yellow-100"
                  />
                </td>
                <td width="100px">
                  <Button id="submitBtn" type="submit">
                    Filter
                  </Button>
                </td>
                <td width="200px">
                  <Button onClick={resetFilter}>Reset Filter</Button>
                </td>
                <td width="200px">
                  <input
                    type="checkbox"
                    id="AllSeasonData"
                    checked={allSeasonHistory}
                    onChange={(e) => {
                      setAllSeasonHistory(e.target.checked);
                    }}
                  />{' '}
                  &nbsp;
                  <label htmlFor="AllSeasonData">All Season Events?</label>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
        </form>

        <Bar
          id="barchart"
          data={eventMatchChartData}
          width={600}
          height={200}
          options={options}
        />
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
