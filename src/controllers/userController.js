import { userService } from '../services/index.js';
import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync.js'; // Assuming you have a utility for async error handling
import ApiError from '../utils/ApiError.js';

const getAgent = catchAsync(async (req, res) => {
    let agent = await userService.getUserById (req.user._id);
    if (!agent) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User is not Exist')
    }

    return res.status(httpStatus.OK).send({ agent });
})




export default { getAgent }
