import { readData } from '../../shared.ts';
import chalk from 'chalk';

const isSymbol = (char: string) => char !== '.' && isNaN(+char);
const isNumber = (char: string) => !isNaN(+char);

const getWholeNumber = (row: string, index: number) => {
  let result = [row[index]];

  const checkNextNumber = (idx) => {
    if (isNumber(row[idx])) {
      result.push(row[idx]);
      checkNextNumber(++idx);
    }
    return;
  };

  const checkPrevNumber = (idx) => {
    if (isNumber(row[idx])) {
      result.unshift(row[idx]);
      checkPrevNumber(--idx);
    }
    return;
  };

  checkNextNumber(index + 1);
  checkPrevNumber(index - 1);

  return parseInt(result.join(''));
};

export async function day3b(dataPath?: string) {
  const data = await readData(dataPath);
  const rowLength = data[0].length;

  let result = 0;

  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row1 = rowIndex === 0 ? '' : data[rowIndex - 1];
    const row2 = data[rowIndex];
    const row3 = rowIndex === data.length - 1 ? '' : data[rowIndex + 1];
    const rows = [row1, row2, row3];

    const asterisks = row2.matchAll(/\*/g);
    for (const { index } of asterisks) {
      const row1Adjacent = [row1[index]];
      const row2Adjacent = [];
      const row3Adjacent = [row3[index]];

      if (index > 0) {
        row1Adjacent.unshift(row1[index - 1]);
        row2Adjacent.unshift(row2[index - 1]);
        row3Adjacent.unshift(row3[index - 1]);
      }
      if (index < rowLength - 1) {
        row1Adjacent.push(row1[index + 1]);
        row2Adjacent.push(row2[index + 1]);
        row3Adjacent.push(row3[index + 1]);
      }

      let adjacentPartNums = [];

      // TODO - refactor to avoid duplication!!!
      if (isNumber(row1Adjacent[1]) && row1Adjacent.length === 3) {
        const wholeNumber = getWholeNumber(row1, index);
        adjacentPartNums.push(wholeNumber);
      } else {
        if (isNumber(row1Adjacent[0])) {
          const wholeNumber = getWholeNumber(row1, index - 1);
          adjacentPartNums.push(wholeNumber);
        }
        if (isNumber(row1Adjacent[2])) {
          const wholeNumber = getWholeNumber(row1, index + 1);
          adjacentPartNums.push(wholeNumber);
        }
      }

      if (row2Adjacent.length > 1) {
        if (isNumber(row2Adjacent[0])) {
          const wholeNumber = getWholeNumber(row2, index - 1);
          adjacentPartNums.push(wholeNumber);
        }
        if (isNumber(row2Adjacent[1])) {
          const wholeNumber = getWholeNumber(row2, index + 1);
          adjacentPartNums.push(wholeNumber);
        }
      } else {
        // only 1 item because at either end of the row
        const refIndex = index === 0 ? index + 1 : index - 1;
        if (isNumber(row2Adjacent[0])) {
          const wholeNumber = getWholeNumber(row2, refIndex);
          adjacentPartNums.push(wholeNumber);
        }
      }

      if (isNumber(row3Adjacent[1]) && row3Adjacent.length === 3) {
        const wholeNumber = getWholeNumber(row3, index);
        adjacentPartNums.push(wholeNumber);
      } else {
        if (isNumber(row3Adjacent[0])) {
          const wholeNumber = getWholeNumber(row3, index - 1);
          adjacentPartNums.push(wholeNumber);
        }
        if (isNumber(row3Adjacent[2])) {
          const wholeNumber = getWholeNumber(row3, index + 1);
          adjacentPartNums.push(wholeNumber);
        }
      }

      if (adjacentPartNums.length === 2) {
        result += adjacentPartNums[0] * adjacentPartNums[1];
      }
    }
  }

  return result;
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
