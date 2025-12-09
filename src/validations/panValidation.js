import Joi from "joi";

export const panValidation = Joi.object({
  pan: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .required(),
  name: Joi.string().min(3).required(),
  dob: Joi.string().required(),
});
