import { readData } from '../../shared.ts';
import chalk from 'chalk';

const limits = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function day2a(dataPath?: string) {
  const data = await readData(dataPath);

  let result = 0;

  data.forEach((row) => {
    const [gameId, sets] = row.split(': ');
    const [_, id] = gameId.split(' ');
    const turns = sets.split('; ');

    let isValidRow = true;

    turns.forEach((turn) => {
      let cubeMap = {
        red: 0,
        green: 0,
        blue: 0,
      };
      const cubes = turn.split(', ');

      cubes.forEach((cube) => {
        const [number, colour] = cube.split(' ');
        cubeMap[colour] += parseInt(number);
      });

      Object.entries(cubeMap).forEach(([colour, number]) => {
        if (number > limits[colour]) {
          isValidRow = false;
        }
      });
    });

    if (isValidRow) {
      result += parseInt(id);
    }
    // console.log('res', id, isValidRow, result);
  });

  return result;
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
