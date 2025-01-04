import { body } from 'express-validator';
import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken';
import { adminRequired } from '../middlewares/validateAdmin';
import {
  deleteCategory,
  getCategory,
  idCategory,
  newCategory,
  updateCategory,
} from '../controllers/category.controllers';

const router = Router();

router.get('/', adminRequired, getCategory);
router.get('/:idUser', authRequired, idCategory);
router.post(
  '/new',
  authRequired,
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isString()
    .withMessage('El nombre no es válido'),
  body('description')
    .optional()
    .isString()
    .withMessage('La descripción no es válida'),
  body('state')
    .optional()
    .isIn(['active', 'desactive'])
    .withMessage('El estado debe ser "active" o "desactive"'),
  newCategory
);
router.put(
  '/update/:id',
  authRequired,
  body('name')
    .optional()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isString()
    .withMessage('El nombre no es válido'),
  body('description')
    .optional()
    .isString()
    .withMessage('La descripción no es válida'),
  body('state')
    .optional()
    .isIn(['active', 'desactive'])
    .withMessage('El estado debe ser "active" o "desactive"'),
  updateCategory
);
router.delete('/delete/:id', authRequired, deleteCategory);

export default router;
