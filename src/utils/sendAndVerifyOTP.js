import { OTP } from '../models/index.js'

import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import ApiError from './ApiError.js';
import { sendEmail } from './sendEmail.js';

// Generate a secure 6-digit OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// Send OTP
const getOTP = async (userId) => {

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expiry in 5 minutes
    // console.log("hashedOtp,", hashedOtp)
    await OTP.findOneAndUpdate(
        { userId },
        { otp: hashedOtp, expiresAt },
        { upsert: true, new: true }
    );
    return otp
};

const resendEmailOTP = async (userId, email) => {

    // Find the latest OTP entry for this user with only necessary fields
    const existingOtp = await OTP.findOne({ userId })
        .sort({ createdAt: -1 })
        .select("expiresAt");

    if (existingOtp) {
        const timeRemaining = (existingOtp.expiresAt - Date.now()) / 1000;

        // Enforce cooldown (Allow resend only after 1 min)
        if (timeRemaining > 240) {
            throw new ApiError(400, `Please wait ${Math.ceil(timeRemaining - 240)} seconds before requesting a new OTP.`);
        }
    }
    // Generate new OTP and hash it
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expiry in 5 minutes
    // Update existing OTP or create a new one
    await OTP.findOneAndUpdate(
        { userId },
        { otp: hashedOtp, expiresAt },
        { upsert: true, new: true }
    );
    // Send OTP via email
    await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}. It will expire in 5 minutes.`);

    return { message: "OTP resent successfully" };
};

// Verify OTP
const verifyOtp = async (userId, otp) => {
    const otpRecord = await OTP.findOne({ userId });
    console.log("otpRecord,", otpRecord)
    if (!otpRecord) {
        throw new ApiError(400, 'OTP required!...');
    }
    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ userId }); // Clean up expired OTP
        throw new ApiError(400, 'OTP expired. Please request a new OTP.');
    }
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
        throw new ApiError(400, 'Invalid OTP. Please try again.');
        // return res.status(400).json({ message: 'Invalid OTP. / try again.' });
    }
    await OTP.deleteOne({ userId }); // Clean up expired OTP
    return

};


export { getOTP, verifyOtp, resendEmailOTP };