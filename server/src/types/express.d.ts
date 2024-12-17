// src/types/express.d.ts
import { Admin } from "../models"; // Adjust path based on your project structure

declare global {
  namespace Express {
    interface Request {
      admin?: Admin; // Attach the correct Admin type to req.admin
    }
  }
}
