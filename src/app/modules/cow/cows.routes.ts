import express from 'express';
import { CowController } from './cows.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../enum/user';

const router = express.Router();
router.post('/',auth(UserRole.Seller), CowController.createCow);
router.get('/',auth(UserRole.Admin,UserRole.Buyer,UserRole.Seller), CowController.getAllCows);
router.get('/:id',auth(UserRole.Admin,UserRole.Buyer,UserRole.Seller), CowController.getCowById);
router.patch('/:id',auth(UserRole.Seller), CowController.updateCowById);
router.delete('/:id',auth(UserRole.Seller), CowController.deleteCowById);

export const CowsRoutes = router;
