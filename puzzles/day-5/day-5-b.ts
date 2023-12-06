// import { readData } from '../../shared.ts';
import { readFile } from 'fs/promises';
import chalk from 'chalk';

const MAX_ARRAY_SIZE = 1000000;

const processSeeds = (seeds, mapSets) => {
  let result = 0;
  for (const seed of seeds) {
    const steps = [seed];

    for (let mapSetIdx = 0; mapSetIdx < mapSets.length; mapSetIdx++) {
      if (!steps[mapSetIdx]) {
        steps.push(steps[mapSetIdx - 1]);
      }
      // console.log('start of mapSetLoop', steps, mapSetIdx);
      const latestValue = steps[mapSetIdx];
      // console.log('mapSet: ', mapSet);
      for (const map of mapSets[mapSetIdx]) {
        // console.log('map: ', map);
        const [destination, source, range] = map
          .split(' ')
          .map((char) => +char);

        const maxSource = source + range;
        // console.log({ latestValue, source, maxSource });
        if (latestValue >= source && latestValue <= maxSource) {
          const newValue = destination + (latestValue - source);
          // console.log('strike', newValue);
          steps.push(newValue);
          break;
        }
      }
    }

    // console.log('end of seed loop for seed', seed, steps.at(-1));
    if (steps.at(-1) < result || !result) {
      result = steps.at(-1);
    }
  }
  return result;
};

export async function day5b(dataPath?: string) {
  // const data = await readData(dataPath);
  const fileName = dataPath || process.argv[2];
  const data = (await readFile(fileName)).toString();

  let result = 0;

  const [seedList, ...mapsWithHeader] = data.split('\n\n');

  let mapSets: Array<Array<string>> = [];
  mapsWithHeader.forEach((m) => {
    mapSets.push(m.split(':\n')[1].split('\n'));
  });

  const seedDetails = seedList
    .split(': ')[1]
    .split(' ')
    .map((s) => +s);

  const start: Array<number> = [];
  const range: Array<number> = [];
  seedDetails.forEach((value, index) => {
    if (index % 2 === 0) {
      start.push(value);
    } else {
      range.push(value);
    }
  });

  const numberSeedRanges = start.length;

  for (let i = 0; i < numberSeedRanges; i++) {
    const startValue = start[i];
    const rangeValue = range[i];

    // let rollingRangeValue = 0;

    // while (rollingRangeValue < rangeValue) {

    let seeds = [];
    for (let seedIdx = 0; seedIdx < rangeValue; seedIdx++) {
      // console.log('rangeValue: ', seedIdx, rangeValue);
      if (seedIdx === rangeValue - 1) {
        seeds.push(startValue + seedIdx);
        const batchResult = processSeeds(seeds, mapSets);
        // console.log('final batchResult: ', seeds, batchResult);
        if (batchResult < result || result === 0) {
          result = batchResult;
        }
        break;
      }

      if (seeds.length < MAX_ARRAY_SIZE) {
        seeds.push(startValue + seedIdx);
      } else {
        const batchResult = processSeeds(seeds, mapSets);
        // console.log('batch: ', seeds, batchResult);
        if (batchResult < result || result === 0) {
          result = batchResult;
        }
        seeds = [startValue + seedIdx];
      }
    }
  }

  return result;
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
