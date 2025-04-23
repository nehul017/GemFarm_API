const express = require("express");
const router = express.Router();
const {
  createFarm,
  getAllFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} = require("../controllers/farm.controller");
const {
  createFarmSchema,
  updateFarmSchema,
} = require("../validations/farm.validation");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");

// Create a farm
router.post("/", auth, validate(createFarmSchema), createFarm);

// Get all farms
router.get("/", auth, getAllFarms);

// Get a farm by ID
router.get("/by-id/:id", auth, getFarmById);

// Update a farm
router.put("/:id", auth, validate(updateFarmSchema), updateFarm);

// Delete a farm
router.delete("/:id", auth, deleteFarm);

module.exports = router;
