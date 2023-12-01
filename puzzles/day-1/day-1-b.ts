import { readData } from '../../shared.ts';
import chalk from 'chalk';

const words = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);

  let result = 0;

  data.forEach((row) => {
    let firstNumber: number;
    let lastNumber: number;
    let firstIndex = -1;
    let lastIndex = -1;

    const processResult = (number, index) => {
      if (firstIndex === -1) {
        firstNumber = number;
        firstIndex = index;
      }
      if (lastIndex === -1) {
        lastNumber = number;
        lastIndex = index;
      }
      if (index < firstIndex) {
        firstNumber = number;
        firstIndex = index;
      }
      if (index > lastIndex) {
        lastNumber = number;
        lastIndex = index;
      }
    };

    const findWord = (word, startingIndex = 0) => {
      const index = row.indexOf(word, startingIndex);
      if (index !== -1) {
        processResult(words[word], index);
        findWord(word, index + 1);
      }
    };

    const parsedNums = row.split('').map((char) => Number(char));
    parsedNums.forEach((num, index) => {
      if (!isNaN(num)) {
        processResult(num, index);
      }
    });

    const wordKeys = Object.keys(words);
    wordKeys.forEach((word) => {
      findWord(word);
    });

    const rowResult = `${firstNumber}${lastNumber}`;
    result += +rowResult;
  });
  return result;
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
