const express = require("express");
const router = express.Router();
const {
  createContainer,
  getAllContainers,
  getContainerById,
  updateContainer,
  deleteContainer,
} = require("../controllers/container.controller");
const {
  createContainerSchema,
  updateContainerSchema,
} = require("../validations/container.validation");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");

// Create a new container   
router.post("/", auth, validate(createContainerSchema), createContainer);

// Get all containers
router.get("/", auth, getAllContainers);

// Get a container by ID
router.get("/:id", auth, getContainerById);

// Update a container
router.put("/:id", auth, validate(updateContainerSchema), updateContainer);

// Delete a container
router.delete("/:id", auth, deleteContainer);

module.exports = router;