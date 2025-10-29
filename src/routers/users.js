import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  fetchUsers,
  logoutUserController,
  registerUserController,
  userProfile,
} from '../controllers/users.js';
import { loginUserController } from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
router.get(
  '/allUsers',
  authenticate,
  authorizeRole('admin'),
  ctrlWrapper(fetchUsers),
);
router.post('/logout', authenticate, ctrlWrapper(logoutUserController));
router.get('/profile', authenticate, ctrlWrapper(userProfile));

export default router;
