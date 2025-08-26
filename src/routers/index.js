import { Router } from 'express';
import usersRouter from './users.js';

const router = Router();

router.use('/auth', usersRouter);
router.use('/products', usersRouter);

export default router;
