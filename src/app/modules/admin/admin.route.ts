import express from 'express';
import { AdminAuthController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from '../auth/auth.validation';
import { UserRole } from '../../../enum/user';
import auth from '../../middlewares/auth';



const router = express.Router();

router.post('/create-admin', AdminAuthController.createAdmin);
router.get('/my-profile', auth(UserRole.Admin), AdminAuthController.getMyProfile);
router.patch(
  '/my-profile',
  auth(UserRole.Admin),
  AdminAuthController.updateAdminProfile
);
router.post('/login',validateRequest(AuthValidation.loginZodSchema),AdminAuthController.loginAdmin)
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AdminAuthController.refreshToken
);
export const AdminAuth = router;