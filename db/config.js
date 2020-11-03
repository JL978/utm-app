const { Sequelize } = require("sequelize");

module.exports = new Sequelize("utm_app", "postgres", "1234", {
  host: "localhost",
  dialect: "postgres",
});
