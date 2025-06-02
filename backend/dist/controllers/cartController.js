"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartByUser = exports.removeFromCart = exports.addToCart = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const Product_1 = __importDefault(require("../models/Product"));
const CartItems_1 = __importDefault(require("../models/CartItems"));
const addToCart = async (req, res) => {
    try {
        const user = req.id;
        const { productId, quantity } = req.body;
        console.log("Adding product:", productId, "for user:", user);
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        if (product.seller.toString() === user) {
            return (0, responseHandler_1.response)(res, 403, "You are not authorized to add this product to your cart");
        }
        let cart = await CartItems_1.default.findOne({ user });
        if (!cart) {
            cart = new CartItems_1.default({
                user,
                items: [],
            });
        }
        const existingItem = cart.items.find((item) => item.product?.toString() === productId);
        if (existingItem) {
            existingItem.quantity += +quantity;
        }
        else {
            cart.items.push({
                product: productId,
                quantity: quantity,
            });
        }
        //
        await cart.save();
        // Populate product details
        const populatedCart = await CartItems_1.default.findById(cart._id).populate({
            path: "items.product",
            select: "title price images description", // Add fields you want to populate
        });
        return (0, responseHandler_1.response)(res, 200, "Product added to cart successfully", populatedCart);
    }
    catch (error) {
        console.error("Error in addToCart:", error.message, error.errors);
        return (0, responseHandler_1.response)(res, 500, `Internal server error: ${error.message}`);
    }
};
exports.addToCart = addToCart;
const removeFromCart = async (req, res) => {
    try {
        const user = req.id; // Use authenticated user's ID
        const { productId } = req.body;
        let cart = await CartItems_1.default.findOne({ user });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart not found");
        }
        const originalLength = cart.items.length;
        cart.items = cart.items.filter((item) => {
            return item.product && item.product.toString() !== productId.toString();
        });
        if (cart.items.length === originalLength) {
            return (0, responseHandler_1.response)(res, 404, "Product not found in cart");
        }
        await cart.save();
        const updatedCart = await CartItems_1.default.findById(cart._id).populate({
            path: "items.product",
            select: "title price images description",
        });
        return (0, responseHandler_1.response)(res, 200, "Product removed from cart successfully", updatedCart);
    }
    catch (error) {
        console.error("Error in removeFromCart:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.removeFromCart = removeFromCart;
const getCartByUser = async (req, res) => {
    try {
        const user = req.id;
        let cart = await CartItems_1.default.findOne({ user }).populate({
            path: "items.product",
            select: "title finalprice price images description",
        });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart is empty", null);
        }
        const totalItems = cart.items.length;
        return (0, responseHandler_1.response)(res, 200, "User Cart retrieved successfully", {
            cart,
            totalItems,
        });
    }
    catch (error) {
        console.error("Error in getCartByUser:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.getCartByUser = getCartByUser;
