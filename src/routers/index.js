import { Router } from 'express';
import usersRouter from './users.js';
import itemsRouter from './items.js';
import contactUsRouter from './contactUsMessage.js';
import cartRouter from './cart.js';
import soldRouter from './soldItem.js';

const router = Router();

router.use('/auth', usersRouter);
router.use('/products', itemsRouter);
router.use('/contactUs', contactUsRouter);
router.use('/cart', cartRouter);
router.use('/sold', soldRouter);

export default router;
