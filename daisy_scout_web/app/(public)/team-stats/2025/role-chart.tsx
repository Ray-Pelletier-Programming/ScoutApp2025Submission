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
  1: 'None',
  2: 'Defense',
  3: 'Algae',
  4: 'Coral',
};

function mapRole(val: string): number {
  switch (val) {
    case 'None':
      return 1;
    case 'Defense':
      return 2;
    case 'Algae':
      return 3;
    case 'Coral':
      return 4;
    default:
      return 0;
  }
}

export function Role2025({ data }: TeamMatchData2025Props) {
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
  const renderRole = () => {
    let chartData: ChartData<'bar'> = {
      labels: [],
      datasets: [],
    };
    // transform data for chart
    const labels: string[] = [];
    const role: number[] = [];

    if (data != undefined) {
      data.forEach((element) => {
        labels.push(element.matchNumber.toString());
        role.push(mapRole(element.role ?? 'None'));
      });

      chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Role',
            data: role,
            backgroundColor: 'rgb(120,253,204)',
          },
        ],
      };
    }

    if (data && data.length > 0) {
      return (
        <div>
          <strong>Role:</strong>
          <br />
          <Bar height={120} id="barchart" data={chartData} options={options} />
        </div>
      );
    } else {
      return;
    }
  };

  return <div>{renderRole()}</div>;
}
