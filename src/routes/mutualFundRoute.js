import express from 'express'
import validate from '../middlewares/validate.js'
import { mutualFundController } from '../controllers/index.js'
// import auth from '../middlewares/auth.js'
import auth from '../middlewares/auth.js'
const router = express.Router();
router.get('/', auth('mutualfund'), mutualFundController.getMutualFundByQuery);

export default router