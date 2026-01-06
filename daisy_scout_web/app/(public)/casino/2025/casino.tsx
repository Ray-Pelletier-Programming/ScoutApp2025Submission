'use client';

import React, { useEffect, useState } from 'react';
import { Casino2025IndividualData } from '@/db/queries/casino-2025-queries';
import dynamic from 'next/dynamic';
// Dynamically import the Tabulator component to avoid SSR issues

const DaisyTable = dynamic(() => import('../../../ui/daisy-table-component'), {
  ssr: false,
});

export function CasinoData2025() {
  const getCasinoTable = async () => {
    const transformedData = [];

    let casinoData: Casino2025IndividualData | undefined;

    transformedData.push({
      scoutName: casinoData?.scoutName,
      casinoRank: getCasinoRank(casinoData),
      daisyDollars: getDaisyDollars(casinoData),
    });
    return transformedData;
  };

  const getCasinoRank = (
    //TO DO finish this ranking function
    scoutData: Casino2025IndividualData | undefined
  ): number => {
    if (scoutData === undefined || scoutData === null) {
      return 0;
    }
    return 3 * parseFloat((scoutData?.betAmount ?? 0).toString());
  };

  const getDaisyDollars = (
    //TO DO get daisy dollars by comparing data to actual First match data
    scoutData: Casino2025IndividualData | undefined
  ): number => {
    if (scoutData === undefined || scoutData === null) {
      return 0;
    }
    return 3 * parseFloat((scoutData?.betAmount ?? 0).toString());
  };

  const columns = [
    {
      field: 'casinoRank',
      title: 'Rank',
      width: 100,
    },
    { field: 'scoutName', title: 'Scout Name', width: 200, frozen: true },
    {
      field: 'daisyDollars',
      title: 'Daisy Dollars',
      width: 200,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setTransformedData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCasinoTable();
        setTransformedData(data);
      } catch (error) {
        console.error('Error fetching casino table data:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <DaisyTable data={data} columns={columns} layout={'fitDataTable'} />
    </div>
  );
}
