import express from "express";

console.log("🔥 Rotas de favoritos carregadas!");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Favorites routes working!" });
});

export default router;
