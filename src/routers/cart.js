import express from 'express';

import { addToCart, getCart, removeFromCart } from '../controllers/cart.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { addToCartSchema } from '../validation/cart.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

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
