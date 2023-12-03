import { readData } from '../../shared.ts';
import chalk from 'chalk';

const limits = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);

  let result = 0;

  data.forEach((row) => {
    const [gameId, sets] = row.split(': ');
    const [_, id] = gameId.split(' ');
    const turns = sets.split('; ');

    let cubeMap: Record<string, number> = {
      red: 0,
      green: 0,
      blue: 0,
    };
    turns.forEach((turn) => {
      const cubes = turn.split(', ');

      cubes.forEach((cube) => {
        const [number, colour] = cube.split(' ');
        if (cubeMap[colour] < parseInt(number)) {
          cubeMap[colour] = parseInt(number);
        }
      });
    });
    console.log(cubeMap);

    const power = Object.values(cubeMap).reduce((acc, curr) => acc * curr, 1);
    console.log('power: ', power);
    result += power;
  });

  return result;
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
