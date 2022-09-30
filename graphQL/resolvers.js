const { Op } = require("sequelize");
const db = require("../db/models");

const Query = {
  post: (root, { id }, context) => {
    const { id: userId } = context.user;
    return db.Post.findOne({
      where: { userId, id },
      include: [{ model: db.User }, { model: db.Category }]
    });
  },
  posts: async (root, { page, dateFrom, dateTo, limit = 10 }, context) => {
    const { id: userId } = context.user;
    const queryObj = {};

    if (page) {
      const offset = page * limit - limit;
      queryObj.limit = limit;
      queryObj.offset = offset;
    }

    const whereObj = {
      createdAt: { [Op.between]: [dateFrom || 0, dateTo || Infinity] },
      userId
    };

    queryObj.where = whereObj;
    queryObj.include = [{ model: db.User }, { model: db.Category }];

    const qty = await db.Post.count({ where: whereObj });
    const posts = await db.Post.findAll(queryObj);

    return {
      list: posts,
      qty: qty
    };
  }
};

const Mutation = {
  createPost: async (root, { input }, context) => {
    const { id: userId } = context.user;
    const { id } = await db.Post.create({ ...input, userId });
    return await db.Post.findOne({
      where: { userId, id },
      include: [{ model: db.User }, { model: db.Category }]
    });
  },
  deletePost: async (root, { id }, context) => {
    const { id: userId } = context.user;
    const deleted = await db.Post.destroy({ where: { id, userId } });
    return deleted;
  },
  editPost: async (root, { id, input }, context) => {
    const { id: userId } = context.user;
    if (input) {
      const [updated] = await db.Post.update(input, { where: { id, userId } });
      if (updated) {
        const updated = await db.Post.findOne({
          where: { userId, id },
          include: [{ model: db.User }, { model: db.Category }]
        });
        return updated;
      }
    }
    return null;
  }
};

module.exports = { Query, Mutation };
