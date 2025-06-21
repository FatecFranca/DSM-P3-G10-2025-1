import authService from "./authService";
import userService from "./userService";
import gamesService from "./gamesService";
import commentService from "./commentService";
import reactionService from "./reactionService";
import gameProgressService from "./gameProgressService";

export {
  authService,
  userService,
  gamesService,
  commentService,
  reactionService,
  gameProgressService,
};

export const gameService = gamesService;

export default {
  auth: authService,
  users: userService,
  games: gamesService,
  comments: commentService,
  reactions: reactionService,
  gameProgress: gameProgressService,
};

