'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({comments: true});
  res.render(`comments`, {offers: offers.slice(0, 3)});
});

myRouter.get(`/`, async (req, res) => {
  const [offers, categories] = await Promise.all([
    await api.getOffers(),
    await api.getCategories()
  ]);
  res.render(`my-tickets`, {offers, categories});
});

module.exports = myRouter;
