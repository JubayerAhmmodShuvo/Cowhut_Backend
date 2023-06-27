import express from 'express';

import { UserController } from './users.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../enum/user';

const router = express.Router();

router.get('/',auth(UserRole.Admin), UserController.getAllUsers);

router.get('/:id',auth(UserRole.Admin), UserController.getUserById);
router.patch('/:id',auth(UserRole.Admin), UserController.updateUserById);
router.delete('/:id',auth(UserRole.Admin), UserController.deleteUserById);

export const UserRoutes = router;
