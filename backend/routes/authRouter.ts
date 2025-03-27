import { Request, Response, Router, NextFunction } from "express";
import {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateUserDetails,
  deleteUser,
  checkUserAuth,
} from "../controllers/authController";
import { authenticatedUser } from "../middleware/authMiddleware";
import passport from "passport";
import { IUser } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { response } from "../utils/responseHandler";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-auth", authenticatedUser, checkUserAuth);
router.put("/update-user-details", updateUserDetails);
// router.get("/delete-user", deleteUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback Route
router.get(
  "/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Google callback received");
    passport.authenticate("google", {
      failureRedirect: `${process.env.FRONTEND_PORT}/auth?error=google-auth-failed`,
      session: false,
    })(req, res, next);
  },
  async (req: Request, res: Response) => {
    try {
      console.log("Google authentication successful");

      if (!req.user) {
        console.error("No user data in request");
        throw new Error("Authentication failed - No user data");
      }

      const user = req.user as IUser;
      console.log("Generating token for user:", user._id);

      const accessToken = generateToken(user);

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      };

      console.log("Setting cookie with options:", cookieOptions);

      res.cookie("accessToken", accessToken, cookieOptions);

      console.log("Redirecting to success page");
      return res.redirect(`${process.env.FRONTEND_PORT}/auth/google/success`);
    } catch (error) {
      console.error("Google callback error:", error);
      return res.redirect(
        `${process.env.FRONTEND_PORT}/auth?error=server-error`
      );
    }
  }
);
export default router;
