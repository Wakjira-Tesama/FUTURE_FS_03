import { forbidden } from "../utils/httpError.js";

export function requireRole(...roles) {
  return (req, _res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return next(forbidden("Insufficient role"));
    }
    next();
  };
}
