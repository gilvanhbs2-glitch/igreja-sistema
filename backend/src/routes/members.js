import express from 'express';
import {
  listMembers,
  createMember,
  updateMember,
  deleteMember,
  getMemberById,
} from '../services/memberService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(listMembers());
});

router.post('/', (req, res) => {
  try {
    const member = createMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const member = updateMember(Number(req.params.id), req.body);
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    deleteMember(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  const member = getMemberById(Number(req.params.id));
  if (!member) return res.status(404).json({ error: 'Membro não encontrado.' });
  res.json(member);
});

export default router;
