import mongoose from 'mongoose';
import { IUser } from './type/user.type';

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      select: false,
    },
    rol: {
      type: String,
      enum: ['admin', 'user'],
      require: true,
      default: 'user',
      trim: true,
    },
    state: {
      type: String,
      enum: ['active', 'desactive'],
      default: 'active',
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
