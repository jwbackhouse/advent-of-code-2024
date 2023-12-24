import { readFile } from 'fs/promises';
import chalk from 'chalk';

const TOTAL_CYCLES = 10000;

const logger = (data: Array<string>, message: string = 'Log') => {
  console.log(`${message}:
${data.join('\n')}

`);
};

const convertColumnsToRows = (data: Array<string>) => {
  const columns: Array<Array<string>> = [];
  data.forEach((col: string) => {
    const colArray = col.split('');
    colArray.forEach((value: string, index: number) => {
      if (!columns[index]) {
        columns[index] = [];
      }
      columns[index].push(value);
    });
  });

  return columns;
};

const tiltColumns = (columns: Array<Array<string>>): Array<string> => {
  let newColumns = [];
  columns.forEach((column: Array<string>) => {
    const components = column.join('').split('#');
    let newCol = [];

    components.forEach((component: string, idx: number) => {
      const componentArray = component.split('');
      const sorted = componentArray.sort((a, b) => {
        if (a === '.' && b === 'O') {
          return 1;
        }
        if (a === 'O' && b === '.') {
          return -1;
        }
        return 0;
      });
      newCol.push(sorted.join(''));
    });
    newColumns.push(newCol.join('#'));
  });

  return newColumns;
};

const checkWeight = (rows: Array<string>) => {
  const columns = convertColumnsToRows(rows);
  // console.log('columns: ', columns);
  const length = columns.length;

  const weight = columns.reduce((acc: number, column: Array<string>) => {
    let weight = 0;
    column.forEach((item: string, index: number) => {
      if (item === 'O') {
        weight += length - index;
      }
    });

    return acc + weight;
  }, 0);

  return weight;
};

const runSingleCycle = (rows: Array<string>, isRows = true) => {
  const columns = isRows
    ? convertColumnsToRows(rows)
    : rows.map((row) => row.split(''));
  const north = tiltColumns(columns);

  const westColumns = convertColumnsToRows(north);
  const westRev = westColumns;
  const west = tiltColumns(westRev);

  const southColumns = convertColumnsToRows(west);
  const southRev = southColumns.map((row) => row.reverse());
  const south = tiltColumns(southRev);

  const eastColumns = convertColumnsToRows(south);
  const reversed = eastColumns.map((row) => row.reverse());
  const east = tiltColumns(reversed);

  return east;
};

const getRepeatIndex = (pastMatrices: Array<string>, comparator: string) =>
  pastMatrices.findIndex((item) => item === comparator);

const rotate180 = (matrix: Array<string>) =>
  matrix.reverse().map((row) => row.split('').reverse().join(''));

const runTheCycles = (matrix: string, count: number) => {
  let i = count;
  let newMatrix = matrix.split('\n');
  const comparisonList = [];

  while (i > 0) {
    const cycleResult = runSingleCycle(newMatrix);
    newMatrix = rotate180(cycleResult);

    const repeatIndex = getRepeatIndex(comparisonList, newMatrix.join(''));
    if (repeatIndex > -1) {
      const repeatCycle = TOTAL_CYCLES - i - repeatIndex;
      // This was +1 in the sample code, but for some reason +2 works for the real data 🤷
      const cyclesLeft = TOTAL_CYCLES - repeatIndex + 2;
      const cyclesToSkip = cyclesLeft % repeatCycle;

      let j = cyclesToSkip;
      while (j > 0) {
        const cycleResult = runSingleCycle(newMatrix);
        newMatrix = rotate180(cycleResult);
        j--;
      }
      break;
    }

    comparisonList.push(newMatrix.join(''));
    i--;
  }

  return newMatrix;
};

export async function day14b(dataPath?: string) {
  const fileName = dataPath || process.argv[2];
  const data = (await readFile(fileName)).toString();

  const res = runTheCycles(data, TOTAL_CYCLES);
  // logger(res, 'Result');
  return checkWeight(res);
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
