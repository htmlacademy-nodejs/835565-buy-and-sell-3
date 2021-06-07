'use strict';

const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const CATEGORIES_MIN_NUM = 1;
const DEFAULT_PORT = 3000;
const FILE_NAME = `mocks.json`;
const FILE_PATH = `./src/service/mocks.json`;
const NOT_FOUND_MESSAGE = `NOT FOUND!`;
const MAX_ID_LENGTH = 10;
const API_PREFIX = `/api`;

const defaultOfferKeys = [`title`, `picture`, `description`, `type`, `sum`, `categories`];
const defaultCommentKeys = [`text`];

const url = {
  ROOT: `/`,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const OfferSentencesNum = {
  MIN: 1,
  MAX: 5
};

const PriceLimit = {
  MIN: 1000,
  MAX: 100000,
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const ImgTitleIndex = {
  MIN: 1,
  MAX: 16,
};

const CommentsNum = {
  MIN: 1,
  MAX: 4,
};

const CommentsSentencesNum = {
  MIN: 1,
  MAX: 3,
};

module.exports = {
  DEFAULT_COUNT,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  CATEGORIES_MIN_NUM,
  DEFAULT_PORT,
  FILE_NAME,
  FILE_PATH,
  NOT_FOUND_MESSAGE,
  MAX_ID_LENGTH,
  API_PREFIX,
  defaultOfferKeys,
  defaultCommentKeys,
  url,
  HttpCode,
  ExitCode,
  PriceLimit,
  OfferType,
  ImgTitleIndex,
  OfferSentencesNum,
  CommentsNum,
  CommentsSentencesNum,
};
