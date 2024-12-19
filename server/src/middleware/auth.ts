import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/admin"; // Adjust path as needed
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "12sawegg23grr434"; // Fallback to a hardcoded secret if not in env

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is in format "Bearer <token>"

  if (!token) {
    return next(new UnauthorizedException('Unauthorized', null, ErrorCode.UNAUTHORIZED));
  }

  try {
    // Verify the token and decode the payload
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (!payload || !payload.id) {
      return next(new UnauthorizedException('Unauthorized', null, ErrorCode.UNAUTHORIZED));
    }

    // Find the admin using the decoded ID
    const admin = await Admin.findOne({ where: { id: payload.id } });

    if (!admin) {
      return next(new UnauthorizedException('Admin not found or invalid token', null, ErrorCode.UNAUTHORIZED));
    }
    
    // Attach the admin object to req.admin (TypeScript knows it's an Admin instance now)
    (req as Request & { admin: Admin }).admin = admin;  // This forces TypeScript to accept `admin` on `req`

    // Call the next middleware
    next();
  } catch (error) {
    return next(new UnauthorizedException('Unauthorized', null, ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
