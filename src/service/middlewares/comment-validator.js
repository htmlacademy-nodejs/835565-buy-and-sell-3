'use strict';

const {HttpCode} = require(`../../const`);

const defaultCommentKeys = [`text`];

module.exports = (req, res, next) => {
  const comment = req.body;
  const currentCommentKeys = Object.keys(comment);
  const keysMatches = defaultCommentKeys.every((key) => currentCommentKeys.includes(key));

  if (!keysMatches) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request at comment validation`);
  }

  return next();
};
