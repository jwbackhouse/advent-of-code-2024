// import { readData } from '../../shared.ts';
import { readFile } from 'fs/promises';
import chalk from 'chalk';

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

export async function day5a(dataPath?: string) {
  // const data = await readData(dataPath);
  const fileName = dataPath || process.argv[2];
  const data = (await readFile(fileName)).toString();

  const [seedList, ...mapsWithHeader] = data.split('\n\n');
  const seeds = seedList
    .split(': ')[1]
    .split(' ')
    .map((s) => +s);

  let mapSets: Array<Array<string>> = [];
  mapsWithHeader.forEach((m) => {
    mapSets.push(m.split(':\n')[1].split('\n'));
  });

  return processSeeds(seeds, mapSets);
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
