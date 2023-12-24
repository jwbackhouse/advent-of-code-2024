import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day15a(dataPath?: string) {
  const data = await readData(dataPath);
  const items = data[0].split(',');

  let total = 0;

  items.forEach((item) => {
    let index = 0;
    let answer = 0;

    while (index < item.length) {
      const charCode = item.charCodeAt(index);
      answer += charCode;
      const multiplied = answer * 17;
      const result = multiplied % 256;
      answer = result;

      index++;
    }

    total += answer;
  });

  return total;
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
