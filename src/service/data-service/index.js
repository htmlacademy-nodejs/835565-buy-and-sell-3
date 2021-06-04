'use strict';

const CategoryService = require(`./category-service`);
const SearchService = require(`./search-service`);
const OfferService = require(`./offer-service`);
const CommentService = require(`./comment-service`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  OfferService,
};
