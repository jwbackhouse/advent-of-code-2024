import { readData } from '../../shared.ts';
import chalk from 'chalk';

const playingCardsRankingMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2,
};

const HIGH_CARD = 0;
const PAIR = 10;
const TWO_PAIR = 20;
const THREE_OF_KIND = 30;
const FULL_HOUSE = 40;
const FOUR_OF_KIND = 50;
const FIVE_OF_KIND = 60;

const getHandScore = (hand: Array<string>) => {
  let countMap: Record<string, number> = {};

  hand.forEach((card) => {
    countMap[card] = countMap[card] ? countMap[card] + 1 : 1;
  });
  const values = Object.values(countMap);
  const maxCount = Math.max(...values);

  if (maxCount === 3) {
    if (values.includes(2)) {
      return FULL_HOUSE;
    } else {
      return THREE_OF_KIND;
    }
  }
  if (maxCount === 2) {
    if (values.length === 3) {
      const score = TWO_PAIR;
      return score;
    } else {
      return PAIR;
    }
  }
  if (maxCount === 4) {
    return FOUR_OF_KIND;
  }
  if (maxCount === 5) {
    return FIVE_OF_KIND;
  }

  return HIGH_CARD;
};

const sortHands = (handAdetails: string, handBdetails: string) => {
  const [handA, _bidA] = handAdetails.split(' ');
  const [handB, _bidB] = handBdetails.split(' ');

  const handAArray = handA.split('');
  const handBArray = handB.split('');

  const scoreA = getHandScore(handAArray);
  const scoreB = getHandScore(handBArray);

  if (scoreA !== scoreB) {
    return scoreA - scoreB;
  }

  let tieBreaker = 0;
  for (let i = 0; i < handAArray.length; i++) {
    const cardAScore = +playingCardsRankingMap[handAArray[i]];
    const cardBScore = +playingCardsRankingMap[handBArray[i]];
    if (cardBScore !== cardAScore) {
      tieBreaker = cardAScore - cardBScore;
      break;
    }
  }

  return tieBreaker;
};

export async function day7a(dataPath?: string) {
  const data = await readData(dataPath);

  const sortedRows = data.sort(sortHands);

  let winnings = 0;
  sortedRows.forEach((row, index) => {
    const bid = row.split(' ')[1];
    winnings += +bid * (index + 1);
  });

  return winnings;
}

const answer = await day7a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
