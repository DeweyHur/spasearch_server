import { Schema } from 'mongoose';

export default mongoose.model('Spot', new mongoose.Schema({
  _id: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  latitude: Number,
  longitude: Number,
  type: String,
  name: String,
  description: String
}));