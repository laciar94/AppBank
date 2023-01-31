const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Transfer = db.define('transfer', {
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  accountNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  senderUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Transfer;
