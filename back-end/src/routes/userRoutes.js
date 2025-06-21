import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} from "../controllers/userController.js";

const router = express.Router();

// Rotas públicas
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/:id/stats", getUserStats);
router.post("/", createUser);

// Rotas que requerem autenticação (por enquanto públicas)
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
