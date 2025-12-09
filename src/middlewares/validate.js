import Joi from 'joi'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'
import ApiError from '../utils/ApiError.js'
const validate = (schema) => (req, res, next) => {
  // Correcting the schema fields to match the expected parameters
  const validSchema = pick(schema, ['params', 'query', 'body']); // Fixed typo: 'query ' -> 'query'
  const object = pick(req, Object.keys(validSchema)); // Picking the valid schema from the request object
  // Validate the object using Joi
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false }) // Ensure Joi doesn't stop at the first error
    .validate(object);
  // If there's an error, send a detailed error message
  if (error) {
    console.log("errors in validation", error)
    const errorMessage = error.details.map((details) => details.message.replace(/"/g, '')).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  // If validation is successful, assign the validated values to req
  Object.assign(req, value);
  return next(); // Continue to the next middleware
};
export default validate;
