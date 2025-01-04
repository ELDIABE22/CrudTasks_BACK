import mongoose from 'mongoose';
import { ITask } from './type/task.type';

const TaskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      trim: true,
    },
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
    state: {
      type: String,
      enum: ['pending', 'in progress', 'review', 'completed', 'deleted'],
      default: 'pending',
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Task ||
  mongoose.model<ITask>('Task', TaskSchema);
