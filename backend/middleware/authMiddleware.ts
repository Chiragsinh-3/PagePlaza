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
    const token = req.cookies.accessToken.toString();
    console.log("Token:", token);

    if (!token) {
      return response(res, 401, "Please login to access this resource");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      return response(res, 401, "Invalid token");
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return response(res, 401, "Invalid token");
    }
    return response(res, 500, "Authentication error");
  }
};

export { authenticatedUser };
