'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);

const mainRouter = new Router();
const logger = getLogger({name: `front-api`});

mainRouter.get(`/`, async (req, res) => {
  const [offers, categories] = await Promise.all([
    await api.getOffers(),
    await api.getCategories(true)
  ]);
  res.render(`main`, {offers, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));

mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);
    res.render(`search-result`, {
      results
    });
  } catch (error) {
    try {
      const offers = await api.getOffers();
      res.render(`search-result-empty.pug`, {
        results: [],
        offers
      });
    } catch (err) {
      logger.error(`Internal server error occured: ${err.message}`);
      res.render(`errors/500`);
    }
  }
});

module.exports = mainRouter;
