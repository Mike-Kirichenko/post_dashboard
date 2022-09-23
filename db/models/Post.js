module.exports = (conn, DataTypes) => {
  const Post = conn.define('posts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: true },
    text: { type: DataTypes.STRING, allowNull: false },
  });
  return Post;
};
