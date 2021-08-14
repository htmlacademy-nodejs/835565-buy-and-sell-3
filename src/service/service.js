'use strict';

const {MocksGenerator} = require(`./cli`);

const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
} = require(`../const`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !MocksGenerator[userCommand]) {
  MocksGenerator[DEFAULT_COMMAND].run();
}

MocksGenerator[userCommand].run(userArguments.slice(1));
