import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);

  let result = 0;

  data.forEach((row) => {
    const parsedNums = row.split('').map((number) => parseInt(number, 10));
    const numbers = parsedNums.filter((n) => !isNaN(n));
    const rowResult = `${numbers[0]}${numbers[numbers.length - 1]}`;
    result += +rowResult;
  });
  return result;
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
