import { Schema, model, Document, Types } from 'mongoose';

export interface IUrl extends Document {
  _id: Types.ObjectId;
  longUrl: string;
  shortCode: string;
  createdAt: Date;
  visits: number;
  userId: Types.ObjectId;
}

const urlSchema = new Schema<IUrl>({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true }, // This already creates an index
  createdAt: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Add additional indexes for better performance
urlSchema.index({ userId: 1 });
urlSchema.index({ longUrl: 'text' }); // For text search

export const Url = model<IUrl>('Url', urlSchema);

// Keep the old interface for backward compatibility if needed
export interface UrlEntry {
  id: string;
  longUrl: string;
  shortCode: string;
  createdAt: Date;
  visits: number;
  userId: string;
}