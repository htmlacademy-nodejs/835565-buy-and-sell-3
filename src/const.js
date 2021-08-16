'use strict';

const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const DEFAULT_PORT_SERVER = 3000;
const DEFAULT_PORT_FRONT = 8080;
const FILE_NAME = `mocks.json`;
const DB_FILL_FILE_PATH = `./sql/fill-db.sql`;
const DB_QUERIES_FILE_PATH = `./sql/queries.sql`;
const FILE_PATH = `./mocks.json`;
const NOT_FOUND_MESSAGE = `NOT FOUND!`;
const MAX_ID_LENGTH = 10;
const API_PREFIX = `/api`;
const TIMEOUT = 1000;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const UPLOAD_PATH = `../upload/img/`;
const TEMPLATES_DIR = `templates`;
const MAX_UPLOAD_FILE_SIZE = 1048576;

const OFFER_TITLES_PATH = `./src/data/titles.txt`;
const OFFER_DESCRIPTIONS_PATH = `./src/data/descriptions.txt`;
const OFFER_CATEGORIES_PATH = `./src/data/categories.txt`;
const FILE_COMMENTS_PATH = `./src/data/comments.txt`;

const defaultOfferKeys = [`title`, `picture`, `description`, `type`, `sum`, `categories`];
const defaultCommentKeys = [`text`];

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

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

const DaysGap = {
  MIN: 1,
  MAX: 14,
};

const CategoriesNum = {
  MIN: 1,
  MAX: 3
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
  MIN: 2,
  MAX: 5,
};

const CommentsSentencesNum = {
  MIN: 1,
  MAX: 3,
};

module.exports = {
  DEFAULT_COUNT,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DEFAULT_PORT_SERVER,
  DEFAULT_PORT_FRONT,
  FILE_NAME,
  DB_FILL_FILE_PATH,
  DB_QUERIES_FILE_PATH,
  FILE_PATH,
  NOT_FOUND_MESSAGE,
  MAX_ID_LENGTH,
  API_PREFIX,
  TIMEOUT,
  PUBLIC_DIR,
  UPLOAD_DIR,
  UPLOAD_PATH,
  TEMPLATES_DIR,
  MAX_UPLOAD_FILE_SIZE,
  OFFER_TITLES_PATH,
  OFFER_DESCRIPTIONS_PATH,
  OFFER_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  defaultOfferKeys,
  defaultCommentKeys,
  url,
  HttpCode,
  ExitCode,
  DaysGap,
  PriceLimit,
  OfferType,
  ImgTitleIndex,
  OfferSentencesNum,
  CategoriesNum,
  CommentsNum,
  CommentsSentencesNum,
  Env,
};
