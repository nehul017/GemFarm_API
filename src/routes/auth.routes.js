const express = require("express");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getAllUsers,
  loginUser,
  registerUser,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const { register, login } = require("../validations/auth.validation");

// Register route
router.post("/register", validate(register), registerUser);

// Login route
router.post("/login", validate(login), loginUser);

// Other routes...
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);

module.exports = router;
