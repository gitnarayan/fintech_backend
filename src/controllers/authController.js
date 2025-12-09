import { userService, authService, tokenService } from '../services/index.js'; // Import userService
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js'


import {  verifyOtp } from '../utils/sendAndVerifyOTP.js';
import userController from './userController.js';



const createUser = catchAsync(async (req, res) => {
    let user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens })

});
const verifyEmailOTP = catchAsync(async (req, res) => {
    let user = await userService.getuserByEmail(req.body.email);
    // console.log(" user ", user)
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email not exist")
    }
    let verifyUser = await verifyOtp(user._id, req.body.otp);
    const tokens = await tokenService.generateAuthTokens(user);
    user.isVerifiedEmail = true;
    await user.save();
    return res.status(200).send({ user, tokens });
})
const getUser = catchAsync(async (req, res) => {
    let user = await userService.getUserById(req.params.id);
    user = await userService.getUserById(req.params.id);
    res.status(200).send({ user });
})
const logInUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);

    const tokens = await tokenService.generateAuthTokens(user);
    return res.status(httpStatus.OK).send({ user, tokens });
})

const logout = catchAsync(async (req, res) => {
    let logout = await authService.logout(req.body.refreshToken);
    res.status(httpStatus.OK).send({ logout });
});



export default {
    createUser, getUser, logInUser, logout, 
};
