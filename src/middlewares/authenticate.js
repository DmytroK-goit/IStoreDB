import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/sessions.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  let token = null;

  const authHeader = req.get('Authorization');
  if (authHeader) {
    const [bearer, t] = authHeader.split(' ');
    if (bearer === 'Bearer' && t) token = t;
  }
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) return next(createHttpError(401, 'No access token provided'));

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
