const { role: ROLE } = require("../models"); // Adjust the path to your models directory

// Create a new role
const createRole = async (roleData) => {
  try {
    const newRole = await ROLE.create(roleData);
    return newRole;
  } catch (error) {
    throw new Error(`Error creating role: ${error.message}`);
  }
};

// Get all role
const getAllRoles = async () => {
  try {
    const allRoles = await ROLE.findAll();
    return allRoles;
  } catch (error) {
    throw new Error(`Error fetching role: ${error.message}`);
  }
};

// Get a role by ID
const getRoleById = async (roleId) => {
  try {
    const role = await ROLE.findByPk(roleId);
    if (!role) {
      throw new Error("Role not found");
    }
    return role;
  } catch (error) {
    throw new Error(`Error fetching role by ID: ${error.message}`);
  }
};

// Update a role by ID
const updateRole = async (roleId, updatedData) => {
  try {
    const role = await ROLE.findByPk(roleId);
    if (!role) {
      throw new Error("Role not found");
    }

    await role.update(updatedData);
    return role;
  } catch (error) {
    throw new Error(`Error updating role: ${error.message}`);
  }
};

// Delete a role by ID
const deleteRole = async (roleId) => {
  try {
    const role = await ROLE.findByPk(roleId);
    if (!role) {
      throw new Error("Role not found");
    }

    await role.destroy();
    return { message: "Role deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting role: ${error.message}`);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
