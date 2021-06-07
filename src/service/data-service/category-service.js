'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    const categories = this._offers.reduce((acc, currentOffer) => {
      currentOffer.categories.forEach((categoryItem) => acc.add(categoryItem));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
