'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer-service`);
const CommentService = require(`../data-service/comment-service`);
const {getRandomNum} = require(`../../utils`);
const {HttpCode} = require(`../../const`);
const {mockData} = require(`./offer.e2e.test-mocks`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new OfferService(cloneData), new CommentService());
  return app;
};

const newOffer = {
  categories: `Котики`,
  title: `Дам погладить котика`,
  description: `Дам погладить котика. Дорого. Не гербалайф`,
  picture: `cat.jpg`,
  type: `OFFER`,
  sum: 100500
};

describe(`Offers API.`, () => {

  describe(`Offers API returns a list of all offers.`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received number of items should match number of mock offers`, () =>
      expect(response.body.length).toBe(mockData.length)
    );

    test(`Received items should match mock offers by ID`, () => {
      const randomOfferIndex = getRandomNum(0, mockData.length - 1);
      expect(response.body[randomOfferIndex].id).toBe(mockData[randomOfferIndex].id);
    });
  });

  describe(`Offers API returns an offer with given id.`, () => {
    const app = createAPI();
    let response;
    const requestedMockOffer = mockData[(getRandomNum(0, mockData.length - 1))];

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers/${requestedMockOffer.id}`);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Received item should match corresponding mock offer by title`, () =>
      expect(response.body.title).toBe(requestedMockOffer.title)
    );

    test(`Received status 404 if unexisting offer is requested`, async () => {
      response = await request(app)
        .get(`/offers/unext`);
      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

  describe(`Offers API creates an offer if data is valid.`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/offers`)
        .send(newOffer);
    });

    test(`Received status 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

    test(`Returns offer created`, () =>
      expect(response.body).toMatchObject(newOffer)
    );

    test(`Received offer should contain ID`, () =>
      expect(response.body).toHaveProperty(`id`)
    );

    test(`Offers count should increace after adding new offer`, async () => {
      response = await request(app)
        .get(`/offers`);
      expect(response.body.length).toBe(mockData.length + 1);
    });
  });

  describe(`Offers API does not create offer if data is invalid.`, () => {
    const app = createAPI();

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
    const app = createAPI();
    let response;
    const updatedMockOffer = mockData[getRandomNum(0, mockData.length - 1)];

    beforeAll(async () => {
      response = await request(app)
        .put(`/offers/${updatedMockOffer.id}`)
        .send(newOffer);
    });

    test(`Received status 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

    test(`Returns changed offer`, () => expect(response.body).toMatchObject(newOffer));

    test(`Offer should be updated`, async () => {
      response = await request(app)
        .get(`/offers/${updatedMockOffer.id}`);
      expect(response.body.title).toBe(newOffer.title);
    });

    test(`Trying to change unexisting offer should receive status 404`, () => {
      return request(app)
        .put(`/offers/unexst`)
        .send(newOffer)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`Trying to send invalid offer should receive status 400`, () => {
      const invalidOffer = {
        title: `Дам погладить котика`,
        description: `Дам погладить котика. Дорого. Не гербалайф`,
        picture: `cat.jpg`,
        type: `OFFER`,
      };
      return request(app)
        .put(`/offers/${updatedMockOffer.id}`)
        .send(invalidOffer)
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});

