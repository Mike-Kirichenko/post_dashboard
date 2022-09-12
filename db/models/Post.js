module.exports = (conn, DataTypes) => {
  const Post = conn.define("posts", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
  });
  return Post;
};
