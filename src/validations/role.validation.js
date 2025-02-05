const Joi = require("joi");
const { param } = require("../routes/role.routes");

/**
 * CreateRole.
 */
const createRole = {
  body: Joi.object().keys({
    role: Joi.string().trim().required(),
  }),
};

const updateRole = {
  params: Joi.object().keys({
    id: Joi.string().trim().required(),
  }),
  body: Joi.object().keys({
    role: Joi.string().trim().required(),
  }),
};

/**
 * All Role validations are exported from here 👇
 */
module.exports = {
  createRole,
  updateRole,
};
