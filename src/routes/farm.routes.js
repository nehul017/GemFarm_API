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
const authenticate = require("../middlewares/roleBaseAuthentication");

// Create a farm
router.post(
  "/",
  authenticate(["SuperAdmin", "FarmOwner"]),
  validate(createFarmSchema),
  createFarm
);

// Get all farms
router.get(
  "/",
  authenticate(["SuperAdmin", "FarmOwner", "Manager", "Investor"]),
  getAllFarms
);

// Get a farm by ID
router.get(
  "/by-id/:id",
  authenticate(["SuperAdmin", "FarmOwner", "Manager", "Investor"]),
  getFarmById
);

// Update a farm
router.put(
  "/:id",
  authenticate(["SuperAdmin", "FarmOwner", "Manager", "Investor"]),
  validate(updateFarmSchema),
  updateFarm
);

// Delete a farm
router.delete(
  "/:id",
  authenticate(["SuperAdmin", "FarmOwner", "Manager", "Investor"]),
  deleteFarm
);

module.exports = router;
