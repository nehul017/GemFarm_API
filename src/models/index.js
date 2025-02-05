const { sequelize, Sequelize, DataTypes } = require("../config/database");

const User = require("../models/user.model")(sequelize, DataTypes);
const Role = require("../models/role.model")(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  user: User,
  role: Role,
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
