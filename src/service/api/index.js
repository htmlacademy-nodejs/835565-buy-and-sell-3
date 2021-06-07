'use strict';

const {Router} = require(`express`);
const category = require(`./category`);
const offer = require(`./offer`);
const search = require(`./search`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

const launchApp = async () => {
  let mockData = null;

  try {
    mockData = await getMockData();

    category(app, new CategoryService(mockData));
    search(app, new SearchService(mockData));
    offer(app, new OfferService(mockData), new CommentService());
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }

  return Promise.resolve(mockData);
};

launchApp();

module.exports = app;
