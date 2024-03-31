import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

interface DecodedToken {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token: string = authHeader.split(" ")[1];

  try {
    const decoded: DecodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(403).json({});
  }
};
