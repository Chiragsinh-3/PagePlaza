import express from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import {
  removeFromCart,
  getCartByUser,
  addToCart,
} from "../controllers/cartController";

const router = express.Router();

router.post("/add", authenticatedUser, addToCart);
router.delete("/remove", authenticatedUser, removeFromCart);
router.get("/:userId", authenticatedUser, getCartByUser);

export default router;
