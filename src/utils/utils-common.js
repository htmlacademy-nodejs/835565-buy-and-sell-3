'use strict';

const dayjs = require(`dayjs`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  DaysGap,
} = require(`../const`);

const getRandomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = () => {
  const randomDaysGap = getRandomNum(DaysGap.MIN, DaysGap.MAX);
  return dayjs().add(-randomDaysGap, `day`).format();
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }
  return someArray;
};

const getImgFileName = (num) => {
  return (
    num < 10
      ? `0${num}`
      : `${num}`
  );
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomNum(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomNum(0, items.length - 1), 1
        )
    );
  }
  return result;
};

module.exports = {
  getRandomNum,
  getRandomDate,
  shuffle,
  getImgFileName,
  readContent,
  getRandomSubarray,
};
