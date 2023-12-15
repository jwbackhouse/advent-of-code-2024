import { match } from 'assert';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

const isUnknown = (char) => char === '?';
const isBroken = (char) => char === '#';

const parseRow = (row: string) => {
  const [records, valueList] = row.split(' ');
  const values = valueList.split(',').map(Number);

  return { records, values };
};

const getRemainingValuesLength = (values: Array<number>) => {
  return values.reduce((acc, cur) => acc + cur + 1, 0);
};

const holdingArray = [];

const loop = (count: number, group: Array<string>, values: Array<number>) => {
  // console.log('loop start: ', { group, values });
  const [value, ...remainingValues] = [...values];
  const minSpaceNeeded = getRemainingValuesLength(remainingValues);

  if (!group.length || !value) {
    console.log('no group or no value:', count);
    return { newCount: count, newValues: values };
  }

  if (group.length === value) {
    return { newCount: count, newValues: values };
  }

  if (group.length < minSpaceNeeded || group.length < value) {
    console.log('not enough space');
    return { newCount: count, newValues: values };
  }

  if (isUnknown(group[0]) || isBroken(group[0])) {
    const nextChar = group[value];

    if (group.length === value) {
      console.log('a perfect fit!');
      let newValues = values;
      newValues.shift();
      count++;
      return { newCount: count, newValues };
    }

    if (isBroken(nextChar)) {
      console.log('wont work');
      const newGroup = [...group];

      // current issue is that we are removing too much - just want to remove the first item and try again
      // this change fixes it, but doesn't iterate over the rest correctly
      newGroup.splice(0, 1);

      let newValues = values;

      // console.log({ newGroup, newValues });
      return loop(count, newGroup, newValues);
    }

    console.log('all ok');

    count++;
    const newGroup = [...group];
    newGroup.splice(0, 1);

    holdingArray.push({});

    let newValues = values;
    // if (value === 1) {
    //   newValues = [...values];
    //   newValues.shift();
    // }

    // console.log({ newGroup, newValues });
    return loop(count, newGroup, newValues);
  }
};

// const loopTheLoop = (groups: Array<Array<string>>, values: Array<number>) => {
//   let valueList = values;
//   let newGroups = groups;

//   let countArray: Array<number> = [];

//   groups.forEach((group) => {
//     const { newCount, newValues } = loop(0, group, valueList);
//     console.log('first loop: ', { newCount, newValues });
//     valueList = newValues;
//     countArray.push(newCount);
//   });

//   return countArray;
// };

const getMatch = (group: Array<string>, value: number) => {
  let remainingGroup = [...group];
  let index = value;
  while (true) {
    const isFirstCharValid = remainingGroup[0] !== '.';
    if (!isFirstCharValid) {
      remainingGroup.shift();
      index++;
      continue;
    }

    const nextChar = remainingGroup[value];
    if (isBroken(nextChar)) {
      remainingGroup.shift();
      index++;
      continue;
    }

    return index;
  }
};

const getNextMatch = (group: Array<string>, values: Array<number>) => {
  console.log('GET NEXT MATCH');
  if (!group.length) {
    return 0;
  }

  let remainingValues = [...values];
  const currentGroup = [...group];

  let matches = 0;

  while (true) {
    // if (currentGroup.length < remainingValues[0]) {
    //   console.log('break');
    //   // got here - we're nearly there!
    //   break;
    // }

    if (remainingValues.length === 1) {
      const { newCount } = loop(0, currentGroup, remainingValues);
      console.log('newCount: ', newCount);
      matches += newCount;
      break;
    }
    const furthestIndex = getMatch(currentGroup, remainingValues[0]);
    console.log('furthestIndex: ', furthestIndex);
    currentGroup.splice(0, furthestIndex + 1);
    remainingValues.shift();

    console.log('GET NEXT MATCH > end: ', { currentGroup, remainingValues });

    // getNextMatch(currentGroup, remainingValues);
  }

  return matches;
};

const loopTheLoop = (groups: Array<Array<string>>, values: Array<number>) => {
  let remainingValues = [...values];
  const remainingGroups = [...groups];
  // const currentGroup = remainingGroups[0];

  let matches = 0;

  const newValues = [...remainingValues];

  while (remainingGroups.length) {
    const currentGroup = remainingGroups[0];
    console.log('LOOP THE LOOP > currentGroup: ', currentGroup, newValues);
    const res = getNextMatch(currentGroup, newValues);
    if (!res) {
      console.log('no res');
      remainingGroups.shift();
      continue;
    }
    matches += res;
    currentGroup.shift();
  }

  return Math.max(1, matches);
};

const processData = (data: Array<string>) => {
  let count = [];

  data.forEach((row) => {
    const { records, values } = parseRow(row);
    console.log(row);

    const groups = records
      .split('.')
      .filter(Boolean)
      .map((g) => g.split(''));

    const res = loopTheLoop(groups, values);
    count.push(res);
  });

  return count;
};

export async function day12a(dataPath?: string) {
  const data = await readData(dataPath);

  return processData(data);
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

// starting with the largest number
// narrow groups down to those that are at least this length
// if this leaves only 1 group, total number of options = group length - value + 1 (for value of 5, a group of 7 has 3 options)
//

// or maybe
// start on the left
// find the first location that works for the first value
// iterate over the remaining values
// if this doesn't fit, discard and start again at the next available position
// stop when reach furthest left # (can't go any further right than this)
// fit as many values into a group then try to fit the rest in the next group
