import { z } from "zod";

export const reviewSchema = z.object({
  bookId: z.string(),
  text: z.string().min(1, "El texto es obligatorio"),
  rating: z.number().min(1).max(5, "La calificación debe estar entre 1 y 5"),
});