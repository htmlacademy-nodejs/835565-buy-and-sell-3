'use strict';

const {Router} = require(`express`);
const {OFFERS_PER_PAGE} = require(`../../const`);
const api = require(`../api`).getAPI();
const {getLogger} = require(`../../service/lib/logger`);

const myRouter = new Router();
const logger = getLogger({name: `front-api/my`});

myRouter.get(`/comments`, async (req, res) => {
  try {
    const offers = await api.getOffers({needComments: true});
    res.render(`comments`, {offers});
  } catch (error) {
    logger.error(`Error on '/my/comments' route: ${error.message}`);
    res.render(`errors/500`);
  }
});

myRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;

  const offset = (page - 1) * OFFERS_PER_PAGE;
  const limit = OFFERS_PER_PAGE;

  try {
    const [{current: {count, offers}}, categories] = await Promise.all([
      await api.getOffers({limit, offset}),
      await api.getCategories()
    ]);

    const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

    const options = {
      offers,
      page: +page,
      totalPages,
      categories
    };
    res.render(`my-offers`, {...options});
  } catch (error) {
    logger.error(`Error on '/my' route: ${error.message}`);
    res.render(`errors/500`);
  }
});

module.exports = myRouter;
