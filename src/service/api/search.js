'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const searchRoute = new Router();

module.exports = (app, service) => {
  app.use(`/search`, searchRoute);

  searchRoute.get(`/`, async (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    const searchResults = await service.findAll(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);
  });
};
