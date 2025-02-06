const { otp: OTP } = require("../models"); // Adjust the path to your models directory

// Create a new otp
const createOtp = async (roleData) => {
  try {
    const newOtp = await OTP.create(roleData);
    return newOtp;
  } catch (error) {
    return new Error(`Error creating otp: ${error.message}`);
  }
};

// Get all otp
const getAllOtps = async () => {
  try {
    const allOtps = await OTP.findAll();
    return allOtps;
  } catch (error) {
    return new Error(`Error fetching otp: ${error.message}`);
  }
};

// Get a otp by ID
const getOtpById = async (roleId) => {
  try {
    const otp = await OTP.findByPk(roleId);
    if (!otp) {
      return null;
    }
    return otp;
  } catch (error) {
    return new Error(`Error fetching otp by ID: ${error.message}`);
  }
};

const getOtpWhere= async (where) => {
    try {
      const otp = await OTP.findOne(where);
      if (!otp) {
        return null;
      }
      return otp;
    } catch (error) {
        console.log('error', error)
      return new Error(`Error fetching otp by ID: ${error.message}`);
    }
  };
// Update a otp by ID
const updateOtp = async (roleId, updatedData) => {
  try {
    const otp = await OTP.findByPk(roleId);
    if (!otp) {
      return null;
    }

    await otp.update(updatedData);
    return otp;
  } catch (error) {
    return new Error(`Error updating otp: ${error.message}`);
  }
};

// Delete a otp by ID
const deleteOtp = async (roleId) => {
  try {
    const otp = await OTP.findByPk(roleId);
    if (!otp) {
      return null;
    }

    await otp.destroy();
    return { message: "Otp deleted successfully" };
  } catch (error) {
    return new Error(`Error deleting otp: ${error.message}`);
  }
};

module.exports = {
  createOtp,
  getAllOtps,
  getOtpById,
  updateOtp,
  deleteOtp,
  getOtpWhere
};
