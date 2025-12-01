import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
});

export default mongoose.model('Subscription', subscriptionSchema);
