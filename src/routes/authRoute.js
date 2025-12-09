import express from 'express'
import validate from '../middlewares/validate.js'
import authValidation from '../validations/authValidation.js'
import { authController } from '../controllers/index.js'

import auth from '../middlewares/auth.js'
// const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/signUp', validate(authValidation.createuser), authController.createUser);


router.post('/login', validate(authValidation.logIn), authController.logInUser);
router.post('/logout', validate(authValidation.logout), authController.logout);






export default router;
