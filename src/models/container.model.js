module.exports = (sequelize, DataTypes) => {
    const Container = sequelize.define("container", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        farm_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        autoGrowDeviceId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        blueLabDeviceId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        container_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        container_crop: {
            type: DataTypes.STRING,
            allowNull: true
        },
        container_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        harvest_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        crop_category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        harvest_system: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        timestamps: true,
        underscored: true,
        tableName: "containers"
    });

    Container.associate = (models) => {
        Container.belongsTo(models.farm, {
            foreignKey: 'farm_id',
            as: 'farm'
        });
    };

    return Container;
};
