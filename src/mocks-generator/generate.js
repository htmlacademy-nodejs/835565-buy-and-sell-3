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
  OFFER_TITLES,
  OFFER_DESCRIPTIONS,
  CATEGORIES,
  PriceLimit,
  OfferType,
  ImgTitleIndex,
  OfferSentencesNum,
  ExitCode
} = require(`./const`);

const fs = require(`fs`);
const chalk = require(`chalk`);

const generateOffers = (count) => {
  return Array(count).fill({}).map(() => ({
    title: OFFER_TITLES[getRandomNum(0, OFFER_TITLES.length - 1)],
    picture: `item${getImgFileName(getRandomNum(ImgTitleIndex.MIN, ImgTitleIndex.MAX))}.jpg`,
    description: shuffle(OFFER_DESCRIPTIONS).slice(0, getRandomNum(OfferSentencesNum.MIN, OfferSentencesNum.MAX)).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomNum(PriceLimit.MIN, PriceLimit.MAX),
    category: shuffle(CATEGORIES).slice(0, getRandomNum(CATEGORIES_MIN_NUM, CATEGORIES.length - 1))
  }));
};

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const offersCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = JSON.stringify(generateOffers(offersCount));

    fs.writeFile(FILE_NAME, offers, (err) => {
      return (
        err
          ? console.error(chalk.red(`Can't write data to file...`)) && process.exit(ExitCode.ERROR)
          : console.info(chalk.green(`Operation success. File created.`)) && process.exit(ExitCode.SUCCESS)
      );
    });
  }
};
