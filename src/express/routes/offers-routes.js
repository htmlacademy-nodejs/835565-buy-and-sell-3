'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/add`, (request, response) => response.render(`new-ticket`));
offersRouter.get(`/category/:id`, (request, response) => response.render(`category`));
offersRouter.get(`/edit/:id`, (request, response) => response.render(`ticket-edit`));
offersRouter.get(`/:id`, (request, response) => response.render(`ticket`));

module.exports = offersRouter;
