import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { response } from "../utils/responseHandler";

export const authenticatedUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      console.log("No token found in cookies:", req.cookies);
      return response(res, 401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return response(res, 401, "Invalid or expired token");
  }
};
