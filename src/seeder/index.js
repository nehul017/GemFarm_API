// const connectDB = require('../models/index');
require('dotenv').config()
const logger = require('../config/logger');
const adminSeeder = require('./admin.seeder');
const roleSeeder = require('./role.seeder');

async function seeder() {
    try {
        // await connectDB(); // Db connect.
        logger.log('✅ Seeding database...');

        await roleSeeder(); // Role seeder.

        await adminSeeder(); // Admin seeder.

        logger.log('✅ All seeder run successfully...');

        /**
         * To exit with a 'failure' code use: process.exit(1)
         * To exit with a 'success' code use: process.exit(0)
         * Here we have used code 1 because it's process is used only one time when you change in seeder's files.
         */
        process.exit(0);
    } catch (error) {
        logger.log('❌ Seeder error: ', error);
        process.exit(1);
    }
}

seeder(); // Seeder calling...
