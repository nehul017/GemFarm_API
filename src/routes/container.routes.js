const express = require("express");
const router = express.Router();


const {
  createContainerSchema,
  updateContainerSchema,
} = require("../validations/container.validation");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { containerController } = require("../controllers");

// Create a new container   
router.post("/", auth, validate(createContainerSchema), containerController.createContainer);

// Get all containers
router.get("/", auth, containerController.getAllContainers);

// Get a container by ID
router.get("/:id", auth, containerController.getContainerById);

// Update a container
router.put("/:id", auth, validate(updateContainerSchema), containerController.updateContainer);

// Delete a container
router.delete("/:id", auth, containerController.deleteContainer);

module.exports = router;