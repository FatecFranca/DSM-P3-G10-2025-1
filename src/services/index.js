// Imports corretos com nomes dos arquivos
import authService from './authService';
import userService from './userService';
import gamesService from './gamesService';
import genresService from './genresService'; 
import reviewsService from './reviewsService';
import commentService from './commentService';
import reactionService from './reactionService';
import gameProgressService from './gameProgressService';

// Named exports para compatibilidade
export {
  authService,
  userService,
  gamesService,
  genresService,
  reviewsService,
  commentService,
  reactionService,
  gameProgressService
};

// Aliases para manter compatibilidade com código existente
export const gameService = gamesService;
export const genreService = genresService;
export const reviewService = reviewsService;

// Default export como objeto
export default {
  auth: authService,
  users: userService,
  games: gamesService,
  genres: genresService,
  reviews: reviewsService,
  comments: commentService,
  reactions: reactionService,
  gameProgress: gameProgressService
};
