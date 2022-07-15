'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //hasMany association to cart model
      book.hasMany(models.cart, {
        as: "cart",
        foreignKey: {
          name: "idProduct",
        },
      });

      //hasMany association to purchasedBook model
      book.hasMany(models.purchasedBook, {
        as: "purchasedBook",
        foreignKey: {
          name: "idBook",
        },
      });
    }
  }
  book.init({
    title: DataTypes.STRING,
    year: DataTypes.DATEONLY,
    author: DataTypes.STRING,
    pages: DataTypes.STRING,
    ISBN: DataTypes.BIGINT,
    price: DataTypes.BIGINT,
    desc: DataTypes.TEXT,
    bookPdf: DataTypes.STRING,
    bookImg: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};