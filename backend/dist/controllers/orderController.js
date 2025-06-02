"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.handleRazorPayWebhook = exports.createPaymentWithRazorpay = exports.getOrderByUser = exports.getOrderById = exports.createOrUpdateOrder = void 0;
const CartItems_1 = __importDefault(require("../models/CartItems"));
const responseHandler_1 = require("../utils/responseHandler");
const Order_1 = require("../models/Order");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const razorpay_1 = __importDefault(require("razorpay"));
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("../models/Product"));
dotenv_1.default.config();
// Razorpay credentials
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error("Razorpay credentials are missing in environment variables");
}
const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
    ? new razorpay_1.default({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    })
    : null;
const createOrUpdateOrder = async (req, res) => {
    try {
        const userId = req.id;
        const { orderId, shippingAddress, payment_method, totalAmount, items } = req.body;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized");
        }
        // Validate required fields
        if (!shippingAddress || !payment_method || !totalAmount || !items) {
            return (0, responseHandler_1.response)(res, 400, "Missing required fields", {
                received: { shippingAddress, payment_method, totalAmount, items },
            });
        }
        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "Items must be a non-empty array");
        }
        console.log(items);
        // Validate if all products exist
        const productIds = items.map((item) => item.product);
        const products = await Product_1.default.find({ _id: { $in: productIds } });
        if (products.length !== items.length) {
            return (0, responseHandler_1.response)(res, 400, "One or more products not found");
        }
        // Prepare order items
        const orderItems = items.map((item) => ({
            product: new mongoose_1.default.Types.ObjectId(item.product),
            quantity: Number(item.quantity),
        }));
        let order;
        if (orderId) {
            // Update existing order
            order = await Order_1.Order.findOneAndUpdate({
                _id: orderId,
                user: userId,
                payment_status: "pending",
            }, {
                $set: {
                    shippingAddress,
                    payment_method,
                    totalAmount,
                    items: orderItems,
                },
            }, { new: true, runValidators: true });
            if (!order) {
                return (0, responseHandler_1.response)(res, 404, "Order not found or cannot be modified");
            }
        }
        else {
            // Create new order
            order = new Order_1.Order({
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
        const populatedOrder = await Order_1.Order.findById(order._id)
            .populate("user", "name email")
            .populate("shippingAddress")
            .populate({
            path: "items.product",
            select: "title price images",
        });
        return (0, responseHandler_1.response)(res, 200, `Order ${orderId ? "updated" : "created"} successfully`, populatedOrder);
    }
    catch (error) {
        console.error("Order creation error:", {
            message: error.message,
            stack: error.stack,
            details: error,
        });
        if (error.name === "ValidationError") {
            return (0, responseHandler_1.response)(res, 400, "Validation Error", error.errors);
        }
        return (0, responseHandler_1.response)(res, 500, `Order creation failed: ${error.message}`);
    }
};
exports.createOrUpdateOrder = createOrUpdateOrder;
const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order_1.Order.findById(orderId)
            .populate("user", "name email")
            .populate("shippingAddress")
            .populate({
            path: "items.product",
            model: "Product",
        });
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Order by id fetched successfully", order);
    }
    catch (error) {
        console.error("Error fetching product:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.getOrderById = getOrderById;
const getOrderByUser = async (req, res) => {
    try {
        const userId = req.id;
        const orders = await Order_1.Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .populate("shippingAddress");
        if (!orders || orders.length === 0) {
            return (0, responseHandler_1.response)(res, 404, "No orders found");
        }
        return (0, responseHandler_1.response)(res, 200, "Order by user fetched successfully", orders);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.getOrderByUser = getOrderByUser;
const createPaymentWithRazorpay = async (req, res) => {
    try {
        if (!razorpay) {
            return (0, responseHandler_1.response)(res, 500, "Razorpay configuration is missing");
        }
        const { orderID } = req.body;
        const order = await Order_1.Order.findOne({ orderID });
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found");
        }
        const razorPayOrder = await razorpay.orders.create({
            amount: order.totalAmount * 100,
            currency: "INR",
            receipt: order?._id.toString(),
        });
        return (0, responseHandler_1.response)(res, 200, "Razorpay order created successfully", {
            order: razorPayOrder,
        });
    }
    catch (error) {
        console.error("Error creating Razorpay order:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Failed to create payment");
    }
};
exports.createPaymentWithRazorpay = createPaymentWithRazorpay;
const handleRazorPayWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const shaSum = crypto_1.default.createHmac("sha256", secret);
    shaSum.update(JSON.stringify(req.body));
    const digest = shaSum.digest("hex");
    if (digest === req.headers["x-razorpay-signature"]) {
        const paymentId = req.body.payload.payment.entity.id;
        const orderId = req.body.payload.payment.entity.order.id;
        await Order_1.Order.findOneAndUpdate({ "payment_details.razorpay_order_id": orderId }, {
            payment_status: "completed",
            status: "processing",
            "payment_details.razorpay_payment_id": paymentId,
        });
        return (0, responseHandler_1.response)(res, 200, "Payment processed successfully");
    }
    else {
        return (0, responseHandler_1.response)(res, 400, "Invalid signature");
    }
};
exports.handleRazorPayWebhook = handleRazorPayWebhook;
const verifyPayment = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto_1.default
            .createHmac("sha256", secret)
            .update(sign.toString())
            .digest("hex");
        if (razorpay_signature === expectedSign) {
            // Update order status using the original order ID
            const updatedOrder = await Order_1.Order.findByIdAndUpdate(orderId, {
                $set: {
                    payment_status: "completed",
                    status: "processing",
                    payment_details: {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                    },
                },
            }, { new: true });
            if (!updatedOrder) {
                return (0, responseHandler_1.response)(res, 404, "Order not found");
            }
            // Clear cart
            await CartItems_1.default.findOneAndUpdate({ user: req.id }, { $set: { items: [] } });
            return (0, responseHandler_1.response)(res, 200, "Payment verified successfully", {
                order: updatedOrder,
            });
        }
        else {
            return (0, responseHandler_1.response)(res, 400, "Invalid signature");
        }
    }
    catch (error) {
        console.error("Payment verification error:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Payment verification failed");
    }
};
exports.verifyPayment = verifyPayment;
