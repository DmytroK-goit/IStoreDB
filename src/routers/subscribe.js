// import express from 'express';
// import webpush from '../push.js';

// const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//     const subscription = req.body;

//     console.log('New subscription:', subscription);

//     res.status(201).json({ message: 'Subscribed!' });

//     const payload = JSON.stringify({
//       title: 'Welcome to IStore!',
//       body: 'You will now receive notifications about new products.',
//     });

//     await webpush.sendNotification(subscription, payload);
//   } catch (error) {
//     console.error('Push error:', error);
//     res.status(500).json({ error: 'Failed to send push' });
//   }
// });

// export default router;
