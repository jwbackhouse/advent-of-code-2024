import { get } from 'http';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Connector = [string, ...Coordinates]; // [connector, row, column]
type Coordinates = [number, number];
type FullMap = Array<Array<string>>;
type Direction = ReturnType<typeof getDirectionIn>;

let activeSide: Direction;
let routeMap = [];
let rowLength = 0;

let logCount = 0;
let logLimit = 10;

const logger = (data: unknown) => {
  if (logCount < logLimit) {
    console.log(data);
  }
};

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

const getConnector = (
  row: number,
  column: number,
  map: FullMap,
  directionIn: Direction
) => {
  return {
    connector: [map[row][column] as string, row, column] as Connector,
    directionIn: directionIn as Direction,
  };
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
  const nextDirectionIn = getDirectionIn(row, nextRow, column, nextColumn);
  return getConnector(nextRow, nextColumn, map, nextDirectionIn);
};

const processAbove = (row: number, column: number, isClearing: boolean) => {
  const letterToInsert = isClearing ? 'X' : 'Y';
  for (let i = row - 1; i >= 0; i--) {
    if (routeMap[i][column] === 'R') {
      break;
    }
    routeMap[i][column] = letterToInsert;
  }
};

const processBelow = (row: number, column: number, isClearing: boolean) => {
  const letterToInsert = isClearing ? 'X' : 'Y';
  for (let i = row + 1; i < routeMap.length; i++) {
    if (routeMap[i][column] === 'R') {
      break;
    }
    routeMap[i][column] = letterToInsert;
  }
};

const processLeft = (row: number, column: number, isClearing: boolean) => {
  const letterToInsert = isClearing ? 'X' : 'Y';
  for (let i = column - 1; i >= 0; i--) {
    if (routeMap[row][i] === 'R') {
      break;
    }
    routeMap[row][i] = letterToInsert;
  }
};

const processRight = (row: number, column: number, isClearing: boolean) => {
  const letterToInsert = isClearing ? 'X' : 'Y';
  for (let i = column + 1; i < rowLength; i++) {
    if (routeMap[row][i] === 'R') {
      break;
    }
    routeMap[row][i] = letterToInsert;
  }
};

const clearAbove = (row: number, column: number) =>
  processAbove(row, column, true);
const includeAbove = (row: number, column: number) =>
  processAbove(row, column, false);
const clearBelow = (row: number, column: number) =>
  processBelow(row, column, true);
const includeBelow = (row: number, column: number) =>
  processBelow(row, column, false);

const clearLeft = (row: number, column: number) =>
  processLeft(row, column, true);
const includeLeft = (row: number, column: number) =>
  processLeft(row, column, false);
const clearRight = (row: number, column: number) =>
  processRight(row, column, true);
const includeRight = (row: number, column: number) =>
  processRight(row, column, false);

const recordConnector = (
  [connector, row, column]: Connector,
  directionIn: Direction
) => {
  routeMap[row][column] = 'R';
  switch (connector) {
    case '-':
      if (activeSide === 'down') {
        clearAbove(row, column);
        includeBelow(row, column);
      } else {
        clearBelow(row, column);
        includeAbove(row, column);
      }
      break;
    case '|':
      if (activeSide === 'left') {
        clearRight(row, column);
        includeLeft(row, column);
      } else {
        clearLeft(row, column);
        includeRight(row, column);
      }
      break;
    case 'J':
      if (directionIn === 'right') {
        if (['down', 'right'].includes(activeSide)) {
          activeSide = 'right';
          includeBelow(row, column);
          includeRight(row, column);
        } else {
          clearBelow(row, column);
          clearRight(row, column);
          activeSide = 'left';
        }
      } else if (directionIn === 'down') {
        clearRight(row, column);
        if (['down', 'right'].includes(activeSide)) {
          activeSide = 'down';
          includeRight(row, column);
          includeBelow(row, column);
        } else {
          clearBelow(row, column);
          clearRight(row, column);
          activeSide = 'up';
        }
      }
      break;
    case 'L':
      if (directionIn === 'left') {
        if (['down', 'left'].includes(activeSide)) {
          activeSide = 'left';
          includeBelow(row, column);
          includeLeft(row, column);
        } else {
          clearBelow(row, column);
          clearLeft(row, column);
          activeSide = 'right';
        }
      } else if (directionIn === 'down') {
        if (['down', 'left'].includes(activeSide)) {
          activeSide = 'down';
          includeBelow(row, column);
          includeLeft(row, column);
        } else {
          clearBelow(row, column);
          clearLeft(row, column);
          activeSide = 'up';
        }
      }
      break;
    case '7':
      if (directionIn === 'right') {
        if (['up', 'right'].includes(activeSide)) {
          activeSide = 'right';
          includeAbove(row, column);
          includeRight(row, column);
        } else {
          clearAbove(row, column);
          clearRight(row, column);
          activeSide = 'left';
        }
      } else if (directionIn === 'up') {
        if (['up', 'right'].includes(activeSide)) {
          activeSide = 'up';
          includeAbove(row, column);
          includeRight(row, column);
        } else {
          clearAbove(row, column);
          clearRight(row, column);
          activeSide = 'down';
        }
      }
      break;
    case 'F':
      if (directionIn === 'left') {
        if (['up', 'left'].includes(activeSide)) {
          activeSide = 'left';
          includeAbove(row, column);
          includeLeft(row, column);
        } else {
          clearAbove(row, column);
          clearLeft(row, column);
          activeSide = 'right';
        }
      } else if (directionIn === 'up') {
        if (['up', 'left'].includes(activeSide)) {
          activeSide = 'up';
          includeAbove(row, column);
          includeLeft(row, column);
        } else {
          clearAbove(row, column);
          clearLeft(row, column);
          activeSide = 'down';
        }
      }
      break;
    default:
      break;
  }

  // logger(`${connector}, ${row}, ${column} - ${activeSide}`);
};

const calculateScore = (map: Array<Array<string>>) => {
  let score = 0;

  map.forEach((row, index) => {
    for (let i = 0; i < row.length; i++) {
      // in example data I had to include missing values, but not in real data
      if (row[i] === 'Y') {
        score++;
      }
    }
  });

  return score;
};

export async function day10b(dataPath?: string) {
  // TODO AT THE START
  activeSide = 'down';
  const firstDirectionIn = 'left';
  const initialConnectorIndex = 0;
  logLimit = 200;
  //////////

  const fullMap: FullMap = [];

  const data = await readData(dataPath);
  data.forEach((row) => {
    fullMap.push(row.split(''));
    routeMap.push([]);
  });

  rowLength = fullMap[0].length;

  // row, column
  let sCoordinates: Coordinates;

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

  let directionIn: Direction;
  let newNextConnector: Connector;
  let currentConnector: Connector = ['S', ...sCoordinates];
  let nextConnector = initialConnectors[initialConnectorIndex];

  recordConnector(nextConnector, firstDirectionIn);

  while (nextConnector[0] !== 'S') {
    ({ connector: newNextConnector, directionIn } = getNextConnector(
      currentConnector,
      nextConnector,
      fullMap
    ));
    // logger(`newNextConnector: ${newNextConnector}, ${directionIn}`);
    currentConnector = nextConnector;
    nextConnector = newNextConnector;
    logCount++;

    recordConnector(nextConnector, directionIn);
  }

  // console.log(routeMap.map((row) => row.join('')).join('\n'));
  return calculateScore(routeMap);
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
