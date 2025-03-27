import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

const authenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log("Auth Middleware - All cookies:", req.cookies);
    // console.log("Auth Middleware - Headers:", req.headers);

    let token = req.cookies.accessToken; // Changed from token to accessToken

    // Also check Authorization header as fallback
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("Auth Middleware - Token found:", token ? "Yes" : "No");

    if (!token) {
      return response(res, 401, "Please login to access this resource");
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as jwt.JwtPayload;

      console.log("Auth Middleware - Token decoded:", decoded);

      if (!decoded || !decoded.userId) {
        return response(res, 401, "Invalid token");
      }

      req.id = decoded.userId;
      next();
    } catch (jwtError) {
      console.error("JWT Verification failed:", jwtError);
      return response(res, 401, "Invalid token");
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return response(res, 500, "Authentication error");
  }
};

export { authenticatedUser };
