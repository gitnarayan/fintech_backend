import SipRegistration from '../models/SipRegistration.js';
import { mainSchema } from '../utils/validators.js';
import { callSipRegistrationApi } from '../services/nseSip.service.js';

async function registerSIP(req, res, next) {
  try {
    // Validate
    const { error, value } = mainSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, error: error.details.map(d => d.message) });

    const sipDoc = new SipRegistration({ request_payload: value, status: 'PENDING' });
    await sipDoc.save();
    const nsePayload = value;

    // Call NSE API
    const nseResponse = await callSipRegistrationApi(nsePayload);

    // Save response into DB
    sipDoc.response_payload = nseResponse.data;
    sipDoc.status = 'COMPLETED';
    sipDoc.updated_at = new Date();
    await sipDoc.save();

    return res.status(200).json({
      success: true,
      message: 'SIP registration call completed',
      nse_status: nseResponse.status,
      nse_data: nseResponse.data,
      local_id: sipDoc._id
    });

  } catch (err) {
    try {
      if (req && req.body) {
        await SipRegistration.findOneAndUpdate(
          { 'request_payload.reg_data.internal_ref_no': req.body?.reg_data?.[0]?.internal_ref_no } || {},
          { status: 'FAILED', updated_at: new Date(), response_payload: { error: err.toString() } }
        );
      }
    } catch (e) { /* ignore */ }
    return next(err);
  }
}

export { registerSIP };
