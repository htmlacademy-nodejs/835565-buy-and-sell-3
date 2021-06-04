'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const express = require(`express`);
const {Router} = require(`express`);

const {
  DEFAULT_PORT,
  FILE_PATH,
  NOT_FOUND_MESSAGE,
  HttpCode,
} = require(`../const`);

const app = express();
const offersRouter = new Router();

app.use(express.json());
app.use(`/offers`, offersRouter);

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    offersRouter.get(`/`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILE_PATH);
        const mockData = JSON.parse(fileContent);
        res.json(mockData);
      } catch (error) {
        res.status(HttpCode.SERVER_ERROR).send(error);
      }
    });

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(NOT_FOUND_MESSAGE);
    });

    app.listen(port, (error) => {
      if (error) {
        return console.error(chalk.red(`Ошибка при создании сервера`, error));
      }
      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  }
};
