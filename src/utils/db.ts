import mongoose from 'mongoose';

export const connectDB = async () => {
  if (!process.env.DATABASE_URI) {
    throw new Error('ERROR[MONGODB]: DATABASE_URI no está definido en las variables de entorno');
  }
  
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Connected Database');
  } catch (error) {
    console.log('ERROR[MONGODB]: ' + error);
  }
};
