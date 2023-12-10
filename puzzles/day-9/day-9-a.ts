import { readData } from '../../shared.ts';
import chalk from 'chalk';

const calculateDiffs = (row: number[]) => {
  let diffs = [];
  let uniqueNums = new Set();

  for (let i = 1; i < row.length; i++) {
    const num = row[i];
    const prevNum = row[i - 1];
    const diff = num - prevNum;
    uniqueNums.add(diff);
    diffs.push(diff);
  }
  return { diffs, isIdentical: uniqueNums.size === 1 };
};

const iterateDiffs = (allDiffs: Array<Array<number>>, row: number[]) => {
  const { diffs, isIdentical } = calculateDiffs(row);
  allDiffs.unshift(diffs);
  if (isIdentical) {
    return allDiffs;
  }

  return iterateDiffs(allDiffs, diffs);
};

const calculateNewNumber = (allDiffs: Array<Array<number>>, row: number[]) => {
  const numberToAdd = allDiffs.reduce((acc, diffs) => diffs.at(-1) + acc, 0);
  return row.at(-1) + numberToAdd;
};

export async function day9a(dataPath?: string) {
  const data = await readData(dataPath);

  let result = 0;

  data.forEach((row) => {
    const rowNums = row.split(' ').map(Number);
    const allDiffs = iterateDiffs([], rowNums);
    const newNumber = calculateNewNumber(allDiffs, rowNums);
    result += newNumber;
  });

  return result;
}

const answer = await day9a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
