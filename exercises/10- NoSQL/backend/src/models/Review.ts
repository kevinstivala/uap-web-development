import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  bookId: string;
  user: string;
  text: string;
  rating: number;
  votes: number;
  userVotes: Record<string, number>;
}

const ReviewSchema = new Schema<IReview>({
  bookId: { type: String, required: true },
  user: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  votes: { type: Number, default: 0 },
  userVotes: { type: Map, of: Number, default: {} },
});

export default mongoose.model<IReview>("Review", ReviewSchema);