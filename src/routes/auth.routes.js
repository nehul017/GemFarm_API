const express = require("express");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getAllUsers,
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getLoginUser,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const {
  register,
  login,
  forgot,
  reset,
} = require("../validations/auth.validation");
const auth = require("../middlewares/auth");

// Register route
router.post("/signup", validate(register), registerUser);

// Login route
router.post("/login", validate(login), loginUser);

/**
 * Forgot password.path
 */
router.post("/forgot-password", validate(forgot), forgotPassword);
router.put("/reset-password", validate(reset), resetPassword);


// Other routes...
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);
router.get("/get-profile", auth, getLoginUser);

module.exports = router;
