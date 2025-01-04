import mongoose from 'mongoose';
import { ICategory } from './type/category.type';

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    user: {
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
    },
    name: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      enum: ['active', 'desactive'],
      default: 'active',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);
