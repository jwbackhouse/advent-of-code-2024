import { get } from 'http';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Connector = [string, ...Coordinates]; // [connector, row, column]
type Coordinates = [number, number];
type FullMap = Array<Array<string>>;

// [row, column], coming from bottom / left first
const routingMap = {
  J: {
    down: [0, -1],
    right: [-1, 0],
  },
  L: {
    down: [0, 1],
    left: [-1, 0],
  },
  7: {
    up: [0, -1],
    right: [1, 0],
  },
  F: {
    up: [0, 1],
    left: [1, 0],
  },
  '-': {
    left: [0, -1],
    right: [0, 1],
  },
  '|': {
    up: [-1, 0],
    down: [1, 0],
  },
  '.': {},
};

const getIsValidConnector = (
  connector: string,
  [connectorRow, connectorColumn],
  [row, column]
) => {
  const directionIn = getDirectionIn(
    row,
    connectorRow,
    column,
    connectorColumn
  );
  return !!routingMap[connector][directionIn];
};

// may as well have done this manually 🙄!
const getInitialConnectors = (map: FullMap, row: number, column: number) => {
  const adjacentSquares: Array<Connector> = [];

  const processSquare = (sqRow: number, sqColumn: number) => {
    const square = map[sqRow][sqColumn];
    if (getIsValidConnector(square, [sqRow, sqColumn], [row, column])) {
      adjacentSquares.push([square, sqRow, sqColumn]);
    }
  };

  // up
  if (row > 0) {
    processSquare(row - 1, column);
  }
  // down
  if (row < map.length - 1) {
    processSquare(row + 1, column);
  }
  // left
  if (column > 0) {
    processSquare(row, column - 1);
  }
  // right
  if (column < map[row].length - 1) {
    processSquare(row, column + 1);
  }
  return adjacentSquares;
};

const getConnector = (row: number, column: number, map: FullMap) => {
  return [map[row][column] as string, row, column];
};

const getDirectionIn = (
  rowStart: number,
  rowEnd: number,
  columnStart: number,
  columnEnd: number
) => {
  if (rowStart === rowEnd) {
    return columnStart < columnEnd ? 'right' : 'left';
  } else {
    return rowStart < rowEnd ? 'down' : 'up';
  }
};

const getNextConnector = (
  [_, rowStart, columnStart],
  [connector, row, column],
  map: FullMap
) => {
  const nextLocation = routingMap[connector];
  const directionIn = getDirectionIn(rowStart, row, columnStart, column);
  const locationChange = nextLocation[directionIn];

  const nextRow = row + locationChange[0];
  const nextColumn = column + locationChange[1];
  return getConnector(nextRow, nextColumn, map);
};

// Recursive solution, but stack size exceeded
// const travelThePipe = ({
//   currentConnector,
//   nextConnector,
//   map,
//   stepCount,
// }: {
//   currentConnector: Connector;
//   nextConnector: Connector;
//   map: FullMap;
//   stepCount?: number;
// }) => {
//   const newNextConnector = getNextConnector(
//     currentConnector,
//     nextConnector,
//     map
//   ) as Connector;
//   if (newNextConnector[0] === 'S') {
//     return stepCount + 1;
//   }

//   return travelThePipe({
//     currentConnector: nextConnector,
//     nextConnector: newNextConnector,
//     map,
//     stepCount: stepCount + 1,
//   });
// };

export async function day10a(dataPath?: string) {
  const fullMap: FullMap = [];

  const data = await readData(dataPath);
  data.forEach((row) => fullMap.push(row.split('')));

  // row, column
  let sCoordinates: Coordinates;

  // could do binary search but probably not worth it
  for (let i = 0; i < fullMap.length; i++) {
    const sIndex = fullMap[i].indexOf('S');
    if (sIndex > -1) {
      sCoordinates = [i, sIndex];
      break;
    }
  }

  const initialConnectors = getInitialConnectors(
    fullMap,
    sCoordinates[0],
    sCoordinates[1]
  );

  let stepCount = 1;
  let newNextConnector: Connector;
  let currentConnector: Connector = ['S', ...sCoordinates];
  let nextConnector = initialConnectors[1];

  while (nextConnector[0] !== 'S') {
    newNextConnector = getNextConnector(
      currentConnector,
      nextConnector,
      fullMap
    ) as Connector;
    currentConnector = nextConnector;
    nextConnector = newNextConnector;
    stepCount++;
  }

  return stepCount / 2;
}

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
