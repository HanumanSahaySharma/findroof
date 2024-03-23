import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "./error";

interface UserPayload {
  id: string | undefined;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "User not unauthorized." });
  }
  jwt.verify(token, `${process.env.JWT_SECRET}`, (error: any, user: any) => {
    if (error) {
      if (error.message === "jwt expired") {
        return res.status(401).clearCookie("token").json({ message: "User not unauthorized." });
      }
    }
    req.user = user;
    next();
  });
};
