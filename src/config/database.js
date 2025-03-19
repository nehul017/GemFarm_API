// Importing modules
const { Sequelize, DataTypes } = require("sequelize");
const logger = require("./logger");

// Creating Sequelize instance
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Important for NeonDB SSL connections
    },
  },
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
