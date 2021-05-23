'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/add`, (request, response) => response.render(`offers/new-ticket`));
offersRouter.get(`/category/:id`, (request, response) => response.render(`offers/category`));
offersRouter.get(`/edit/:id`, (request, response) => response.render(`offers/ticket-edit`));
offersRouter.get(`/:id`, (request, response) => response.render(`offers/ticket`));

module.exports = offersRouter;
