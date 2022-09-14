const { Op } = require("sequelize");
const db = require("./db/models");

const Query = {
  post: (root, { id }, context) => {
    const { id: userId } = context.user;
    return db.Post.findOne({
      where: { userId, id },
      include: [{ model: db.User }, { model: db.Category }]
    });
  },
  posts: (root, { page, dateFrom, dateTo }, context) => {
    const limit = 5;
    const { id: userId } = context.user;
    const queryObj = {};

    if (page) {
      const offset = page * limit - limit;
      queryObj.limit = limit;
      queryObj.offset = offset;
    }

    const whereObj = {
      createdAt: { [Op.between]: [dateFrom || 0, dateTo || Infinity] }
    };

    (queryObj.where = { userId, ...whereObj }),
      (queryObj.include = [{ model: db.User }, { model: db.Category }]);

    return db.Post.findAll(queryObj);
  }
};

module.exports = { Query };
