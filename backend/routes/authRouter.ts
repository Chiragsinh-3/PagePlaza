import { Request, Response, Router } from "express";
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
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_PORT}/auth?error=google-auth-failed`,
    session: false,
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as IUser;
      const accessToken = generateToken(user);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      console.log("Google Auth - Cookie being set:", {
        accessToken,
        headers: res.getHeaders(),
      });
      return res.redirect(`${process.env.FRONTEND_PORT}/auth/google/success`);
    } catch (error) {
      console.error("Google auth error:", error);
      res.redirect(`${process.env.FRONTEND_PORT}/auth?error=server-error`);
    }
  }
);
export default router;
