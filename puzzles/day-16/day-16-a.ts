import { get } from 'http';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

type FullMap = Array<Array<string>>;
type Direction = 'up' | 'down' | 'left' | 'right';
type StackItem = {
  row: number;
  column: number;
  direction: Direction;
};

const map: FullMap = [];
const energizedMap: Array<Array<Array<Direction>>> = [[['right']]];

const continueStraight = (
  row: number,
  column: number,
  direction: Direction
) => {
  switch (direction) {
    case 'right':
      return [{ row, column: column + 1, direction }];
    case 'down':
      return [{ row: row + 1, column, direction }];
    case 'left':
      return [{ row, column: column - 1, direction }];
    case 'up':
      return [{ row: row - 1, column, direction }];
  }
};

const splitDirection = (
  row: number,
  column: number,
  direction: Direction
): StackItem[] => {
  switch (direction) {
    case 'down':
    case 'up':
      return [
        { row, column: column + 1, direction: 'right' },
        { row, column: column - 1, direction: 'left' },
      ];
    case 'left':
    case 'right':
      return [
        { row: row + 1, column, direction: 'down' },
        { row: row - 1, column, direction: 'up' },
      ];
  }
};

const changeDirectionBackSlash = (
  row: number,
  column: number,
  direction: Direction
): StackItem[] => {
  let newRow = row;
  let newColumn = column;
  const directionMap: Record<Direction, StackItem> = {
    up: {
      row: newRow,
      column: newColumn - 1,
      direction: 'left',
    },
    down: {
      row: newRow,
      column: newColumn + 1,
      direction: 'right',
    },
    left: {
      row: newRow - 1,
      column: newColumn,
      direction: 'up',
    },
    right: {
      row: newRow + 1,
      column: newColumn,
      direction: 'down',
    },
  };

  return [directionMap[direction]];
};

const changeDirectionForwardSlash = (
  row: number,
  column: number,
  direction: Direction
): StackItem[] => {
  let newRow = row;
  let newColumn = column;
  const directionMap: Record<Direction, StackItem> = {
    up: {
      row: newRow,
      column: newColumn + 1,
      direction: 'right',
    },
    down: {
      row: newRow,
      column: newColumn - 1,
      direction: 'left',
    },
    left: {
      row: newRow + 1,
      column: newColumn,
      direction: 'down',
    },
    right: {
      row: newRow - 1,
      column: newColumn,
      direction: 'up',
    },
  };

  return [directionMap[direction]];
};

const getNextCell = (row: number, column: number, direction: Direction) => {
  const cell = map[row][column];
  switch (cell) {
    case '.':
      return continueStraight(row, column, direction);

    case '|':
      if (direction === 'up' || direction === 'down') {
        return continueStraight(row, column, direction);
      }
      return splitDirection(row, column, direction);

    case '-':
      if (direction === 'left' || direction === 'right') {
        return continueStraight(row, column, direction);
      }
      return splitDirection(row, column, direction);

    case '\\':
      return changeDirectionBackSlash(row, column, direction);

    case '/':
      return changeDirectionForwardSlash(row, column, direction);
  }
};

const filterCells = (cells: StackItem[]) => {
  return cells.filter((cell) => {
    const { row, column } = cell;
    const isWithinMap =
      row >= 0 &&
      row < map.length &&
      column >= 0 &&
      column < map[row].length &&
      map[row][column] !== ' ';

    if (!isWithinMap) {
      return false;
    }

    const existingEntry = energizedMap[row]?.[column];
    const isMatch = existingEntry?.includes(cell.direction);
    return !isMatch;
  });
};

const saveEnergizedCells = (cells: StackItem[]) => {
  cells.forEach((cell) => {
    const { row, column, direction } = cell;

    const existingEntry = energizedMap[row]?.[column];
    if (existingEntry) {
      existingEntry.push(cell.direction);
    } else {
      if (!energizedMap[row]) {
        energizedMap[row] = [];
      }
      energizedMap[row][column] = [direction];
    }
  });
};

const getEnergizedCount = () => {
  let count = 0;
  energizedMap.forEach((row) => {
    row.forEach((cell) => {
      if (cell) {
        count++;
      }
    });
  });
  return count;
};

const processData = () => {
  const stack: Array<{ row: number; column: number; direction: Direction }> = [
    {
      row: 0,
      column: 0,
      direction: 'right',
    },
  ];

  while (stack.length) {
    const { row, column, direction } = stack.at(-1);

    const nextCells = getNextCell(row, column, direction);
    const validNextCells = filterCells(nextCells);
    saveEnergizedCells(validNextCells);

    stack.pop();
    stack.push(...validNextCells);
  }

  return getEnergizedCount();
};

export async function day16a(dataPath?: string) {
  const data = await readData(dataPath);
  data.forEach((row) => map.push(row.split('')));

  return processData();
}

const answer = await day16a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
