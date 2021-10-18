'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const offersRoute = new Router();

module.exports = (app, offerService, commentService) => {

  app.use(`/offers`, offersRoute);


  /**
   * Main route to get offers
   * according to query option
   */
  offersRoute.get(`/`, async (req, res) => {
    const {offset, limit, needComments} = req.query;

    let offers = {};

    if (needComments) {
      offers.current = await offerService.findAll({needComments});
      return res.status(HttpCode.OK).json(offers);
    }

    if (limit && offset) {
      offers.current = await offerService.findPage({limit, offset});
    } else {
      offers.recent = await offerService.findLimit({limit});
      offers.discussed = await offerService.findLimit({limit, needComments: true});
    }

    return res.status(HttpCode.OK).json(offers);
  });


  /**
   * Current single OFFER routes
   * to handle CRUD operations
   */
  offersRoute.get(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const {needComments} = req.query;

    const offer = await offerService.findOne({id: offerId, needComments});

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find offer with id:${offerId}`);
    }

    return res.status(HttpCode.OK)
      .json(offer);
  });

  offersRoute.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  offersRoute.put(`/:offerId`, [offerExist(offerService), offerValidator], async (req, res) => {
    const {offerId} = req.params;

    const updatedOffer = await offerService.update(offerId, req.body);

    if (!updatedOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find offer with id:${offerId}`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  offersRoute.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;

    const deletedOffer = await offerService.findOne({id: offerId});

    if (!deletedOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Cannot delete unexisting offer`);
    }

    await offerService.drop(offerId);

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });


  /**
   * Current offer's COMMENTS routes
   * to handle CRUD operations
   */
  offersRoute.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offerId} = req.params;

    const comments = await commentService.findAll(offerId);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  offersRoute.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], async (req, res) => {
    const {offerId} = req.params;

    const comment = await commentService.create(offerId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  offersRoute.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {offerId, commentId} = req.params;

    const deletedComment = await commentService.findOne(offerId, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Cannot delete unexisting comment`);
    }

    await commentService.drop(offerId, commentId);

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });
};
