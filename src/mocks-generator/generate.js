'use strict';

const {
  generateOffers,
} = require(`./utils`);

const {
  DEFAULT_COUNT,
  FILE_NAME,
  ExitCode,
} = require(`./const`);

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const OFFER_TITLES_PATH = `../data/titles.txt`;
const OFFER_DESCRIPTIONS_PATH = `../data/descriptions.txt`;
const OFFER_CATEGORIES_PATH = `../data/categories.txt`;
const FILE_COMMENTS_PATH = `../data/comments.txt`;

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
  name: `--generate`,
  async run(args) {
    const titles = await readContent(OFFER_TITLES_PATH);
    const descriptions = await readContent(OFFER_DESCRIPTIONS_PATH);
    const categories = await readContent(OFFER_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const offersCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const offers = JSON.stringify(generateOffers(offersCount, titles, descriptions, categories, comments));

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
