import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Review routes funcionando!' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get all reviews' });
});

export default router;