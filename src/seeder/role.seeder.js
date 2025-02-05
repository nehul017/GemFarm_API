const logger = require('../config/logger');
const { db } = require('../models');


/**
 * Role seeder.
 */
module.exports = roleSeeder = async () => {
    try {
         await db.roles.create({ role: "superAdmin" }); // If role doesn't exists, create role.
        

        logger.log('✅ Role seeder run successfully...');
    } catch (error) {
        logger.log('❌ Error from role seeder :', error);
    }
};
