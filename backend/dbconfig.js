const { Sequelize } = require('sequelize');
const userModel = require('./models/users');

const sequelize = new Sequelize({
  dialect: 'mssql',
  host: 'localhost',
  username: 'iits',
  password: 'iits123',
  database: 'DiamondSoft'
});

const Users = userModel(sequelize);

module.exports = { Users, sequelize };
