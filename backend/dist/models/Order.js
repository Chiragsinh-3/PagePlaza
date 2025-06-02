"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OrderItemSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});
const OrderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: [
            (items) => items.length > 0,
            "Items array cannot be empty",
        ],
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    shippingAddress: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    payment_status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    payment_method: {
        type: String,
        required: true,
    },
    payment_details: {
        razorpay_order_id: { type: String },
        razorpay_payment_id: { type: String },
        razorpay_signature: { type: String },
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });
exports.Order = mongoose_1.default.model("Order", OrderSchema);
