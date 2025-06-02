"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductBySellerId = exports.deleteProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const cloudnaryConfig_1 = require("../config/cloudnaryConfig");
const Product_1 = __importDefault(require("../models/Product"));
const WishList_1 = __importDefault(require("../models/WishList"));
const createProduct = async (req, res) => {
    try {
        const { title, category, condition, classType, author, price, edition, description, finalprice, shippingCharge, paymentMode, paymentDetails, } = req.body;
        const sellerId = req.id;
        const images = req.files;
        if (!images || images.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "Please upload at least one image");
        }
        let parsedPaymentDetails;
        try {
            parsedPaymentDetails =
                typeof paymentDetails === "string"
                    ? JSON.parse(paymentDetails)
                    : paymentDetails;
        }
        catch (error) {
            return (0, responseHandler_1.response)(res, 400, "Invalid payment details format");
        }
        // Upload images to Cloudinary
        const uploadPromise = images.map((image) => {
            return (0, cloudnaryConfig_1.uploadToCloudinary)(image);
        });
        const uploadImages = await Promise.all(uploadPromise);
        const imageUrl = uploadImages.map((image) => image.secure_url);
        // Create product object with conditional payment details
        const productData = {
            title,
            category,
            condition,
            classType,
            author,
            price,
            edition,
            description,
            finalprice,
            shippingCharge,
            paymentMode,
            seller: sellerId,
            images: imageUrl,
            paymentDetails: {
                upiId: paymentMode === "UPI" ? parsedPaymentDetails.upiId : "",
                bankDetails: paymentMode === "Bank Account"
                    ? {
                        accountNumber: parsedPaymentDetails.bankDetails?.accountNumber || "",
                        ifscCode: parsedPaymentDetails.bankDetails?.ifscCode || "",
                        bankName: parsedPaymentDetails.bankDetails?.bankName || "",
                    }
                    : {
                        accountNumber: "",
                        ifscCode: "",
                        bankName: "",
                    },
            },
        };
        const product = new Product_1.default(productData);
        await product.save();
        return (0, responseHandler_1.response)(res, 200, "Product created successfully", product);
    }
    catch (error) {
        console.error("Product creation error:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find()
            .sort({ createdAt: -1 })
            .populate("seller", "name email");
        if (!products) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        // Check wishlist status for each product
        for (let product of products) {
            const inWishlist = await WishList_1.default.findOne({
                user: req.id,
                products: product._id,
            });
            if (inWishlist) {
                product.inWishlist = true;
            }
            else {
                product.inWishlist = false;
            }
        }
        return (0, responseHandler_1.response)(res, 200, "Products fetched successfully", products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.getAllProducts = getAllProducts;
const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product_1.default.findById(productId).populate("seller", "name email profilePicture phoneNumber addresses");
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        const inWishlist = await WishList_1.default.findOne({
            user: req.id,
            products: product._id,
        });
        console.log(inWishlist, "inWishlist");
        console.log("User ID:", req.id);
        console.log("Product ID:", product._id);
        if (inWishlist) {
            product.inWishlist = true;
        }
        else {
            product.inWishlist = false;
        }
        return (0, responseHandler_1.response)(res, 200, "Product fetched successfully", product);
    }
    catch (error) {
        console.error("Error fetching product:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.getProductById = getProductById;
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product not found");
        }
        await product.deleteOne();
        return (0, responseHandler_1.response)(res, 200, "Product deleted successfully");
    }
    catch (error) {
        console.error("Error deleting product:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.deleteProduct = deleteProduct;
const getProductBySellerId = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 400, "Seller ID is required");
        }
        const products = await Product_1.default.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .populate("seller", "name email profilePicture phoneNumber addresses");
        if (!products || products.length === 0) {
            return (0, responseHandler_1.response)(res, 404, "No products found for this seller");
        }
        return (0, responseHandler_1.response)(res, 200, "Products fetched by seller id successfully", products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return (0, responseHandler_1.response)(res, 500, error.message || "Internal Server Error");
    }
};
exports.getProductBySellerId = getProductBySellerId;
