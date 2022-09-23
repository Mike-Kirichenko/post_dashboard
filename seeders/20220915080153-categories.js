'use strict';
const faker = require('faker');

const categories = [...Array(12)].map((category) => ({
  name: faker.lorem.sentence(1),
}));
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('categories', categories, {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('categories', null, {});
  },
};
