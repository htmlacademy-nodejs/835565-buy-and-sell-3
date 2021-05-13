'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/add`, (request, response) => response.send(`/offers/add`));
offersRouter.get(`/category/:id`, (request, response) => response.send(`/offers/category/:id`));
offersRouter.get(`/edit/:id`, (request, response) => response.send(`/offers/edit/:id`));
offersRouter.get(`/:id`, (request, response) => response.send(`/offers/:id`));

module.exports = offersRouter;
