import { model, Model, Schema, Types } from 'mongoose';
import {
  Gender,
  IUserDocument,
  LookingFor,
  RelationshipStatus
} from '@user/interfaces/user.interface';

const userSchema: Schema = new Schema(
  {
    authId: { type: Types.ObjectId, ref: 'Auth', index: { unique: true } },
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    course: { type: String, trim: true },
    gender: { type: String, enum: [Gender.MALE, Gender.FEMALE] },
    images: [String],
    university: { type: Types.ObjectId, ref: 'University' },
    mobileNumber: { type: String, trim: true },
    relationshipStatus: {
      type: String,
      enum: [RelationshipStatus.SINGLE, RelationshipStatus.DATING, RelationshipStatus.MARRIED],
      default: RelationshipStatus.SINGLE
    },
    lookingFor: {
      type: String,
      enum: [LookingFor.FRIENDSHIP, LookingFor.RELATIONSHIP, LookingFor.OTHERS],
      default: LookingFor.OTHERS
    },
    email: String,
    expoPushToken: String,
    settings: {
      notificationsEnabled: { type: Boolean, default: true },
      activeStatus: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true
  }
);

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };
