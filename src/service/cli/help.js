'use strict';

const chalk = require(`chalk`);
const version = require(`./version`);
const generate = require(`./generate`);
const fill = require(`./fill`);
const fillDB = require(`./filldb`);
const server = require(`./server`);

const moduleName = `--help`;
const helpText = `
Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    service.js <command>

    Команды:
    ${version.name}:            выводит номер версии
    ${moduleName}:               печатает этот текст
    ${generate.name} <count>    формирует файл mocks.json
    ${fill.name} <count>        формирует файлы sql запросов
    ${fillDB.name} <count>      генерирует данные и заполняет БД
    ${server.name}              запускает http-сервер
`;

module.exports = {
  name: moduleName,
  run: () => console.info(chalk.gray(helpText))
};
