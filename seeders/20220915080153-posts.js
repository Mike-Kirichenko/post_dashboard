'use strict';
const faker = require('faker');

const randomDate = (start, end) => {
  const randMs =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randMs);
};

const posts = [...Array(240)].map((post) => {
  const createdAt = randomDate(new Date(2017, 0, 1), new Date());
  const updatedAt = randomDate(
    new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    ),
    new Date()
  );

  return {
    title: faker.lorem.sentence(1),
    text: faker.lorem.sentence(24),
    categoryId: Math.floor(Math.random() * 12) + 1,
    userId: Math.floor(Math.random() * 4) + 1,
    img: faker.image.abstract(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
});
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('posts', posts, {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('posts', null, {});
  },
};
