'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(searchText) {
    const offers = this._offers.reduce((acc, currentOffer) => {
      if (currentOffer.title.includes(searchText)) {
        acc.push(currentOffer);
      }
      return acc;
    }, []);

    return offers;
  }
}

module.exports = SearchService;
