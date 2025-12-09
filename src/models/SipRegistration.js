import mongoose from 'mongoose';
const { Schema } = mongoose;

const RegDataSchema = new Schema({
  amc_code: String,
  sch_code: String,
  client_code: String,
  internal_ref_no: String,
  trans_mode: String,
  dp_txn_mode: String,
  start_date: String,
  frequency_type: String,
  frequency_allowed: String,
  installment_amount: String,
  status: String,
  member_code: String,
  folio_no: String,
  sip_remarks: String,
  installment_no: String,
  sip_mandate_id: String,
  sub_broker_code: String,
  euin_number: String,
  euin_declaration: String,
  dpc_flag: String,
  first_order_today: String,
  sub_broker_arn: String,
  end_date: String,
  primary_holder_mobile: String,
  primary_holder_email: String,
  filler_1: String,
  filler_2: String,
  filler_3: String,
  filler_4: String,
  filler_5: String,
  reg_id: String,
  reg_status: String,
  reg_remark: String
}, { _id: false });

const SipRegistrationSchema = new Schema({
  request_payload: { reg_data: [RegDataSchema] },
  response_payload: Object,
  status: { type: String, default: 'PENDING' },
  created_at: { type: Date, default: Date.now },
  updated_at: Date
});

export default mongoose.model('SipRegistration', SipRegistrationSchema);
