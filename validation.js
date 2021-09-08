const Joi = require("joi");
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(50).required(),
    email: Joi.string().min(6).max(60).email().required(),
    password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  }).options({ abortEarly: false });
  return schema.validate(data);
};
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(60).email().required(),
    password: Joi.string().min(6),
  }).options({ abortEarly: false });
  return schema.validate(data);
};

module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;