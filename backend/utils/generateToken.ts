// @ts-nocheck
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

export const generateToken = (user: IUser): string => {
  // Generate a JWT token with the user's ID and a secret key
  // The token will expire in 1 day
  return jwt.sign({ userId: user?._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};
