import express from 'express';
import { listPresences, registerPresenceByQr } from '../services/presenceService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(listPresences());
});

router.post('/', (req, res) => {
  try {
    const { codigo } = req.body;
    const result = registerPresenceByQr(codigo);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
