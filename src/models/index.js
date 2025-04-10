const { sequelize, Sequelize, DataTypes } = require("../config/database");

const User = require("../models/user.model")(sequelize, DataTypes);
const Role = require("../models/role.model")(sequelize, DataTypes);
const OTP = require("../models/otp.model")(sequelize, DataTypes);
const Category = require("../models/category.model")(sequelize, DataTypes);
const Commodity = require("../models/commodity.model")(sequelize, DataTypes);
const Farm = require("../models/farm.model")(sequelize, DataTypes);
const Container = require("../models/container.model")(sequelize, DataTypes);
const db = {
  sequelize,
  Sequelize,
  user: User,
  role: Role,
  otp: OTP,
  category: Category,
  commodity: Commodity,
  farm: Farm,
  container: Container,
};

// Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sync all defined models to the database

// Export Sequelize and models
module.exports = db;
