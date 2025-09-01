import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessions.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return next(createHttpError(401, 'No access token found'));

    const session = await SessionsCollection.findOne({ accessToken: token });
    if (!session) return next(createHttpError(401, 'Session not found'));

    if (Date.now() > session.accessTokenValidUntil) {
      return next(createHttpError(401, 'Access token expired'));
    }

    const user = await UsersCollection.findById(session.userId);
    if (!user) return next(createHttpError(401, 'User not found'));

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
