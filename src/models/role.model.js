module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "role", // Singular model name
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  // Association: One Role has many Users
  Role.associate = (models) => {
    Role.hasMany(models.user, {
      foreignKey: "roleId",
      as: "users", // Alias for reverse relation
    });
  };

  return Role;
};
