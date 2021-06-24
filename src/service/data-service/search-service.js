'use strict';

class SearchService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll(searchText) {
    const offers = this._offers.reduce((acc, currentOffer) => {
      const formattedOfferTitle = currentOffer.title.toLowerCase();
      if (formattedOfferTitle.includes(searchText.toLowerCase())) {
        acc.push(currentOffer);
      }
      return acc;
    }, []);

    return offers;
  }
}

module.exports = SearchService;
