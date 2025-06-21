import express from 'express';
import {
  upsertCommentReaction,
  getReactionsByComment,
  removeCommentReaction
} from '../controllers/commentReactionController.js';

const router = express.Router();

// Rotas públicas
router.get('/comment/:commentId', getReactionsByComment);

// Rotas que requerem autenticação (por enquanto públicas)
router.post('/', upsertCommentReaction);
router.delete('/:id', removeCommentReaction);

export default router;

