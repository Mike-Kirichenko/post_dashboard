const fs = require('fs');
const { Op } = require('sequelize');
const { User, Post, Category } = require('../db/models');
const imgFolderBase = './uploads';
const order = [['createdAt', 'DESC']];

const Query = {
  post: (root, { id }, context) => {
    const { id: userId } = context.user;
    return Post.findOne({
      where: { userId, id },
      include: [{ model: User }, { model: Category }],
    });
  },

  posts: (root, { query }, context) => {
    const { id: userId } = context.user;
    const whereObj = { userId };
    const queryObj = {};

    if (query) {
      const { page, limit, dateFrom, dateTo } = query;
      whereObj.createdAt = {
        [Op.between]: [dateFrom || 0, dateTo || Infinity],
      };
      if (limit) {
        queryObj.limit = limit;
      }
      if (page) {
        queryObj.offset = page * limit - limit;
      }
    }

    queryObj.where = whereObj;
    queryObj.include = [{ model: User }, { model: Category }];
    queryObj.order = order;

    return {
      list: Post.findAll(queryObj),
      qty: Post.count({ where: whereObj }),
    };
  },
};

const Mutation = {
  createPost: async (root, { input }, context) => {
    const { id: userId } = context.user;
    const { id } = await Post.create({ ...input, userId });
    return await Post.findOne({
      where: { userId, id },
      include: [{ model: User }, { model: Category }],
    });
  },
  deletePosts: async (root, { query, postIds }, context) => {
    const { id: userId } = context.user;
    const finalQuery = {};
    let activePage;

    const foundRows = await Post.findAll({
      where: { id: { [Op.in]: postIds }, userId },
      attributes: ['img'],
    });

    const deleted = await Post.destroy({
      where: { id: { [Op.in]: postIds }, userId },
    });

    if (foundRows && deleted) {
      foundRows.forEach((row) => {
        const { img: imgPath } = row;
        if (fs.existsSync(`${imgFolderBase}/${imgPath}`)) {
          fs.unlinkSync(`${imgFolderBase}/${imgPath}`);
        }
      });

      const totalPostQty = await Post.count({ where: { userId } });

      if (query) {
        const { limit, page } = query;
        activePage = page;
        finalQuery.limit = limit;
        finalQuery.offset = page * limit - limit;
        const totalPages = Math.ceil(totalPostQty / limit);

        if (page > 1 && page > totalPages) {
          finalQuery.offset = (page - 1) * limit - limit;
          activePage = page - 1;
        }
      }

      const queryRelatedPosts = await Post.findAll({
        where: { userId },
        ...finalQuery,
        include: [{ model: User }, { model: Category }],
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
      const [updated] = await Post.update(input, { where: { id, userId } });
      if (updated) {
        const updated = await Post.findOne({
          where: { userId, id },
          include: [{ model: User }, { model: Category }],
        });
        return updated;
      }
    }
  },
};

module.exports = { Query, Mutation };
