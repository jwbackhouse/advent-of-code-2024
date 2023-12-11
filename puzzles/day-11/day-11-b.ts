import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Coordinate = [number, number];
type StarMap = Array<Array<string>>;

const EXPANSION = 999999;

const getIsEmpty = (char: string) => char === '.';

const addIfEmpty = (
  array: Array<string>,
  index: number,
  target: Array<number>
) => {
  const isEmpty = array.every(getIsEmpty);
  if (isEmpty) {
    target.push(index);
  }
};

const getEmptyLines = (map: StarMap) => {
  const emptyRows: Array<number> = [];
  const emptyColumns: Array<number> = [];

  const columns: Array<Array<string>> = [];

  map.forEach((row, rowIndex) => {
    addIfEmpty(row, rowIndex, emptyRows);

    row.forEach((char, colIndex) => {
      if (!columns[colIndex]) {
        columns[colIndex] = [];
      }
      columns[colIndex].push(char);
    });
  });

  columns.forEach((column, colIndex) => {
    addIfEmpty(column, colIndex, emptyColumns);
  });

  return { emptyRows, emptyColumns };
};

const getCoordinates = (map: StarMap) => {
  const coordinates = [];

  map.forEach((row, rowIndex) => {
    row.forEach((char, colIndex) => {
      if (char === '#') {
        coordinates.push([rowIndex, colIndex]);
      }
    });
  });

  return coordinates;
};

const addExpansion = (
  emptyIndices: Array<number>,
  start: number,
  end: number
) => {
  let total = 0;

  emptyIndices.forEach((emptyIndex) => {
    if (
      (start < emptyIndex && emptyIndex < end) ||
      (end < emptyIndex && emptyIndex < start)
    ) {
      total = total + EXPANSION;
    }
  });

  return total;
};

const getPathLength = ({
  coordinate: [startRow, startCol],
  nextCoordinate: [endRow, endCol],
  emptyColumns,
  emptyRows,
}: {
  coordinate: Coordinate;
  nextCoordinate: Coordinate;
  emptyColumns: Array<number>;
  emptyRows: Array<number>;
}) => {
  let rowDiff = Math.abs(startRow - endRow);
  let colDiff = Math.abs(startCol - endCol);

  colDiff += addExpansion(emptyColumns, startCol, endCol);
  rowDiff += addExpansion(emptyRows, startRow, endRow);

  return rowDiff + colDiff;
};

const getTotalPathLength = (
  coordinates: Array<Coordinate>,
  emptyColumns: Array<number>,
  emptyRows: Array<number>
) => {
  let totalPathLength = 0;

  coordinates.forEach((coordinate, index) => {
    let nextIndex = index + 1;
    while (coordinates[nextIndex]) {
      const nextCoordinate = coordinates[nextIndex];
      totalPathLength += getPathLength({
        coordinate,
        nextCoordinate,
        emptyColumns,
        emptyRows,
      });
      nextIndex++;
    }
  });

  return totalPathLength;
};

export async function day11b(dataPath?: string) {
  const data = await readData(dataPath);

  const map = data.map((row) => row.split(''));
  const { emptyColumns, emptyRows } = getEmptyLines(map);

  const coordinates = getCoordinates(map);

  const totalPathLength = getTotalPathLength(
    coordinates,
    emptyColumns,
    emptyRows
  );
  return totalPathLength;
}

const answer = await day11b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
