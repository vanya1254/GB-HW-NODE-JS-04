const Joi = require("joi");

const idSchema = Joi.object({
  id: Joi.number().min(1).required(),
});

const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  login: Joi.string().min(6).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  age: Joi.number().integer().min(14),
});

module.exports = { idSchema, userSchema };
