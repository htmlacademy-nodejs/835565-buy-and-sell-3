'use strict';

const axios = require(`axios`);
const {TIMEOUT, DEFAULT_PORT_SERVER} = require(`../const`);

const port = process.env.API_PORT || DEFAULT_PORT_SERVER;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers({offset, limit, needComments} = {}) {
    return this._load(`/offers`, {params: {offset, limit, needComments}});
  }

  getOffer(id, comments) {
    return this._load(`/offers/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

