import mongoose, { Schema, Document } from 'mongoose';
import { ILocation } from '../types/location.type';

const LocationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { type: String, required: true, enum: ['Home', 'Work', 'Other'] },
  address: { type: String, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
}, { timestamps: true });

const Location = mongoose.model<ILocation>('Location', LocationSchema);

export default Location;
