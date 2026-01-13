import { User } from '../models/index.js'; // Import the User model
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status'
const createUser = async (bodyData) => {

    const user = await User.create(bodyData);
    return user;
};
const getUserById = async (UserId) => {
    const user = await User.findById(UserId).select({ role: 0, password: 0, __v: 0 })
    return user;
};
// Function to get a User by their ID
const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    console.log("User by email", User)
    return user;
};
const updateMyProfile = async (UserId, updateBody) => {
    // console.log("update body data ", updateBody)
    const User = await getUserById(UserId);
    if (!User) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, UserId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist!');
    }
    if (updateBody.mobile && (await User.isMobileNumberTaken(updateBody.mobile, UserId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile number already exist!');
    }
    Object.assign(User, updateBody);
    await User.save();
    return User;
};


const updateUserById = async (UserId, updateBody) => {
    console.log("UserId", UserId)
    console.log("updateBody", updateBody)
    const User = await getUserById(UserId);
    console.log("User", User)
    if (!User) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, UserId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exist!');
    }
    Object.assign(User, updateBody);
    await User.save();
    return User;
};
const upadteIsAcitveUser = async (UserId) => {

    const User = await getUserById(UserId);
    if (!User) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    User.isActive = !User.isActive
    await User.save();
    return User;
};



export default { updateMyProfile, upadteIsAcitveUser, updateUserById, getUserById, getUserByEmail, createUser };
