const jwt = require("jsonwebtoken");
const apiResponse = require("../middlewares/api.response");
const messages = require("../contants/message.json");
const { user, role, sequelize } = require("../models");

// Required Config
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if Authorization header is present and if it follows "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return apiResponse.UNAUTHORIZED({ res, message: messages.unauthorized });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return apiResponse.UNAUTHORIZED({ res, message: messages.unauthorized });
  }

  try {
    // Verify token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ success: false, message: messages.token_expired });
        } else {
          return res.status(400).json({ success: false, message: err.message });
        }
      }

      // Find user and include role association
      const foundUser = await user.findOne({
        attributes: [
          "id",
          "username",
          "email",
          "roleId",
          "createdAt",
          "updatedAt",
          [sequelize.col("role.role"), "role"], // Alias the role's name directly in the result
        ],
        where: { id: decoded.id },
        include: [{ model: role, as: "role", attributes: [] }], // Eager load role association
        raw: true, // Return plain JSON object
      });

      if (!foundUser) {
        return apiResponse.UNAUTHORIZED({
          res,
          message: messages.invalid_token,
        });
      }

      req.user = foundUser; // Attach user data (including role) to the request object
      next(); // Proceed to the next middleware
    });
  } catch (e) {
    return apiResponse.UNAUTHORIZED({ res, message: messages.unauthorized });
  }
};
