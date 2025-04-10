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
  verifyOTP,
  getCommodityData,
  getPerKGprice,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const {
  register,
  login,
  forgot,
  reset,
  verifyOtp,
  updateProfile,
} = require("../validations/auth.validation");
const auth = require("../middlewares/auth");
const { upload } = require("../services/s3.upload");

// Register route
router.post("/signup", validate(register), registerUser);

// Login route
router.post("/login", validate(login), loginUser);

/**
 * Forgot password.path
 */
router.post("/forgot-password", validate(forgot), forgotPassword);
router.put("/reset-password", validate(reset), resetPassword);

// Verify OTP
router.post("/verify-otp", validate(verifyOtp), verifyOTP);


// Other routes...
router.put("/update-profile/:id", auth, upload, validate(updateProfile), updateUser);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);
router.get("/get-profile", auth, getLoginUser);
router.get("/get-commodity", auth, getCommodityData);
router.post("/get-kg-price",  getPerKGprice);

module.exports = router;
