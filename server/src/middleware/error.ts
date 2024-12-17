import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpException } from "../exceptions/root";

// Explicitly type the middleware as an error handler
export const errorMiddleware: ErrorRequestHandler = (
  error: HttpException, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {  // Ensure the return type is void
  // Set default status code to 500 if it's not defined
  const statusCode = error.statusCode || 500;
  
  // Prepare error response object
  const response = {
    message: error.message,
    errorCode: error.errorCode,
    errors: error.error || null,  // If there are no specific errors, set it to null
  };

  // Send the response without returning the Response object
  res.status(statusCode).json(response);
};
