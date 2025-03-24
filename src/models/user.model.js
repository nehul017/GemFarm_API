module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles", // Refers to the table name in the DB
          key: "id",
        },
      },
    },
    { timestamps: true }
  );

  // Association: User belongs to Role
  User.associate = (models) => {
    User.belongsTo(models.role, {
      // Singular to match Role model
      foreignKey: "roleId",
      as: "role", // Alias used in queries
    });
  };

  return User;
};
