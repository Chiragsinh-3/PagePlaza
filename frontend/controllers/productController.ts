import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import { uploadToCloudinary } from "../config/cloudnaryConfig";
import Product from "../models/Product";
import WishList from "../models/WishList";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
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
      paymentDetails,
    } = req.body;

    const sellerId = (req as any).id;
    const images = req.files as Express.Multer.File[];

    if (!images || images.length === 0) {
      return response(res, 400, "Please upload at least one image");
    }

    let parsedPaymentDetails;
    try {
      parsedPaymentDetails =
        typeof paymentDetails === "string"
          ? JSON.parse(paymentDetails)
          : paymentDetails;
    } catch (error) {
      return response(res, 400, "Invalid payment details format");
    }

    // Upload images to Cloudinary
    const uploadPromise = images.map((image) => {
      return uploadToCloudinary(image as any);
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
        bankDetails:
          paymentMode === "Bank Account"
            ? {
                accountNumber:
                  parsedPaymentDetails.bankDetails?.accountNumber || "",
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

    const product = new Product(productData);
    await product.save();

    return response(res, 200, "Product created successfully", product);
  } catch (error: any) {
    console.error("Product creation error:", error);
    return response(res, 500, error.message || "Internal Server Error");
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("seller", "name email");
    if (!products) {
      return response(res, 404, "Product not found");
    }
    // Check wishlist status for each product
    for (let product of products) {
      const inWishlist = await WishList.findOne({
        user: (req as any).id,
        products: product._id,
      });

      if (inWishlist) {
        product.inWishlist = true;
      } else {
        product.inWishlist = false;
      }
    }
    return response(res, 200, "Products fetched successfully", products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return response(res, 500, error.message || "Internal Server Error");
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "seller",
      "name email profilePicture phoneNumber addresses"
    );
    if (!product) {
      return response(res, 404, "Product not found");
    }
    const inWishlist = await WishList.findOne({
      user: (req as any).id,
      products: product._id,
    });
    console.log(inWishlist, "inWishlist");
    console.log("User ID:", (req as any).id);
    console.log("Product ID:", product._id);

    if (inWishlist) {
      product.inWishlist = true;
    } else {
      product.inWishlist = false;
    }
    return response(res, 200, "Product fetched successfully", product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return response(res, 500, error.message || "Internal Server Error");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return response(res, 404, "Product not found");
    }
    await product.deleteOne();
    return response(res, 200, "Product deleted successfully");
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return response(res, 500, error.message || "Internal Server Error");
  }
};

export const getProductBySellerId = async (req: Request, res: Response) => {
  try {
    const sellerId = req.params.sellerId;
    if (!sellerId) {
      return response(res, 400, "Seller ID is required");
    }
    const products = await Product.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate("seller", "name email profilePicture phoneNumber addresses");

    if (!products || products.length === 0) {
      return response(res, 404, "No products found for this seller");
    }
    return response(
      res,
      200,
      "Products fetched by seller id successfully",
      products
    );
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return response(res, 500, error.message || "Internal Server Error");
  }
};
