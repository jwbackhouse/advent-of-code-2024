import { readFile } from 'fs/promises';
import chalk from 'chalk';

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

const tiltColumns = (columns: Array<Array<string>>) => {
  let newColumns = [];
  columns.forEach((column: Array<string>) => {
    const components = column.join('').split('#');
    let newCol = [];

    components.forEach((component: string) => {
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

const checkWeight = (columns: Array<string>) => {
  const length = columns.length;

  const weight = columns.reduce((acc: number, column: string) => {
    let weight = 0;
    column.split('').forEach((item: string, index: number) => {
      if (item === 'O') {
        weight += length - index;
      }
    });

    return acc + weight;
  }, 0);

  return weight;
};

export async function day14a(dataPath?: string) {
  const fileName = dataPath || process.argv[2];
  const data = (await readFile(fileName)).toString();
  const rows = data.split('\n');
  const columns = convertColumnsToRows(rows);

  const tilted = tiltColumns(columns);
  return checkWeight(tilted);
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
