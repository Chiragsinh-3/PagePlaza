"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    images: [{ type: String }],
    title: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    classType: { type: String, required: true },
    // subject: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    edition: { type: String },
    description: { type: String },
    finalprice: { type: Number, required: true },
    shippingCharge: { type: String },
    paymentMode: {
        type: String,
        enum: ["UPI", "Bank Account"],
        required: true,
    },
    inWishlist: { type: Boolean, default: false },
    paymentDetails: {
        upiId: {
            type: String,
            required: function () {
                return this.paymentMode === "UPI";
            },
            default: function () {
                return this.paymentMode === "UPI" ? undefined : "";
            },
        },
        bankDetails: {
            accountNumber: {
                type: String,
                required: function () {
                    return this.paymentMode === "Bank Account";
                },
                default: "",
            },
            ifscCode: {
                type: String,
                required: function () {
                    return this.paymentMode === "Bank Account";
                },
                default: "",
            },
            bankName: {
                type: String,
                required: function () {
                    return this.paymentMode === "Bank Account";
                },
                default: "",
            },
        },
        _id: false,
    },
    seller: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Product", productSchema);
