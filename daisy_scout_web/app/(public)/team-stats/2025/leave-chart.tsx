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
  2: 'No',
  3: 'Yes',
};

function mapLeader(val: string): number {
  switch (val) {
    case 'No Show':
      return 1;
    case 'No':
      return 2;
    case 'Yes':
      return 3;
    default:
      return 0;
  }
}
export function Leave2025({ data }: TeamMatchData2025Props) {
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
        max: 3,
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
  const renderLeave = () => {
    let chartData: ChartData<'bar'> = {
      labels: [],
      datasets: [],
    };
    // transform data for chart
    const labels: string[] = [];
    const leave: number[] = [];

    if (data != undefined) {
      data.forEach((element) => {
        labels.push(element.matchNumber.toString());
        leave.push(mapLeader(element.leave ?? ''));
      });

      chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Leave',
            data: leave,
            backgroundColor: 'rgb(62, 177, 144)',
          },
        ],
      };
    }

    if (data && data.length > 0) {
      return (
        <div>
          <strong>Leave:</strong>
          <br />
          <Bar height={120} id="barchart" data={chartData} options={options} />
        </div>
      );
    } else {
      return;
    }
  };

  return <div>{renderLeave()}</div>;
}
