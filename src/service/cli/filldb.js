'use strict';

const sequelize = require(`../lib/sequelize`);

const {getLogger} = require(`../lib/logger`);
const {readContent} = require(`../../utils/utils-common`);
const {generateOffersForDB} = require(`../../utils/utils-data`);

const {
  DEFAULT_COUNT,
  OFFER_TITLES_PATH,
  OFFER_DESCRIPTIONS_PATH,
  OFFER_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  ExitCode,
  mockUsers
} = require(`../../const`);
const initDB = require(`../lib/init-db`);

const logger = getLogger({name: `fill-db`});

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [count] = args;
    const offersCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const categories = await readContent(OFFER_CATEGORIES_PATH);

    const options = {
      titles: await readContent(OFFER_TITLES_PATH),
      descriptions: await readContent(OFFER_DESCRIPTIONS_PATH),
      commentSentences: await readContent(FILE_COMMENTS_PATH),
      categories,
      mockUsersCount: mockUsers.length,
    };

    const offers = generateOffersForDB(offersCount, options);

    initDB(sequelize, {offers, categories});
  }
};
