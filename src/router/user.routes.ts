import { body } from 'express-validator';
import { Router } from "express";
import { deleteUser, getUser, updateUser } from "../controllers/user.controllers";
import { adminRequired } from '../middlewares/validateAdmin';

const router = Router();

router.get('/consult', adminRequired, getUser);
router.put('/update/:id',
    adminRequired,
    body('name').optional().notEmpty().withMessage('El nombre es requerido').isString().withMessage('El nombre no es válido'),
    body('lastname').optional().isString().withMessage('El apellido no es válido'),
    body('rol').optional().isIn(['admin', 'user']).withMessage('El rol debe ser "admin" o "user"'),
    body('state').optional().isIn(['active', 'desactive']).withMessage('El estado debe ser "active" o "desactive"'), 
    updateUser
);
router.delete('/delete/:id', adminRequired, deleteUser);

export default router;