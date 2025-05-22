const Joi = require("joi");

const createContainerSchema = Joi.object({
  farm_id: Joi.string().uuid().required(), // required based on your earlier schema
  container_name: Joi.string().optional().allow(null, ""),
  container_crop: Joi.string().optional().allow(null, ""),
  crop_category: Joi.string().optional().allow(null, ""),
  crop_variety: Joi.string().optional().allow(null, ""),
  auto_grow_device_id: Joi.string().optional().allow(null, ""),
  blue_lab_device_id: Joi.string().optional().allow(null, ""),
  container_status: Joi.string().optional().allow(null, ""),
  harvest_system: Joi.string().optional().allow(null, ""),
  harvest_date: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date(), Joi.allow(null))
    .optional(),
  container_image: Joi.string().uri().optional().allow(null, ""),

  container_size: Joi.string().optional().allow(null, ""),
  num_plant_sites: Joi.number().integer().positive().optional().allow(null),
  planting_date: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date(), Joi.allow(null))
    .optional(),
  time_to_first_harvest: Joi.string().optional().allow(null, ""),
  harvest_frequency: Joi.string().optional().allow(null, ""),
});


const updateContainerSchema = Joi.object({
  autoGrowDeviceId: Joi.string().optional().allow(null, ""),
  blueLabDeviceId: Joi.string().optional().allow(null, ""),
  container_status: Joi.string().optional().allow(null, ""),
  container_crop: Joi.string().optional().allow(null, ""),
  container_image: Joi.string().uri().optional().allow(null, ""),
  harvest_date: Joi.date().optional().allow(null, ""),
  container_size: Joi.string().optional().allow(null, ""),
  num_plant_sites: Joi.number().integer().positive().optional().allow(null),
  planting_date: Joi.alternatives()
    .try(Joi.string().isoDate(), Joi.date(), Joi.allow(null))
    .optional(),
  time_to_first_harvest: Joi.string().optional().allow(null, ""),
  harvest_frequency: Joi.string().optional().allow(null, ""),
}).min(1); // Ensure at least one field is provided


module.exports = {
  createContainerSchema,
  updateContainerSchema,
};
