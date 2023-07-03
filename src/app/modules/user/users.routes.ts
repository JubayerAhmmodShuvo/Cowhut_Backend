import express from 'express';

import { UserController } from './users.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../enum/user';

const router = express.Router();


router.get(
  '/my-profile',
  auth(UserRole.Buyer, UserRole.Seller),
  UserController.getMyProfile
  );
  router.patch(
    '/my-profile',
    auth(UserRole.Buyer, UserRole.Seller),
    UserController.updateMyProfile
    );
    
    router.get('/:id', auth(UserRole.Admin), UserController.getUserById);
    
    router.patch('/:id', auth(UserRole.Admin), UserController.updateUserById);
    router.delete('/:id', auth(UserRole.Admin), UserController.deleteUserById);
    router.get('/', auth(UserRole.Admin), UserController.getAllUsers);

export const UserRoutes = router;
