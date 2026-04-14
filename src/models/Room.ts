import mongoose, { Document, Model } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
  amenities: string[];
  type: 'suite' | 'deluxe' | 'standard';
  status: 'available' | 'maintenance';
}

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  type: { type: String, enum: ['suite', 'deluxe', 'standard'], default: 'standard' },
  status: { type: String, enum: ['available', 'maintenance'], default: 'available' },
}, { timestamps: true });

const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', roomSchema);
export default Room;
