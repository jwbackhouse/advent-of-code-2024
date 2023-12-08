import { readData } from '../../shared.ts';
import chalk from 'chalk';

const playingCardsRankingMap = {
  A: 14,
  K: 13,
  Q: 12,
  J: 1,
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
const PAIR = 1000;
const TWO_PAIR = 2000;
const THREE_OF_KIND = 3000;
const FULL_HOUSE = 4000;
const FOUR_OF_KIND = 5000;
const FIVE_OF_KIND = 6000;

const jokerUpgradeMap = {
  [HIGH_CARD]: PAIR,
  [PAIR]: THREE_OF_KIND,
  [TWO_PAIR]: FULL_HOUSE,
  [THREE_OF_KIND]: FOUR_OF_KIND,
  [FULL_HOUSE]: FOUR_OF_KIND, // not possible
  [FOUR_OF_KIND]: FIVE_OF_KIND,
  [FIVE_OF_KIND]: FIVE_OF_KIND,
};

const upgradeHand = (score: number, jokerCount: number) => {
  if (jokerCount === 0) {
    return score;
  }
  let newScore = jokerUpgradeMap[score];
  if (newScore === FOUR_OF_KIND) {
    newScore;
  }
  return upgradeHand(newScore, jokerCount - 1);
};

const getHandScore = (hand: Array<string>) => {
  let countMap: Record<string, number> = {};
  let jokerCount = 0;

  hand.forEach((card) => {
    if (card !== 'J') {
      countMap[card] = countMap[card] ? countMap[card] + 1 : 1;
    } else {
      jokerCount++;
    }
  });
  const values = Object.values(countMap);
  const maxCount = Math.max(...values);

  if (maxCount === 3) {
    if (values.includes(2)) {
      return upgradeHand(FULL_HOUSE, jokerCount);
    } else {
      return upgradeHand(THREE_OF_KIND, jokerCount);
    }
  }
  if (maxCount === 2) {
    const valuesContains2Twice =
      values.filter((value) => value === 2).length === 2;
    if (valuesContains2Twice) {
      return upgradeHand(TWO_PAIR, jokerCount);
    } else {
      return upgradeHand(PAIR, jokerCount);
    }
  }
  if (maxCount === 4) {
    return upgradeHand(FOUR_OF_KIND, jokerCount);
  }
  if (maxCount === 5) {
    return upgradeHand(FIVE_OF_KIND, jokerCount);
  }

  return upgradeHand(HIGH_CARD, jokerCount);
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

export async function day7b(dataPath?: string) {
  const data = await readData(dataPath);

  const sortedRows = data.sort(sortHands);

  let winnings = 0;
  sortedRows.forEach((row, index) => {
    const bid = row.split(' ')[1];
    winnings += +bid * (index + 1);
  });

  return winnings;
}

const answer = await day7b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
