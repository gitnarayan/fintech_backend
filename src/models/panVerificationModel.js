import mongoose from "mongoose";

const panSchema = new mongoose.Schema(
  {
    panNumber: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    dob: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "MISMATCH", "ERROR"],
      default: "PENDING",
    },
    provider: { type: String, default: "sandbox" },
    requestId: { type: String },
    response: { type: mongoose.Schema.Types.Mixed },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("PanVerification", panSchema);
