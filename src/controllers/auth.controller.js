const userService = require("../services/user.service");

// Controller function for registering a user
const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).send({
      message: "User registered successfully",
      user: user,
    });
  } catch (err) {
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
    console.log('err', err)
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

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
