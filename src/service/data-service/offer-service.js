'use strict';

const {ORDER_BY_LATEST_DATE} = require(`../../const`);
const Aliase = require(`../models/aliase`);

class OfferService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(data) {
    const offer = await this._Offer.create(data);
    await offer.addCategories(data.categories);
    return offer.get();
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(
        offer,
        {
          where: {id}
        }
    );
    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
      });
    }
    return await this._Offer.findByPk(id, {include});
  }

  async findAll(needComments) {
    const options = {
      include: [Aliase.CATEGORIES],
      order: [ORDER_BY_LATEST_DATE]
    };

    if (needComments) {
      options.include.push(Aliase.COMMENTS);
      options.order[0] = [
        {model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`
      ];
    }

    const offers = await this._Offer.findAll(options);
    return offers.map((item) => item.get());
  }

  async findLimit({limit, needComments}) {
    if (!needComments) {
      const options = {
        limit,
        include: [
          Aliase.CATEGORIES
        ],
        order: [
          ORDER_BY_LATEST_DATE
        ]
      };
      return await this._Offer.findAll(options);
    }

    const options = {
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`]
        }
      ],
      group: [
        `Offer.id`,
        `categories.id`,
        `categories->OfferCategory.OfferId`,
        `categories->OfferCategory.CategoryId`
      ],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ]
    };

    let offers = await this._Offer.findAll(options);
    offers = offers
      .map((offer) => offer.get())
      .filter((offer) => offer.commentsCount > 0);

    return offers.slice(0, limit);
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES],
      order: [
        ORDER_BY_LATEST_DATE
      ],
      distinct: true
    });
    return {count, offers: rows};
  }

}

module.exports = OfferService;
