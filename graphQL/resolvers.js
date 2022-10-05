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
    const { page, limit = 10, dateFrom, dateTo } = query;
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
      queryObj.limit = limit;
      queryObj.offset = page * limit - limit;
    }

    return {
      list: db.Post.findAll(queryObj),
      qty: db.Post.count({ where: whereObj }),
    };
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
    const finalQuery = {};
    let activePage;
    const deleted = await db.Post.destroy({
      where: { id: { [Op.in]: postIds }, userId },
    });

    if (deleted) {
      const totalPostQty = await db.Post.count({ where: { userId } });

      if (query) {
        const { limit = 10, page } = query;
        activePage = page;
        finalQuery.limit = limit;
        finalQuery.offset = page * limit - limit;
        const totalPages = Math.ceil(totalPostQty / limit);
        if (page > 1 && page > totalPages) {
          finalQuery.offset = (page - 1) * limit - limit;
          activePage = page - 1;
        }
      }

      const queryRelatedPosts = await db.Post.findAll({
        where: { userId },
        ...finalQuery,
        include: [{ model: db.User }, { model: db.Category }],
        order,
      });

      return {
        list: queryRelatedPosts,
        qty: totalPostQty,
        activePage,
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
  },
};

module.exports = { Query, Mutation };
