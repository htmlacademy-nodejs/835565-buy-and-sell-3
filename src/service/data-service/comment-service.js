'use strict';

class CommentService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
  }

  getComments(offer) {
    this._comments = offer.comments;
  }

  async create(offerId, comment) {
    return this._Comment.create({
      offerId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findAll(offerId) {
    return this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }
}

module.exports = CommentService;
