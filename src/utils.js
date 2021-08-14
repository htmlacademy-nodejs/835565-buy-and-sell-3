'use strict';

const dayjs = require(`dayjs`);
const {nanoid} = require(`nanoid`);
const {
  MAX_ID_LENGTH,
  PriceLimit,
  OfferType,
  ImgTitleIndex,
  OfferSentencesNum,
  CommentsNum,
  CommentsSentencesNum,
  CategoriesNum,
  DaysGap,
} = require(`./const`);

const getRandomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = () => {
  const randomDaysGap = getRandomNum(DaysGap.MIN, DaysGap.MAX);
  return dayjs().add(-randomDaysGap, `day`).format();
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }
  return someArray;
};

const getImgFileName = (num) => {
  return (
    num < 10
      ? `0${num}`
      : `${num}`
  );
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomNum(CommentsSentencesNum.MIN, CommentsSentencesNum.MAX)).join(` `),
  }));
};

const generateOffers = (count, {titles, descriptions, categories, comments}) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomNum(0, titles.length - 1)],
    date: getRandomDate(),
    picture: `item${getImgFileName(getRandomNum(ImgTitleIndex.MIN, ImgTitleIndex.MAX))}.jpg`,
    description: shuffle(descriptions).slice(0, getRandomNum(OfferSentencesNum.MIN, OfferSentencesNum.MAX)).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomNum(PriceLimit.MIN, PriceLimit.MAX),
    categories: shuffle(categories).slice(0, getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX)),
    comments: generateComments(getRandomNum(CommentsNum.MIN, CommentsNum.MAX), comments),
  }));
};

const getCategories = (items) => {
  const categories = items.reduce((acc, currentItem) => {
    currentItem.categories.forEach((categoryItem) => acc.add(categoryItem));
    return acc;
  }, new Set());

  return [...categories];
};

const generateCommentsForDB = (count, offerId, usersCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomNum(1, usersCount),
    offerId,
    text: shuffle(comments)
      .slice(0, getRandomNum(CommentsSentencesNum.MIN, CommentsSentencesNum.MAX))
      .join(` `),
  }))
);

const getRandomCategoriesId = (categoriesNum, categoriesCount) => {
  const categories = [];
  for (let i = 0; i < categoriesNum; i++) {
    categories.push(getRandomNum(1, categoriesCount));
  }
  return categories;
};

const generateOffersForDB = (count, {titles, descriptions, commentSentences, categoriesCount, mockUsersCount}) => {
  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomNum(0, titles.length - 1)],
    date: getRandomDate(),
    picture: `item${getImgFileName(getRandomNum(ImgTitleIndex.MIN, ImgTitleIndex.MAX))}.jpg`,
    description: shuffle(descriptions).slice(0, getRandomNum(OfferSentencesNum.MIN, OfferSentencesNum.MAX)).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomNum(PriceLimit.MIN, PriceLimit.MAX),
    categories: getRandomCategoriesId(getRandomNum(CategoriesNum.MIN, CategoriesNum.MAX), categoriesCount),
    userId: getRandomNum(1, mockUsersCount),
    comments: generateCommentsForDB(getRandomNum(CommentsNum.MIN, CommentsNum.MAX), index + 1, mockUsersCount, commentSentences),
  }));
};

const generateQueryToFillDB = ({userValues, categoryValues, offerValues, offerCategoryValues, commentValues}) => {
  return `
/* Заполнение таблицы пользователей */
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};

/* Заполнение таблицы категорий */
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE offers DISABLE TRIGGER ALL;

/* Заполнение таблицы объявлений */
INSERT INTO offers(title, date, description, type, sum, picture, user_id) VALUES
${offerValues};
ALTER TABLE offers ENABLE TRIGGER ALL;
ALTER TABLE offer_categories DISABLE TRIGGER ALL;

/* Заполнение таблицы связей объявлений и категорий */
INSERT INTO offer_categories(offer_id, category_id) VALUES
${offerCategoryValues};
ALTER TABLE offer_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;

/* Заполнение таблицы комментариев */
INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;
};

module.exports = {
  getRandomNum,
  shuffle,
  getImgFileName,
  generateOffers,
  generateComments,
  getCategories,
  generateCommentsForDB,
  generateOffersForDB,
  generateQueryToFillDB,
};
