'use client';

import { useActionState } from 'react';
import {
  postForm,
  post2025PredictForm,
  get2025AutoTables,
} from '@/app/(public)/match-predictor/match-predictor-actions';
import { Button } from '@/app/ui/button';
import { useSettings } from '@/app/ui/context/settings-context';
import { EventMatch } from '@/db/models/event-match';
import { Predict2025Data } from '@/db/models/predict-2025-data';
import dynamic from 'next/dynamic';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, ArcElement);
import { Pie } from 'react-chartjs-2';
import React from 'react';
import { TeamMatch2025Autos } from '@/db/models/team-match-2025-autos';

export function MatchPredict2025() {
  const initialState: EventMatch = {
    eventMatchId: '',
    eventId: '',
    matchType: '',
    matchNumber: null,
    blue1: null,
    blue2: null,
    blue3: null,
    red1: null,
    red2: null,
    red3: null,
    allEvents: false,
    scheduledStartTime: null,
  }; /* define the initial state of the form */

  const predictInitialState: Array<Predict2025Data> = [];

  const { settings } = useSettings();

  const [blueAutos, setBlueAutos] = React.useState<TeamMatch2025Autos[]>([]);

  const [redAutos, setRedAutos] = React.useState<TeamMatch2025Autos[]>([]);

  const [state, getTeamsForMatch] = useActionState(
    postForm,
    initialState
  ); /* useFormState added */

  const [predictState, getPrediction] = useActionState(
    post2025PredictForm,
    predictInitialState
  ); /* useFormState added */

  const [allEvents, setAllEvents] = React.useState(state.allEvents ?? false);

  React.useEffect(() => {
    const fetchAutos = async () => {
      const { blueAutos, redAutos } = await get2025AutoTables(state);
      console.log('GotAutos');
      setBlueAutos(blueAutos);
      setRedAutos(redAutos);
    };
    fetchAutos();
  }, [state, predictState]);

  interface Cell {
    getValue: () => string;
    getElement: () => HTMLElement;
  }

  const AsBlueFormatter = (cell: Cell): string => {
    const val = cell.getValue();
    const el = cell.getElement();
    el.style.backgroundColor = 'rgba(218, 247, 255, .4)';
    return val;
  };

  const AsRedFormatter = (cell: Cell): string => {
    const val = cell.getValue();
    const el = cell.getElement();
    el.style.backgroundColor = 'rgba(255, 204, 204, .4)';
    return val;
  };

  const formatStarLoc = (cell: Cell): string => {
    const val = cell.getValue();
    return val.replace(' Barge', '');
  };

  const formatEvent = (cell: Cell): string => {
    const val = cell.getValue();
    return val.replace('2025', '');
  };

  const getTeamCoral = (teamData: Predict2025Data | undefined): number => {
    return (
      parseFloat((teamData?.autoReefL1 ?? 0).toString()) +
      parseFloat((teamData?.autoReefL2 ?? 0).toString()) +
      parseFloat((teamData?.autoReefL3 ?? 0).toString()) +
      parseFloat((teamData?.autoReefL4 ?? 0).toString()) +
      parseFloat((teamData?.teleopReefL1 ?? 0).toString()) +
      parseFloat((teamData?.teleopReefL2 ?? 0).toString()) +
      parseFloat((teamData?.teleopReefL3 ?? 0).toString()) +
      parseFloat((teamData?.teleopReefL4 ?? 0).toString())
    );
  };

  const getTeamPoints = (teamData: Predict2025Data | undefined): number => {
    return (
      3 * parseFloat((teamData?.autoReefL1 ?? 0).toString()) +
      4 * parseFloat((teamData?.autoReefL2 ?? 0).toString()) +
      6 * parseFloat((teamData?.autoReefL3 ?? 0).toString()) +
      7 * parseFloat((teamData?.autoReefL4 ?? 0).toString()) +
      2 * parseFloat((teamData?.teleopReefL1 ?? 0).toString()) +
      3 * parseFloat((teamData?.teleopReefL2 ?? 0).toString()) +
      4 * parseFloat((teamData?.teleopReefL3 ?? 0).toString()) +
      5 * parseFloat((teamData?.teleopReefL4 ?? 0).toString()) +
      4 * parseFloat((teamData?.autoNet ?? 0).toString()) +
      2 * parseFloat((teamData?.autoProcessor ?? 0).toString()) +
      4 * parseFloat((teamData?.teleopNet ?? 0).toString()) +
      2 * parseFloat((teamData?.teleopProcessor ?? 0).toString()) +
      12 * parseFloat((teamData?.endgameDeep ?? 0).toString()) +
      6 * parseFloat((teamData?.endgameShallow ?? 0).toString()) +
      2 * parseFloat((teamData?.endgamePark ?? 0).toString())
    );
  };

  const getPredictTable = () => {
    const transformedData = [];

    let blue1data: Predict2025Data | undefined;
    let blue2data: Predict2025Data | undefined;
    let blue3data: Predict2025Data | undefined;
    let red1data: Predict2025Data | undefined;
    let red2data: Predict2025Data | undefined;
    let red3data: Predict2025Data | undefined;

    if (predictState) {
      for (let i = 0; i < predictState.length; i++) {
        if (predictState[i].teamNumber == state.blue1) {
          blue1data = predictState[i];
        }
        if (predictState[i].teamNumber == state.blue2) {
          blue2data = predictState[i];
        }
        if (predictState[i].teamNumber == state.blue3) {
          blue3data = predictState[i];
        }
        if (predictState[i].teamNumber == state.red1) {
          red1data = predictState[i];
        }
        if (predictState[i].teamNumber == state.red2) {
          red2data = predictState[i];
        }
        if (predictState[i].teamNumber == state.red3) {
          red3data = predictState[i];
        }
      }
    }

    transformedData.push({
      type: 'Team Number',
      Blue1: blue1data?.teamNumber ?? '',
      Blue2: blue2data?.teamNumber ?? '',
      Blue3: blue3data?.teamNumber ?? '',
      Red1: red1data?.teamNumber ?? '',
      Red2: red2data?.teamNumber ?? '',
      Red3: red3data?.teamNumber ?? '',
    });

    transformedData.push({
      type: 'L1',
      Blue1: (
        parseFloat((blue1data?.teleopReefL1 ?? 0.0).toString()) +
        parseFloat((blue1data?.autoReefL1 ?? 0.0).toString())
      ).toFixed(1),
      Blue2: (
        parseFloat((blue2data?.teleopReefL1 ?? 0.0).toString()) +
        parseFloat((blue2data?.autoReefL1 ?? 0.0).toString())
      ).toFixed(1),
      Blue3: (
        parseFloat((blue3data?.teleopReefL1 ?? 0.0).toString()) +
        parseFloat((blue3data?.autoReefL1 ?? 0.0).toString())
      ).toFixed(1),
      Red1: (
        parseFloat((red1data?.teleopReefL1 ?? 0.0).toString()) +
        parseFloat((red1data?.autoReefL1 ?? 0.0).toString())
      ).toFixed(1),
      Red2: (
        parseFloat((red2data?.teleopReefL1 ?? 0.0).toString()) +
        parseFloat((red2data?.autoReefL1 ?? 0.0).toString())
      ).toFixed(1),
      Red3: (
        parseFloat((red3data?.teleopReefL1 ?? 0.0).toString()) +
        parseFloat((red3data?.autoReefL1 ?? 0.0).toString())
      ).toFixed(1),
    });

    transformedData.push({
      type: 'L2',
      Blue1: (
        parseFloat((blue1data?.teleopReefL2 ?? 0.0).toString()) +
        parseFloat((blue1data?.autoReefL2 ?? 0.0).toString())
      ).toFixed(1),
      Blue2: (
        parseFloat((blue2data?.teleopReefL2 ?? 0.0).toString()) +
        parseFloat((blue2data?.autoReefL2 ?? 0.0).toString())
      ).toFixed(1),
      Blue3: (
        parseFloat((blue3data?.teleopReefL2 ?? 0.0).toString()) +
        parseFloat((blue3data?.autoReefL2 ?? 0.0).toString())
      ).toFixed(1),
      Red1: (
        parseFloat((red1data?.teleopReefL2 ?? 0.0).toString()) +
        parseFloat((red1data?.autoReefL2 ?? 0.0).toString())
      ).toFixed(1),
      Red2: (
        parseFloat((red2data?.teleopReefL2 ?? 0.0).toString()) +
        parseFloat((red2data?.autoReefL2 ?? 0.0).toString())
      ).toFixed(1),
      Red3: (
        parseFloat((red3data?.teleopReefL2 ?? 0.0).toString()) +
        parseFloat((red3data?.autoReefL2 ?? 0.0).toString())
      ).toFixed(1),
    });

    transformedData.push({
      type: 'L3',
      Blue1: (
        parseFloat((blue1data?.teleopReefL3 ?? 0.0).toString()) +
        parseFloat((blue1data?.autoReefL3 ?? 0.0).toString())
      ).toFixed(1),
      Blue2: (
        parseFloat((blue2data?.teleopReefL3 ?? 0.0).toString()) +
        parseFloat((blue2data?.autoReefL3 ?? 0.0).toString())
      ).toFixed(1),
      Blue3: (
        parseFloat((blue3data?.teleopReefL3 ?? 0.0).toString()) +
        parseFloat((blue3data?.autoReefL3 ?? 0.0).toString())
      ).toFixed(1),
      Red1: (
        parseFloat((red1data?.teleopReefL3 ?? 0.0).toString()) +
        parseFloat((red1data?.autoReefL3 ?? 0.0).toString())
      ).toFixed(1),
      Red2: (
        parseFloat((red2data?.teleopReefL3 ?? 0.0).toString()) +
        parseFloat((red2data?.autoReefL3 ?? 0.0).toString())
      ).toFixed(1),
      Red3: (
        parseFloat((red3data?.teleopReefL3 ?? 0.0).toString()) +
        parseFloat((red3data?.autoReefL3 ?? 0.0).toString())
      ).toFixed(1),
    });

    transformedData.push({
      type: 'L4',
      Blue1: (
        parseFloat((blue1data?.teleopReefL4 ?? 0.0).toString()) +
        parseFloat((blue1data?.autoReefL4 ?? 0.0).toString())
      ).toFixed(1),
      Blue2: (
        parseFloat((blue2data?.teleopReefL4 ?? 0.0).toString()) +
        parseFloat((blue2data?.autoReefL4 ?? 0.0).toString())
      ).toFixed(1),
      Blue3: (
        parseFloat((blue3data?.teleopReefL4 ?? 0.0).toString()) +
        parseFloat((blue3data?.autoReefL4 ?? 0.0).toString())
      ).toFixed(1),
      Red1: (
        parseFloat((red1data?.teleopReefL4 ?? 0.0).toString()) +
        parseFloat((red1data?.autoReefL4 ?? 0.0).toString())
      ).toFixed(1),
      Red2: (
        parseFloat((red2data?.teleopReefL4 ?? 0.0).toString()) +
        parseFloat((red2data?.autoReefL4 ?? 0.0).toString())
      ).toFixed(1),
      Red3: (
        parseFloat((red3data?.teleopReefL4 ?? 0.0).toString()) +
        parseFloat((red3data?.autoReefL4 ?? 0.0).toString())
      ).toFixed(1),
    });

    transformedData.push({
      type: 'Processor',
      Blue1: (
        parseFloat((blue1data?.teleopProcessor ?? 0.0).toString()) +
        parseFloat((blue1data?.autoProcessor ?? 0.0).toString())
      ).toFixed(1),
      Blue2: (
        parseFloat((blue2data?.teleopProcessor ?? 0.0).toString()) +
        parseFloat((blue2data?.autoProcessor ?? 0.0).toString())
      ).toFixed(1),
      Blue3: (
        parseFloat((blue3data?.teleopProcessor ?? 0.0).toString()) +
        parseFloat((blue3data?.autoProcessor ?? 0.0).toString())
      ).toFixed(1),
      Red1: (
        parseFloat((red1data?.teleopProcessor ?? 0.0).toString()) +
        parseFloat((red1data?.autoProcessor ?? 0.0).toString())
      ).toFixed(1),
      Red2: (
        parseFloat((red2data?.teleopProcessor ?? 0.0).toString()) +
        parseFloat((red2data?.autoProcessor ?? 0.0).toString())
      ).toFixed(1),
      Red3: (
        parseFloat((red3data?.teleopProcessor ?? 0.0).toString()) +
        parseFloat((red3data?.autoProcessor ?? 0.0).toString())
      ).toFixed(1),
    });

    transformedData.push({
      type: 'Net',
      Blue1: (
        parseFloat((blue1data?.teleopNet ?? 0.0).toString()) +
        parseFloat((blue1data?.autoNet ?? 0.0).toString())
      ).toFixed(1),
      Blue2: (
        parseFloat((blue2data?.teleopNet ?? 0.0).toString()) +
        parseFloat((blue2data?.autoNet ?? 0.0).toString())
      ).toFixed(1),
      Blue3: (
        parseFloat((blue3data?.teleopNet ?? 0.0).toString()) +
        parseFloat((blue3data?.autoNet ?? 0.0).toString())
      ).toFixed(1),
      Red1: (
        parseFloat((red1data?.teleopNet ?? 0.0).toString()) +
        parseFloat((red1data?.autoNet ?? 0.0).toString())
      ).toFixed(1),
      Red2: (
        parseFloat((red2data?.teleopNet ?? 0.0).toString()) +
        parseFloat((red2data?.autoNet ?? 0.0).toString())
      ).toFixed(1),
      Red3: (
        parseFloat((red3data?.teleopNet ?? 0.0).toString()) +
        parseFloat((red3data?.autoNet ?? 0.0).toString())
      ).toFixed(1),
    });

    transformedData.push({
      type: 'Teleop Algae Removed',
      Blue1: blue1data?.teleopAlgaeRemoved,
      Blue2: blue2data?.teleopAlgaeRemoved,
      Blue3: blue3data?.teleopAlgaeRemoved,
      Red1: red1data?.teleopAlgaeRemoved,
      Red2: red2data?.teleopAlgaeRemoved,
      Red3: red3data?.teleopAlgaeRemoved,
    });

    transformedData.push({
      type: 'Endgame (D/S/P/N)',
      Blue1: blue1data?.endgame,
      Blue2: blue2data?.endgame,
      Blue3: blue3data?.endgame,
      Red1: red1data?.endgame,
      Red2: red2data?.endgame,
      Red3: red3data?.endgame,
    });

    transformedData.push({
      type: 'Leave',
      Blue1: blue1data?.leave,
      Blue2: blue2data?.leave,
      Blue3: blue3data?.leave,
      Red1: red1data?.leave,
      Red2: red2data?.leave,
      Red3: red3data?.leave,
    });

    transformedData.push({
      type: 'Operability (W/B/D/NS)',
      Blue1: blue1data?.operability,
      Blue2: blue2data?.operability,
      Blue3: blue3data?.operability,
      Red1: red1data?.operability,
      Red2: red2data?.operability,
      Red3: red3data?.operability,
    });

    transformedData.push({
      type: 'Role (C/A/D)',
      Blue1: blue1data?.role,
      Blue2: blue2data?.role,
      Blue3: blue3data?.role,
      Red1: red1data?.role,
      Red2: red2data?.role,
      Red3: red3data?.role,
    });

    transformedData.push({
      type: 'Driver Ability',
      Blue1: blue1data?.driverAbility,
      Blue2: blue2data?.driverAbility,
      Blue3: blue3data?.driverAbility,
      Red1: red1data?.driverAbility,
      Red2: red2data?.driverAbility,
      Red3: red3data?.driverAbility,
    });

    let bluePoints = 0;
    let redPoints = 0;

    bluePoints += getTeamPoints(blue1data);
    bluePoints += getTeamPoints(blue2data);
    bluePoints += getTeamPoints(blue3data);
    bluePoints = Math.round(bluePoints);
    redPoints += getTeamPoints(red1data);
    redPoints += getTeamPoints(red2data);
    redPoints += getTeamPoints(red3data);
    redPoints = Math.round(redPoints);

    let blueCoral = 0;
    let redCoral = 0;

    blueCoral += getTeamCoral(blue1data);
    blueCoral += getTeamCoral(blue2data);
    blueCoral += getTeamCoral(blue3data);
    blueCoral = Math.round(blueCoral);
    redCoral += getTeamCoral(red1data);
    redCoral += getTeamCoral(red2data);
    redCoral += getTeamCoral(red3data);
    redCoral = Math.round(redCoral);

    return { transformedData, bluePoints, redPoints, blueCoral, redCoral };
  };

  const GetRedPieData = () => {
    const teams = [];
    const data = [];

    if (predictState) {
      for (let i = 0; i < predictState.length; i++) {
        if (
          predictState[i].teamNumber == state.red1 ||
          predictState[i].teamNumber == state.red2 ||
          predictState[i].teamNumber == state.red3
        ) {
          teams.push(predictState[i].teamNumber + ' Coral');
          data.push(
            parseFloat((predictState[i].autoReefL1 ?? 0).toString()) +
              parseFloat((predictState[i].autoReefL2 ?? 0).toString()) +
              parseFloat((predictState[i].autoReefL3 ?? 0).toString()) +
              parseFloat((predictState[i].autoReefL4 ?? 0).toString()) +
              parseFloat((predictState[i].teleopReefL1 ?? 0).toString()) +
              parseFloat((predictState[i].teleopReefL2 ?? 0).toString()) +
              parseFloat((predictState[i].teleopReefL3 ?? 0).toString()) +
              parseFloat((predictState[i].teleopReefL4 ?? 0).toString())
          );

          teams.push(predictState[i].teamNumber + ' Algae');
          data.push(
            parseFloat((predictState[i].autoNet ?? 0).toString()) +
              parseFloat((predictState[i].autoProcessor ?? 0).toString()) +
              parseFloat((predictState[i].teleopNet ?? 0).toString()) +
              parseFloat((predictState[i].teleopProcessor ?? 0).toString())
          );
        }
      }
    }
    return {
      labels: teams,
      datasets: [
        {
          label: ' Avg Cycles ',
          data: data,
          backgroundColor: [
            '#fc3503',
            '#8c1e03',
            '#f5ed07',
            '#9c9600',
            '#054deb',
            '#01277a',
          ],
          // [
          //   'rgba(145, 113, 130, 1)',
          //   'rgba(188, 154, 171, 1)',
          //   'rgba(68, 173, 97, 1)',
          //   'rgba(153, 205, 164, 1)',
          //   'rgba(0, 0, 209, 1)',
          //   'rgba(0, 58, 245, 0.5)',
          // ],
          hoverOffset: 4,
        },
      ],
    };
  };

  const GetBluePieData = () => {
    const teams = [];
    const data = [];

    if (predictState) {
      for (let i = 0; i < predictState.length; i++) {
        if (
          predictState[i].teamNumber == state.blue1 ||
          predictState[i].teamNumber == state.blue2 ||
          predictState[i].teamNumber == state.blue3
        ) {
          teams.push(predictState[i].teamNumber + ' Coral');
          data.push(
            parseFloat((predictState[i].autoReefL1 ?? 0).toString()) +
              parseFloat((predictState[i].autoReefL2 ?? 0).toString()) +
              parseFloat((predictState[i].autoReefL3 ?? 0).toString()) +
              parseFloat((predictState[i].autoReefL4 ?? 0).toString()) +
              parseFloat((predictState[i].teleopReefL1 ?? 0).toString()) +
              parseFloat((predictState[i].teleopReefL2 ?? 0).toString()) +
              parseFloat((predictState[i].teleopReefL3 ?? 0).toString()) +
              parseFloat((predictState[i].teleopReefL4 ?? 0).toString())
          );

          teams.push(predictState[i].teamNumber + ' Algae');
          data.push(
            parseFloat((predictState[i].autoNet ?? 0).toString()) +
              parseFloat((predictState[i].autoProcessor ?? 0).toString()) +
              parseFloat((predictState[i].teleopNet ?? 0).toString()) +
              parseFloat((predictState[i].teleopProcessor ?? 0).toString())
          );
        }
      }
    }
    return {
      labels: teams,
      datasets: [
        {
          label: ' Avg Cycles',
          data: data,
          backgroundColor: [
            '#fc3503',
            '#8c1e03',
            '#f5ed07',
            '#9c9600',
            '#054deb',
            '#01277a',
          ],
          // [

          //   'rgba(145, 113, 130, 1)',
          //   'rgba(188, 154, 171, 1)',
          //   'rgba(68, 173, 97, 1)',
          //   'rgba(153, 205, 164, 1)',
          //   'rgba(0, 0, 209, 1)',
          //   'rgba(0, 58, 245, 0.5)',
          // ],
          hoverOffset: 4,
        },
      ],
    };
  };

  const columns = [
    { field: 'type', title: 'Team' },
    { field: 'Blue1', title: 'Blue 1', formatter: AsBlueFormatter },
    { field: 'Blue2', title: 'Blue 2', formatter: AsBlueFormatter },
    { field: 'Blue3', title: 'Blue 3', formatter: AsBlueFormatter },
    { field: 'Red1', title: 'Red 1', formatter: AsRedFormatter },
    { field: 'Red2', title: 'Red 2', formatter: AsRedFormatter },
    { field: 'Red3', title: 'Red 3', formatter: AsRedFormatter },
  ];

  const autoColumns = [
    { field: 'teamNumber', title: 'Team' },
    {
      field: 'eventId',
      title: 'Event',
      width: '12px',
      formatter: formatEvent,
    },
    { field: 'matchNumber', title: 'M<br/>#' },
    { field: 'autoStartLoc', title: 'Start<br/>Loc', formatter: formatStarLoc },
    { field: 'coralA', title: 'A', width: '2px' },
    { field: 'coralB', title: 'B', width: '2px' },
    { field: 'coralC', title: 'C', width: '2px' },
    { field: 'coralD', title: 'D', width: '2px' },
    { field: 'coralE', title: 'E', width: '2px' },
    { field: 'coralF', title: 'F', width: '2px' },
  ];

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
      },
    },
  };

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderPredictionResult = () => {
    if (
      predictState &&
      Object.keys(predictState).length !== 0 &&
      predictState[0].eventId != ''
    ) {
      const { transformedData, bluePoints, redPoints, blueCoral, redCoral } =
        getPredictTable();
      return (
        <div>
          <DaisyTable
            data={transformedData}
            columns={columns}
            layout={'fitData'}
          />

          <table>
            <tbody>
              <tr>
                <td width="400px">
                  <div id="cycleTitleBlue">
                    <center>
                      <br />
                      <strong>Blue Total Expected Points:</strong>
                      {'  '}
                      <strong>{bluePoints}</strong>
                    </center>
                  </div>
                </td>
                <td width="50px"></td>
                <td width="400px">
                  <div id="cycleTitleRed">
                    <center>
                      <br />
                      <strong>Red Total Expected Points:</strong>
                      {'  '}
                      <strong>{redPoints}</strong>
                    </center>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="400px">
                  <div id="cycleTitleBlue">
                    <center>
                      <br />
                      <strong>Blue Total Expected Coral:</strong>
                      {'  '}
                      <strong>{blueCoral}</strong>
                    </center>
                  </div>
                </td>
                <td width="50px"></td>
                <td width="400px">
                  <div id="cycleTitleRed">
                    <center>
                      <br />
                      <strong>Red Total Expected Coral:</strong>
                      {'  '}
                      <strong>{redCoral}</strong>
                    </center>
                  </div>
                </td>
              </tr>
              <tr>
                <td valign="top">
                  <div id="bluepie">
                    <Pie data={GetBluePieData()} options={options} />
                  </div>
                </td>
                <td></td>
                <td valign="top">
                  <div id="redpie">
                    <Pie data={GetRedPieData()} options={options} />
                  </div>
                </td>
              </tr>
              <tr>
                <td valign="top">
                  <div id="blueAutos">
                    Blue Autos
                    <br />
                    <DaisyTable
                      data={blueAutos}
                      columns={autoColumns}
                      layout={'fitData'}
                    />
                  </div>
                </td>
                <td></td>
                <td valign="top">
                  <div id="redAutos">
                    Red Autos
                    <br />
                    <DaisyTable
                      data={redAutos}
                      columns={autoColumns}
                      layout={'fitData'}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td valign="top">
                  <div id="autoTableb"></div>
                </td>
                <td></td>
                <td valign="top">
                  <div id="autoTabler"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div>
      <div>
        <br />
        <form action={getTeamsForMatch}>
          <table>
            <tbody>
              <tr>
                <td width="400px">
                  <input
                    type="hidden"
                    id="eventId"
                    name="eventId"
                    value={settings.getEventId()}
                  />
                  <label htmlFor="matchNum">Enter Match Num:</label>{' '}
                </td>
                <td width="200px">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    id="matchNum"
                    name="matchNum"
                    defaultValue={state.matchNumber || ''}
                    className="bg-yellow-100"
                  />
                </td>
                <td width="200px">
                  <Button type="submit">Fetch Teams</Button>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
        </form>

        <form action={getPrediction}>
          <input
            type="hidden"
            id="eventId"
            name="eventId"
            value={settings.getEventId()}
          />
          <input
            type="hidden"
            id="season"
            name="season"
            value={settings.season}
          />
          <table>
            <tbody>
              <tr>
                <td width="200px">Blue Team:</td>
                <td width="200px">
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    id="blue1"
                    name="blue1"
                    defaultValue={state.blue1?.toString()}
                    className="bg-blue-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.blue1 = parseInt(e.target.value);
                      state.eventId = settings.getEventId();
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td width="200px">
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    id="blue2"
                    name="blue2"
                    defaultValue={state.blue2?.toString()}
                    className="bg-blue-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.blue2 = parseInt(e.target.value);
                      state.eventId = settings.getEventId();
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td width="200px">
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    id="blue3"
                    name="blue3"
                    defaultValue={state.blue3?.toString()}
                    className="bg-blue-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.blue3 = parseInt(e.target.value);
                      state.eventId = settings.getEventId();
                      state.matchNumber = null;
                    }}
                  />
                </td>

                <td>
                  <input
                    type="checkbox"
                    id="allEvents"
                    name="allEvents"
                    checked={allEvents}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAllEvents(e.target.checked);
                      state.allEvents = e.target.checked;
                    }}
                  />
                  &nbsp;
                  <label htmlFor="allEvents" className="text-sm">
                    Last 6 Quals
                    <br />
                    All Season?
                  </label>
                </td>
              </tr>
              <tr>
                <td>Red Team:</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    id="red1"
                    name="red1"
                    defaultValue={state.red1?.toString()}
                    className="bg-red-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.red1 = parseInt(e.target.value);
                      state.eventId = settings.getEventId();
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    id="red2"
                    name="red2"
                    defaultValue={state.red2?.toString()}
                    className="bg-red-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.red2 = parseInt(e.target.value);
                      state.eventId = settings.getEventId();
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="20000"
                    id="red3"
                    name="red3"
                    defaultValue={state.red3?.toString()}
                    className="bg-red-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.red3 = parseInt(e.target.value);
                      state.eventId = settings.getEventId();
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td width="400px">
                  <Button type="submit">Prediction</Button>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
        </form>
      </div>

      {renderPredictionResult()}
    </div>
  );
}
