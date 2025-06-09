import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Genre routes funcionando!' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get all genres' });
});

export default router;