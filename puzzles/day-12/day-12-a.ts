import { readData } from '../../shared.ts';
import chalk from 'chalk';

const isUnknown = (char) => char === '?';
const isBroken = (char) => char === '#';

const parseRow = (row: string) => {
  const [recordString, valueList] = row.split(' ');
  const values = valueList.split(',').map(Number);

  return { records: recordString.split(''), values };
};

const getIsMatch = (
  records: Array<string>,
  startIndex: number,
  endIndex: number
) => {
  const window = records.slice(startIndex, endIndex);

  if (!window.length) {
    return false;
  }

  const isWindowValid = window.every(
    (char) => isBroken(char) || isUnknown(char)
  );

  const isStartValid = startIndex === 0 || !isBroken(records[startIndex - 1]);
  const isEndValid =
    endIndex === records.length - 1 || !isBroken(records[endIndex]);

  return isWindowValid && isStartValid && isEndValid;
};

const findMatch = (
  records: Array<string>,
  startIndex: number,
  endIndex: number
) => {
  const window = records.slice(startIndex, endIndex);
  const expectedWindowLength = endIndex - startIndex;
  if (endIndex > records.length || window.length < expectedWindowLength) {
    // allow end index to be one longer than the array
    return null;
  }
  if (getIsMatch(records, startIndex, endIndex)) {
    return startIndex;
  }

  const newStartIndex = startIndex + 1;
  const newEndIndex = endIndex + 1;
  return findMatch(records, newStartIndex, newEndIndex);
};

const processRow = (row: string) => {
  let count = 0;

  const { records, values } = parseRow(row);

  const latestMatchingIndices = [];
  let liveIndex = 0;

  let startIndex = 0;
  let endIndex = values[liveIndex];

  let i = 0;
  while (true) {
    const match = findMatch(records, startIndex, endIndex);
    const isMatch = typeof match === 'number' && !isNaN(match);

    const isLastValue = liveIndex === values.length - 1;

    if (!isMatch) {
      if (liveIndex === 0) {
        break;
      }

      liveIndex--;
      startIndex = latestMatchingIndices[liveIndex] + 1;
      endIndex = startIndex + values[liveIndex];
      latestMatchingIndices.splice(liveIndex);

      continue;
    }

    const getHasUsedAllBrokenChars = () => {
      const brokenChars = records.flatMap((value, index) =>
        isBroken(value) ? index : []
      );

      const matchRanges = latestMatchingIndices.map((value, index) => {
        const start = value;
        const end = value + values[index] - 1;
        return { start, end };
      });

      return brokenChars.every((charIndex) =>
        matchRanges.some(
          ({ start, end }) => charIndex >= start && charIndex <= end
        )
      );
    };

    if (isLastValue) {
      latestMatchingIndices[liveIndex] = match;
      if (getHasUsedAllBrokenChars()) {
        count++;
      }
      startIndex = match + 1;
      endIndex = startIndex + values[liveIndex];
      continue;
    }

    latestMatchingIndices[liveIndex] = match;
    startIndex = latestMatchingIndices[liveIndex] + values[liveIndex] + 1;
    liveIndex++;
    endIndex = startIndex + values[liveIndex];

    i++;
  }

  return count;
};

export async function day12a(dataPath?: string) {
  const data = await readData(dataPath);

  let result = 0;
  data.forEach((row) => {
    const rowResult = processRow(row);
    // console.log('rowResult: ', rowResult);
    result += rowResult;
  });
  return result;
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
