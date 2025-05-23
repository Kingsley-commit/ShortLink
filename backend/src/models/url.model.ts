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
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});


urlSchema.index({ userId: 1 });
urlSchema.index({ longUrl: 'text' }); 

export const Url = model<IUrl>('Url', urlSchema);


export interface UrlEntry {
  id: string;
  longUrl: string;
  shortCode: string;
  createdAt: Date;
  visits: number;
  userId: string;
}