import express from 'express';
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getPopularReviews,
  getRecentReviews
} from '../controllers/reviewController.js';

const router = express.Router();

// Rotas públicas
router.get('/', getAllReviews);
router.get('/popular', getPopularReviews);
router.get('/recent', getRecentReviews);
router.get('/:id', getReviewById);

// Rotas que requerem autenticação (por enquanto públicas)
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;