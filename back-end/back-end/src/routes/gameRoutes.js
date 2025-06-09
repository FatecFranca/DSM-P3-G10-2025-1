import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Game routes funcionando!' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get all games' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get game ${req.params.id}` });
});

export default router;