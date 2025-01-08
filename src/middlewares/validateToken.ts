import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export interface IAuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

export const authRequired = (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, autorización denegada' });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    throw new Error(
      'ERROR[JWT]: JWT_SECRET no está definido en las variables de entorno'
    );
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verifyToken;

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};
