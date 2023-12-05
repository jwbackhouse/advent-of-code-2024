import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);

  let result = 0;

  data.forEach((row) => {
    const [id, gameData] = row.split(': ');
    const [winningNumStr, guessStr] = gameData.split(' | ');

    const winningNums = winningNumStr.split(' ').filter(Boolean);
    const guesses = guessStr.split(' ').filter(Boolean);

    const winMap = {};
    let correctGuesses = 0;
    winningNums.forEach((num) => {
      winMap[num] = 1;
    });

    guesses.forEach((guess) => {
      correctGuesses += winMap[guess] ?? 0;
    });

    const score = correctGuesses ? 1 * 2 ** (correctGuesses - 1) : 0;
    result += score;
  });

  return result;
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
