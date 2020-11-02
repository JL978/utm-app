const Sequelize = require("sequelize");
const db = require("../config");

const Links = db.define("links", {
  link_id: {
    type: Sequelize.STRING,
  },
  resource_type: {
    type: Sequelize.STRING,
  },
  resource_link: {
    type: Sequelize.STRING,
  },
  utm_source: {
    type: Sequelize.STRING,
  },
  utm_medium: {
    type: Sequelize.STRING,
  },
  utm_campaign: {
    type: Sequelize.STRING,
  },
  utm_content: {
    type: Sequelize.STRING,
  },
  discount_code: {
    type: Sequelize.STRING,
  },
});

module.exports = Links;
