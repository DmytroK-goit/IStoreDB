import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createSoldProductSchema,
  updateSoldProductSchema,
} from '../validation/items.js';
import {
  createProduct,
  deleteItem,
  getProducts,
  updateItem,
} from '../controllers/productController.js';
import { createContactMessage } from '../controllers/contactUsMessage.js';
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
router.delete(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  ctrlWrapper(deleteItem),
);

router.patch(
  '/:id',
  authenticate,
  authorizeRole('admin'),
  upload.single('img'),
  validateBody(updateSoldProductSchema),
  ctrlWrapper(updateItem),
);
export default router;
