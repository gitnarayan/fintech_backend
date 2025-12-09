import express from 'express'
import { userController } from '../controllers/index.js'
import auth from '../middlewares/auth.js'
const router = express.Router();
router.get('/', auth('getDocuments'), userController.getAgent);



export default router