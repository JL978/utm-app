const { Sequelize } = require("sequelize");

module.exports = new Sequelize("codegig", "utm_app", "1234", {
  host: "localhost",
  dialect: "postgres",
});
