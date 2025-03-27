import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Product from "../models/Product";
// import CartItems from "../models/CartItems";
import WishList from "../models/WishList";

export const addToWishList = async (req: Request, res: Response) => {
  try {
    const user = (req as any).id;
    const { productId } = req.body;
    console.log("Adding product:", productId, "for user:", user);

    const product = await Product.findById(productId);

    if (!product) {
      return response(res, 404, "Product not found");
    }

    let wishList = await WishList.findOne({ user });
    if (product.seller.toString() === user) {
      return response(
        res,
        403,
        "You are not authorized to add this product to your wishList"
      );
    }
    if (!wishList) {
      wishList = new WishList({
        user,
        products: [],
      });
    }
    if (wishList.products.includes(productId)) {
      return response(res, 400, "Product already in wishList");
    }

    // Update only the inWishlist field without triggering full validation
    await Product.findByIdAndUpdate(
      productId,
      { inWishlist: true },
      { validateBeforeSave: false }
    );

    wishList.products.push(productId);
    await wishList.save();
    return response(
      res,
      200,
      "Product added to wishList successfully",
      wishList
    );
  } catch (error: any) {
    console.error("Error in addToCart:", error.message, error.errors);
    return response(res, 500, `Internal server error: ${error.message}`);
  }
};

export const removeFromWishList = async (req: Request, res: Response) => {
  try {
    const user = (req as any).id;
    const { productId } = req.body; // Changed from req.params to req.body

    let wishList = await WishList.findOne({ user });
    if (!wishList) {
      return response(res, 404, "Cart not found");
    }

    wishList.products = wishList.products.filter(
      (item) => item.toString() !== productId
    );

    await wishList.save();

    return response(
      res,
      200,
      "Product removed from wishList successfully",
      wishList
    );
  } catch (error) {
    console.error("Error in removeFromWishList:", error);
    return response(res, 500, "Internal server error");
  }
};

export const getWishListByUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).id;

    let wishList = await WishList.findOne({ user }).populate("products");
    if (!wishList) {
      return response(res, 404, "WishList is empty", { Products: [] });
    }

    return response(res, 200, "User WishList retrieved successfully", wishList);
  } catch (error) {
    console.error("Error in Wishlist by User:", error);
    return response(res, 500, "Internal server error");
  }
};
