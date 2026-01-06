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

export function TotalPiecesScored2025({ data }: TeamMatchData2025Props) {
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
  const renderTotalPiecesScored = () => {
    let chartData: ChartData<'bar'> = {
      labels: [],
      datasets: [],
    };
    // transform data for chart
    const labels: string[] = [];
    const autoCoral: number[] = [];
    const teleopCoral: number[] = [];
    const autoAlgae: number[] = [];
    const teleopAlgae: number[] = [];
    const hpAlgae: number[] = [];

    if (data != undefined) {
      data.forEach((element) => {
        labels.push(element.matchNumber.toString());
        autoCoral.push(
          (element.autoReefL1 ?? 0) +
            (element.autoReefL2 ?? 0) +
            (element.autoReefL3 ?? 0) +
            (element.autoReefL4 ?? 0)
        );
        teleopCoral.push(
          (element.teleopReefL1 ?? 0) +
            (element.teleopReefL2 ?? 0) +
            (element.teleopReefL3 ?? 0) +
            (element.teleopReefL4 ?? 0)
        );
        autoAlgae.push(element.autoNet ?? 0 + (element.autoProcessor ?? 0));
        teleopAlgae.push(
          (element.teleopNet ?? 0) + (element.teleopProcessor ?? 0)
        );
        hpAlgae.push(element.hpNetMade ?? 0);
      });

      chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Auto Coral',
            data: autoCoral,
            backgroundColor: '#e8c0ed',
          },
          {
            label: 'Teleop Coral',
            data: teleopCoral,
            backgroundColor: '#e35ff5',
          },
          {
            label: 'Auto Algae',
            data: autoAlgae,
            backgroundColor: '#78fdcc',
          },
          {
            label: 'Teleop Algae',
            data: teleopAlgae,
            backgroundColor: '#3eb190',
          },
          {
            label: 'HP Algae',
            data: hpAlgae,
            backgroundColor: '#4544fd',
          },
        ],
      };
    }

    if (data && data.length > 0) {
      return (
        <div>
          <strong>Total Pieces Scored:</strong>
          <br />
          <Bar height={120} id="barchart" data={chartData} options={options} />
        </div>
      );
    } else {
      return;
    }
  };

  return <div>{renderTotalPiecesScored()}</div>;
}
