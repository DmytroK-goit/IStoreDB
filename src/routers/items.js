import express from 'express';
// import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateTransactionSchema } from '../validation/transaction.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  deleteTransaction,
  getIncomeAndExpenses,
  getTransactionsByMonth,
  updateTransaction,
} from '../controllers/transaction.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { createSoldProductSchema } from '../validation/items.js';
import { createProduct } from '../controllers/productController.js';
import { ContactUs } from '../db/models/contactUs.js';

const router = express.Router();

router.post(
  '/admin',
  authenticate,
  isAdmin,
  validateBody(createSoldProductSchema),
  ctrlWrapper(createProduct),
);
router.post(
  '/contactUs',

  validateBody(createSoldProductSchema),
  ctrlWrapper(ContactUs),
);
router.get('/products', ctrlWrapper(getTransactionsByMonth));
router.get('/income-expenses', authenticate, ctrlWrapper(getIncomeAndExpenses));

router.patch(
  '/:id',
  authenticate,
  validateBody(updateTransactionSchema),
  ctrlWrapper(updateTransaction),
);
router.delete('/:id', authenticate, ctrlWrapper(deleteTransaction));

export default router;
