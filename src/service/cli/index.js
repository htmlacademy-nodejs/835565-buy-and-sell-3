'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);
const filldb = require(`./filldb`);

const MocksGenerator = {
  [generate.name]: generate,
  [version.name]: version,
  [help.name]: help,
  [server.name]: server,
  [fill.name]: fill,
  [filldb.name]: filldb,
};

module.exports = {MocksGenerator};
