import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../enum/user';

const router = express.Router();

router.post('/',auth(UserRole.Buyer), OrderController.createOrderController);
router.get(
  '/:id',
  auth(UserRole.Buyer),
  OrderController.getOrderByIdController
);
router.get('/', auth(UserRole.Buyer,UserRole.Admin,UserRole.Seller), OrderController.getOrdersController);

export const OrderRoutes = router;
