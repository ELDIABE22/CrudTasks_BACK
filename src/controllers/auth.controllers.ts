import { validationResult } from 'express-validator';
import { createAccessToken } from '../utils/jwt';
import { Request, Response } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

import bcrypt from 'bcryptjs';
import UserSchema from '../models/user.model';

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const loginController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const verifyCredentials = await UserSchema.findOne({ email }).select(
      '+password'
    );

    if (!verifyCredentials) {
      return res
        .status(401)
        .json({ message: 'Correo electrónico o contraseña incorrecto.' });
    }

    const comparePassword = await bcrypt.compare(
      password,
      verifyCredentials.password
    );

    if (!comparePassword) {
      return res
        .status(401)
        .json({ message: 'Correo electrónico o contraseña incorrecto.' });
    }

    const token = await createAccessToken({ id: verifyCredentials._id });

    return res.status(202).json({ message: 'Sesión iniciada', token });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[LOGIN]: ' + error });
  }
};

export const registerController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, lastname, email, password } = req.body;

    const verifyEmail = await UserSchema.findOne({ email });

    if (verifyEmail) {
      return res
        .status(409)
        .json({ message: 'El correo electrónico ya está registrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new UserSchema({
      name,
      lastname,
      email,
      password: passwordHash,
    });

    await newUser.save();

    const token = await createAccessToken({ id: newUser._id });

    return res.status(201).json({ message: 'Usuario registrado', token });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[REGISTER]: ' + error });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!process.env.JWT_SECRET) {
    throw new Error(
      'ERROR[JWT]: JWT_SECRET no está definido en las variables de entorno'
    );
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, autorización denegada' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as CustomJwtPayload;

    if (!verifyToken)
      return res
        .status(401)
        .json({ message: 'No token, autorización denegada' });

    const { id } = verifyToken;

    const { _id, name, lastname, email, rol, state } =
      await UserSchema.findById({
        _id: id,
      });

    if (!_id) return res.status(401).json({ message: 'El usuario no existe' });

    return res.json({
      id: _id,
      name,
      lastname,
      email,
      rol,
      state,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        message: 'La sesión ha expirado, por favor inicia sesión nuevamente.',
      });
    } else {
      return res.status(500).json({ message: 'ERROR[VERIFY_TOKEN]: ' + error });
    }
  }
};
