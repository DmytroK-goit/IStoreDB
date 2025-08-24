import createHttpError from 'http-errors';
import { SessionsCollection } from '../models/session.js';
import { UsersCollection } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) return next(createHttpError(401, 'No Authorization header'));

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token)
    return next(createHttpError(400, 'Invalid Authorization header'));

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) return next(createHttpError(401, 'Session not found'));

  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);
  if (!user) return next(createHttpError(401, 'User not found'));

  req.user = user;
  next();
};
