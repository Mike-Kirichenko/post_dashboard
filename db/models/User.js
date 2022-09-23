module.exports = (conn, DataTypes) => {
  const User = conn.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      nickname: { type: DataTypes.STRING, unique: true, allowNull: false },
      avatar: { type: DataTypes.STRING, unique: false, allowNull: true },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    { timestamps: false }
  );
  return User;
};
