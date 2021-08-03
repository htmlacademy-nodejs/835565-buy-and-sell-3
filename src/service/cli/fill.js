'use strict';

const {
  generateOffersForDB,
  generateQueryToFillDB,
} = require(`../../utils`);

const {
  DEFAULT_COUNT,
  DB_FILE_PATH,
  OFFER_TITLES_PATH,
  OFFER_DESCRIPTIONS_PATH,
  OFFER_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
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

    const values = {
      userValues: mockUsers.map(
          ({email, passwordHash, firstName, lastName, avatar}) =>
            `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
      ).join(`,\n`),

      categoryValues: categories.map((name) => `('${name}')`).join(`,\n`),

      offerValues: offers.map(
          ({title, description, type, sum, picture, userId}) =>
            `('${title}', '${description}', '${type}', ${sum}, '${picture}', ${userId})`
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

    const content = generateQueryToFillDB(values);

    try {
      await fs.writeFile(DB_FILE_PATH, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
