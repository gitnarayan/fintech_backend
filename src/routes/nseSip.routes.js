import express from 'express';

const router = express.Router();
import { registerSIP } from '../controllers/nseSip.controller.js';

// POST /api/v1/nse/sip/register
router.post('/register', registerSIP);

export default router;
