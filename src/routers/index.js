import { Router } from 'express';
import usersRouter from './users.js';
import itemsRouter from './items.js';

const router = Router();

router.use('/auth', usersRouter);
router.use('/products', itemsRouter);

export default router;
