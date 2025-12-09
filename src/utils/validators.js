// const Joi = require('joi');

// const regDataSchema = Joi.object({
//   amc_code: Joi.string().max(50).required(),
//   sch_code: Joi.string().max(20).required(),
//   client_code: Joi.string().max(10).required(),
//   internal_ref_no: Joi.string().max(20).optional().allow(''),
//   trans_mode: Joi.string().valid('D','P2').required(),
//   dp_txn_mode: Joi.string().valid('C','N','P').required(),
//   start_date: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required(),
//   frequency_type: Joi.string().valid('WEEKLY','MONTHLY','QUARTERLY','SEMI-ANNUALLY','ANNUALLY','DAILY').required(),
//   frequency_allowed: Joi.string().valid('1').required(),
//   installment_amount: Joi.string().required(),
//   status: Joi.string().valid('1','0').required(),
//   member_code: Joi.string().required(),
//   folio_no: Joi.string().max(15).allow(''),
//   installment_no: Joi.alternatives().try(Joi.number().integer().min(1), Joi.string().allow('')).optional(),
//   sub_broker_arn: Joi.string().max(20).allow(''),
//   primary_holder_mobile: Joi.string().max(10).allow(''),
//   primary_holder_email: Joi.string().email().max(50).allow(''),
//   // other optional fields left tolerant:
// });

// const mainSchema = Joi.object({
//   reg_data: Joi.array().items(regDataSchema).min(1).max(50).required()
// });

// module.exports = { mainSchema };



import Joi from 'joi';

// ---------------- SIP REGISTRATION (old) ----------------
const regDataSchema = Joi.object({
  amc_code: Joi.string().max(50).required(),
  sch_code: Joi.string().max(20).required(),
  client_code: Joi.string().max(10).required(),
  internal_ref_no: Joi.string().max(20).optional().allow(''),
  trans_mode: Joi.string().valid('D', 'P2').required(),
  dp_txn_mode: Joi.string().valid('C', 'N', 'P').required(),
  start_date: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required(),
  frequency_type: Joi.string().valid(
    'WEEKLY',
    'MONTHLY',
    'QUARTERLY',
    'SEMI-ANNUALLY',
    'ANNUALLY',
    'DAILY'
  ).required(),
  frequency_allowed: Joi.string().valid('1').required(),
  installment_amount: Joi.string().required(),
  status: Joi.string().valid('1', '0').required(),
  member_code: Joi.string().required(),
  folio_no: Joi.string().max(15).allow(''),
  installment_no: Joi.alternatives().try(
    Joi.number().integer().min(1),
    Joi.string().allow('')
  ).optional(),
  sub_broker_arn: Joi.string().max(20).allow(''),
  primary_holder_mobile: Joi.string().max(10).allow(''),
  primary_holder_email: Joi.string().email().max(50).allow(''),
});

const mainSchema = Joi.object({
  reg_data: Joi.array().items(regDataSchema).min(1).max(50).required()
});

// ---------------- ORDER ENTRY (transaction/NORMAL) ----------------
const orderDetailSchema = Joi.object({
  order_ref_number: Joi.string().max(19).allow(''),
  scheme_code: Joi.string().max(20).required(),
  trxn_type: Joi.string().valid('P', 'R').required(),
  buy_sell_type: Joi.string().valid('FRESH', 'ADDITIONAL').required(),
  client_code: Joi.string().max(10).required(),
  demat_physical: Joi.string().valid('C', 'N', 'P').required(),
  order_amount: Joi.string().allow(''), // DECIMAL as string
  folio_no: Joi.string().max(15).allow(''),
  remarks: Joi.string().max(200).allow(''),
  kyc_flag: Joi.string().valid('Y', 'N').required(),
  sub_broker_code: Joi.string().max(15).allow(''),
  euin_number: Joi.string().max(20).allow(''),
  euin_declaration: Joi.string().valid('Y', 'N').required(),
  min_redemption_flag: Joi.string().valid('Y', 'N').required(),
  dpc_flag: Joi.string().valid('Y', 'N').required(),
  all_units: Joi.string().valid('Y', 'N').required(),
  redemption_units: Joi.string().allow(''),
  sub_broker_arn: Joi.string().max(20).allow(''),
  bank_ref_no: Joi.string().max(25).allow(''),
  account_no: Joi.string().max(20).allow(''),
  mobile_no: Joi.string().max(10).allow(''),
  email: Joi.string().max(50).allow(''),
  mandate_id: Joi.string().max(13).allow(''),
  filler1: Joi.string().allow('')
});

const orderEntrySchema = Joi.object({
  transaction_details: Joi.array().items(orderDetailSchema).min(1).max(50).required()
});

export { mainSchema, orderEntrySchema };
