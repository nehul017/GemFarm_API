module.exports = (sequelize, DataTypes) => {
  const Farm = sequelize.define(
    "farm",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      farmImage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "farms",
    }
  );

  Farm.associate = (models) => {
    Farm.hasMany(models.container, {
      foreignKey: "farm_id",
      as: "containers",
    });
  };

  return Farm;
};
