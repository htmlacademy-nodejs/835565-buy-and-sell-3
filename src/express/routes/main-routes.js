'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (request, response) => response.render(`main`));
mainRouter.get(`/register`, (request, response) => response.render(`sign-up`));
mainRouter.get(`/login`, (request, response) => response.render(`login`));
mainRouter.get(`/search`, (request, response) => response.render(`search-result`));

module.exports = mainRouter;
