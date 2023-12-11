import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Coordinate = [number, number];
type StarMap = Array<Array<string>>;

const getIsEmpty = (char: string) => char === '.';

const getExpandedMap = (data: Array<string>) => {
  const expandedMap: StarMap = [];
  const columns = [];

  data.forEach((row) => {
    const rowArray = row.split('');
    expandedMap.push(rowArray);

    const isEmpty = rowArray.every(getIsEmpty);
    if (isEmpty) {
      expandedMap.push(rowArray);
    }

    rowArray.forEach((char, colIndex) => {
      if (!columns[colIndex]) {
        columns[colIndex] = [];
      }
      columns[colIndex].push(char);
    });
  });

  const emptyColumns = columns.map((column) => {
    const isEmpty = column.every(getIsEmpty);
    return isEmpty;
  });

  let isEmptyCount = 0;
  emptyColumns.forEach((isEmpty, index) => {
    if (isEmpty) {
      expandedMap.forEach((row) => {
        row.splice(index + isEmptyCount, 0, '.');
      });
      isEmptyCount++;
    }
  });

  return expandedMap;
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

const getPathLength = (
  [startRow, startCol]: Coordinate,
  [endRow, endCol]: Coordinate
) => {
  const rowDiff = Math.abs(startRow - endRow);
  const colDiff = Math.abs(startCol - endCol);

  return rowDiff + colDiff;
};

const getTotalPathLenth = (coordinates: Array<Coordinate>) => {
  let totalPathLength = 0;

  coordinates.forEach((coordinate, index) => {
    let nextIndex = index + 1;
    while (coordinates[nextIndex]) {
      const nextCoordinate = coordinates[nextIndex];
      totalPathLength += getPathLength(coordinate, nextCoordinate);
      nextIndex++;
    }
  });

  return totalPathLength;
};

export async function day11a(dataPath?: string) {
  const data = await readData(dataPath);

  const expandedMap = getExpandedMap(data);
  const coordinates = getCoordinates(expandedMap);

  const totalPathLength = getTotalPathLenth(coordinates);
  return totalPathLength;
}

const answer = await day11a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
