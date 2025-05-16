const express = require("express");
const router = express.Router();

// Import all your route files here
const roleRoutes = require("./role.routes");
const userRoutes = require("./auth.routes");
const farmRoutes = require("./farm.routes");
const managerRoutes = require("./manager.routes");
const containerRoutes = require("./container.routes");
const { upload } = require("../services/s3.upload");
const auth = require("../middlewares/auth");
const authenticate = require("../middlewares/roleBaseAuthentication");


// Use routes with base paths
router.use("/roles", roleRoutes);
// Add more routes as needed
router.use("/auth", userRoutes);
router.use("/farms", farmRoutes);
router.use("/containers", containerRoutes);
router.use("/manager", managerRoutes);

router.post("/upload", authenticate(['SuperAdmin', 'FarmOwner', 'Manager', 'Investor']), upload, (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded or invalid file type." });
  }
  res.status(200).json({
    message: "Image uploaded successfully!",
    filePath: `/uploads/${req.file.filename}`,
    file: req.file.location,
  });
});

module.exports = router;
