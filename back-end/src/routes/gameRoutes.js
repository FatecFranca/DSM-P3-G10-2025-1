import express from 'express';
import {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
  getFeaturedGames
} from '../controllers/gameController.js';

const router = express.Router();

// Rotas públicas
router.get('/', getAllGames);
router.get('/featured', getFeaturedGames);
router.get('/:id', getGameById);

// Rotas que requerem autenticação (por enquanto públicas)
router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

export default router;