//functions for sorters and to build the table
//table should hold dictionary data and gets input from script to pass to dict

export class sortableTable {
  constructor(table, column, direction) {
    this.table = table;
    this.column = column;
    this.direction = direction;
  }

  //the sorting function would be better to sort the dictionary and then rebuild the table
  //sort by header column clicked, word, count, translation, hiragana reading
  //category separation should be removed with the sorter
}