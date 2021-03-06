'use strict';

const {readContent} = require(`../../utils/utils-common`);
const {generateOffers} = require(`../../utils/utils-data`);

const {
  DEFAULT_COUNT,
  FILE_NAME,
  OFFER_TITLES_PATH,
  OFFER_DESCRIPTIONS_PATH,
  OFFER_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  ExitCode,
} = require(`../../const`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

module.exports = {
  name: `--generate`,
  async run(args) {

    const options = {
      titles: await readContent(OFFER_TITLES_PATH),
      descriptions: await readContent(OFFER_DESCRIPTIONS_PATH),
      categories: await readContent(OFFER_CATEGORIES_PATH),
      comments: await readContent(FILE_COMMENTS_PATH),
    };

    const [count] = args;
    const offersCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = JSON.stringify(generateOffers(offersCount, options));

    try {
      await fs.writeFile(FILE_NAME, offers);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit();
    } catch (error) {
      console.error(chalk.red(`Can't write data to file. ${error.message}`));
      process.exit(ExitCode.ERROR);
    }
  }
};
