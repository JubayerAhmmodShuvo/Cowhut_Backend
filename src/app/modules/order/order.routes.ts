import express from 'express';
import { OrderController } from './order.controller';

const router = express.Router();

router.get('/', OrderController.getOrdersController);
router.post('/', OrderController.createOrderController);

export const OrderRoutes = router;
