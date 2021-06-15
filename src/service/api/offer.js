'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../const`);
const offerValidator = require(`../middlewares/offer-validator`);
const offerExist = require(`../middlewares/offer-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const offersRoute = new Router();

module.exports = (app, offerService, commentService) => {

  app.use(`/offers`, offersRoute);

  offersRoute.get(`/`, (req, res) => {
    const offers = offerService.findAll();
    if (!offers) {
      res.status(HttpCode.NOT_FOUND)
        .send(`NOT FOUND`);
    }
    res.status(HttpCode.OK)
      .json(offers);
  });

  offersRoute.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);
    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find offer with id:${offerId}`);
    }
    return res.status(HttpCode.OK)
      .json(offer);
  });

  offersRoute.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(offer);
  });

  offersRoute.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    commentService.getComments(offer);
    const comment = commentService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  offersRoute.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    commentService.getComments(offer);
    const comments = commentService.findAll();
    return res.status(HttpCode.OK)
      .json(comments);
  });

  offersRoute.put(`/:offerId`, [offerExist(offerService), offerValidator], (req, res) => {
    const {offerId} = req.params;
    const updatedOffer = offerService.update(offerId, req.body);
    if (!updatedOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Unable to find offer with id:${offerId}`);
    }
    return res.status(HttpCode.OK)
      .json(updatedOffer);
  });

  offersRoute.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const deletedOffer = offerService.drop(offerId);
    if (!deletedOffer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Cannot delete unexisting offer`);
    }
    return res.status(HttpCode.OK)
      .json(deletedOffer);
  });

  offersRoute.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    commentService.getComments(offer);
    const {commentId} = req.params;
    const deletedComment = commentService.drop(commentId);
    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Cannot delete unexisting comment`);
    }
    return res.status(HttpCode.OK)
      .json(deletedComment);
  });
};
