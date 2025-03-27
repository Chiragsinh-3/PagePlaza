import { Request, Response } from "express";
import CartItems from "../models/CartItems";
import { response } from "../utils/responseHandler";
import { Order } from "../models/Order";
import crypto from "crypto";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import Product from "../models/Product";

dotenv.config();

// Razorpay credentials
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("Razorpay credentials are missing in environment variables");
}

const razorpay =
  RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
      })
    : null;

export const createOrUpdateOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { orderId, shippingAddress, payment_method, totalAmount, items } =
      req.body;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    // Validate required fields
    if (!shippingAddress || !payment_method || !totalAmount || !items) {
      return response(res, 400, "Missing required fields", {
        received: { shippingAddress, payment_method, totalAmount, items },
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return response(res, 400, "Items must be a non-empty array");
    }
    console.log(items);
    // Validate if all products exist
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return response(res, 400, "One or more products not found");
    }

    // Prepare order items
    const orderItems = items.map((item) => ({
      product: new mongoose.Types.ObjectId(item.product),
      quantity: Number(item.quantity),
    }));

    let order;
    if (orderId) {
      // Update existing order
      order = await Order.findOneAndUpdate(
        {
          _id: orderId,
          user: userId,
          payment_status: "pending",
        },
        {
          $set: {
            shippingAddress,
            payment_method,
            totalAmount,
            items: orderItems,
          },
        },
        { new: true, runValidators: true }
      );

      if (!order) {
        return response(res, 404, "Order not found or cannot be modified");
      }
    } else {
      // Create new order
      order = new Order({
        user: userId,
        items: orderItems,
        shippingAddress,
        payment_method,
        totalAmount,
        payment_status: "pending",
        status: "pending",
      });

      await order.save();
    }

    // Populate necessary fields for response
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",
        select: "title price images",
      });

    return response(
      res,
      200,
      `Order ${orderId ? "updated" : "created"} successfully`,
      populatedOrder
    );
  } catch (error: any) {
    console.error("Order creation error:", {
      message: error.message,
      stack: error.stack,
      details: error,
    });

    if (error.name === "ValidationError") {
      return response(res, 400, "Validation Error", error.errors);
    }

    return response(res, 500, `Order creation failed: ${error.message}`);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate({
        path: "items.product",
        model: "Product",
      });
    if (!order) {
      return response(res, 404, "Order not found");
    }
    return response(res, 200, "Order by id fetched successfully", order);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return response(res, 500, error.message || "Internal Server Error");
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("shippingAddress");

    if (!orders || orders.length === 0) {
      return response(res, 404, "No orders found");
    }
    return response(res, 200, "Order by user fetched successfully", orders);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return response(res, 500, error.message || "Internal Server Error");
  }
};

export const createPaymentWithRazorpay = async (
  req: Request,
  res: Response
) => {
  try {
    if (!razorpay) {
      return response(res, 500, "Razorpay configuration is missing");
    }

    const { orderID } = req.body;
    const order = await Order.findOne({ orderID });

    if (!order) {
      return response(res, 404, "Order not found");
    }

    const razorPayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: order?._id.toString(),
    });

    return response(res, 200, "Razorpay order created successfully", {
      order: razorPayOrder,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return response(res, 500, error.message || "Failed to create payment");
  }
};

export const handleRazorPayWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  const shaSum = crypto.createHmac("sha256", secret);

  shaSum.update(JSON.stringify(req.body));
  const digest = shaSum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    const paymentId = req.body.payload.payment.entity.id;
    const orderId = req.body.payload.payment.entity.order.id;

    await Order.findOneAndUpdate(
      { "payment_details.razorpay_order_id": orderId },
      {
        payment_status: "completed",
        status: "processing",
        "payment_details.razorpay_payment_id": paymentId,
      }
    );
    return response(res, 200, "Payment processed successfully");
  } else {
    return response(res, 400, "Invalid signature");
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", secret!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update order status using the original order ID
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            payment_status: "completed",
            status: "processing",
            payment_details: {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
          },
        },
        { new: true }
      );

      if (!updatedOrder) {
        return response(res, 404, "Order not found");
      }

      // Clear cart
      await CartItems.findOneAndUpdate(
        { user: req.id },
        { $set: { items: [] } }
      );

      return response(res, 200, "Payment verified successfully", {
        order: updatedOrder,
      });
    } else {
      return response(res, 400, "Invalid signature");
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return response(res, 500, error.message || "Payment verification failed");
  }
};
