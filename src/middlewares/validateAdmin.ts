import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import UserSchema from '../models/user.model';

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const adminRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const { id } = verifyToken;

    const user = await UserSchema.findById({ _id: id });

    if (!user) return res.status(404).json({ message: 'El usuario no existe' });

    if (user.rol !== 'admin')
      return res.status(403).json({
        message: 'Acceso denegado. No tienes los permisos necesarios',
      });

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
