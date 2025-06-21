import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkIsFavorite,
} from "../controllers/favoriteControllerSimple.js";

console.log("🔄 userFavoritesRoutes.js carregado com sucesso!");

const router = express.Router();

console.log("✅ Rotas de favoritos carregadas!");

router.post("/", addToFavorites);

router.delete("/:gameId", removeFromFavorites);

router.get("/", getUserFavorites);

router.get("/check/:gameId", checkIsFavorite);

export default router;
