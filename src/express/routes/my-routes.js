'use strict';

const {Router} = require(`express`);
const {OFFERS_PER_PAGE} = require(`../../const`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({needComments: true});
  res.render(`comments`, {offers});
});

myRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;

  const offset = (page - 1) * OFFERS_PER_PAGE;
  const limit = OFFERS_PER_PAGE;

  const [{current: {count, offers}}, categories] = await Promise.all([
    await api.getOffers({limit, offset}),
    await api.getCategories()
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  const options = {
    offers,
    page,
    totalPages,
    categories
  };
  res.render(`my-offers`, {...options});
});

module.exports = myRouter;
