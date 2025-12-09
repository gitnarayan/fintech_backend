import logger from '../config/logger.js'
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error('Error in catchAsync:', err);
    next(err)
  });
};
export default catchAsync;
