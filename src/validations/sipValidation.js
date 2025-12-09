import Joi from 'joi';
// import { objectId } from './custom.validation.js';
import { objectId } from './customValidation.js';

const createSIP = {
  body: Joi.object().keys({
    schemeCode: Joi.string().required(),
    exchange: Joi.string().valid('NSE', 'BSE').required(),
    amount: Joi.number().min(500).required(),
    frequency: Joi.string().valid('MONTHLY', 'QUARTERLY', 'WEEKLY').required(),
    sipDate: Joi.number().min(1).max(28).required(),
    startDate: Joi.date().min('now').required(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  }),
};

const getSIP = {
  params: Joi.object().keys({
    sipId: Joi.string().custom(objectId).required(),
  }),
};

const updateSIP = {
  params: Joi.object().keys({
    sipId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      amount: Joi.number().min(500),
      frequency: Joi.string().valid('MONTHLY', 'QUARTERLY', 'WEEKLY'),
      sipDate: Joi.number().min(1).max(28),
      endDate: Joi.date().min('now'),
    })
    .min(1),
};

export default {
  createSIP,
  getSIP,
  updateSIP,
}; 