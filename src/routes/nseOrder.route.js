import express from 'express';
import { placeOrder } from '../controllers/nseOrder.controller.js';

const router = express.Router();

// POST /api/v1/nse/order
router.post('/order', placeOrder);

export default router;
