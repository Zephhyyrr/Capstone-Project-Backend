import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined in environment variables");
}

interface AuthRequest extends Request {
    user?: { userId: number };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Access denied, token missing or malformed!" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token!" });
    }
};  