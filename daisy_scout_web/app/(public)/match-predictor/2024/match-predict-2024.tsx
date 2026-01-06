'use client';

import { useActionState } from 'react';
import {
  postForm,
  post2024PredictForm,
} from '@/app/(public)/match-predictor/match-predictor-actions';
import { Button } from '@/app/ui/button';
import { useSettings } from '@/app/ui/context/settings-context';
import { EventMatch } from '@/db/models/event-match';
import { Predict2024Data } from '@/db/queries/predict-2024-data-queries';
import dynamic from 'next/dynamic';
// Dynamically import the Tabulator component to avoid SSR issues
const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, ArcElement);
import { Pie } from 'react-chartjs-2';

export function MatchPredict2024() {
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

  const predictInitialState: Array<Predict2024Data> = [
    {
      eventId: '',
      teamNumber: 22,
      climbStateAvg: null,
      robotLeaveAvg: null,

      autoAmpScoredAvg: null,
      autoSpeakerScoredAvg: null,
      autoAmpMissedAvg: null,
      autoSpeakerMissedAvg: null,

      teleAmpScoredAvg: null,
      teleSpeakerScoredAvg: null,
      teleAmpMissedAvg: null,
      teleSpeakerMissedAvg: null,

      ferryAvg: null,
      trapAvg: null,
      harmonyAvg: null,
      driverAbilityAvg: null,
      sourceTimeAvg: null,
      ampTimeAvg: null,

      operation: null,
      role: null,
      driveTrain: null,
      humanPlayer: null,
      canLeave: null,
      canAutoAmp: null,
      canAutoSpeaker: null,
      contestMiddle: null,
      maxNotesAuto: null,
      canTeleAmp: null,
      canTeleSpeaker: null,
      canTrap: null,
      intakeLocation: null,
      scoringPref: null,
      climbLocation: null,
      climbHeight: null,
      notableFeat: null,
    },
  ]; /* define the initial state of the form */

  const { settings } = useSettings();

  const [state, getTeamsForMatch] = useActionState(
    postForm,
    initialState
  ); /* useFormState added */

  const [predictState, getPrediction] = useActionState(
    post2024PredictForm,
    predictInitialState
  ); /* useFormState added */

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

  const getTeamCycle = (teamData: Predict2024Data): number => {
    return (
      parseFloat((teamData.autoAmpScoredAvg ?? 0).toString()) +
      parseFloat((teamData.autoSpeakerScoredAvg ?? 0).toString()) +
      parseFloat((teamData.teleAmpScoredAvg ?? 0).toString()) +
      parseFloat((teamData.teleSpeakerScoredAvg ?? 0).toString())
    );
  };

  const getPredictTable = () => {
    const transformedData = [];

    let blue1data: Predict2024Data | undefined;
    let blue2data: Predict2024Data | undefined;
    let blue3data: Predict2024Data | undefined;
    let red1data: Predict2024Data | undefined;
    let red2data: Predict2024Data | undefined;
    let red3data: Predict2024Data | undefined;

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

    transformedData.push({
      type: 'Team Number',
      Blue1: blue1data!.teamNumber,
      Blue2: blue2data!.teamNumber,
      Blue3: blue3data!.teamNumber,
      Red1: red1data!.teamNumber,
      Red2: red2data!.teamNumber,
      Red3: red3data!.teamNumber,
    });

    transformedData.push({
      type: 'Speaker',
      Blue1: (
        parseFloat((blue1data!.teleSpeakerScoredAvg ?? 0.0).toString()) +
        parseFloat((blue1data!.autoSpeakerScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Blue2: (
        parseFloat((blue2data!.teleSpeakerScoredAvg ?? 0.0).toString()) +
        parseFloat((blue2data!.autoSpeakerScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Blue3: (
        parseFloat((blue3data!.teleSpeakerScoredAvg ?? 0.0).toString()) +
        parseFloat((blue3data!.autoSpeakerScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Red1: (
        parseFloat((red1data!.teleSpeakerScoredAvg ?? 0.0).toString()) +
        parseFloat((red1data!.autoSpeakerScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Red2: (
        parseFloat((red2data!.teleSpeakerScoredAvg ?? 0.0).toString()) +
        parseFloat((red2data!.autoSpeakerScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Red3: (
        parseFloat((red3data!.teleSpeakerScoredAvg ?? 0.0).toString()) +
        parseFloat((red3data!.autoSpeakerScoredAvg ?? 0.0).toString())
      ).toFixed(1),
    });

    transformedData.push({
      type: 'Amp',
      Blue1: (
        parseFloat((blue1data!.teleAmpScoredAvg ?? 0.0).toString()) +
        parseFloat((blue1data!.autoAmpScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Blue2: (
        parseFloat((blue2data!.teleAmpScoredAvg ?? 0.0).toString()) +
        parseFloat((blue2data!.autoAmpScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Blue3: (
        parseFloat((blue3data!.teleAmpScoredAvg ?? 0.0).toString()) +
        parseFloat((blue3data!.autoAmpScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Red1: (
        parseFloat((red1data!.teleAmpScoredAvg ?? 0.0).toString()) +
        parseFloat((red1data!.autoAmpScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Red2: (
        parseFloat((red2data!.teleAmpScoredAvg ?? 0.0).toString()) +
        parseFloat((red2data!.autoAmpScoredAvg ?? 0.0).toString())
      ).toFixed(1),
      Red3: (
        parseFloat((red3data!.teleAmpScoredAvg ?? 0.0).toString()) +
        parseFloat((red3data!.autoAmpScoredAvg ?? 0.0).toString())
      ).toFixed(1),
    });

    transformedData.push({
      type: 'Ferry',
      Blue1: blue1data!.ferryAvg ?? 0,
      Blue2: blue2data!.ferryAvg ?? 0,
      Blue3: blue3data!.ferryAvg ?? 0,
      Red1: red1data!.ferryAvg ?? 0,
      Red2: red2data!.ferryAvg ?? 0,
      Red3: red3data!.ferryAvg ?? 0,
    });

    transformedData.push({
      type: 'ClimbState',
      Blue1: blue1data!.climbStateAvg ?? 0,
      Blue2: blue2data!.climbStateAvg ?? 0,
      Blue3: blue3data!.climbStateAvg ?? 0,
      Red1: red1data!.climbStateAvg ?? 0,
      Red2: red2data!.climbStateAvg ?? 0,
      Red3: red3data!.climbStateAvg ?? 0,
    });

    transformedData.push({
      type: 'Trap',
      Blue1: blue1data!.trapAvg ?? 0,
      Blue2: blue2data!.trapAvg ?? 0,
      Blue3: blue3data!.trapAvg ?? 0,
      Red1: red1data!.trapAvg ?? 0,
      Red2: red2data!.trapAvg ?? 0,
      Red3: red3data!.trapAvg ?? 0,
    });

    transformedData.push({
      type: 'Slow At Source',
      Blue1: blue1data!.sourceTimeAvg,
      Blue2: blue2data!.sourceTimeAvg,
      Blue3: blue3data!.sourceTimeAvg,
      Red1: red1data!.sourceTimeAvg,
      Red2: red2data!.sourceTimeAvg,
      Red3: red3data!.sourceTimeAvg,
    });

    transformedData.push({
      type: 'Slow At Amp',
      Blue1: blue1data!.ampTimeAvg,
      Blue2: blue2data!.ampTimeAvg,
      Blue3: blue3data!.ampTimeAvg,
      Red1: red1data!.ampTimeAvg,
      Red2: red2data!.ampTimeAvg,
      Red3: red3data!.ampTimeAvg,
    });

    transformedData.push({
      type: 'Operation (W/B/D)',
      Blue1: blue1data!.operation,
      Blue2: blue2data!.operation,
      Blue3: blue3data!.operation,
      Red1: red1data!.operation,
      Red2: red2data!.operation,
      Red3: red3data!.operation,
    });

    transformedData.push({
      type: 'Role (O/D/F)',
      Blue1: blue1data!.role,
      Blue2: blue2data!.role,
      Blue3: blue3data!.role,
      Red1: red1data!.role,
      Red2: red2data!.role,
      Red3: red3data!.role,
    });

    let blueCycles = 0;
    let redCycles = 0;

    blueCycles += getTeamCycle(blue1data!);
    blueCycles += getTeamCycle(blue2data!);
    blueCycles += getTeamCycle(blue3data!);
    blueCycles = Math.round(blueCycles);
    redCycles += getTeamCycle(red1data!);
    redCycles += getTeamCycle(red2data!);
    redCycles += getTeamCycle(red3data!);
    redCycles = Math.round(redCycles);

    return { transformedData, blueCycles, redCycles };
  };

  const GetRedPieData = () => {
    const teams = [];
    const data = [];

    for (let i = 0; i < predictState.length; i++) {
      if (
        predictState[i].teamNumber == state.red1 ||
        predictState[i].teamNumber == state.red2 ||
        predictState[i].teamNumber == state.red3
      ) {
        teams.push(predictState[i].teamNumber + ' Amp');
        data.push(
          parseFloat((predictState[i].autoAmpScoredAvg ?? 0).toString()) +
            parseFloat((predictState[i].teleAmpScoredAvg ?? 0).toString())
        );

        teams.push(predictState[i].teamNumber + ' Speaker');
        data.push(
          parseFloat((predictState[i].autoSpeakerScoredAvg ?? 0).toString()) +
            parseFloat((predictState[i].teleSpeakerScoredAvg ?? 0).toString())
        );
      }
    }
    return {
      labels: teams,
      datasets: [
        {
          label: 'My First Dataset',
          data: data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(44, 99, 132)',
            'rgb(22, 162, 235)',
            'rgb(88, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    };
  };

  const GetBluePieData = () => {
    const teams = [];
    const data = [];

    for (let i = 0; i < predictState.length; i++) {
      if (
        predictState[i].teamNumber == state.blue1 ||
        predictState[i].teamNumber == state.blue2 ||
        predictState[i].teamNumber == state.blue3
      ) {
        teams.push(predictState[i].teamNumber + ' Amp');
        data.push(
          parseFloat((predictState[i].autoAmpScoredAvg ?? 0).toString()) +
            parseFloat((predictState[i].teleAmpScoredAvg ?? 0).toString())
        );

        teams.push(predictState[i].teamNumber + ' Speaker');
        data.push(
          parseFloat((predictState[i].autoSpeakerScoredAvg ?? 0).toString()) +
            parseFloat((predictState[i].teleSpeakerScoredAvg ?? 0).toString())
        );
      }
    }
    return {
      labels: teams,
      datasets: [
        {
          label: 'My First Dataset',
          data: data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(44, 99, 132)',
            'rgb(22, 162, 235)',
            'rgb(88, 205, 86)',
          ],
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

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderPredictionResult = () => {
    if (
      Object.keys(predictState).length !== 0 &&
      predictState[0].eventId != ''
    ) {
      const { transformedData, blueCycles, redCycles } = getPredictTable();
      return (
        <div>
          <DaisyTable
            data={transformedData}
            columns={columns}
            layout={'fitData'}
          />
          <div> more data</div>
          <span>
            <strong>
              {blueCycles == redCycles
                ? 'Even'
                : blueCycles > redCycles
                  ? 'Blue Favored'
                  : 'Red Favored'}
            </strong>
          </span>

          <table>
            <tbody>
              <tr>
                <td width="625px">
                  <div id="cycleTitleBlue">
                    <br />
                    <strong>Total Expected Cycles:</strong>
                  </div>

                  <h1>
                    <div id="blueCycles">
                      <br />
                      <strong>{blueCycles}</strong>
                    </div>
                  </h1>

                  <div id="bluepie">
                    <Pie data={GetBluePieData()} options={options} />
                  </div>
                  <div id="blueAutos"></div>

                  <div id="autoTableb"></div>
                </td>
                <td width="50px"></td>
                <td width="625px">
                  <div id="cycleTitleRed">
                    <br />
                    <strong>Total Expected Cycles:</strong>
                  </div>

                  <h1>
                    <div id="redCycles">
                      <br />
                      <strong>{redCycles}</strong>
                    </div>
                  </h1>

                  <div id="redpie">
                    <div id="bluepie">
                      <Pie data={GetRedPieData()} options={options} />
                    </div>
                  </div>

                  <div id="redAutos"></div>

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
                    id="matchNum"
                    name="matchNum"
                    defaultValue={state.matchNumber || ''}
                    className="bg-yellow-100"
                  />
                </td>
                <td width="200px">
                  <Button type="submit">Submit</Button>
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
                    id="blue1"
                    name="blue1"
                    defaultValue={state.blue1?.toString()}
                    className="bg-blue-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.blue1 = parseInt(e.target.value);
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td width="200px">
                  <input
                    id="blue2"
                    name="blue2"
                    defaultValue={state.blue2?.toString()}
                    className="bg-blue-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.blue2 = parseInt(e.target.value);
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td width="200px">
                  <input
                    id="blue3"
                    name="blue3"
                    defaultValue={state.blue3?.toString()}
                    className="bg-blue-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.blue3 = parseInt(e.target.value);
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td width="400px">
                  <Button type="submit">Submit</Button>
                </td>
              </tr>
              <tr>
                <td>Red Team:</td>
                <td>
                  <input
                    id="red1"
                    name="red1"
                    defaultValue={state.red1?.toString()}
                    className="bg-red-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.red1 = parseInt(e.target.value);
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td>
                  <input
                    id="red2"
                    name="red2"
                    defaultValue={state.red2?.toString()}
                    className="bg-red-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.red2 = parseInt(e.target.value);
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td>
                  <input
                    id="red3"
                    name="red3"
                    defaultValue={state.red3?.toString()}
                    className="bg-red-100"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      state.red3 = parseInt(e.target.value);
                      state.matchNumber = null;
                    }}
                  />
                </td>
                <td id="resultcell">
                  <label id="prediction"></label>
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
