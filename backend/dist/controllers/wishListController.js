"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishListByUser = exports.removeFromWishList = exports.addToWishList = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const Product_1 = __importDefault(require("../models/Product"));
// import CartItems from "../models/CartItems";
const WishList_1 = __importDefault(require("../models/WishList"));
const addToWishList = async (req, res) => {
    try {
        const user = req.id;
        const { productId } = req.body;
        console.log("Adding product:", productId, "for user:", user);
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        let wishList = await WishList_1.default.findOne({ user });
        if (product.seller.toString() === user) {
            return (0, responseHandler_1.response)(res, 403, "You are not authorized to add this product to your wishList");
        }
        if (!wishList) {
            wishList = new WishList_1.default({
                user,
                products: [],
            });
        }
        if (wishList.products.includes(productId)) {
            return (0, responseHandler_1.response)(res, 400, "Product already in wishList");
        }
        // Update only the inWishlist field without triggering full validation
        await Product_1.default.findByIdAndUpdate(productId, { inWishlist: true }, { validateBeforeSave: false });
        wishList.products.push(productId);
        await wishList.save();
        return (0, responseHandler_1.response)(res, 200, "Product added to wishList successfully", wishList);
    }
    catch (error) {
        console.error("Error in addToCart:", error.message, error.errors);
        return (0, responseHandler_1.response)(res, 500, `Internal server error: ${error.message}`);
    }
};
exports.addToWishList = addToWishList;
const removeFromWishList = async (req, res) => {
    try {
        const user = req.id;
        const { productId } = req.body; // Changed from req.params to req.body
        let wishList = await WishList_1.default.findOne({ user });
        if (!wishList) {
            return (0, responseHandler_1.response)(res, 404, "Cart not found");
        }
        wishList.products = wishList.products.filter((item) => item.toString() !== productId);
        await wishList.save();
        return (0, responseHandler_1.response)(res, 200, "Product removed from wishList successfully", wishList);
    }
    catch (error) {
        console.error("Error in removeFromWishList:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.removeFromWishList = removeFromWishList;
const getWishListByUser = async (req, res) => {
    try {
        const user = req.id;
        let wishList = await WishList_1.default.findOne({ user }).populate("products");
        if (!wishList) {
            return (0, responseHandler_1.response)(res, 404, "WishList is empty", { Products: [] });
        }
        return (0, responseHandler_1.response)(res, 200, "User WishList retrieved successfully", wishList);
    }
    catch (error) {
        console.error("Error in Wishlist by User:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal server error");
    }
};
exports.getWishListByUser = getWishListByUser;
