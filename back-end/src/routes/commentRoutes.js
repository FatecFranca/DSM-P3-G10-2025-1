import express from 'express';
import { 
  createComment, 
  getCommentsByReview, 
  deleteComment, 
  getAllComments 
} from '../controllers/commentController.js';

const router = express.Router();

// Rotas públicas
router.get('/review/:reviewId', getCommentsByReview);
router.get('/', getAllComments);

// Rotas que requerem autenticação (por enquanto públicas)
router.post('/', createComment);
router.delete('/:id', deleteComment);

export default router;
