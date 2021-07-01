'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`comments`, {offers: offers.slice(0, 3)});
});

myRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`my-tickets`, {offers});
});

module.exports = myRouter;
