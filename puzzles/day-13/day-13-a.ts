import { readFile } from 'fs/promises';
import chalk from 'chalk';

const getIndices = (data: Array<number>) => {
  let indices = [];
  for (let i = 0; i < data.length; i++) {
    indices[i] = [];
    for (let j = i + 1; j < data.length; j++) {
      if (data[j] === data[i]) {
        indices[i].push(j);
      }
    }
  }

  return indices;
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
      const value = potentialMatches.length / 2;
      return isReverse ? data.length - value : value;
    }
  }

  return 0;
};

const checkSymmetry = (data: Array<number>) => {
  const indices = getIndices(data);

  // starting at the start
  if (indices[0].length) {
    const value = getValue(data, indices[0], false);

    if (value) {
      return value;
    }
  }

  // starting at the end
  const reversedData = [...data].reverse();

  const reverseIndices = getIndices(reversedData);
  if (reverseIndices[0].length) {
    const value = getValue(reversedData, reverseIndices[0], true);
    return value;
  }

  return 0;
};

const checkRows = (data: Array<Array<string>>) => {
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

export async function day13a(dataPath?: string) {
  const fileName = dataPath || process.argv[2];
  const data = (await readFile(fileName)).toString();
  const patterns = data.split('\n\n').map((pattern) => pattern.split('\n'));

  let count = 0;

  patterns.forEach((pattern, index) => {
    const rowData = pattern.map((row: string) => row.split(''));
    const rowResult = checkRows(rowData) * 100;
    // console.log('rowResult: ', rowResult);
    count += rowResult;

    if (!rowResult) {
      const colResult = checkColumns(pattern);
      // console.log('colResult: ', colResult);
      count += colResult;

      if (!colResult) {
        console.log('CHECK:', index);
      }
    }
  });

  return count;
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

// const checkSymmetry = (data: Array<number>) => {
//   let indices = [];
//   let count = 0;

//   for (let i = 0; i < data.length; i++) {
//     const matchingIndex = data.findIndex(
//       (value, idx) => idx > i && value === data[i]
//     );
//     indices.push(matchingIndex);
//   }
//   console.log('indices: ', indices);

//   let isStartingAtStart = indices[0] !== -1 && indices[1] === indices[0] - 1;
//   // console.log('isStartingAtStart: ', isStartingAtStart);

//   const isFirstColumnSymmetrical = indices[0] === 1;
//   // console.log(
//   //   'isLastColumnSymmetrical: ',
//   //   isLastColumnSymmetrical,
//   //   indices.at(-2),
//   //   indices.length + 1
//   // );
//   if (isFirstColumnSymmetrical) {
//     return 1;
//   }

//   const isLastColumnSymmetrical = indices.at(-2) === indices.length - 1;
//   if (isLastColumnSymmetrical) {
//     return indices.length - 1;
//   }

//   // think it's not possible to have another symmetry line that ends at the end
//   if (isStartingAtStart) {
//     count = 1;
//     for (let i = 1; i < indices.length; i++) {
//       // re-write to find all indices that match, then for the next one check one of them is equal to one of the preceding ones minus 1
//       if (indices[i - 1] - indices[i] === 1) {
//         count++;
//         continue;
//       }
//       break;
//     }

//     return count;
//   }

//   const firstPositiveIndex = indices.findIndex((value) => value > -1);
//   const indicesToCheck = indices.slice(firstPositiveIndex);
//   // console.log('indicesToCheck: ', indicesToCheck);
//   for (let i = 1; i < indicesToCheck.length; i++) {
//     if (indicesToCheck[i - 1] - indicesToCheck[i] === 1) {
//       // console.log('add count');
//       count = i + 1;
//     } else if (count === indicesToCheck.slice(i).length) {
//       // console.log('break');
//       break;
//     } else {
//       // console.log('reset');
//       count = 0;
//     }
//   }

//   // console.log('firstPositiveIndex: ', firstPositiveIndex);
//   return count ? count + firstPositiveIndex : 0;

//   // const positiveIndices = indicesToCheck.filter((value) => value > -1);
//   // const negativeIndices = indicesToCheck.filter((value) => value === -1);
//   // isSymmetrical = positiveIndices.length === negativeIndices.length;

//   // // double check that the positive values are in descending order
//   // if (isSymmetrical) {
//   //   for (let i = 1; i < positiveIndices.length; i++) {
//   //     if (positiveIndices[i - 1] - positiveIndices[i] !== 1) {
//   //       isSymmetrical = false;
//   //     }
//   //   }
//   // }

//   // return isSymmetrical
//   //   ? getColumnsToLeft(positiveIndices, firstPositiveIndex)
//   //   : 0;
// };
