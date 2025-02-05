const express = require("express");
const router = express.Router();
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/role.controller");
const auth = require("../middlewares/auth");
const checkAccess = require("../middlewares/roleBaseAuthentication");
const validate = require("../middlewares/validate");
const { roleValidation } = require("../validations");

// Create a new role
router.post(
  "/create",
  auth,
  checkAccess(["superAdmin"]),
  validate(roleValidation.createRole),
  createRole
);

// Get all roles
router.get("/getALl", auth, checkAccess(["superAdmin"]), getAllRoles);

// Get a role by ID
router.get("/get/:id", auth, checkAccess(["superAdmin"]), getRoleById);

// Update a role by ID
router.put(
  "/update/:id",
  auth,
  checkAccess(["superAdmin"]),
  validate(roleValidation.updateRole),
  updateRole
);

// Delete a role by ID
router.delete("/delete/:id", auth, checkAccess(["superAdmin"]), deleteRole);

module.exports = router;
