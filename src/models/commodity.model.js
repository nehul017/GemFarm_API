module.exports = (sequelize, DataTypes) => {
    const Commodity = sequelize.define("commodity", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        overall_max_low_price: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        overall_max_high_price: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName: "commodities"
    });

    Commodity.associate = (models) => {
        Commodity.belongsTo(models.category, {
            foreignKey: 'category_id',
            as: 'category'
        });
    };
    
    return Commodity;
};
