const bcrypt = require('bcryptjs');
const { adminData } = require('./seedData');
const { db } = require('../models');
const logger = require('../config/logger');

/**
 * Admin seeder.
 */
module.exports = adminSeeder = async () => {

  const superAdminRole = await db.roles.findOne({
    where: {
      role: "superAdmin"
    },
  });

  try {
    for (let admin of adminData) {
      const adminExist = await db.users.findOne({
        where: {
          email: admin.email
        },
      })
      const password = await bcrypt.hash("Admin@123",10)
        if(!adminExist) {
          await db.users.create({
            userName: "Admin",
            email: "genfarmadmin@gmail.com",
            password: password,
            roleId: superAdminRole.id,
            isEmailVerified: true,
          }); // If admin doesn't exists, create admin.
        }
      }

      logger.log('✅ Admin seeder run successfully...');
    } catch (error) {
      logger.log('❌ Error from admin seeder :', error);
    }
  };
