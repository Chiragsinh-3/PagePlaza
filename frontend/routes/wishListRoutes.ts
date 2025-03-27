import express from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import {
  addToWishList,
  removeFromWishList,
  getWishListByUser,
} from "../controllers/wishListController";

const router = express.Router();

router.post("/add", authenticatedUser, addToWishList);
router.delete("/remove", authenticatedUser, removeFromWishList);
router.get("/:userId", authenticatedUser, getWishListByUser);

export default router;
