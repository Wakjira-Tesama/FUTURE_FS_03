import { HttpError } from "../utils/httpError.js";

export function errorHandler(err, _req, res, _next) {
  const status = err instanceof HttpError ? err.status : 500;
  const payload = {
    error: {
      message: status === 500 ? "Internal server error" : err.message,
      ...(err.details ? { details: err.details } : {}),
    },
  };

  if (process.env.NODE_ENV !== "production") {
    payload.error._debug = {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
    };
  }

  res.status(status).json(payload);
}
