const { Op } = require('sequelize');

const order = [['createdAt', 'DESC']];

exports.formatWhereObj = (params) => {
  const { userId, dateFrom, dateTo, search } = params;

  let whereObj = { userId };

  whereObj.createdAt = {
    [Op.between]: [dateFrom || 0, dateTo || Infinity],
  };

  if (search) {
    whereObj = {
      ...whereObj,
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { text: { [Op.iLike]: `%${search}%` } },
      ],
    };
  }
  return whereObj;
};

exports.getFinalQueryObject = (query, whereObj, models) => {
  const queryObj = {};
  const { page, limit } = query;

  if (limit) {
    queryObj.limit = limit;
  }
  if (page) {
    queryObj.offset = page * limit - limit;
  }

  queryObj.where = whereObj;
  queryObj.include = models;
  queryObj.order = order;
  return queryObj;
};
