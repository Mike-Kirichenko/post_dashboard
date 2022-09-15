"use strict";
const faker = require("faker");

const posts = [...Array(240)].map((post) => ({
  title: faker.lorem.sentence(1),
  text: faker.lorem.sentence(24),
  categoryId: Math.floor(Math.random() * 11) + 1,
  userId: Math.floor(Math.random() * 59) + 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("posts", posts, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("posts", null, {});
  },
};
