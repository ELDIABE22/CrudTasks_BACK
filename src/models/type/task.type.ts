import mongoose from 'mongoose';

export interface ITask {
  title: string;
  description: string;
  category: mongoose.StringSchemaDefinition;
  user: {
    id: mongoose.StringSchemaDefinition;
    name: string;
  };
  state: 'pending' | 'in progress' | 'review' | 'completed' | 'deleted';
}
