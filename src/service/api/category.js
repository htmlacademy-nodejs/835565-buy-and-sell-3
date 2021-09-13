'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);

const categoriesRoute = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, categoriesRoute);

  categoriesRoute.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
