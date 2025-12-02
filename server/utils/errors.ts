export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(400, message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(404, message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class PaymentError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(400, message, "PAYMENT_ERROR", details);
    this.name = "PaymentError";
  }
}

export class PaymentInitializationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(500, message, "PAYMENT_INIT_ERROR", details);
    this.name = "PaymentInitializationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(401, message, "AUTH_ERROR");
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(403, message, "AUTHZ_ERROR");
    this.name = "AuthorizationError";
  }
}

export function formatErrorResponse(error: unknown): {
  status: string;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
} {
  if (error instanceof AppError) {
    return {
      status: "error",
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      status: "error",
      message: error.message,
      code: "INTERNAL_ERROR",
    };
  }

  return {
    status: "error",
    message: "An unknown error occurred",
    code: "UNKNOWN_ERROR",
  };
}
