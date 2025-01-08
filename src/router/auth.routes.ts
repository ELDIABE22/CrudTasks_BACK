import { Router } from 'express';
import {
  loginController,
  registerController,
  verifyToken,
} from '../controllers/auth.controllers';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/login',
  body('email')
    .isEmail()
    .withMessage('El correo no es válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .isLength({ max: 15 })
    .withMessage('La contraseña debe tener máximo 15 caracteres'),
  loginController
);

router.post(
  '/register',
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isString()
    .withMessage('El nombre no es válido'),
  body('lastname')
    .optional()
    .isString()
    .withMessage('El apellido no es válido'),
  body('email')
    .isEmail()
    .withMessage('El correo no es válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .isLength({ max: 15 })
    .withMessage('La contraseña debe tener máximo 15 caracteres'),
  registerController
);

router.get('/verify', verifyToken);

export default router;
