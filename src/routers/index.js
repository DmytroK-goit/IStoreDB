import { Router } from 'express';
import usersRouter from './users.js';
import itemsRouter from './items.js';
import contactUsRouter from './contactUsMessage.js';
import cartRouter from './cart.js';
import soldRouter from './soldItem.js';
import webpush from '../push.js';
import Subscription from '../db/models/Subscription.js';

const router = Router();

router.use('/auth', usersRouter);
router.use('/products', itemsRouter);
router.use('/contactUs', contactUsRouter);
router.use('/cart', cartRouter);
router.use('/sold', soldRouter);
router.post('/webpush', async (req, res) => {
  try {
    const subscription = req.body;

    console.log('Subscription received:', subscription);

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
router.post('/admin/push/send', async (req, res) => {
  try {
    const { title, body } = req.body;

    const subscriptions = await Subscription.find();

    if (!subscriptions.length) {
      return res.status(404).json({ message: 'No subscribers available' });
    }

    const payload = JSON.stringify({ title, body });

    const results = [];

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
        results.push({ endpoint: sub.endpoint, status: 'sent' });
      } catch (err) {
        console.log('Push failed, removing subscription', sub.endpoint);
        await Subscription.deleteOne({ _id: sub._id });
      }
    }

    res.json({ message: 'Push sent to all', results });
  } catch (err) {
    res.status(500).json({ error: 'Push sending error' });
  }
});

export default router;
