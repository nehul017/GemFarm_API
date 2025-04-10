const Joi = require("joi");

const createFarmSchema = Joi.object({
  name: Joi.string().required(),
  farmImage: Joi.string().uri().optional().allow(null, ''),
  location: Joi.string().optional().allow(null, '')
});

const updateFarmSchema = Joi.object({
  name: Joi.string().optional(),
  farmImage: Joi.string().uri().optional().allow(null, ''),
  location: Joi.string().optional().allow(null, '')
}).min(1); // Ensure at least one field is provided

module.exports = {
  createFarmSchema,
  updateFarmSchema
};
