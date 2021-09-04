'use strict';

const {nanoid} = require(`nanoid`);

const {
  CommentsSentencesNum,
  ImgTitleIndex,
  OfferSentencesNum,
  PriceLimit,
  CategoriesNum,
  CommentsNum,
  OfferType,
  MAX_ID_LENGTH
} = require(`../const`);

const {
  shuffle,
  getRandomNum,
  getImgFileName,
  getRandomDate,
  getRandomSubarray
} = require(`./utils-common`);


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

const generateOffersForDB = (count, {titles, descriptions, commentSentences, categories, mockUsersCount}) => {
  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomNum(0, titles.length - 1)],
    date: getRandomDate(),
    picture: `item${getImgFileName(getRandomNum(ImgTitleIndex.MIN, ImgTitleIndex.MAX))}.jpg`,
    description: shuffle(descriptions).slice(0, getRandomNum(OfferSentencesNum.MIN, OfferSentencesNum.MAX)).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomNum(PriceLimit.MIN, PriceLimit.MAX),
    categories: getRandomSubarray(categories),
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

const generateQueryToGetDataFromDB = ({
  offerId,
  newCommentsLimit,
  commentsOfferId,
  offersType, offersLimit,
  updatedOfferId,
  updatedTitle
}) => {
  return `
/* Список всех категорий */
SELECT * FROM categories;

/* Список непустых категорий */
SELECT id, name FROM categories
  JOIN offer_categories
  ON id = category_id
  GROUP BY id;

/* Категории с количеством объявлений */
SELECT id, name, count(offer_id) FROM categories
  LEFT JOIN offer_categories
  ON id = category_id
  GROUP BY id;

/* Список объявлений, сначала свежие */
SELECT offers.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
  GROUP BY offers.id, users.id
  ORDER BY offers.date DESC;

/* Детальная информация по объявлению */
SELECT offers.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
WHERE offers.id = ${offerId}
  GROUP BY offers.id, users.id;

/* Свежие комментарии */
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.date DESC
  LIMIT ${newCommentsLimit};

/* Комментарии к объявлению */
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = ${commentsOfferId}
  ORDER BY comments.date DESC;

/* Объявления о покупке */
SELECT * FROM offers
WHERE type = '${offersType.toUpperCase()}'
  LIMIT ${offersLimit};

/* Обновить заголовок */
UPDATE offers
SET title = '${updatedTitle}'
WHERE id = ${updatedOfferId}`;
};

module.exports = {
  generateOffers,
  getCategories,
  generateOffersForDB,
  generateQueryToFillDB,
  generateQueryToGetDataFromDB,
};
