interface Cell {
  getValue: () => string;
  getElement: () => HTMLElement;
}

//TODO: REMOVE FOR OTHER FORMATTER
export const formatDateTemp = (cell: Cell): string => {
  const val = cell.getValue();

  if (val == null || val == undefined) {
    return '';
  }
  const date = new Date(val);
  //TODO: Why, when time outputted is this correct
  // where as event schedule needs 4 hrs added?
  const format = 'mm/dd/yyyy';
  const _padStart = (value: number): string =>
    value.toString().padStart(2, '0');
  return format
    .replace(/yyyy/g, _padStart(date.getFullYear()))
    .replace(/dd/g, _padStart(date.getDate()))
    .replace(/mm/g, _padStart(date.getMonth() + 1));
};
