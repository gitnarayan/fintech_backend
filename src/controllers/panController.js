import { verifyPanService } from "../services/panService.js";
import { panValidation } from "../validations/panValidation.js";

export const verifyPan = async (req, res) => {
  try {
    const { error, value } = panValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await verifyPanService(value);

    return res.status(200).json({
      success: true,
      message: "PAN verification completed",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
