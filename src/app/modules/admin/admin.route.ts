import express from 'express';
import { AdminAuthController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from '../auth/auth.validation';



const router = express.Router();

router.post('/create-admin', AdminAuthController.createAdmin);
router.post('/login',validateRequest(AuthValidation.loginZodSchema),AdminAuthController.loginAdmin)
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AdminAuthController.refreshToken
);
export const AdminAuth = router;