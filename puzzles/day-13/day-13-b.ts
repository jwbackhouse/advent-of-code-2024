import { readFile } from 'fs/promises';
import chalk from 'chalk';

const getPossibleVariances = (length: number) => {
  let remaining = 0;
  let possibleVariances = [];

  while (remaining < length) {
    possibleVariances.push(2 ** remaining);
    remaining++;
  }

  return possibleVariances;
};

const getMatchingIndices = (data: Array<number>) => {
  console.log('data: ', data);
  let indices = [];
  let amendedData = [...data];

  const possibleVariances = getPossibleVariances(data.length);

  for (let i = 0; i < data.length; i++) {
    indices[i] = [];
    for (let j = i + 1; j < data.length; j++) {
      const current = data[i];
      const comparator = data[j];
      const diff = current - comparator;

      if (possibleVariances.includes(diff)) {
        console.log('match', current, comparator, diff);
        indices[i].push(j);
        amendedData[i] -= diff;
      }
      if (!diff) {
        indices[i].push(j);
      }
    }
  }

  console.log('amendedData', amendedData);

  return { indices, amendedData };
};

const getValue = (
  data: Array<number>,
  indices: Array<number>,
  isReverse: boolean
) => {
  for (const index of indices) {
    const potentialMatches = data.slice(0, index + 1);
    console.log('potentialMatches: ', potentialMatches);
    const confirmSymmetry = potentialMatches.every((value, index) => {
      if (index === 0) {
        return true;
      }

      return value === potentialMatches.at(-(1 + index));
    });

    if (confirmSymmetry) {
      const value = potentialMatches.length / 2;
      return isReverse ? data.length - value : value;
    }
  }

  return 0;
};

const checkSymmetry = (data: Array<number>) => {
  const { indices, amendedData } = getMatchingIndices(data);
  console.log('indices: ', indices);

  // starting at the start
  if (indices[0].length) {
    console.log('start at start');
    const value = getValue(amendedData, indices[0], false);
    // console.log('value: ', value);

    if (value) {
      return value;
    }
  }

  // starting at the end
  const reversedData = [...data].reverse();

  const { indices: reverseIndices, amendedData: reverseAmendedData } =
    getMatchingIndices(reversedData);
  console.log('reverseIndices: ', reverseIndices);
  if (reverseIndices[0].length) {
    const reverseValue = getValue(reverseAmendedData, reverseIndices[0], true);
    return reverseValue;
  }

  return 0;
};

const checkRows = (data: Array<Array<string>>) => {
  // console.log('data: ', data);
  const rowValues: Array<number> = [];

  data.forEach((row: Array<string>) => {
    let rowValue = 0;
    row.forEach((value: string, index: number) => {
      if (value === '#') {
        const value = 1 + 2 ** index;
        rowValue += value;
      }
    });

    rowValues.push(rowValue);
  });

  // console.log('checking sym', rowValues);
  return checkSymmetry(rowValues);
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
