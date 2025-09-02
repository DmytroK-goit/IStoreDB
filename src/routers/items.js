import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { createSoldProductSchema } from '../validation/items.js';
import {
  createProduct,
  getProducts,
} from '../controllers/productController.js';
import { createContactMessage } from '../controllers/contactUs.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post(
  '/addProduct',
  authenticate,
  authorizeRole('admin'),
  upload.single('img'),
  validateBody(createSoldProductSchema),
  ctrlWrapper(createProduct),
);

router.post(
  '/contactUs',
  validateBody(createSoldProductSchema),
  ctrlWrapper(createContactMessage),
);

router.get('/', ctrlWrapper(getProducts));

export default router;
