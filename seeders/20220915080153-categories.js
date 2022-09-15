"use strict";
const faker = require("faker");

const categories = [...Array(100)].map((category) => ({
  name: faker.lorem.sentence(1),
}));
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("categories", categories, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("categories", null, {});
  },
};
