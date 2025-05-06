const express = require("express");
const router = express.Router();


const {
  createContainerSchema,
  updateContainerSchema,
} = require("../validations/container.validation");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { containerController } = require("../controllers");
const authenticate = require("../middlewares/roleBaseAuthentication");


// Create a new container   
router.post("/", authenticate(['SuperAdmin', 'FarmOwner', 'Manager', 'Investor']), validate(createContainerSchema), containerController.createContainer);

// Get all containers
router.get("/", authenticate(['SuperAdmin', 'FarmOwner', 'Manager', 'Investor']), containerController.getAllContainers);

// Get a container by ID
router.get("/:id", authenticate(['SuperAdmin', 'FarmOwner', 'Manager', 'Investor']), containerController.getContainerById);

// Update a container
router.put("/:id", authenticate(['SuperAdmin', 'FarmOwner', 'Manager', 'Investor']), validate(updateContainerSchema), containerController.updateContainer);

// Delete a container
router.delete("/:id", authenticate(['SuperAdmin', 'FarmOwner', 'Manager', 'Investor']), containerController.deleteContainer);

//Get Container by Sensor Data
router.get("/sensor/:id", authenticate(['SuperAdmin', 'FarmOwner', 'Manager', 'Investor']), containerController.getContainerBySensorData);

module.exports = router;