const { Category } = require('../../db/models');
const order = [['id', 'DESC']];

const Query = {
  categories: () => {
    const categories = Category.findAll({ order });
    return categories;
  },
};

module.exports = { Query };
