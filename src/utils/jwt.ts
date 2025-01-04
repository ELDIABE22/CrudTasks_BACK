import { JwtPayload } from 'jsonwebtoken';

import jwt from 'jsonwebtoken';

export const createAccessToken = (payload: JwtPayload) => {
  return new Promise((res, rej) => {
    if (!process.env.JWT_SECRET) {
      throw new Error(
        'ERROR[JWT]: JWT_SECRET no está definido en las variables de entorno'
      );
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (error, token) => {
        if (error) rej(error);
        res(token);
      }
    );
  });
};
