const roleService = require('../services/role.service');  // Adjust the path as needed

// Create a new role
const createRole = async (req, res) => {
  try {
    const {  role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role name are required.' });
    }

    const newRole = await roleService.createRole({ role });
    return res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await roleService.getRoleById(id);
    return res.status(200).json(role);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Update a role by ID
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedRole = await roleService.updateRole(id, updatedData);
    return res.status(200).json(updatedRole);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

// Delete a role by ID
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await roleService.deleteRole(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
