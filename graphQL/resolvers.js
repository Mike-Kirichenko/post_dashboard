const { Op } = require('sequelize');
const db = require('../db/models');
const order = [['createdAt', 'DESC']];

const Query = {
  post: (root, { id }, context) => {
    const { id: userId } = context.user;
    return db.Post.findOne({
      where: { userId, id },
      include: [{ model: db.User }, { model: db.Category }],
    });
  },

  posts: (root, { query }, context) => {
    const { page, limit, dateFrom, dateTo } = query;
    const { id: userId } = context.user;

    const whereObj = {
      createdAt: { [Op.between]: [dateFrom || 0, dateTo || Infinity] },
      userId,
    };

    const queryObj = {
      where: whereObj,
      include: [{ model: db.User }, { model: db.Category }],
      order,
    };

    if (page) {
      const offset = page * limit - limit;
      queryObj.limit = limit;
      queryObj.offset = offset;
    }

    const postsData = {
      list: db.Post.findAll(queryObj),
      qty: db.Post.count({ where: whereObj }),
    };

    return postsData;
  },
};

const Mutation = {
  createPost: async (root, { input }, context) => {
    const { id: userId } = context.user;
    const { id } = await db.Post.create({ ...input, userId });
    return await db.Post.findOne({
      where: { userId, id },
      include: [{ model: db.User }, { model: db.Category }],
    });
  },
  deletePosts: async (root, { query, postIds }, context) => {
    const { id: userId } = context.user;
    const { limit, page } = query;

    const deleted = await db.Post.destroy({
      where: { id: { [Op.in]: postIds }, userId },
    });

    if (deleted) {
      const finalQuery = { limit, offset: page * limit - limit };
      const totalPostQty = await db.Post.count({ where: { userId } });
      const totalPages = Math.ceil(totalPostQty / limit);

      if (page > totalPages) finalQuery.offset = (page - 1) * limit - limit;

      const queryRelatedPosts = await db.Post.findAll({
        where: { userId },
        ...finalQuery,
        order,
      });

      return {
        list: queryRelatedPosts,
        qty: totalPostQty,
      };
    }
  },
  editPost: async (root, { id, input }, context) => {
    const { id: userId } = context.user;
    if (input) {
      const [updated] = await db.Post.update(input, { where: { id, userId } });
      if (updated) {
        const updated = await db.Post.findOne({
          where: { userId, id },
          include: [{ model: db.User }, { model: db.Category }],
        });
        return updated;
      }
    }
    return null;
  },
};

module.exports = { Query, Mutation };
