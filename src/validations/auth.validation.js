const Joi = require("joi");

/**
 * Login.
 */
const login = {
  body: Joi.object().keys({
    email: Joi.string()
      .trim()
      .email()
      .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Email must be a valid email address.',
      }),
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Password must be at least 8 characters long.',
      }),
  }),
};
/**
 * Register.
 */
const register = {
  body: Joi.object().keys({
    username: Joi.string().trim().required(),
    email: Joi.string()
      .trim()
      .email()
      .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Email must be a valid email address.',
      }),
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Password must be at least 8 characters long.',
      }),
  }),
};

/**
 * Send OTP.
 */
const sendOtp = {
  body: Joi.object().keys({
    email: Joi.string()
      .trim()
      .email()
      .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Email must be a valid email address.',
      }),
  }),
};

/**
 *log out
 */
const logout = {
  body: Joi.object().keys({
    fcmToken: Joi.string().optional().allow(""),
  }),
};

/**
 * Verify OTP.
 */
const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string()
      .trim()
      .email()
      .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Email must be a valid email address.',
      }),
    otp: Joi.string().trim().required(),
  }),
};

/**
 * Change password.
 */
const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().trim().required(),
    newPassword: Joi.string().trim().required(),
  }),
};

/**
 * Forgot password.
 */
const forgot = {
  body: Joi.object().keys({
    email: Joi.string()
      .trim()
      .email()
      .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Email must be a valid email address.',
      }),
  }),
};

const reset = {
  body: Joi.object().keys({
    password: Joi.string()
      .trim()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Password must be at least 8 characters long.',
      }),
    confirmPassword: Joi.string()
      .trim()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
      .required()
      .messages({
        'string.pattern.base': 'Confirm Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Confirm Password must be at least 8 characters long.',
      }),
    email: Joi.string()
      .trim()
      .email()
      .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Email must be a valid email address.',
      }),
  }),
};

const verfiyOTP = {
  body: Joi.object().keys({
    otp: Joi.string()
      .trim()
      .length(6)
      .pattern(/^\d{6}$/)
      .required()
      .messages({
        "string.length": "OTP must be exactly 6 digits.",
        "string.pattern.base": "OTP must contain only numbers.",
        "any.required": "OTP is required.",
      }),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    username: Joi.string().trim().required(),
    email: Joi.string()
      .trim()
      .email()
      .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
      .required()
      .messages({
        'string.pattern.base': 'Email must be a valid email address.',
      }),
  }),
};

/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  login,
  sendOtp,
  verifyOtp,
  forgot,
  changePassword,
  logout,
  register,
  reset,
  verfiyOTP,
  updateProfile
};
