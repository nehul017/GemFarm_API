const { user: USER, role, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");

// Service function for creating a user
const createUser = async (userData) => {
  try {
    const existingUser = await USER.findOne({
      where: { email: userData.email },
    });

    if (existingUser) { 
      return new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await USER.create({
      ...userData,
      password: hashedPassword,
    });
    return newUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

// Service function for finding a user by email
const getUserByEmail = async (email) => {
  try {
    const user = await USER.findOne({
      attributes: [
        "id",
        "userName",
        "password",
        "email",
        "roleId",
        "createdAt",
        "updatedAt",
        [sequelize.col("role.role"), "role"], // Alias the role's name directly in the result
      ],
      where: { email },
      include: [{ model: role, as: "role", attributes: [] }], // Eager load role association
      raw: true,
    });
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
        expiresIn: "1h",
      }
    );
    return { user, token };
  } catch (error) {
    return new Error("Error logging in");
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  loginUser,
};
