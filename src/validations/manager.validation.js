const Joi = require("joi");

const createManagerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().label("Manager Name"),
  email: Joi.string().email({ tlds: { allow: false } }).required().label("Manager Email"),
  farmIds: Joi.array()
    .items(Joi.string().uuid().label("Farm ID"))
    .min(1)
    .required()
    .label("Assigned Farms"),
});

module.exports = { createManagerSchema };
