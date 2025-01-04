import { Request, Response } from 'express';
import UserSchema from '../models/user.model';
import { validationResult } from 'express-validator';

export const getUser = async (_: Request, res: Response) => {
  try {
    const users = await UserSchema.find();
    return res.status(200).json({ message: 'Usuarios obtenidos', users });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[GET_USER]: ' + error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;

    const verifyUser = await UserSchema.findById({ _id: id });

    if (!verifyUser)
      return res.status(404).json({ message: 'El usuario no existe' });

    await UserSchema.findByIdAndUpdate({ _id: id }, req.body);

    return res.status(201).json({ message: 'Usuario actualizado' });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[UPDATE_USER]: ' + error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const verifyId = await UserSchema.findById({ _id: id });

    if (!verifyId)
      return res.status(404).json({ message: 'El usuario no existe' });

    await UserSchema.findByIdAndDelete({ _id: id });

    return res.status(200).json({ message: 'Usuario eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[DELETE_USER]: ' + error });
  }
};
