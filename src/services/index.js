// src/services/index.js - Alternativa com default exports
import authService from './authService';
import userService from './userService';
import gameService from './gameService';
import genreService from './genreService';
import reviewService from './reviewService';
import commentService from './commentService';
import reactionService from './reactionService';
import gameProgressService from './gameProgressService';

export {
  authService,
  userService,
  gameService,
  genreService,
  reviewService,
  commentService,
  reactionService,
  gameProgressService
};

export default {
  auth: authService,
  users: userService,
  games: gameService,
  genres: genreService,
  reviews: reviewService,
  comments: commentService,
  reactions: reactionService,
  gameProgress: gameProgressService
};