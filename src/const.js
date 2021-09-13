'use strict';

// Cli
const DEFAULT_COUNT = 1;
const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const DEFAULT_PORT_SERVER = 3000;
const API_PREFIX = `/api`;
const NOT_FOUND_MESSAGE = `NOT FOUND!`;
const DESCRIPTION_CHAR_LENGTH = 1000;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

// File names and paths
const FILE_NAME = `mocks.json`;
const DB_FILL_FILE_PATH = `./sql/fill-db.sql`;
const DB_QUERIES_FILE_PATH = `./sql/queries.sql`;
const FILE_PATH = `./mocks.json`;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const UPLOAD_PATH = `../upload/img/`;
const LOG_FILE_PATH = `../../../logs/api.log`;
const TEMPLATES_DIR = `templates`;
const OFFER_TITLES_PATH = `./src/data/titles.txt`;
const OFFER_DESCRIPTIONS_PATH = `./src/data/descriptions.txt`;
const OFFER_CATEGORIES_PATH = `./src/data/categories.txt`;
const FILE_COMMENTS_PATH = `./src/data/comments.txt`;

// Front
const DEFAULT_PORT_FRONT = 8080;
const MAX_ID_LENGTH = 10;
const TIMEOUT = 1000;
const MAX_UPLOAD_FILE_SIZE = 1048576;
const DATE_FORMAT = `DD MMMM YYYY`;

const defaultOfferKeys = [`title`, `createdAt`, `picture`, `description`, `type`, `sum`, `categories`];
const defaultCommentKeys = [`text`, `createdAt`];

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Mocks
const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf95`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf93`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

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
  // Cli
  DEFAULT_COUNT,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DEFAULT_PORT_SERVER,
  API_PREFIX,
  NOT_FOUND_MESSAGE,
  DESCRIPTION_CHAR_LENGTH,
  ExitCode,
  Env,

  // File names and paths
  FILE_NAME,
  DB_FILL_FILE_PATH,
  DB_QUERIES_FILE_PATH,
  FILE_PATH,
  PUBLIC_DIR,
  UPLOAD_DIR,
  UPLOAD_PATH,
  LOG_FILE_PATH,
  TEMPLATES_DIR,
  OFFER_TITLES_PATH,
  OFFER_DESCRIPTIONS_PATH,
  OFFER_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,

  // Front
  DEFAULT_PORT_FRONT,
  MAX_ID_LENGTH,
  TIMEOUT,
  MAX_UPLOAD_FILE_SIZE,
  DATE_FORMAT,
  defaultOfferKeys,
  defaultCommentKeys,
  HttpCode,

  // Mocks
  mockUsers,
  DaysGap,
  PriceLimit,
  OfferType,
  ImgTitleIndex,
  OfferSentencesNum,
  CategoriesNum,
  CommentsNum,
  CommentsSentencesNum,
};
