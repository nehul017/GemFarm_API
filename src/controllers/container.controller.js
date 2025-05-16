const supabase = require("../config/supabaseClient");
const containerService = require("../services/container.service");

// Create Container
const createContainer = async (req, res) => {
  try {
    const result = await containerService.createContainer(req.body);
    if (result instanceof Error) throw result;
    return res
      .status(200)
      .json({ message: "Container created successfully", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all Containers
const getAllContainers = async (req, res) => {
  try {
    const { farm_id } = req.query;
    const where = {};
    if (farm_id) {
      where.farm_id = farm_id;
    }

    const { data, error } = await supabase
      .from("containers")
      .select("*")
      .eq("farm_id", farm_id);
      
    if (error) throw error;

    return res
      .status(200)
      .json({ message: "Containers fetched successfully", data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Container by ID
const getContainerById = async (req, res) => {
  try {
    const result = await containerService.getContainerById(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Container not found" });
    return res
      .status(200)
      .json({ message: "Container fetched successfully", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Container
const updateContainer = async (req, res) => {
  try {
    const result = await containerService.updateContainer(
      req.params.id,
      req.body
    );
    if (!result)
      return res.status(404).json({ message: "Container not found" });
    return res
      .status(200)
      .json({ message: "Container updated successfully", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Container
const deleteContainer = async (req, res) => {
  try {
    const result = await containerService.deleteContainer(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Container not found" });
    return res
      .status(200)
      .json({ message: "Container deleted successfully", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Container by Sensor Data
const getContainerBySensorData = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .eq("container_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log('data', data)
    return res
      .status(200)
      .json({ message: "Sensor data fetched successfully", data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createContainer,
  getAllContainers,
  getContainerById,
  updateContainer,
  deleteContainer,
  getContainerBySensorData,
};
