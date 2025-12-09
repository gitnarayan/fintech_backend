import { userService, tokenService } from './index.js'; // Import userService
import { User, } from '../models/index.js'; // Import userService
import ApiError from '../utils/ApiError.js'
import httpStatus from 'http-status'
import { Token } from '../models/index.js'
import { tokenTypes } from '../config/tokens.js'
import { sendEmail } from '../utils/sendEmail.js';




const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (!user?.isActive || user?.role !== "user") {
        throw new ApiError(httpStatus.FORBIDDEN, 'UNAUTHORIZED user');
    }
    return user;
};

const getUserById = async (id) => {
    const User = await UserService.getUserById(id);
    return User;
};


const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Not found');
    }
    await refreshTokenDoc.deleteOne();
    return { msg: "successfully logout" }
};
const updatePassword = async (data) => {
    let getUser = await UserService.getUserByEmail(data.email);
    console.log(getUser)
    if (!getUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User Not found');
    }
    getUser.password = data.password;
    await getUser.save();
    return { msg: "Password updated successfully" }

}

const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
        console.log("resetPasswordTokenDoc", resetPasswordTokenDoc)
        const User = await UserService.getUserById(resetPasswordTokenDoc.user);
        // console.log()
        console.log("User in authservise ", User)
        if (!User) {
            throw new Error(httpStatus.BAD_REQUEST, 'User not found');
        }
        await UserService.updateUserById(User.id, { password: newPassword });
        await Token.deleteMany({ User: User.id, type: tokenTypes.RESET_PASSWORD });
        const htmlContent = ` <html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;">
        <div>
            <img src="https://more-matrimony.blr1.vultrobjects.com/logo/icon.png" alt="moreMatrimony Logo" style="width: 80px; margin-bottom: 20px;">
        </div>
        <h1 style="color: #f21a2d;">Your Password Has Been Successfully Reset</h1>
        <p style="font-size: 16px;">Dear <strong> ${User?.firstName}</strong>,</p>
        <p style="font-size: 14px;">Your password has been successfully reset. Below are your new login details:</p>
        <div style="background: #f8f8f8; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p style="font-size: 16px;"><strong>Email:</strong> ${User?.email}</p>
            <p style="font-size: 16px;"><strong>New Password:</strong> ${newPassword}</p>
        </div>
        <p style="font-size: 14px;">For security reasons, we recommend changing your password immediately after logging in.</p>
        <p>If you didn't request this change, please contact our support team at <a href="mailto:support@morematrimony.com" style="color: #f21a2d; text-decoration: none;">support@morematrimony.com</a>.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">© 2024 moreMatrimony Matrimony. All rights reserved.</p>
    </div>
</body>
</html>
`
        // const html=
        sendEmail(User.email, 'Password Reset Confirmation', htmlContent);
    } catch (error) {
        console.log(error)
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
};

const changePassword = async (UserId, oldPassword, password) => {
    console.log("agnet id ", UserId)
    const User = await User.findById(UserId);
    if (!User) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    const isMatch = await User.isPasswordMatch(oldPassword)
    if (!isMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
    }
    User.password = password
    await User.save();
};


export default {
    logout, resetPassword, loginUserWithEmailAndPassword, loginUserWithEmailAndPassword, changePassword,
    updatePassword
}