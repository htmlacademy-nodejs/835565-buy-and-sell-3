'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);
const server = require(`./server`);

const MocksGenerator = {
  [generate.name]: generate,
  [version.name]: version,
  [help.name]: help,
  [server.name]: server,
};

module.exports = {MocksGenerator};
