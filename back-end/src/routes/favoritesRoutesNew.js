import express from "express";

console.log("🎯 FAVORITOS ROUTES LOADED! 🎯");

const router = express.Router();

router.get("/", (req, res) => {
  console.log("GET /api/favorites chamado");
  res.json({
    success: true,
    message: "Favoritos API funcionando!",
    timestamp: new Date().toISOString(),
  });
});

export default router;
