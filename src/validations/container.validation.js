const Joi = require("joi");

const createContainerSchema = Joi.object({
  farm_id: Joi.string().uuid().required(),
  autoGrowDeviceId: Joi.string().optional().allow(null, ''),
  blueLabDeviceId: Joi.string().optional().allow(null, ''),
  container_status: Joi.string().optional().allow(null, ''),
  container_crop: Joi.string().optional().allow(null, ''),
  container_image: Joi.string().uri().optional().allow(null, ''),
  harvest_date: Joi.date().optional().allow(null, ''),
});

const updateContainerSchema = Joi.object({
  autoGrowDeviceId: Joi.string().optional().allow(null, ''),
  blueLabDeviceId: Joi.string().optional().allow(null, ''),
  container_status: Joi.string().optional().allow(null, ''),
  container_crop: Joi.string().optional().allow(null, ''),
  container_image: Joi.string().uri().optional().allow(null, ''),
  harvest_date: Joi.date().optional().allow(null, ''),
}).min(1); // Ensure at least one field is provided

module.exports = {
  createContainerSchema,
  updateContainerSchema
};
