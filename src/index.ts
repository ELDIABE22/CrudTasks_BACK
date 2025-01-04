import app from './app';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import userRoutes from './router/user.routes';
import authRoutes from './router/auth.routes';
import categoryRoutes from './router/category.routes';
import taskRoutes from './router/task.routes';

import { connectDB } from './utils/db';

dotenv.config();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ROUTES AUTH
app.use('/api/auth', authRoutes);

// ROUTES USER
app.use('/api/user', userRoutes);

// ROUTES CATEGORY
app.use('/api/category', categoryRoutes);

// ROUTES TASK
app.use('/api/task', taskRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Connected server at http://localhost:${process.env.PORT}`);
});
