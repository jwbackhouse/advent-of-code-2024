import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4b(dataPath?: string) {
  const data = await readData(dataPath);

  let tally: Record<string, number> = {};

  data.forEach((row, index) => {
    tally[index] = tally[index] ? ++tally[index] : 1;

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

    const nextIndex = index + 1;
    for (let i = nextIndex; i < correctGuesses + nextIndex; i++) {
      const additionalTally = tally[index] || 0;
      const existingTally = tally[i];
      tally[i] = existingTally
        ? existingTally + additionalTally
        : additionalTally;
    }
  });
  const result = Object.values(tally).reduce((acc, curr) => acc + curr, 0);

  return result;
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
