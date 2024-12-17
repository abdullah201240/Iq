import { HttpException, ErrorCode } from "./root";

export class BadRequestException extends HttpException {
    
    constructor(message: string, errorCode: ErrorCode) {
        // Fixed the typo from "massage" to "message"
        super(message, errorCode, 400, null);
    }
}
