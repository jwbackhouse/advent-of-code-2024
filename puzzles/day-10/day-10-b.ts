import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day10b(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));

// recreate full map with path vs non-path items
// starting at the second row with a path item
//... find first column without a path item
// iterate through neighbours until you find a path item
// if that path item is anything except - / |, go 'through the gap' (includes diagonals)
// continue until you reach the min/max row/column of the path map
// if you can't find a way out, add number to total
// nb -/| always stop you
// direction you hit letters dictates whether you can squeeze through the gap
