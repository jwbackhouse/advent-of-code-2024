import { readData } from '../../shared.ts';
import chalk from 'chalk';

const getDistance = (time: number, speed: number) => time * speed;

const processRace = (totalTime: number, record: number) => {
  let newRecords = 0;
  let maxDistance = 0;
  for (let i = 1; i < totalTime; i++) {
    const remainingTime = totalTime - i;
    const distance = getDistance(remainingTime, i);

    if (distance > record) {
      newRecords++;
    }
    // small optimization
    if (distance > maxDistance) {
      maxDistance = distance;
    }
    if (distance < maxDistance && distance < record) {
      break;
    }
  }

  return newRecords;
};

export async function day6a(dataPath?: string) {
  const data = await readData(dataPath);

  const parseRow = (row: string) =>
    row
      .split(' ')
      .filter((char) => !isNaN(Number(char)) && char !== '')
      .map(Number);

  const time = parseRow(data[0]);
  const record = parseRow(data[1]);

  let result = 1;

  time.forEach((t, i) => {
    const newRecords = processRace(t, record[i]);
    result *= newRecords;
  });

  return result;
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
