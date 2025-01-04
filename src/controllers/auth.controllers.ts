import { validationResult } from 'express-validator';
import { createAccessToken } from '../utils/jwt';
import { Request, Response } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

import bcrypt from 'bcrypt';
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

    return res
      .status(202)
      .cookie('token', token)
      .json({ message: 'Sesión iniciada' });
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

    return res
      .status(201)
      .cookie('token', token)
      .json({ message: 'Usuario registrado' });
  } catch (error) {
    return res.status(500).json({ message: 'ERROR[REGISTER]: ' + error });
  }
};

export const logout = (_: Request, res: Response) => {
  res.cookie('token', '', {
    expires: new Date(0),
  });
  return res.sendStatus(204);
};

export const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!process.env.JWT_SECRET) {
    throw new Error(
      'ERROR[JWT]: JWT_SECRET no está definido en las variables de entorno'
    );
  }

  if (!token)
    return res.status(401).json({ message: 'No token, autorización denegada' });

  try {
    const verifyToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as CustomJwtPayload;

    if (!verifyToken)
      return res.status(401).json({ message: 'No token, autorización denegada' });

    const { id } = verifyToken;

    const { _id, name, lastname, email, rol, state } = await UserSchema.findById({
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
      return res.status(401).json({ message: 'La sesión ha expirado, por favor inicia sesión nuevamente.' });
    } else {
      return res.status(500).json({ message: 'ERROR[VERIFY_TOKEN]: ' + error });
    }
  }
};
