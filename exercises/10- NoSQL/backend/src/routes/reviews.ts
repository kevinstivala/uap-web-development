import express from "express";
import Review from "../models/Review";
import { verifyToken } from "../middleware/auth";
import { reviewSchema } from "../validators/reviewValidator";


const router = express.Router();

// Obtener reseñas por libro
router.get("/", async (req, res) => {
  const { bookId } = req.query;
  try {
    const reviews = await Review.find(bookId ? { bookId } : {});
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo reseñas" });
  }
});

// Crear una nueva reseña
router.post("/", verifyToken, async (req, res) => {
  try {
    reviewSchema.parse(req.body);
    const { bookId, text, rating } = req.body;
    const user = req.user.id;
    const review = await Review.create({ bookId, user, text, rating });
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
});

// Votar una reseña
router.patch("/:id/vote", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { vote } = req.body;
  const user = req.user.id;

  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: "Reseña no encontrada" });

    if (review.userVotes[user]) return res.status(403).json({ error: "Ya votaste" });

    review.votes += vote;
    review.userVotes[user] = vote;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Error votando la reseña" });
  }
});

router.get("/reviews", verifyToken, async (req, res) => {
  const user = req.user.id;
  try {
    const reviews = await Review.find({ user });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo historial de reseñas" });
  }
});

export default router;