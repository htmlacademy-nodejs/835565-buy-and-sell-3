'use strict';

const {HttpCode} = require(`../../const`);

const defaultOfferKeys = [`title`, `picture`, `description`, `type`, `sum`, `categories`];

module.exports = (req, res, next) => {
  const newOffer = req.body;
  const currentOfferKeys = Object.keys(newOffer);
  const keysMatches = defaultOfferKeys.every((key) => currentOfferKeys.includes(key));

  if (!keysMatches) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request at offer validation`);
  }

  return next();
};
