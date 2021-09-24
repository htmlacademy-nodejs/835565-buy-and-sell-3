'use strict';

const {Router} = require(`express`);
const {OFFERS_PER_PAGE} = require(`../../const`);
const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);

const mainRouter = new Router();
const logger = getLogger({name: `front-api`});

mainRouter.get(`/`, async (req, res) => {
  const limit = OFFERS_PER_PAGE;

  const [offers, categories] = await Promise.all([
    await api.getOffers({limit}),
    await api.getCategories(true)
  ]);
  res.render(`main`, {offers, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));

mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;
  const limit = OFFERS_PER_PAGE;

  try {
    const [results, offers] = await Promise.all([
      await api.search(search),
      await api.getOffers({limit})
    ]);

    res.render(`search-result`, {
      results,
      offers
    });
  } catch (error) {
    try {
      const offers = await api.getOffers({limit});
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
