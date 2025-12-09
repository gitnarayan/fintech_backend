import mongoose from "mongoose";
import { toJSON, paginate } from "./plugins/index.js";
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,

            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },
        countryCode: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    }, { timestamps: true }
);

// Index for unique email
userSchema.index({ email: 1 }, { unique: true });

// Add plugin that converts mongoose to JSON
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Optional: Hash password before saving (add bcrypt and implement if needed)
userSchema.methods.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
};
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model("User", userSchema);

export { User };
