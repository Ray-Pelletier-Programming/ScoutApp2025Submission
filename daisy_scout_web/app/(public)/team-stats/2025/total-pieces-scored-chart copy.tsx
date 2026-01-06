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

export function CoralPiecesScored2025({ data }: TeamMatchData2025Props) {
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

  // Render the content on the page based on the current season
  // to change the display for a season, go to the correct imported
  // component for the season.
  const renderCoralPiecesScored = () => {
    let chartData: ChartData<'bar'> = {
      labels: [],
      datasets: [],
    };
    // transform data for chart
    const labels: string[] = [];
    const l1Coral: number[] = [];
    const l2Coral: number[] = [];
    const l3Coral: number[] = [];
    const l4Coral: number[] = [];

    if (data != undefined) {
      data.forEach((element) => {
        labels.push(element.matchNumber.toString());
        l1Coral.push((element.autoReefL1 ?? 0) + (element.teleopReefL1 ?? 0));
        l2Coral.push((element.autoReefL2 ?? 0) + (element.teleopReefL2 ?? 0));
        l3Coral.push((element.autoReefL3 ?? 0) + (element.teleopReefL3 ?? 0));
        l4Coral.push((element.autoReefL4 ?? 0) + (element.teleopReefL4 ?? 0));
      });

      chartData = {
        labels: labels,
        datasets: [
          {
            label: 'L1',
            data: l1Coral,
            backgroundColor: '#8a179c',
          },
          {
            label: 'L2',
            data: l2Coral,
            backgroundColor: '#bd6fc9',
          },
          {
            label: 'L3',
            data: l3Coral,
            backgroundColor: '#d096d9',
          },
          {
            label: 'L4',
            data: l4Coral,
            backgroundColor: '#e8caed',
          },
        ],
      };
    }

    if (data && data.length > 0) {
      return (
        <div>
          <strong>Coral Level Scored:</strong>
          <br />
          <Bar height={120} id="barchart" data={chartData} options={options} />
        </div>
      );
    } else {
      return;
    }
  };

  return <div>{renderCoralPiecesScored()}</div>;
}
