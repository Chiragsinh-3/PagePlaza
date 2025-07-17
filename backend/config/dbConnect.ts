// @ts-nocheck
import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(":::::::::mongodb connected:::::::::");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
