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
  2: 'Dead',
  3: 'Broken',
  4: 'Working',
};

function mapOperability(val: string): number {
  switch (val) {
    case 'None':
      return 0;
    case 'No Show':
      return 1;
    case 'Dead':
      return 2;
    case 'Broken':
      return 3;
    case 'Working':
      return 4;
    default:
      return 0;
  }
}

export function Operability2025({ data }: TeamMatchData2025Props) {
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
  const renderOperability = () => {
    let chartData: ChartData<'bar'> = {
      labels: [],
      datasets: [],
    };
    // transform data for chart
    const labels: string[] = [];
    const operability: number[] = [];

    if (data != undefined) {
      data.forEach((element) => {
        labels.push(element.matchNumber.toString());
        operability.push(mapOperability(element.operability ?? 'None'));
      });

      chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Operability',
            data: operability,
            backgroundColor: 'rgb(120,253,204)',
          },
        ],
      };
    }

    if (data && data.length > 0) {
      return (
        <div>
          <strong>Operability:</strong>
          <br />
          <Bar height={120} id="barchart" data={chartData} options={options} />
        </div>
      );
    } else {
      return;
    }
  };

  return <div>{renderOperability()}</div>;
}
