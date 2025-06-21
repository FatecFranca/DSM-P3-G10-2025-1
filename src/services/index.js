import authService from "./authService";
import userService from "./userService";
import gamesService from "./gamesService";
import reviewsService from "./reviewsService";
import reactionService from "./reactionService";

export {
  authService,
  userService,
  gamesService,
  reviewsService,
  reactionService,
};

export const gameService = gamesService;

export default {
  auth: authService,
  users: userService,
  games: gamesService,
  reviews: reviewsService,
  reactions: reactionService,
};
