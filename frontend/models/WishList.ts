import mongoose from "mongoose";

export interface IWishList extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const wishListSchema = new mongoose.Schema<IWishList>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IWishList>("WishList", wishListSchema);
