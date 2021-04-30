'use strict';

const {
  getRandomNum,
  shuffle,
  getImgFileName
} = require(`./utils`);

const {
  DEFAULT_COUNT,
  FILE_NAME,
  CATEGORIES_MIN_NUM,
  PriceLimit,
  OfferType,
  ImgTitleIndex,
  OfferSentencesNum,
  ExitCode
} = require(`./const`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const OFFER_TITLES_PATH = `../data/titles.txt`;
const OFFER_DESCRIPTIONS_PATH = `../data/descriptions.txt`;
const OFFER_CATEGORIES_PATH = `../data/categories.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

const generateOffers = (count, titles, descriptions, categories) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomNum(0, titles.length - 1)],
    picture: `item${getImgFileName(getRandomNum(ImgTitleIndex.MIN, ImgTitleIndex.MAX))}.jpg`,
    description: shuffle(descriptions).slice(0, getRandomNum(OfferSentencesNum.MIN, OfferSentencesNum.MAX)).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomNum(PriceLimit.MIN, PriceLimit.MAX),
    category: shuffle(categories).slice(0, getRandomNum(CATEGORIES_MIN_NUM, categories.length - 1))
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(OFFER_TITLES_PATH);
    const descriptions = await readContent(OFFER_DESCRIPTIONS_PATH);
    const categories = await readContent(OFFER_CATEGORIES_PATH);

    const [count] = args;
    const offersCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = JSON.stringify(generateOffers(offersCount, titles, descriptions, categories));

    try {
      await fs.writeFile(FILE_NAME, offers);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
