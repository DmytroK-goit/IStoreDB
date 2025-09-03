import { Router } from 'express';
import usersRouter from './users.js';
import itemsRouter from './items.js';
import contactUsRouter from './contactUsMessage.js';

const router = Router();

router.use('/auth', usersRouter);
router.use('/products', itemsRouter);
router.use('/contactUs', contactUsRouter);

export default router;
