'use strict';

const {
  generateOffersForDB,
  generateQueryToFillDB,
  generateQueryToGetDataFromDB,
  getRandomNum,
} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  DB_FILL_FILE_PATH,
  OFFER_TITLES_PATH,
  OFFER_DESCRIPTIONS_PATH,
  OFFER_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  DB_QUERIES_FILE_PATH,
  ExitCode,
} = require(`../../const`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf95`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf93`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

module.exports = {
  name: `--fill`,
  async run(args) {

    const titles = await readContent(OFFER_TITLES_PATH);
    const descriptions = await readContent(OFFER_DESCRIPTIONS_PATH);
    const categories = await readContent(OFFER_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const options = {
      titles,
      descriptions,
      commentSentences,
      categoriesCount: categories.length,
      mockUsersCount: mockUsers.length,
    };

    const [count] = args;
    const offersCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const offers = generateOffersForDB(offersCount, options);
    const comments = offers.flatMap((offer) => offer.comments);
    const offerCategories = offers.reduce((acc, currentOffer, index) => {
      currentOffer.categories.forEach((categoryId) => acc.push({offerId: index + 1, categoryId}));
      return acc;
    }, []);

    const valuesToFill = {
      userValues: mockUsers.map(
          ({email, passwordHash, firstName, lastName, avatar}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      ).join(`,\n`),

      categoryValues: categories.map((name) => `('${name}')`).join(`,\n`),

      offerValues: offers.map(
          ({title, date, description, type, sum, picture, userId}) =>
            `('${title}', '${date}', '${description}', '${type}', ${sum}, '${picture}', ${userId})`
      ).join(`,\n`),

      offerCategoryValues: offerCategories.map(
          ({offerId, categoryId}) =>
            `(${offerId}, ${categoryId})`
      ).join(`,\n`),

      commentValues: comments.map(
          ({text, userId, offerId}) =>
            `('${text}', ${userId}, ${offerId})`
      ).join(`,\n`),
    };

    const valuesToGetData = {
      offerId: getRandomNum(1, offers.length),
      newCommentsLimit: 5,
      commentsOfferId: getRandomNum(1, offers.length),
      offersType: `OFFER`,
      offersLimit: 2,
      updatedTitle: `New Title`,
      updatedOfferId: getRandomNum(1, offers.length),
    };

    const contentToFill = generateQueryToFillDB(valuesToFill);

    const contentToGetData = generateQueryToGetDataFromDB(valuesToGetData);

    try {
      await fs.writeFile(DB_FILL_FILE_PATH, contentToFill);
      await fs.writeFile(DB_QUERIES_FILE_PATH, contentToGetData);
      console.info(chalk.green(`Operation success. Files created.`));
      process.exit();
    } catch (error) {
      console.error(chalk.red(`Can't write data to files. ${error.message}`));
      process.exit(ExitCode.ERROR);
    }
  }
};
