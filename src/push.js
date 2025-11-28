import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:k0vbasyuk.dim0n@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

export default webpush;
