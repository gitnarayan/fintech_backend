// import axios from 'axios';
// // const { buildNseAuthHeaders } = require('../utils/nseAuthHeaders');
// import { buildAuthHeadersObj } from '../utils/nseAuth.js';
// import NseRequestLog from '../models/NseRequestLog.js';
// import { retry } from '../helpers/retryHelper.js';

// const baseURL = process.env.NSE_API_BASE_URL;
// if (!baseURL) throw new Error('NSE_API_BASE_URL missing');

// async function callSipRegistrationApi(payload) {
//   const url = `${baseURL}/nsemfdesk/api/v2/transaction/NORMAL`;
//   // const headers = buildNseAuthHeaders();
//   const headers = buildAuthHeadersObj();

//   // Save request log (start)
//   const logEntry = new NseRequestLog({
//     endpoint: url,
//     method: 'POST',
//     request_headers: headers,
//     request_body: payload
//   });

//   // console.log("NSE SIP REQ HEADERS:", headers);
//   // console.log("NSE logEntry:", logEntry.request_body);
//   // return;
//   // Save request log (end)

//   try {
    
//     const timeout = parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10);
//     const maxRetries = parseInt(process.env.MAX_RETRIES || '2', 10);
    
//     const response = await retry(async () => {
//       return axios.post(url, payload, { headers, timeout });
//     }, maxRetries);
    
//     logEntry.response_status = response.status;
//     logEntry.response_body = response.data;
//     await logEntry.save();

//     return { status: response.status, data: response.data };
//   } catch (err) {
//     logEntry.error = err.toString();
//     if (err.response) {
//       logEntry.response_status = err.response.status;
//       logEntry.response_body = err.response.data;
//     }
//     await logEntry.save();
//     throw err;
//   }
// }

// export { callSipRegistrationApi };


import axios from 'axios';
import { buildAuthHeadersObj } from '../utils/nseAuth.js';
import NseRequestLog from '../models/NseRequestLog.js';
import { retry } from '../helpers/retryHelper.js';

const baseURL = process.env.NSE_API_BASE_URL;
if (!baseURL) throw new Error('NSE_API_BASE_URL missing');

async function callSipRegistrationApi(payload) {

  const url = `${baseURL}/nsemfdesk/api/v2/transaction/NORMAL`;

  // ✅ IMPORTANT FIX — await added
  const headers = await buildAuthHeadersObj();

  // Save request log (start)
  const logEntry = new NseRequestLog({
    endpoint: url,
    method: 'POST',
    request_headers: headers,
    request_body: payload
  });

  try {

    const timeout = parseInt(process.env.REQUEST_TIMEOUT_MS || '30000', 10);
    const maxRetries = parseInt(process.env.MAX_RETRIES || '2', 10);

    const response = await retry(async () => {
      return axios.post(
        url,
        payload,
        {
          headers,
          timeout,
          withCredentials: true   // ✅ REQUIRED FOR COOKIE SESSION
        }
      );
    }, maxRetries);

    logEntry.response_status = response.status;
    logEntry.response_body = response.data;
    await logEntry.save();

    return {
      status: response.status,
      data: response.data
    };

  } catch (err) {

    logEntry.error = err.toString();

    if (err.response) {
      logEntry.response_status = err.response.status;
      logEntry.response_body = err.response.data;
    }

    await logEntry.save();
    throw err;
  }
}

export { callSipRegistrationApi };
