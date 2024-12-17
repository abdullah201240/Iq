import { HttpException } from "./root";
import { ErrorCode } from './root'; // Import the ErrorCode enum if not already imported

export class InternalException extends HttpException {
    constructor(message: string, errors: any, errorCode: ErrorCode) {
        // Call the parent constructor with proper arguments
        super(message, errorCode, 500, errors);
    }
}
