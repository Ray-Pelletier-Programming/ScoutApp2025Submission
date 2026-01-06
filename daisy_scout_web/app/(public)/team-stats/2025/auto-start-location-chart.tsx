import React from 'react';

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
  ChartData,
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
import { TeamMatchData2025Props } from './TeamMatchData2025Props';

// Replace the value with what you actually want for a specific key
const yLabels: { [key: number]: string } = {
  0: 'No Data',
  1: 'No Show',
  2: 'Alliance',
  3: 'Center',
  4: 'Opponent',
};

function mapAutoStart(val: string): number {
  switch (val) {
    case 'None':
      return 0;
    case 'No Show':
      return 1;
    case 'Alliance Barge':
      return 2;
    case 'Center':
      return 3;
    case 'Opponent Barge':
      return 4;
    default:
      return 0;
  }
}
export function AutoStartLocation2025({ data }: TeamMatchData2025Props) {
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        max: 4,
        ticks: {
          callback: function (value: string | number) {
            // callback expects string | number
            // parseInt expects string
            // indexer expect int, but ticks might be decimal.  When not a whole number, no label will be shown...
            return yLabels[parseFloat(value.toString())];
          },
        },
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

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderAutoStart = () => {
    let chartData: ChartData<'bar'> = {
      labels: [],
      datasets: [],
    };
    // transform data for chart
    const labels: string[] = [];
    const autostartLoc: number[] = [];

    if (data != undefined) {
      data.forEach((element) => {
        labels.push(element.matchNumber.toString());
        autostartLoc.push(mapAutoStart(element.autoStartLoc ?? ''));
      });

      chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Auton Start Location',
            data: autostartLoc,
            backgroundColor: 'rgb(62, 177, 144)',
          },
        ],
      };
    }

    if (data && data.length > 0) {
      return (
        <div>
          <strong>Auton Start Location:</strong>
          <br />
          <Bar height={120} id="barchart" data={chartData} options={options} />
        </div>
      );
    } else {
      return;
    }
  };

  return <div>{renderAutoStart()}</div>;
}
