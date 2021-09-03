'use strict';

const {getCategories} = require(`../../utils/utils-data`);

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    return getCategories(this._offers);
  }
}

module.exports = CategoryService;
