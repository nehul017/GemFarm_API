const apiResponse = require("./api.response");

// middlewares/roleCheck.js
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      return next(); // Allow access if the user's role is in the allowedRoles array
    }
    return apiResponse.FORBIDDEN({
      res,
      message: "You don't have permission to perform this action",
    });
  };
};
