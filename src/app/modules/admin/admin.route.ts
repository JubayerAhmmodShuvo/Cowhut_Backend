import express from 'express';
import { AdminAuthController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from '../auth/auth.validation';


const router = express.Router();

router.post('/signup', AdminAuthController.createAdmin);
router.post('/login',validateRequest(AuthValidation.loginZodSchema),AdminAuthController.loginAdmin)

export const AdminAuth = router;