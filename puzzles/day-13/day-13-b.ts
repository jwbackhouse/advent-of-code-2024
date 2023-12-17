import { readFile } from 'fs/promises';
import chalk from 'chalk';

const getPossibleVariances = (length: number) => {
  let remaining = 0;
  let possibleVariances = [];

  while (remaining < length) {
    possibleVariances.push(1 + 2 ** remaining);
    remaining++;
  }

  return possibleVariances;
};

const getMatchingIndices = (data: Array<number>, rowLength: number) => {
  let indices = [[]];
  let amendedData = [[...data]];
  let isRetryNeeded = true;

  const possibleVariances = getPossibleVariances(rowLength);

  for (let i = 0; i < data.length; i++) {
    indices.at(-1)[i] = [];
    for (let j = i + 1; j < data.length; j++) {
      const current = data[i];
      const comparator = data[j];
      const diff = current - comparator;

      if (!diff) {
        indices.at(-1)[i].push(j);
      }
    }
  }

  while (isRetryNeeded) {
    for (let i = 0; i < data.length; i++) {
      indices.at(-1)[i] = [];
      for (let j = i + 1; j < data.length; j++) {
        const current = data[i];
        const comparator = data[j];
        const diff = current - comparator;

        if (possibleVariances.includes(Math.abs(diff))) {
          indices.push([...indices.at(-1)]);
          amendedData.push([...amendedData[0]]);
          indices.at(-1)[i].push(j);
          amendedData.at(-1)[i] -= diff;

          isRetryNeeded = j < data.length - 1 ? true : false;
          // console.log('match After', i, j, indices, amendedData);
          continue;
        }

        if (!diff) {
          indices.at(-1)[i].push(j);
        }
        isRetryNeeded = false;
      }
    }
  }

  // console.log('amendedData', amendedData);
  // console.log('indices end of GMI', indices);

  return { indices, amendedData };
};

const getValue = (
  data: Array<number>,
  indices: Array<number>,
  isReverse: boolean
) => {
  for (const index of indices) {
    const potentialMatches = data.slice(0, index + 1);
    const confirmSymmetry = potentialMatches.every((value, index) => {
      if (index === 0) {
        return true;
      }

      return value === potentialMatches.at(-(1 + index));
    });

    if (confirmSymmetry) {
      // console.log(
      //   'potentialMatches: ',
      //   potentialMatches,
      //   data.length,
      //   isReverse
      // );
      const value = potentialMatches.length / 2;
      return isReverse ? data.length - value : value;
    }
  }

  return 0;
};

const checkSymmetry = (data: Array<number>, rowLength: number) => {
  const { indices, amendedData } = getMatchingIndices(data, rowLength);
  // console.log('indices: ', indices);

  let originalValue: number;

  // starting at the start
  for (let i = 0; i < indices.length; i++) {
    const currentIndices = indices[i];
    const value = getValue(amendedData[i], currentIndices[0], false);
    if (value && i === 0) {
      originalValue = value;
    }
    if (
      value &&
      i !== 0 &&
      value !== originalValue &&
      Number.isInteger(value)
    ) {
      return value;
    }
  }

  // starting at the end
  const reversedData = [...data].reverse();

  const { indices: reverseIndices, amendedData: reverseAmendedData } =
    getMatchingIndices(reversedData, rowLength);
  // console.log('reverseIndices: ', reverseAmendedData);
  for (let i = 0; i < reverseIndices.length; i++) {
    // console.log('current: ', reverseIndices[i][0].length);
    if (reverseIndices[i][0].length) {
      const currentReversedIndices = reverseIndices[i];
      const reverseValue = getValue(
        reverseAmendedData[i],
        currentReversedIndices[0],
        true
      );

      if (reverseValue && i === 0) {
        // console.log('Original: ', reverseValue);
        originalValue = reverseValue;
      }
      if (
        reverseValue &&
        i !== 0 &&
        reverseValue !== originalValue &&
        Number.isInteger(reverseValue)
      ) {
        return reverseValue;
      }
    }
  }

  return 0;
};

const checkRows = (data: Array<Array<string>>) => {
  // console.log('data: ', data);
  const rowValues: Array<number> = [];

  data.forEach((row: Array<string>) => {
    // console.log('row: ', row);
    let rowValue = 0;
    row.forEach((value: string, index: number) => {
      if (value === '#') {
        // console.log('index: ', row, index);
        const value = 1 + 2 ** index;
        rowValue += value;
      }
    });

    rowValues.push(rowValue);
  });
  // console.log('rowValues: ', data[0].length);

  // console.log('checking sym', rowValues);
  return checkSymmetry(rowValues, data[0].length);
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

const checkColumns = (data: Array<string>) => {
  const rows = convertColumnsToRows(data);
  return checkRows(rows);
};

export async function day13b(dataPath?: string) {
  const fileName = dataPath || process.argv[2];
  const data = (await readFile(fileName)).toString();
  const patterns = data.split('\n\n').map((pattern) => pattern.split('\n'));

  let count = 0;

  patterns.forEach((pattern, index) => {
    // console.log('pattern: ', pattern);
    const rowData = pattern.map((row: string) => row.split(''));
    const rowResult = checkRows(rowData) * 100;
    console.log('rowResult: ', rowResult);
    count += rowResult;

    if (!rowResult) {
      const colResult = checkColumns(pattern);
      console.log('colResult: ', colResult);
      count += colResult;

      if (!colResult) {
        console.log('CHECK:', index);
      }
    }
  });

  return count;
}

const answer = await day13b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
