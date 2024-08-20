import mongoose from "mongoose";

export interface ILocation extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
