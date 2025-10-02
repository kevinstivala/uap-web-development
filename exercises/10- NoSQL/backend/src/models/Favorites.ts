import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  user: string;
  bookId: string;
}

const FavoriteSchema = new Schema<IFavorite>({
  user: { type: String, required: true },
  bookId: { type: String, required: true },
});

export default mongoose.model<IFavorite>("Favorite", FavoriteSchema);