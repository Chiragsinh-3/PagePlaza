import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import {
  sendVerificationToEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../config/emailConfig";
import { generateToken } from "../utils/generateToken";

// Add this interface near the top of the file

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, agreeTerms } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response(res, 400, "User Already Exist");
    }
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = new User({
      name,
      email,
      password,
      agreeTerms,
      verificationToken,
    });

    await user.save();
    await sendVerificationToEmail(user.email, verificationToken);
    await sendWelcomeEmail(user.email);
    console.log("Verification Token:", verificationToken);

    return response(
      res,
      200,
      "User Created Successfully, Check your Email to verify your account"
    );
  } catch (error: any) {
    return response(res, 500, error.message || "Internal Server Error");
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    console.log("Searching for token:", token);
    const user = await User.findOne({ verificationToken: token });
    console.log("Found user:", user ? "Yes" : "No");

    if (!user) {
      return response(res, 404, "Invalid verification token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    const accesstoken = generateToken(user);
    res.cookie("accessToken", accesstoken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    await user.save();

    return response(res, 200, "Email verified successfully");
  } catch (error: any) {
    return response(res, 500, error.message || "Internal Server Error");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return response(res, 400, "Invalid Email or Password");
    }

    if (!user.isVerified) {
      return response(res, 400, "Email not verified");
    }
    const accesstoken = generateToken(user);
    // res.cookie("accessToken", accesstoken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24,
    // });

    await user.save();

    return response(res, 200, "Login Successful", { accesstoken, user });
  } catch (error: any) {
    return response(res, 500, error.message || "Internal Server Error");
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    return response(res, 200, "Logout Successful");
  } catch (error: any) {
    return response(res, 500, error.message || "Internal Server Error");
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return response(res, 404, "User not found");
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    await sendPasswordResetEmail(user.email, resetToken);
    return response(res, 200, "Password reset email sent");
  } catch (error: any) {
    return response(res, 500, error.message || "Internal Server Error");
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return response(res, 400, "Invalid or expired token");
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return response(res, 200, "Password reset successful");
  } catch (error: any) {
    return response(res, 500, error.message || "Internal Server Error");
  }
};

const updateUserDetails = async (req: Request, res: Response) => {
  try {
    // change previous email to new one too
    const { name, phoneNumber, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return response(res, 400, "User does not exist");
    }
    existingUser.name = name;
    existingUser.phoneNumber = phoneNumber;
    await existingUser.save();
    return response(res, 200, "User details updated successfully");
  } catch (error: any) {
    return response(res, 500, error.message || "Internal Server Error");
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return response(res, 400, "User does not exist");
    }
    await User.deleteOne({ email });
    console.log(email, "deleted successfully");
    return response(res, 200, "User deleted successfully");
  } catch (error: any) {
    return response(res, 500, error.message || "Internal Server Error");
  }
};

const checkUserAuth = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    if (!userId) {
      return response(res, 401, "Unauthenticated, please login to access");
    }

    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpires -verificationToken -__v"
    );

    if (!user) {
      return response(res, 404, "User not found");
    }

    return response(res, 200, "User retrieved successfully", { user });
  } catch (error: any) {
    console.error("Check auth error:", error);
    return response(res, 500, error.message || "Internal Server Error");
  }
};

export {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  deleteUser,
  checkUserAuth,
};
