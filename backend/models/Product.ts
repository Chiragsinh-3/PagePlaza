// @ts-nocheck
import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  images: string[];
  title: string;
  category: string;
  condition: string;
  classType: string;
  // subject: string;
  author: string;
  price: number;
  edition: string;
  description: string;
  finalprice: number;
  shippingCharge?: string;
  paymentMode: "UPI" | "Bank Account";
  inWishlist?: boolean;
  paymentDetails?: {
    upiId?: string;
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
  };
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
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
        required: function (this: any) {
          return this.paymentMode === "UPI";
        },
        default: function (this: any) {
          return this.paymentMode === "UPI" ? undefined : "";
        },
      },
      bankDetails: {
        accountNumber: {
          type: String,
          required: function (this: any) {
            return this.paymentMode === "Bank Account";
          },
          default: "",
        },
        ifscCode: {
          type: String,
          required: function (this: any) {
            return this.paymentMode === "Bank Account";
          },
          default: "",
        },
        bankName: {
          type: String,
          required: function (this: any) {
            return this.paymentMode === "Bank Account";
          },
          default: "",
        },
      },
      _id: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
