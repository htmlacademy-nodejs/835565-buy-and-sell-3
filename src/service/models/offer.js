'use strict';

const {DataTypes, Model} = require(`sequelize`);
const {DESCRIPTION_CHAR_LENGTH} = require(`../../const`);

class Offer extends Model {}

const define = (sequelize) => Offer.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: DataTypes.STRING,
  description: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(DESCRIPTION_CHAR_LENGTH),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING
  },
  sum: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Offer`,
  tableName: `offers`,
  paranoid: true
});

module.exports = define;
