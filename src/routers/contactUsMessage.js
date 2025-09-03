import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { contactUsValidationSchema } from '../validation/contactUsMessage.js';
import {
  createContactMessage,
  getContactMessages,
} from '../controllers/contactUsMessage.js';

const router = express.Router();

router.post(
  '/addContactUs',
  validateBody(contactUsValidationSchema),
  ctrlWrapper(createContactMessage),
);

router.get(
  '/',
  authenticate,
  authorizeRole('admin'),
  ctrlWrapper(getContactMessages),
);

export default router;
