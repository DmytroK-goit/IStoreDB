import createHttpError from 'http-errors';

export const authorizeRole = (role) => (req, res, next) => {
  if (!req.user) {
    return next(createHttpError(401, 'Not authenticated'));
  }

  if (req.user.role !== role) {
    return next(createHttpError(403, 'Access denied'));
  }

  next();
};
