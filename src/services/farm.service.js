const supabase = require("../config/supabaseClient");
const { farm: FarmModel, container } = require("../models");


// Create a new FarmModel
const createFarm = async (data) => {
  try {
    // const newFarm = await FarmModel.create(data);
    // return newFarm;
    const { data: newFarm, error } = await supabase
      .from("farms") // your Supabase table name
      .insert([data])
      .select()
      .single(); // return the inserted row

    if (error) {
      console.log('error', error)
      throw new Error(error.message);
    }

    return newFarm;
  } catch (error) {
    console.log('error', error)
    return new Error(`Error creating farm model: ${error.message}`);
  }
};

// Get all FarmModels
const getAllFarms = async () => {
  try {
    return await FarmModel.findAll();
  } catch (error) {
    return new Error(`Error fetching farm models: ${error.message}`);
  }
};

// Get FarmModel by ID
const getFarmById = async (id) => {
  try {
    const farm = await FarmModel.findOne({
      where: { id },
      include: [
        {
          model: container, // example associated model
          as: "containers", // make sure this alias matches the association
        },
      ],
    });
    return farm || null;
  } catch (error) {
    return new Error(`Error fetching farm model by ID: ${error.message}`);
  }
};

// Get FarmModel with where clause
const getFarmWhere = async (where) => {
  try {
    const farm = await FarmModel.findOne({ where });
    return farm || null;
  } catch (error) {
    return new Error(`Error fetching farm model: ${error.message}`);
  }
};

// Update FarmModel by ID
const updateFarm = async (id, data) => {
  try {
    const farm = await FarmModel.findByPk(id);
    if (!farm) return null;

    await farm.update(data);
    return farm;
  } catch (error) {
    return new Error(`Error updating farm model: ${error.message}`);
  }
};

// Delete FarmModel by ID
const deleteFarm = async (id) => {
  try {
    const farm = await FarmModel.findByPk(id);
    if (!farm) return null;

    await farm.destroy();
    return { message: "Farm model deleted successfully" };
  } catch (error) {
    return new Error(`Error deleting farm model: ${error.message}`);
  }
};

module.exports = {
  createFarm,
  getAllFarms,
  getFarmById,
  getFarmWhere,
  updateFarm,
  deleteFarm,
};
