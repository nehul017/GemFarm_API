const supabase = require("../config/supabaseClient");
const { container: Container, farm } = require("../models");

// Create a new Container
const createContainer = async (payload) => {
  try {
    const { data, error } = await supabase.from("containers").insert([payload]);
    console.log('error', error)

    if (error) throw error;

    return data;
  } catch (error) {
    console.log('error', error)
    return new Error(`Error creating container: ${error.message}`);
  }
};

// Get all Containers
const getAllContainers = async (where) => {
  try {
    return await Container.findAll({
      where,
      include: [
        {
          model: farm,
          as: "farm",
          attributes: ["id", "name", "location"],
        },
      ],
    });
  } catch (error) {
    return new Error(`Error fetching containers: ${error.message}`);
  }
};

// Get Container by ID
const getContainerById = async (id) => {
  try {
    const container = await Container.findByPk(id);
    return container || null;
  } catch (error) {
    return new Error(`Error fetching container by ID: ${error.message}`);
  }
};

// Get Container with where clause
const getContainerWhere = async (where) => {
  try {
    const container = await Container.findOne({ where });
    return container || null;
  } catch (error) {
    return new Error(`Error fetching container: ${error.message}`);
  }
};

// Update Container by ID
const updateContainer = async (id, data) => {
  try {
    const container = await Container.findByPk(id);
    if (!container) return null;

    await container.update(data);
    return container;
  } catch (error) {
    return new Error(`Error updating container: ${error.message}`);
  }
};

// Delete Container by ID
const deleteContainer = async (id) => {
  try {
    const container = await Container.findByPk(id);
    if (!container) return null;

    await container.destroy();
    return { message: "Container deleted successfully" };
  } catch (error) {
    return new Error(`Error deleting container: ${error.message}`);
  }
};

module.exports = {
  createContainer,
  getAllContainers,
  getContainerById,
  getContainerWhere,
  updateContainer,
  deleteContainer,
};
