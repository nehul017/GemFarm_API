module.exports = (sequelize, DataTypes) => {
    const otp = sequelize.define("otp", {
        otp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expires: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { timestamps: true },)
    return otp
}