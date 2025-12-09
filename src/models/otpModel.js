import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
            unique: true, // One active OTP per user
        },
        otp: {
            type: String, // Hashed OTP
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

// Optional index to auto-remove expired OTPs if using TTL
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", otpSchema);

export { OTP };
