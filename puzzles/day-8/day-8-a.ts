import { readData } from '../../shared.ts';
import chalk from 'chalk';

const destinationMap = {};

const getDestination = (currentStep: string, direction: string) => {
  const lookupIndex = direction === 'L' ? 0 : 1;
  return destinationMap[currentStep][lookupIndex];
};

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath);
  const directions = data[0].split('');
  data.splice(0, 2);

  data.forEach((step, index) => {
    const stepName = step.slice(0, 3);
    destinationMap[stepName] = step.split(' = (')[1].slice(0, -1).split(', ');
  });

  let steps = 0;
  let index = 0;
  let currentStep = 'AAA';

  while (true) {
    steps++;
    let lookupIndex = index % directions.length;
    const direction = directions[lookupIndex];
    const destination = getDestination(currentStep, direction);

    if (destination === 'ZZZ') {
      break;
    }

    currentStep = destination;
    index++;
  }

  return steps;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
