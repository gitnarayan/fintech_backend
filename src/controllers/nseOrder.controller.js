import { orderEntrySchema } from '../utils/validators.js';
import { callOrderEntryApi } from '../services/nseOrder.service.js';

async function placeOrder(req, res, next) {
  try {
    // 1) Validate incoming body as per Order Entry spec
    const { error, value } = orderEntrySchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details.map(d => d.message)
      });
    }

    const nsePayload = value;

    // 2) Call NSE Order Entry API
    const nseResponse = await callOrderEntryApi(nsePayload);

    // 3) Return response to client
    return res.status(200).json({
      success: true,
      message: 'Order API call completed',
      nse_status: nseResponse.status,
      nse_data: nseResponse.data
    });

  } catch (err) {
    return next(err);
  }
}

export { placeOrder };
