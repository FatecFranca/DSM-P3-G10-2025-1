import express from 'express';
import {
  upsertReviewReaction,
  getReactionsByReview,
  removeReviewReaction
} from '../controllers/reviewReactionController.js';

const router = express.Router();

// Rotas públicas
router.get('/review/:reviewId', getReactionsByReview);

// Rotas que requerem autenticação (por enquanto públicas)
router.post('/', upsertReviewReaction);
router.delete('/:id', removeReviewReaction);

export default router;
