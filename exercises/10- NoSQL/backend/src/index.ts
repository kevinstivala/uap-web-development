import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth";
import reviewRoutes from "./routes/reviews";
import favoriteRoutes from "./routes/favorites";


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});