import { Request, Response } from 'express';
import CategorySchema from '../models/category.model';
import { validationResult } from 'express-validator';
import UserSchema from '../models/user.model';
import TaskSchema from '../models/task.model';

export const getCategory = async (_: Request, res: Response) => {
  try {
    const categorys = await CategorySchema.find({ state: 'active' });

    return res.status(200).json(categorys);
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[CATEGORYS]: ' + error });
  }
};

export const idCategory = async (req: Request, res: Response) => {
  try {
    const { idUser } = req.params;
    
    const categorys = await CategorySchema.find({ 'user.id': idUser, state: 'active' });

    return res.status(200).json(categorys);
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[USER_CATEGORYS]: ' + error });
  }
};

export const newCategory = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { user, name, description } = req.body;

    const userFound = await UserSchema.findById({ _id: user });

    if (!userFound)
      return res.status(404).json({ message: 'El usuario no existe' });

    const newCategory = new CategorySchema({
      user: {
        id: userFound._id,
        name: userFound.name,
      },
      name,
      description,
    });

    await newCategory.save();

    return res.status(201).json({ message: 'Categoría creada' });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[NEW_CATEGORY]: ' + error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { user, name, description, state } = req.body;

    const verifyCategory = await CategorySchema.findById({ _id: id });

    if (!verifyCategory)
      return res.status(404).json({ message: 'La categoría no existe' });

    const userFound = await UserSchema.findById(user);
    if (!userFound) {
      return res.status(404).json({ message: 'El usuario no existe' });
    }

    await CategorySchema.findByIdAndUpdate(id, {
      user: {
        id: userFound._id,
        name: userFound.name,
      },
      name,
      description,
      state,
    });

    return res.status(201).json({ message: 'Categoría actualizada' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'ERROR[UPDATE_CATEGORY]: ' + error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const verifyCategory = await CategorySchema.findById({ _id: id });

    if (!verifyCategory)
      return res.status(404).json({ message: 'La categoría no existe' });

    await TaskSchema.deleteMany({ category: verifyCategory._id })
    
    await CategorySchema.findByIdAndDelete({ _id: id });

    return res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'ERROR[DELETE_CATEGORY]: ' + error });
  }
};