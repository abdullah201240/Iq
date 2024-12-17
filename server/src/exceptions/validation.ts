import { HttpException, ErrorCode } from './root';

export class UnprocessableEntity extends HttpException {
    constructor(
        error: any,
        message: string = "Unprocessable Entity", // Default to "Unprocessable Entity" instead of "Unauthorized"
        errorCode: number = ErrorCode.Unprocessable_Entity, // Use the appropriate error code for unprocessable entity
        statusCode: number = 422 // Use status code 422 for Unprocessable Entity
    ) {
        super(message, errorCode, statusCode, error); // Pass all required arguments to the parent HttpException class
    }
}
