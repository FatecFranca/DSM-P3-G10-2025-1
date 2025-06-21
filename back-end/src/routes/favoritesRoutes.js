import express from "express";

console.log("🎯 Carregando rotas de favoritos...");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Favoritos API funcionando!" });
});

router.post("/", (req, res) => {
  res.json({ message: "POST para favoritos funcionando!" });
});

export default router;
