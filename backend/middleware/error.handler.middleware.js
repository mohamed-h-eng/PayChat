// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let code = err.code || "INTERNAL_SERVER_ERROR";
  let details = err.details || null;

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    code = "VALIDATION_ERROR";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate key error";
    code = "DUPLICATE_KEY_ERROR";
    details = Object.keys(err.keyValue || {}).map((field) => ({
      field,
      value: err.keyValue[field],
    }));
  }

  // Mongoose bad ObjectId / cast error
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    code = "CAST_ERROR";
    details = [{ field: err.path, value: err.value }];
  }

  // JWT errors (optional if you use JWT)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    code = "INVALID_TOKEN";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    code = "TOKEN_EXPIRED";
  }

  // Log server-side
  console.error(err);

  const response = {
    success: false,
    message,
    error: { code },
  };

  if (details) response.error.details = details;

  // Avoid leaking internals in production
  if (process.env.NODE_ENV !== "production") {
    response.error.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};