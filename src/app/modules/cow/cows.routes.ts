import express from 'express';
import { CowController } from './cows.controller';

const router = express.Router();
router.post('/', CowController.createCow);
router.get('/', CowController.getAllCows);
router.get('/:id', CowController.getCowById);
router.patch('/:id', CowController.updateCowById);
router.delete('/:id', CowController.deleteCowById);

export const CowsRoutes = router;
