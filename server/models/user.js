'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //hasOne association to profile model
      user.hasOne(models.profile, {
        as: "profile",
        foreignKey: {
          name: "idUser",
        },
      });

      //hasMany association to cart model
      user.hasMany(models.cart, {
        as: "cart",
        foreignKey: {
          name: "idUser",
        },
      });

      //hasMany association to transaction model
      user.hasMany(models.transaction, {
        as: "transaction",
        foreignKey: {
          name: "idUser",
        },
      });

      //hasMany association to purchasedBook model
      user.hasMany(models.purchasedBook, {
        as: "purchasedBook",
        foreignKey: {
          name: "idUser",
        },
      });

      //hasMany association to chat model
      user.hasMany(models.chat, {
        as: "senderMessage",
        foreignKey: {
          name: "idSender",
        },
      });
      user.hasMany(models.chat, {
        as: "recipientMessage",
        foreignKey: {
          name: "idRecipient",
        },
      });
    }
  }
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};