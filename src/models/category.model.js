module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      category_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: "categories",
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.commodity, {
        foreignKey: 'category_id',
        as: 'commodities'
    });
};


  return Category;
};
