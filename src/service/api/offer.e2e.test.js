'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer-service`);
const CommentService = require(`../data-service/comment-service`);
const {getRandomNum} = require(`../../utils/utils-common`);
const {HttpCode} = require(`../../const`);
const {mockData, mockCategories} = require(`./offer.e2e.test-mocks`);
const initDB = require(`../lib/init-db`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockData});

  const app = express();
  app.use(express.json());
  offer(app, new OfferService(mockDB), new CommentService(mockDB));
  return app;
};

const newOffer = {
  id: 1,
  title: `Дам погладить котика`,
  createdAt: `2021-08-21T21:19:10+03:00`,
  description: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
  picture: `cat.jpg`,
  type: `OFFER`,
  sum: 100500,
  categories: [1, 2]
};

describe(`Offers API.`, () => {

  describe(`Offers API returns a list of all offers:`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .get(`/offers`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received number of items should match number of mock offers`, () =>
      expect(response.body.length).toBe(mockData.length)
    );

    test(`Received items should match mock offers by title`, () => {
      const randomOfferIndex = getRandomNum(0, mockData.length - 1);
      expect(response.body[randomOfferIndex].title).toBe(mockData[randomOfferIndex].title);
    });
  });

  describe(`Offers API returns an offer with given id.`, () => {
    let response;
    let app;
    const requestedMockOfferId = getRandomNum(1, mockData.length);
    const requestedMockOffer = mockData[requestedMockOfferId - 1];

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/offers/${requestedMockOfferId}`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received item should match corresponding mock offer by title`, () =>
      expect(response.body.title).toBe(requestedMockOffer.title)
    );

    test(`Received status 404 if unexisting offer is requested`, async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/offers/unext`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`Offers API creates an offer if data is valid.`, () => {
    let app;
    let response;
    const validOffer = {
      id: 4,
      title: `Дам погладить котика`,
      createdAt: `2021-08-21T21:19:10+03:00`,
      description: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
      picture: `cat.jpg`,
      type: `OFFER`,
      sum: 100500,
      categories: [1, 2]
    };

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/offers`)
        .send(validOffer);
    });

    test(`Received status 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

    test(`Offers count should increace after adding new offer`, async () => {
      response = await request(app)
        .get(`/offers`);
      expect(response.body.length).toBe(mockData.length + 1);
    });
  });

  describe(`Offers API does not create offer if data is invalid.`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Unvalidated offer post should receive status 400`, async () => {
      for (const key of Object.keys(newOffer)) {
        const badOffer = {...newOffer};
        delete badOffer[key];
        await request(app)
          .post(`/offers`)
          .send(badOffer)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`Offers API changes an offer.`, () => {
    let response;
    let app;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/offers/${newOffer.id}`)
        .send(newOffer);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Offer should be updated`, async () => {
      response = await request(app)
        .get(`/offers/${newOffer.id}`);
      expect(response.body.title).toBe(newOffer.title);
    });
  });


  test(`Trying to change unexisting offer should receive status 404`, async () => {
    const app = await createAPI();

    return request(app)
      .put(`/offers/unexist`)
      .send(newOffer)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`Trying to send invalid offer should receive status 400`, async () => {
    const app = await createAPI();
    const updatedMockOfferId = 1;
    const invalidOffer = {
      title: `Дам погладить котика`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      picture: `cat.jpg`,
      type: `OFFER`,
    };
    return await request(app)
      .put(`/offers/${updatedMockOfferId}`)
      .send(invalidOffer)
      .expect(HttpCode.BAD_REQUEST);
  });
});

