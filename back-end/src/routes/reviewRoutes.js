import { Router } from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getRecentReviews,
  getPopularReviews
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Rotas públicas
router.get('/', getAllReviews);
router.get('/recent', getRecentReviews);
router.get('/popular', getPopularReviews);
router.get('/:id', getReviewById);

// Rotas protegidas (requerem autenticação)
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;