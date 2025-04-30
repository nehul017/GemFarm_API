const supabase = require("../config/supabaseClient");
const apiResponse = require("./api.response");

// middlewares/roleCheck.js
module.exports = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1];

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      // Attach user to request
      req.user = user;

      // Check role in `profiles` table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        return apiResponse.FORBIDDEN({
          res,
          message: "You don't have permission to perform this action",
        });
      }

      if (!allowedRoles.includes(profile.role)) {
        return apiResponse.FORBIDDEN({
          res,
          message: "You don't have permission to perform this action",
        });
      }

      // Attach user role to request
      req.userRole = profile.role;

      next();
    } catch (err) {
      console.error("Authorization middleware error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
