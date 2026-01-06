import React from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables'; //import Tabulator library

export class DaisyTemp extends React.Component {
  el = React.createRef();
  tabulator = null; //variable to hold your table

  doTablulator() {
    //instantiate Tabulator when element is mounted
    this.tabulator = new Tabulator(this.el, {
      data: this.props.tableData,
      movableRows: true,
      columns: this.props.columns,
      height: this.props.height,
      rowFormatter: this.props.rowFormatter(),
    });

    //listen for row move
    this.tabulator.on('rowMoved', this.props.onRowMoved());
  }
  componentDidUpdate() {
    this.doTablulator();
  }
  componentDidMount() {
    this.doTablulator();
  }

  //add table holder element to DOM
  render() {
    console.log('render', new Date().toISOString());
    return <div ref={(el) => (this.el = el)} />;
  }
}
