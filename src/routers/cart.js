import express from 'express';
import { validateBody } from '../middlewares/validateBody';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import { addToCartSchema } from '../validation/cart';
import { addToCart, getCart, removeFromCart } from '../controllers/cart';
import { authenticate } from '../middlewares/authenticate';

const router = express.Router();

router.post(
  '/addToCart',
  authenticate,
  validateBody(addToCartSchema),
  ctrlWrapper(addToCart),
);

router.get('/', authenticate, ctrlWrapper(getCart));

router.delete('/:id', authenticate, ctrlWrapper(removeFromCart));
export default router;
