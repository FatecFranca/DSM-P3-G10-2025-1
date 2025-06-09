import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'User routes funcionando!' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

export default router;