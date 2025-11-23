import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  changeOrderStatus,
  createOrderFromCart,
  getAllOrders,
  getOrderProduct,
} from '../controllers/soldItem.js';
import { orderValidationSchema } from '../validation/soldItem.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = express.Router();

router.post(
  '/addToOrder',
  authenticate,
  validateBody(orderValidationSchema),
  ctrlWrapper(createOrderFromCart),
);

router.patch(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  ctrlWrapper(changeOrderStatus),
);
router.get('/my', authenticate, ctrlWrapper(getOrderProduct));
router.get(
  '/all',
  authenticate,
  authorizeRole('admin', 'demo'),
  ctrlWrapper(getAllOrders),
);

export default router;
