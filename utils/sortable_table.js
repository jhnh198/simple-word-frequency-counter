//functions for sorters and to build the table
export class sortableTable {
  constructor(table, column, direction) {
    this.table = table;
    this.column = column;
    this.direction = direction;
  }

  //the sorting function would be better to sort the dictionary and then rebuild the table
  //sort by header column clicked, word, count, translation, hiragana reading
  //category separation should be removed with the sorter

  sortTable() {
    let rows = Array.from(this.table.rows);
    let sortedRows = rows.slice(1).sort((a, b) => {
      let aCol = a.cells[this.column].textContent;
      let bCol = b.cells[this.column].textContent;
      return aCol > bCol ? 1 : -1;
    });

    if (this.direction === 'desc') {
      sortedRows.reverse();
    }

    this.table.tBodies[0].append(...sortedRows);
  }
}