'use strict';

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
} = require(`./const`);

const getRandomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

const generateOffersForDB = (count, {titles, descriptions, commentSentences, categoriesCount, mockUsersCount}) => {
  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomNum(0, titles.length - 1)],
    picture: `item${getImgFileName(getRandomNum(ImgTitleIndex.MIN, ImgTitleIndex.MAX))}.jpg`,
    description: shuffle(descriptions).slice(0, getRandomNum(OfferSentencesNum.MIN, OfferSentencesNum.MAX)).join(` `),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomNum(PriceLimit.MIN, PriceLimit.MAX),
    category: [getRandomNum(1, categoriesCount)],
    userId: getRandomNum(1, mockUsersCount),
    comments: generateCommentsForDB(getRandomNum(CommentsNum.MIN, CommentsNum.MAX), index + 1, mockUsersCount, commentSentences),
  }));
};

const generateQueryToFillDB = ({userValues, categoryValues, offerValues, offerCategoryValues, commentValues}) => {
  return `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE offers DISABLE TRIGGER ALL;
INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
${offerValues};
ALTER TABLE offers ENABLE TRIGGER ALL;
ALTER TABLE offer_categories DISABLE TRIGGER ALL;
INSERT INTO offer_categories(offer_id, category_id) VALUES
${offerCategoryValues};
ALTER TABLE offer_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
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
