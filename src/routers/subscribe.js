import express from 'express';
import webpush from '../push.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const subscription = req.body;

  console.log('New subscription:', subscription);

  res.status(201).json({ message: 'Subscribed!' });

  const payload = JSON.stringify({
    title: 'Welcome!',
    body: 'You will now receive notifications.',
  });

  webpush.sendNotification(subscription, payload).catch(console.error);
});

export default router;
