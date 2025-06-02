// @ts-nocheck
import express from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import {
  createOrUpdateOrder,
  getOrderById,
  getOrderByUser,
  createPaymentWithRazorpay,
  verifyPayment,
} from "../controllers/orderController";

const router = express.Router();

router.post("/", authenticatedUser, createOrUpdateOrder);

router.get("/", authenticatedUser, getOrderByUser);

router.get("/:id", authenticatedUser, getOrderById);

router.post(
  "/create-razorpay-order",
  authenticatedUser,
  createPaymentWithRazorpay
);

router.post("/verify-payment", authenticatedUser, verifyPayment);

export default router;
