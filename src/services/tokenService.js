import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/config.js';
import agentService from './userService.js';
import { Token } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { tokenTypes } from '../config/tokens.js';
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};
const verifyToken = async (token, type) => {
    try {
        const payload = jwt.verify(token, config.jwt.secret);
        const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });

        if (!tokenDoc) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');

        }
        return tokenDoc;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log("TokenExpiredError", error)
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired');
        }
        throw error;
    }
}
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};
const generateResetPasswordToken = async (email) => {
    const user = await agentService.getAgentByEmail(email);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
};
const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};
export default {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
};
