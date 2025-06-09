import express from 'express';

const router = express.Router();

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes funcionando!' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint' });
});

export default router;