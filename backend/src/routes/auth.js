import express from 'express';
import { authenticateUser } from '../services/authService.js';

const router = express.Router();

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = authenticateUser(email, password);
    res.json({ ok: true, user });
  } catch (error) {
    res.status(401).json({ ok: false, error: error.message });
  }
});

export default router;
