import express from 'express';
import { buildAuthHeaderValue } from '../utils/nseAuth.js';

const router = express.Router();

router.get('/nse/auth-token', (req, res) => {
  try {
    const token = buildAuthHeaderValue();
    res.json({ authorization: token, memberId: process.env.NSE_MEMBER_ID });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
