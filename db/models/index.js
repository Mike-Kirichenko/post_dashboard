const { conn, Sequelize: DataTypes } = require('../config');
//Create Models
const User = require('./User.js')(conn, DataTypes);
const Post = require('./Post.js')(conn, DataTypes);
const Category = require('./Category.js')(conn, DataTypes);

//Establish Relationships
User.hasMany(Post, {
  foreignKey: { allowNull: false },
});
Post.belongsTo(User);

Category.hasMany(Post, {
  foreignKey: { allowNull: false },
});
Post.belongsTo(Category);

module.exports = { User, Category, Post };
