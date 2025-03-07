// Importing modules
const { Sequelize, DataTypes } = require("sequelize");
const logger = require("./logger");

// Creating Sequelize instance
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.HOST || "localhost",
  database: process.env.DATABASE || "genfarm",
  username: process.env.DB_USERNAME || "root",
  password: process.env.PASSWORD  || "Nehul@2607",
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
