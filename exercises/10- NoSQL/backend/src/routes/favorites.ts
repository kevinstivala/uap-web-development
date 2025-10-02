import express from "express";
import Favorite from "../models/Favorites";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Agregar un libro a favoritos
router.post("/", verifyToken, async (req, res) => {
  const { bookId } = req.body;
  const user = req.user.id;
  try {
    const favorite = await Favorite.create({ user, bookId });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ error: "Error agregando a favoritos" });
  }
});

// Obtener lista de favoritos
router.get("/", verifyToken, async (req, res) => {
  const user = req.user.id;
  try {
    const favorites = await Favorite.find({ user });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo favoritos" });
  }
});

export default router;