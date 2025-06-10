import { Router } from 'express'
import { 
  createGenre, 
  getAllGenres, 
  getGenreById, 
  getGenreBySlug,
  updateGenre, 
  deleteGenre 
} from '../controllers/genreController.js'

const router = Router()

router.post('/', createGenre)
router.get('/', getAllGenres)
router.get('/slug/:slug', getGenreBySlug)
router.get('/:id', getGenreById)
router.put('/:id', updateGenre)
router.delete('/:id', deleteGenre)

export default router