// Importing modules
const { Sequelize, DataTypes } = require("sequelize");
const logger = require("./logger");

// Creating Sequelize instance
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost" || process.env.HOST,
  database: "genfarm" || process.env.DATABASE,
  username: "root" || process.env.USERNAME,
  password: "Nehul@2607" || process.env.PASSWORD,
  port: 3306,
  logging: false,
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    logger.error("Unable to connect to the database:", err);
  });
sequelize
  .sync({ alter: true })
  .then(() => {
    logger.info("All models were synchronized successfully.");
  })
  .catch((err) => {
    logger.error("Unable to synchronize models:", err);
  });

module.exports = {
  Sequelize,
  sequelize,
  DataTypes,
};
