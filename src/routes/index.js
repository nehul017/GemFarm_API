const express = require('express');
const router = express.Router();

// Import all your route files here
const roleRoutes = require('./role.routes');
const userRoutes = require('./auth.routes');

// Use routes with base paths
router.use('/roles', roleRoutes);
// Add more routes as needed
router.use('/auth', userRoutes);

module.exports = router;
