import express from 'express';
import { OrderController } from './order.controller';

const router = express.Router();

router.post('/', OrderController.createOrderController);
router.get('/', OrderController.getOrdersController);

export const OrderRoutes = router;
