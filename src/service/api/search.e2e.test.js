'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const search = require(`./search`);
const SearchService = require(`../data-service/search-service`);
const {HttpCode} = require(`../../const`);
const {mockData, mockCategories} = require(`./search.e2e.test-mocks`);
const initDB = require(`../lib/init-db`);

const app = express();
app.use(express.json());

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockData});
  search(app, new SearchService(mockDB));
});

describe(`Search API.`, () => {

  describe(`Positive outcome:`, () => {
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/search`)
        .query({
          query: `Куплю книги`
        });
    });

    test(`Received status OK`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Found 1 mock offer`, () => expect(response.body.length).toEqual(1));
    test(`Received offer's title corresponds query`, () => expect(response.body[0].title).toEqual(mockData[1].title));
  });

  describe(`Negative outcome:`, () => {

    test(`Returns 404 if nothing is found`, () =>
      request(app)
      .get(`/search`)
      .query({
        query: `Абракадабра`
      })
      .expect(HttpCode.NOT_FOUND)
    );

    test(`Returns 400 if query string is absent`, () =>
      request(app)
        .get(`/search`)
        .expect(HttpCode.BAD_REQUEST)
    );
  });
});
