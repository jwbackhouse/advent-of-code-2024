import { it } from 'node:test';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

type OPERATOR = '-' | '=';

const boxes: Array<Array<string>> = [];

const parseItem = (
  item: string
): { label: string; operator: OPERATOR; focusLength: number } => {
  const subtractIndex = item.indexOf('-');
  const equalIndex = item.indexOf('=');

  if (subtractIndex > -1) {
    return {
      label: item.substring(0, subtractIndex),
      operator: '-',
      focusLength: parseInt(item.substring(subtractIndex + 1)),
    };
  }

  if (equalIndex > -1) {
    return {
      label: item.substring(0, equalIndex),
      operator: '=',
      focusLength: parseInt(item.substring(equalIndex + 1)),
    };
  }

  throw new Error('Invalid item');
};

const getBoxNumber = (item: string) => {
  let answer = 0;

  for (let i = 0; i < item.length; i++) {
    const charCode = item.charCodeAt(i);
    answer += charCode;
    const multiplied = answer * 17;
    const result = multiplied % 256;
    answer = result;
  }

  return answer;
};

const checkIsSameLabel = (label: string) => (item: string) =>
  item.split(' ')[0] === label;

const processSubtract = (boxNumber: number, label: string) => {
  const box = boxes[boxNumber];
  if (!box) {
    return;
  }

  const existingLensIndex = box.findIndex(checkIsSameLabel(label));
  if (existingLensIndex > -1) {
    box.splice(existingLensIndex, 1);
  }
};

const processEqual = (
  boxNumber: number,
  label: string,
  focusLength: number
) => {
  const box = boxes[boxNumber];
  const newItem = `${label} ${focusLength}`;

  if (!box) {
    boxes[boxNumber] = [newItem];
    return;
  }

  const existingLensIndex = box.findIndex(checkIsSameLabel(label));
  if (existingLensIndex > -1) {
    box.splice(existingLensIndex, 1, newItem);
    return;
  }

  boxes[boxNumber] = [...box, newItem];
};

const processItem = ({
  boxNumber,
  label,
  operator,
  focusLength,
}: {
  boxNumber: number;
  label: string;
  operator: OPERATOR;
  focusLength: number;
}) => {
  if (operator === '-') {
    processSubtract(boxNumber, label);
  } else {
    processEqual(boxNumber, label, focusLength);
  }
};

const calculateResult = (boxes: Array<Array<string>>) => {
  let total = 0;

  boxes.forEach((box, boxIndex) => {
    const boxNumber = boxIndex + 1;
    box.forEach((item, itemIndex) => {
      const focalLength = parseInt(item.split(' ')[1]);
      const res = boxNumber * focalLength * (itemIndex + 1);
      total += res;
    });
  });

  return total;
};

export async function day15b(dataPath?: string) {
  const data = await readData(dataPath);
  const items = data[0].split(',');

  items.forEach((item) => {
    const { label, operator, focusLength } = parseItem(item);
    const boxNumber = getBoxNumber(label);

    processItem({ boxNumber, label, operator, focusLength });
  });

  return calculateResult(boxes);
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
