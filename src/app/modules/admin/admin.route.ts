import express from 'express';
import { AdminAuthController } from './admin.controller';


const router = express.Router();

router.post('/signup',AdminAuthController.createAdmin );

export const AdminAuth = router;