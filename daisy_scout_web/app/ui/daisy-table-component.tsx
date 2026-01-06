'use client';
// Ensure this component only runs on the client side

import React, { useEffect, useRef } from 'react';
import { RowComponent, TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css'; // Import styles
import { Button } from './button';

interface TableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[];

  // eslint-disable-next-line no-unused-vars
  rowFormatter?: ((row: RowComponent) => void) | undefined;
  // eslint-disable-next-line no-unused-vars
  picklistRowMoved?: ((row: RowComponent) => void) | undefined;

  canMoveRows?: boolean;
  layout?:
    | 'fitColumns'
    | 'fitData'
    | 'fitDataFill'
    | 'fitDataStretch'
    | 'fitDataTable'
    | undefined;
  height?: number | undefined;
  showDownload?: boolean;
}

const DaisyTable: React.FC<TableProps> = ({
  data,
  columns,
  rowFormatter,
  picklistRowMoved,
  canMoveRows,
  layout,
  height,
  showDownload = false,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);

  useEffect(() => {
    if (tableRef.current) {
      const t = new Tabulator(tableRef.current, {
        data,
        columns,
        layout: layout ?? ('fitColumns' as const),
        movableRows: canMoveRows,
        rowFormatter,
        height: height ?? undefined,
      });

      t.on('rowMoved', picklistRowMoved);
      tabulatorRef.current = t;
    }
  }, [
    data,
    columns,
    rowFormatter,
    picklistRowMoved,
    layout,
    height,
    canMoveRows,
  ]);

  const handleDownload = () => {
    if (tabulatorRef.current) {
      tabulatorRef.current.download('csv', 'data.csv');
    }
  };
  return (
    <div style={{ display: 'inline-block' }}>
      {' '}
      {showDownload && (
        <>
          <div style={{ float: 'right' }}>
            <Button onClick={handleDownload}>Export Data</Button>
          </div>
          <br />
          <br />
        </>
      )}
      <div ref={tableRef} />
    </div>
  );
};

export default DaisyTable;
