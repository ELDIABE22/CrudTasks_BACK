import { NextFunction, Request, Response } from 'express';

export const verifyingSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!process.env.JWT_SECRET) {
    throw new Error(
      'ERROR[JWT]: JWT_SECRET no está definido en las variables de entorno'
    );
  }

  if (token)
    return res
      .status(409)
      .json({ message: 'Tu sesión está actualmente abierta.' });

  next();
};
