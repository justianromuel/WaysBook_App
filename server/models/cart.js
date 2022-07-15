'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //belongsTo association to user model
      cart.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });

      //belongsTo association to book model
      cart.belongsTo(models.book, {
        as: "book",
        foreignKey: {
          name: "idProduct",
        },
      });
    }
  }
  cart.init({
    idUser: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    total: DataTypes.BIGINT,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};