import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Product from "../models/Product";
import CartItems, { ICartItem } from "../models/CartItems";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).id;
    const { productId, quantity } = req.body;
    console.log("Adding product:", productId, "for user:", user);

    const product = await Product.findById(productId);

    if (!product) {
      return response(res, 404, "Product not found");
    }

    if (product.seller.toString() === user) {
      return response(
        res,
        403,
        "You are not authorized to add this product to your cart"
      );
    }
    let cart = await CartItems.findOne({ user });
    if (!cart) {
      cart = new CartItems({
        user,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product?.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += +quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
      } as ICartItem);
    }
    //
    await cart.save();

    // Populate product details
    const populatedCart = await CartItems.findById(cart._id).populate({
      path: "items.product",
      select: "title price images description", // Add fields you want to populate
    });

    return response(
      res,
      200,
      "Product added to cart successfully",
      populatedCart
    );
  } catch (error: any) {
    console.error("Error in addToCart:", error.message, error.errors);
    return response(res, 500, `Internal server error: ${error.message}`);
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any).id; // Use authenticated user's ID
    const { productId } = req.body;

    let cart = await CartItems.findOne({ user });
    if (!cart) {
      return response(res, 404, "Cart not found");
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item) => {
      return item.product && item.product.toString() !== productId.toString();
    });

    if (cart.items.length === originalLength) {
      return response(res, 404, "Product not found in cart");
    }

    await cart.save();

    const updatedCart = await CartItems.findById(cart._id).populate({
      path: "items.product",
      select: "title price images description",
    });

    return response(
      res,
      200,
      "Product removed from cart successfully",
      updatedCart
    );
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    return response(res, 500, "Internal server error");
  }
};

export const getCartByUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).id;

    let cart = await CartItems.findOne({ user }).populate({
      path: "items.product",
      select: "title finalprice price images description",
    });
    if (!cart) {
      return response(res, 404, "Cart is empty", null);
    }

    const totalItems = cart.items.length;
    return response(res, 200, "User Cart retrieved successfully", {
      cart,
      totalItems,
    });
  } catch (error) {
    console.error("Error in getCartByUser:", error);
    return response(res, 500, "Internal server error");
  }
};
