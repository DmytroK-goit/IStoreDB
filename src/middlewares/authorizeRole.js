import createHttpError from 'http-errors';

export const authorizeRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(createHttpError(401, 'Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, 'Access denied'));
    }

    next();
  };
