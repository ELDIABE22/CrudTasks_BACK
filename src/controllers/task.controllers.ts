import { Request, Response } from 'express';
import TaskSchema from '../models/task.model';
import CategorySchema from '../models/category.model';
import UserSchema from '../models/user.model';
import { validationResult } from 'express-validator';

export const tasks = async (_: Request, res: Response) => {
  try {
    const tasks = await TaskSchema.find();
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[TASKS]: ' + error });
  }
};

export const idTasks = async (req: Request, res: Response) => {
  try {
    const { idCategory } = req.params;

    const categoryTasks = await TaskSchema.find({ category: idCategory });

    return res.status(200).json(categoryTasks);
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[USER_TASKS]: ' + error });
  }
};

export const newTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, category, user, state } = req.body;

    const userFound = await UserSchema.findById({ _id: user });

    if (!userFound)
      return res.status(404).json({ message: 'El usuario no existe' });

    const categoryFound = await CategorySchema.findById({ _id: category });

    if (!categoryFound)
      return res.status(404).json({ message: 'La categoría no existe' });

    const newTask = new TaskSchema({
      title,
      description,
      category,
      user: {
        id: userFound._id,
        name: userFound.name,
      },
      state,
    });

    await newTask.save();

    return res.status(201).json({ message: 'Tarea creada' });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[NEW_TASK]: ' + error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, description, category, user, state } = req.body;

    const taskFound = await TaskSchema.findById(id);
    if (!taskFound) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const userFound = await UserSchema.findById(user);
    if (!userFound) {
      return res.status(404).json({ message: 'El usuario no existe' });
    }

    const categoryFound = await CategorySchema.findById(category);
    if (!categoryFound) {
      return res.status(404).json({ message: 'La categoría no existe' });
    }

    await TaskSchema.findByIdAndUpdate(id, {
      title,
      description,
      category,
      user: {
        id: userFound._id,
        name: userFound.name,
      },
      state,
    });

    return res.status(200).json({ message: 'Tarea actualizada' });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[UPDATE_TASK]: ' + error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const taskFound = await TaskSchema.findById(id);

    if (!taskFound)
      return res.status(404).json({ message: 'Tarea no encontrada' });

    await TaskSchema.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Tarea eliminada' });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[DELETE_TASK]: ' + error });
  }
};
