import { IUniDocument } from '@uni/interfaces/uni.interface';
import { model, Model, Schema } from 'mongoose';

const uniSchema: Schema = new Schema({
  name: String,
  image: String,
  location: {
    address: String,
    location: {
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number]
    }
  }
});

const UniModel: Model<IUniDocument> = model<IUniDocument>('Uni', uniSchema, 'Uni');
export { UniModel };
