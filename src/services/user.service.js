const { user: USER, role, sequelize, otp: otpModel } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../templates/emailTemplate");
const { sendEmail } = require("../utils/email-sending");
const moment = require("moment/moment");
const supabase = require("../config/supabaseClient");

// Service function for creating a user
const createUser = async (userData, res) => {
  try {
    const existingUser = await USER.findOne({
      where: { email: userData.email },
    });

    if (existingUser) {
      return null;
    }

    userData.roleId = 5;

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await USER.create({
      ...userData,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return { user: newUser, token };
  } catch (error) {
    console.log("error", error);
    throw new Error("Error creating user");
  }
};

// Service function for finding a user by email
const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers({ email });
    if (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Error fetching user");
    }
    const user = data.users.find((u) => u.email === email);
    // const user = await USER.findOne({
    //   attributes: [
    //     "id",
    //     "username",
    //     "password",
    //     "profileImage",
    //     "email",
    //     "roleId",
    //     "createdAt",
    //     "updatedAt",
    //     [sequelize.col("role.role"), "role"], // Alias the role's name directly in the result
    //   ],
    //   where: { email },
    //   include: [{ model: role, as: "role", attributes: [] }], // Eager load role association
    //   raw: true,
    // });
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

// Service function for updating a user
const updateUser = async (id, updateData) => {
  try {
    const user = await USER.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    await user.update(updateData);
    return user;
  } catch (error) {
    console.log("error", error);
    throw new Error("Error updating user");
  }
};

const updateUserV2 = async (userId, updateData) => {
  console.log("updateData", updateData);
  try {
    const { data: oldProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single(); // Only 1 record expected`

    if (fetchError) {
      throw new Error("User not found or error fetching user");
    }

    // Step 2: Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: updateData.username,
        profileImage: updateData.profileImage || oldProfile.profileImage,
      })
      .eq("id", userId)
      .select("*")
      .maybeSingle(); // Prevents error if no row is returned

    if (updateError) {
      throw new Error(updateError.message);
    }

    console.log("updatedUser", updatedUser);
    return {
      id: updatedUser.id,
      username: updatedUser.full_name,
      profileImage: updatedUser.profileImage,
      phone: updatedUser.phone,
      email: updateData.email,
    };
  } catch (error) {
    console.log("error", error);
    throw new Error("Error updating user");
  }
};

// Service function for deleting a user
const deleteUser = async (id) => {
  try {
    const user = await USER.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    await user.destroy();
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting user");
  }
};

// Service function for user login
const loginUser = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Error("Invalid email or password");
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    return { user, token };
  } catch (error) {
    return new Error("Error logging in");
  }
};

const sendForgetPasswordEmail = async (email) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return new Error("User not found");
    }

    const generateOtp = () =>
      ("0".repeat(6) + Math.floor(Math.random() * 10 ** 6)).slice(-6);

    let otp = await generateOtp();

    const expireTime = moment().add(5, "minute").toISOString();

    await otpModel.create({
      otp,
      userId: user.id,
      expires: expireTime,
    });

    await sendEmail(email, "Forget Password", sendOTP(email, otp));

    return token;
  } catch (error) {
    return new Error("Error sending email");
  }
};
const getUserById = async (id) => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(id);

    if (error || !data.user) {
      throw new Error("User not found");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id) // id in profiles = id in auth.users
      .single(); // expect only one record

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    return {
      id: data.user.id,
      email: data.user.email,
      role: profile.role,
      username: profile.full_name,
      profileImage: profile.profileImage || "",
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Error fetching user by ID");
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  loginUser,
  sendForgetPasswordEmail,
  getUserById,
  updateUserV2,
};
