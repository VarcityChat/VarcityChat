import { Document, ObjectId } from 'mongoose';

export interface IUniDocument extends Document {
  _id: string | ObjectId;
  name: string;
  image: string;
  location: ILocation;
}

interface ILocation {
  location?: { type: string; coordinates: number[] };
  address: string;
  description?: string;
}
