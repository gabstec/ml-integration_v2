export function errorMiddleware(error, req, res, next) {
  const status = error.status || 500;
  const payload = { message: error.message || "Internal server error" };

  if (error.details) payload.details = error.details;
  res.status(status).json(payload);
}