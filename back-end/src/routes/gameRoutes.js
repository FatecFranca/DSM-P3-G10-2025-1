import express from 'express';
import {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame
} from '../controllers/gameController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createGame);
router.get('/', getAllGames);
router.get('/:id', getGameById);
router.put('/:id', authMiddleware, updateGame);
router.delete('/:id', authMiddleware, deleteGame);

export default router;