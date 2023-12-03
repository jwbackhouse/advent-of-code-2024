import { readData } from '../../shared.ts';
import chalk from 'chalk';

const isSymbol = (char: string) => char !== '.' && isNaN(+char);
const isNumber = (char: string) => !isNaN(+char);

const isPreviousCharSymbol = (row, charIndex) => {
  if (charIndex === 0) {
    return false;
  }
  if (row === '') {
    return false;
  }
  return isSymbol(row[charIndex - 1]);
};

const isNextCharSymbol = (row, charIndex) => {
  if (charIndex === row.length - 1) {
    return false;
  }
  if (row === '') {
    return false;
  }
  return isSymbol(row[charIndex + 1]);
};

const hasAdjacentSymbol = (
  [row1, row2, row3]: Array<string>,
  charIndex: number
) => {
  if (
    row1 !== '' &&
    (isPreviousCharSymbol(row1, charIndex) ||
      isSymbol(row1[charIndex]) ||
      isNextCharSymbol(row1, charIndex))
  ) {
    return true;
  }
  if (
    isPreviousCharSymbol(row2, charIndex) ||
    isNextCharSymbol(row2, charIndex)
  ) {
    return true;
  }
  if (
    row3 !== '' &&
    (isPreviousCharSymbol(row3, charIndex) ||
      isSymbol(row3[charIndex]) ||
      isNextCharSymbol(row3, charIndex))
  ) {
    return true;
  }
  return false;
};

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath);
  const rowLength = data[0].length;

  let result = 0;

  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row1 = rowIndex === 0 ? '' : data[rowIndex - 1];
    const row2 = data[rowIndex];
    const row3 = rowIndex === data.length - 1 ? '' : data[rowIndex + 1];
    const rows = [row1, row2, row3];

    let partNums = [];
    let isValid = false;

    const validatePartNum = () => {
      if (isValid) {
        const validNumber = parseInt(partNums.join(''));
        result += validNumber;
      }
      partNums = [];
    };

    for (let charIndex = 0; charIndex < rowLength; charIndex++) {
      const char = row2[charIndex];
      if (isNumber(char)) {
        partNums.push(char);
        if (hasAdjacentSymbol(rows, charIndex)) {
          isValid = true;
        }

        // At end of row
        if (charIndex === rowLength - 1) {
          validatePartNum();
        }
        continue;
      }

      if (partNums.length) {
        validatePartNum();
      }
      isValid = false;
    }
  }

  return result;
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
