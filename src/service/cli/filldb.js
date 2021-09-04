'use strict';

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

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

    const {Category, Offer} = defineModels(sequelize);

    await sequelize.sync({force: true});

    const titles = await readContent(OFFER_TITLES_PATH);
    const descriptions = await readContent(OFFER_DESCRIPTIONS_PATH);
    const categories = await readContent(OFFER_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({name: item}))
    );

    const options = {
      titles,
      descriptions,
      commentSentences,
      categories: categoryModels,
      mockUsersCount: mockUsers.length,
    };

    const offers = generateOffersForDB(offersCount, options);
    const offerPromises = offers.map(async (offer) => {
      const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
      await offerModel.addCategories(offer.categories);
    });
    await Promise.all(offerPromises);
  }
};
