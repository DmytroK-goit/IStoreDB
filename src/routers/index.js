import { Router } from 'express';
import usersRouter from './users.js';
import itemsRouter from './items.js';
import contactUsRouter from './contactUsMessage.js';
import cartRouter from './cart.js';
import soldRouter from './soldItem.js';
import webpush from '../push.js';

const router = Router();

router.use('/auth', usersRouter);
router.use('/products', itemsRouter);
router.use('/contactUs', contactUsRouter);
router.use('/cart', cartRouter);
router.use('/sold', soldRouter);
router.post('/webpush', async (req, res) => {
  try {
    const subscription = req.body;

    console.log('New subscription:', subscription);

    res.status(201).json({ message: 'Subscribed!' });

    const payload = JSON.stringify({
      title: 'Welcome to IStore!',
      body: 'You will now receive notifications about new products.',
    });

    await webpush.sendNotification(subscription, payload);
  } catch (error) {
    console.error('Push error:', error);
    res.status(500).json({ error: 'Failed to send push' });
  }
});

export default router;
