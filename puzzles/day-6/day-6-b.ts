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

export async function day6b(dataPath?: string) {
  const data = await readData(dataPath);

  const parseRow = (row: string) =>
    Number(
      row
        .split(' ')
        .filter((char) => !isNaN(Number(char)) && char !== '')
        .join('')
    );

  const time = parseRow(data[0]);
  const record = parseRow(data[1]);

  let result = processRace(time, record);

  // time.forEach((t, i) => {
  //   const newRecords = processRace(t, record[i]);
  //   result *= newRecords;
  // });

  return result;
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
