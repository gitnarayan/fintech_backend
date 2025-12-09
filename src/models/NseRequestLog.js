import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NseRequestLogSchema = new Schema({
  endpoint: String,
  method: String,
  request_headers: Object,
  request_body: Object,
  response_status: Number,
  response_body: Object,
  error: String,
  created_at: { type: Date, default: Date.now }
});
export default mongoose.model('NseRequestLog', NseRequestLogSchema);
