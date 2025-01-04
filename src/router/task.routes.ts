import { Router } from 'express';
import {
    deleteTask,
  idTasks,
  newTask,
  tasks,
  updateTask,
} from '../controllers/task.controllers';
import { body } from 'express-validator';
import { authRequired } from '../middlewares/validateToken';
// import { adminRequired } from '../middlewares/validateAdmin';

const router = Router();

router.get('/', authRequired, tasks);
router.get('/:idCategory', authRequired, idTasks);
router.post(
  '/new',
  authRequired,
  body('title')
    .notEmpty()
    .withMessage('El titulo es requerido')
    .isString()
    .withMessage('El titulo no es válido'),
  body('description')
    .isString()
    .withMessage('La descripción no es válida'),
  body('category')
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isString()
    .withMessage('La categoría no es válida'),
  body('user')
    .notEmpty()
    .withMessage('El usuario es requerido')
    .isString()
    .withMessage('El usuario no es válido'),
  body('state')
    .optional()
    .isIn(['pending', 'in progress', 'review', 'completed', 'deleted'])
    .withMessage(
      'El estado debe ser "pending", "in progress", "review", "completed" o "deleted"'
    ),
  newTask
);
router.put(
  '/update/:id',
  authRequired,
  body('title')
    .optional()
    .notEmpty()
    .withMessage('El titulo es requerido')
    .isString()
    .withMessage('El titulo no es válido'),
  body('description')
    .optional()
    .isString()
    .withMessage('La descripción no es válida'),
  body('category')
    .optional()
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isString()
    .withMessage('La categoría no es válida'),
  body('user')
    .optional()
    .notEmpty()
    .withMessage('El usuario es requerido')
    .isString()
    .withMessage('El usuario no es válido'),
  body('state')
    .optional()
    .isIn(['pending', 'in progress', 'review', 'completed', 'deleted'])
    .withMessage(
      'El estado debe ser "pending", "in progress", "review", "completed" o "deleted"'
    ),
  updateTask
);
router.delete('/delete/:id', authRequired, deleteTask);

export default router;
