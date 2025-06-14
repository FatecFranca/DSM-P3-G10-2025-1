import express from 'express';
import {
  updateGameProgress,
  getProgressByUser,
  getUsersByGameProgress,
  getGamesByStatus,
  removeProgress
} from '../controllers/gameProgressController.js';

const router = express.Router();

// Rotas públicas
router.get('/user/:userId', getProgressByUser);
router.get('/game/:gameId', getUsersByGameProgress);
router.get('/status/:status', getGamesByStatus);

// Rotas que requerem autenticação (por enquanto públicas)
router.post('/', updateGameProgress);
router.delete('/:id', removeProgress);

export default router;
