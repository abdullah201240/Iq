import { Request, Response, NextFunction } from 'express';
import { ErrorCode, HttpException } from './exceptions/root';
import { InternalException } from './exceptions/internal-exception';
import { ZodError } from 'zod'; // Assuming you're using Zod for validation

// Define a centralized error handler that supports custom exception handling and validation errors
export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body using Zod before proceeding to the controller
            await method(req, res, next); // This will execute the controller
        } catch (error: any) {
            let exception: HttpException;

            if (error instanceof ZodError) {
                // If it's a Zod error, handle validation failure
                exception = new InternalException('Validation Error', error.errors, ErrorCode.Unprocessable_Entity);
            } else if (error instanceof HttpException) {
                // If it's a known exception, pass it
                exception = error;
            } else {
                // Internal server error for other unknown errors
                exception = new InternalException('Internal Server Error', error, ErrorCode.Internal_Exception);
            }

            // Pass the exception to the next middleware (usually the error handler middleware)
            next(exception);
        }
    };
};
