'use strict';

const {nanoid} = require(`nanoid`);
const {
  CATEGORIES_MIN_NUM,
  MAX_ID_LENGTH,
  PriceLimit,
  OfferType,
  ImgTitleIndex,
  OfferSentencesNum,
  CommentsNum,
  CommentsSentencesNum,
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
    categories: shuffle(categories).slice(0, getRandomNum(CATEGORIES_MIN_NUM, categories.length - 1)),
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

module.exports = {
  getRandomNum,
  shuffle,
  getImgFileName,
  generateOffers,
  generateComments,
  getCategories,
};
