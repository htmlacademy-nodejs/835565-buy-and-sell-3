'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/comments`, (request, response) => response.render(`comments`));
myRouter.get(`/`, (request, response) => response.render(`my-tickets`));

module.exports = myRouter;
