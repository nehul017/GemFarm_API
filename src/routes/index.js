const express = require("express");
const router = express.Router();

// Import all your route files here
const roleRoutes = require("./role.routes");
const userRoutes = require("./auth.routes");
const { upload } = require("../services/s3.upload");

// Use routes with base paths
router.use("/roles", roleRoutes);
// Add more routes as needed
router.use("/auth", userRoutes);

router.post("/upload", upload, (req, res) => {
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
