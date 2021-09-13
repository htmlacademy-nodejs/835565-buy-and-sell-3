'use strict';

const {Router} = require(`express`);
const category = require(`./category`);
const offer = require(`./offer`);
const search = require(`./search`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const app = new Router();

const launchApp = async () => {
  defineModels(sequelize);

  try {
    return await Promise.all([
      category(app, new CategoryService(sequelize)),
      search(app, new SearchService(sequelize)),
      offer(app, new OfferService(sequelize), new CommentService(sequelize))
    ]);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

launchApp();

module.exports = app;
