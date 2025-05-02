const supabase = require("../config/supabaseClient");
const farmService = require("../services/farm.service");

// Create Farm
const createFarm = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      location: req.body.location,
      farm_image: req.body.farmImage,
    };
    const result = await farmService.createFarm(data);
    if (result instanceof Error) throw result;
    return res
      .status(200)
      .json({ message: "Farm created successfully", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all Farms
const getAllFarms = async (req, res) => {
  try {
    const { data, error } = await supabase.from("farms").select("*");

    if (error) throw error;

    return res
      .status(200)
      .json({ message: "Farm fetched successfully", data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Farm by ID
const getFarmById = async (req, res) => {
  try {

    const { data, error } = await supabase
    .from("farms")
    .select(`
      *,
      containers(*)
      `)
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    if (!data) return res.status(404).json({ message: "Farm not found" });
    return res
      .status(200)
      .json({ message: "Farm fetched successfully", data: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Farm
const updateFarm = async (req, res) => {
  try {
    const result = await farmService.updateFarm(req.params.id, req.body);
    if (!result)
      return res.status(404).json({ message: "Farm model not found" });
    return res
      .status(200)
      .json({ message: "Farm updated successfully", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Farm
const deleteFarm = async (req, res) => {
  try {
    const result = await farmService.deleteFarm(req.params.id);
    if (!result)
      return res.status(404).json({ message: "Farm model not found" });
    return res
      .status(200)
      .json({ message: "Farm deleted successfully", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFarm,
  getAllFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
};
