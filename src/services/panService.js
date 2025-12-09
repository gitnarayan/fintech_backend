import axios from "axios";
import { sandboxPanConfig } from "../config/sandboxPanConfig.js";
import PanVerification from "../models/panVerificationModel.js";

export const verifyPanService = async ({ pan, name, dob }) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `api-key ${sandboxPanConfig.apiKey}`,
      "X-API-KEY": sandboxPanConfig.apiKey,
      "X-API-SECRET": sandboxPanConfig.apiSecret,
    };


    const payload = {
      pan,
      name,
      dob,
    };

    const response = await axios.post(sandboxPanConfig.url, payload, {
      headers,
      timeout: sandboxPanConfig.timeout,
    });

    const data = response.data;

    let status = "MISMATCH";
    if (data?.nameMatch === true || data?.match === true) {
      status = "VERIFIED";
    }

    const saved = await PanVerification.create({
      panNumber: pan,
      name,
      dob,
      status,
      provider: "sandbox",
      requestId: data?.requestId || null,
      response: data,
      verifiedAt: status === "VERIFIED" ? new Date() : null,
    });

    return { status, data: saved };
  } catch (error) {
    const resp = error.response || {};
    await PanVerification.create({
      panNumber: pan,
      name,
      dob,
      status: "ERROR",
      provider: "sandbox",
      response: {
        message: error.message,
        status: resp.status || null,
        data: resp.data || null,
      },
    });

    const statusPart = resp.status ? ` (status ${resp.status})` : '';
    throw new Error("PAN verification failed: " + error.message + statusPart + (resp.data ? ` - ${JSON.stringify(resp.data)}` : ''));
  }
};
