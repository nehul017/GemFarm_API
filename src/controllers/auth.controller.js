const logger = require("../config/logger");
const apiResponse = require("../middlewares/api.response");
const userService = require("../services/user.service");
const message = require("../contants/message.json");
const { otpServices } = require("../services");
const bcrypt = require("bcryptjs");

// Controller function for registering a user
const registerUser = async (req, res) => {
  try {
    const createdData = await userService.createUser(req.body);

    if (!createdData) {
      return res.status(400).send({ message: "Email already exists" });
    } else {
      return res.status(201).send({
        message: "User registered successfully",
        user: createdData.user,
        token: createdData.token
      });
    }
  } catch (err) {
    console.log('err', err)
    return res
      .status(500)
      .send({ message: "Error registering user", error: err.message });
  }
};

// Controller function for logging in a user
const loginUser = async (req, res) => {
  try {
    const { user, token } = await userService.loginUser(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    return res.status(200).send({
      message: "Login successful",
      user: user,
      token,
    });
  } catch (err) {
    console.log("err", err);
    return res.status(400).send({ message: err.message });
  }
};

// Controller function for updating a user
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).send({ message: "User updated successfully", user });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Controller function for deleting a user
const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Controller function for getting all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Controller function for get login user
const getLoginUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    return res.status(200).send({
      message: "User Retrieve successfully",
      user: user,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};


//Controller function for forgot password
const forgotPassword = async (req, res) => {
  try {
    const reqBody = req.body;

    const emailExist = await userService.getUserByEmail(reqBody.email);

    if (!emailExist) {
      return apiResponse.NOT_FOUND({
        res,
        message: message.email_not_register,
      }); // If email doesn't exist, throw an error.
    }

    await userService.sendForgetPasswordEmail(emailExist.email);

    return apiResponse.OK({
      res,
      message: message.password_forgot,
    });
  } catch (err) {
    logger.error("error generating", err);
    return apiResponse.CATCH_ERROR({
      res,
      message: message.something_went_wrong,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const reqBody = req.body;

    const otpExists = await otpServices.getOtpWhere({
      where: {
        otp: reqBody.otp,
      },
    });

    if (!otpExists) {
      return apiResponse.NOT_FOUND({ res, message: message.otp_invalid });
    }

    if (otpExists.otp !== reqBody.otp) {
      return apiResponse.BAD_REQUEST({ res, message: message.otp_invalid });
    }

    if (new Date(otpExists.expires) <= new Date()) {
      return apiResponse.BAD_REQUEST({ res, message: message.otp_expired });
    }

    await otpServices.deleteOtp(otpExists.id);

    return apiResponse.OK({
      res,
      message: message.otp_verify_success,
    });
  } catch (err) {
    logger.error("error generating", err);
    return apiResponse.CATCH_ERROR({
      res,
      message: message.something_went_wrong,
    });
  }
}


const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;


    const userExist = await userService.getUserByEmail(email);

    if (!userExist) {
      return apiResponse.NOT_FOUND({
        res,
        message: message.email_not_register,
      });
    }

    if (password !== confirmPassword) {
      return apiResponse.BAD_REQUEST({
        res,
        message: message.password_not_match,
      });
    }

    let hashPassword = await bcrypt.hashSync(password, 10);

    await userService.updateUser(userExist.id, {
      password: hashPassword
    });

    return apiResponse.OK({
      res,
      message: message.password_reset,
    });
  } catch (err) {
    logger.error("error generating", err);
    return apiResponse.CATCH_ERROR({
      res,
      message: message.something_went_wrong,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  forgotPassword,
  resetPassword,
  verifyOTP,
  getLoginUser
};
